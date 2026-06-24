import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, verifyPassword } from '@/lib/password';
import {
  PUBLIC_COMMUNITY_POST_COLUMNS,
  sanitizeCommunityFileUrls,
} from '@/lib/communityPosts';
import { getClientIp } from '@/lib/security/clientIp';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rateLimit';
import { getSupabaseAdmin } from '@/lib/security/supabaseAdmin';

const DELETE_GLOBAL_LIMIT = 20;
const DELETE_POST_LIMIT = 10;
const DELETE_GLOBAL_WINDOW = 60 * 60 * 1000;
const DELETE_POST_WINDOW = 15 * 60 * 1000;

function getSupabaseOrError() {
  try {
    return { supabase: getSupabaseAdmin(), error: null as NextResponse | null };
  } catch {
    return {
      supabase: null,
      error: NextResponse.json({ error: '서버 설정 오류입니다.' }, { status: 503 }),
    };
  }
}

export async function GET(request: NextRequest) {
  const page = Math.max(0, Number(request.nextUrl.searchParams.get('page')) || 0);
  const limit = Math.min(
    50,
    Math.max(1, Number(request.nextUrl.searchParams.get('limit')) || 20),
  );
  const from = page * limit;
  const to = from + limit - 1;

  const { supabase, error: configError } = getSupabaseOrError();
  if (configError || !supabase) return configError!;

  const { data, error } = await supabase
    .from('community_posts')
    .select(PUBLIC_COMMUNITY_POST_COLUMNS)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: '게시글 목록을 불러오지 못했습니다.' }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { author_nickname, author_password, title, content, file_urls } = body;

    if (!author_nickname || !author_password || !title) {
      return NextResponse.json({ error: '닉네임, 비밀번호, 제목은 필수입니다.' }, { status: 400 });
    }
    if (title.length > 100) {
      return NextResponse.json({ error: '제목은 100자를 초과할 수 없습니다.' }, { status: 400 });
    }
    if (typeof content === 'string' && content.length > 10000) {
      return NextResponse.json({ error: '내용은 10000자를 초과할 수 없습니다.' }, { status: 400 });
    }
    if (author_nickname.length > 20) {
      return NextResponse.json({ error: '닉네임은 20자를 초과할 수 없습니다.' }, { status: 400 });
    }
    if (author_password.length > 50) {
      return NextResponse.json({ error: '비밀번호는 50자를 초과할 수 없습니다.' }, { status: 400 });
    }

    const files = sanitizeCommunityFileUrls(file_urls);
    if (Array.isArray(file_urls) && file_urls.length > 0 && files.length === 0) {
      return NextResponse.json(
        { error: '첨부파일 URL이 유효하지 않습니다. 사이트 업로드 파일만 첨부할 수 있습니다.' },
        { status: 400 },
      );
    }

    const ip = getClientIp(request);
    const { supabase, error: configError } = getSupabaseOrError();
    if (configError || !supabase) return configError!;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentCount, error: countError } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('created_at', oneHourAgo);

    if (countError) {
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }

    if (recentCount !== null && recentCount >= 10) {
      return NextResponse.json({
        error: '1시간에 최대 10개의 게시글만 작성할 수 있습니다. 잠시 후 다시 시도해주세요.'
      }, { status: 429 });
    }

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: titleCount } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .eq('title', title)
      .gte('created_at', oneDayAgo);

    if (titleCount !== null && titleCount >= 2) {
      return NextResponse.json({
        error: '동일한 제목의 게시글은 24시간 내 2개까지만 작성할 수 있습니다.'
      }, { status: 409 });
    }

    if (content) {
      const { data: contentDup } = await supabase
        .from('community_posts')
        .select('id')
        .eq('ip_address', ip)
        .eq('content', content)
        .gte('created_at', oneDayAgo)
        .limit(1);

      if (contentDup && contentDup.length > 0) {
        return NextResponse.json({
          error: '동일한 내용의 게시글이 이미 존재합니다. 도배로 간주됩니다.'
        }, { status: 409 });
      }
    }

    const { data, error } = await supabase
      .from('community_posts')
      .insert([{
        author_nickname,
        author_password: hashPassword(author_password),
        title,
        content: content || '',
        file_urls: files,
        ip_address: ip,
      }])
      .select(PUBLIC_COMMUNITY_POST_COLUMNS)
      .single();

    if (error) {
      return NextResponse.json({ error: '게시글 작성에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ post: data }, { status: 201 });

  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, password } = body;

    if (!id || !password) {
      return NextResponse.json({ error: 'ID와 비밀번호가 필요합니다.' }, { status: 400 });
    }

    const ip = getClientIp(request);
    const globalRate = checkRateLimit(
      `community-delete:${ip}`,
      DELETE_GLOBAL_LIMIT,
      DELETE_GLOBAL_WINDOW,
    );
    if (!globalRate.ok) {
      return NextResponse.json(
        rateLimitResponse('삭제 시도 한도를 초과했습니다.', globalRate.resetAfterMs),
        { status: 429 },
      );
    }

    const postRate = checkRateLimit(
      `community-delete:${ip}:${id}`,
      DELETE_POST_LIMIT,
      DELETE_POST_WINDOW,
    );
    if (!postRate.ok) {
      return NextResponse.json(
        rateLimitResponse('이 게시글에 대한 삭제 시도가 너무 많습니다.', postRate.resetAfterMs),
        { status: 429 },
      );
    }

    const { supabase, error: configError } = getSupabaseOrError();
    if (configError || !supabase) return configError!;

    const { data: post } = await supabase
      .from('community_posts')
      .select('author_password')
      .eq('id', id)
      .single();

    if (!post) {
      return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }

    if (!verifyPassword(password, post.author_password)) {
      return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 403 });
    }

    const { error } = await supabase.from('community_posts').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: '삭제에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });

  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
}
