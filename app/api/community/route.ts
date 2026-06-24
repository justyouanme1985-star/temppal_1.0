import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { author_nickname, author_password, title, content, file_urls } = body;

    // ── Validation ──
    if (!author_nickname || !author_password || !title) {
      return NextResponse.json({ error: '닉네임, 비밀번호, 제목은 필수입니다.' }, { status: 400 });
    }
    if (title.length > 100) {
      return NextResponse.json({ error: '제목은 100자를 초과할 수 없습니다.' }, { status: 400 });
    }
    if (content.length > 10000) {
      return NextResponse.json({ error: '내용은 10000자를 초과할 수 없습니다.' }, { status: 400 });
    }
    if (author_nickname.length > 20) {
      return NextResponse.json({ error: '닉네임은 20자를 초과할 수 없습니다.' }, { status: 400 });
    }
    if (author_password.length > 50) {
      return NextResponse.json({ error: '비밀번호는 50자를 초과할 수 없습니다.' }, { status: 400 });
    }

    const files = Array.isArray(file_urls) ? file_urls.slice(0, 3) : [];

    // ── Get client IP ──
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ── Rate limit: max 10 posts per hour per IP ──
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

    // ── Duplicate check: same IP + same title → max 2 per 24h ──
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

    // ── Content-based duplicate check: same IP + same content within 24h ──
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

    // ── Insert ──
    const { data, error } = await supabase
      .from('community_posts')
      .insert([{
        author_nickname,
        author_password,
        title,
        content: content || '',
        file_urls: files,
        ip_address: ip,
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: '게시글 작성에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ post: data }, { status: 201 });

  } catch (err) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
}

// DELETE /api/community — body: { id, password }
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, password } = body;

    if (!id || !password) {
      return NextResponse.json({ error: 'ID와 비밀번호가 필요합니다.' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Verify password
    const { data: post } = await supabase
      .from('community_posts')
      .select('author_password')
      .eq('id', id)
      .single();

    if (!post) {
      return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }

    if (post.author_password !== password) {
      return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 403 });
    }

    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: '삭제에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });

  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
}
