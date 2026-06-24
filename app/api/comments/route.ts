import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/security/clientIp";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rateLimit";
import { getSupabaseAdmin } from "@/lib/security/supabaseAdmin";

const PUBLIC_COMMENT_COLUMNS =
  "id, target_type, target_id, parent_id, author, content, created_at, updated_at, deleted";

const POST_LIMIT = 30;
const DELETE_LIMIT = 60;
const WINDOW_MS = 60 * 60 * 1000;

function getSupabaseOrError() {
  try {
    return { supabase: getSupabaseAdmin(), error: null as NextResponse | null };
  } catch {
    return {
      supabase: null,
      error: NextResponse.json({ error: "서버 설정 오류입니다." }, { status: 503 }),
    };
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetType = searchParams.get("type");
  const targetId = searchParams.get("id");

  if (!targetType || !targetId) {
    return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
  }

  const { supabase, error: configError } = getSupabaseOrError();
  if (configError || !supabase) return configError!;

  const { data, error } = await supabase
    .from("comments")
    .select(PUBLIC_COMMENT_COLUMNS)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("comments GET error:", error);
    return NextResponse.json({ error: "댓글을 불러오지 못했습니다." }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`comments-post:${ip}`, POST_LIMIT, WINDOW_MS);
  if (!rate.ok) {
    return NextResponse.json(
      rateLimitResponse("댓글 작성 한도를 초과했습니다.", rate.resetAfterMs),
      { status: 429 },
    );
  }

  try {
    const body = await req.json();
    const { target_type, target_id, parent_id, author, content } = body;

    if (!target_type || !target_id || !author?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
    }
    if (!["player", "equipment", "community"].includes(target_type)) {
      return NextResponse.json({ error: "잘못된 대상 유형입니다." }, { status: 400 });
    }
    if (author.trim().length > 20) {
      return NextResponse.json({ error: "이름은 20자 이하로 입력해주세요." }, { status: 400 });
    }
    if (content.trim().length > 1500) {
      return NextResponse.json({ error: "내용은 1500자 이하로 입력해주세요." }, { status: 400 });
    }

    const secretKey = crypto.randomUUID();
    const { supabase, error: configError } = getSupabaseOrError();
    if (configError || !supabase) return configError!;

    const { data, error } = await supabase
      .from("comments")
      .insert([{
        target_type,
        target_id,
        parent_id: parent_id || null,
        author: author.trim(),
        content: content.trim(),
        secret_key: secretKey,
      }])
      .select(PUBLIC_COMMENT_COLUMNS)
      .single();

    if (error) {
      console.error("comments POST error:", error);
      return NextResponse.json({ error: "댓글 작성에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ ...data, secret_key: secretKey }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`comments-delete:${ip}`, DELETE_LIMIT, WINDOW_MS);
  if (!rate.ok) {
    return NextResponse.json(
      rateLimitResponse("삭제 시도 한도를 초과했습니다.", rate.resetAfterMs),
      { status: 429 },
    );
  }

  try {
    const body = await req.json();
    const { id, secret_key } = body;

    if (!id || !secret_key) {
      return NextResponse.json({ error: "ID와 삭제 키가 필요합니다." }, { status: 400 });
    }

    const { supabase, error: configError } = getSupabaseOrError();
    if (configError || !supabase) return configError!;

    const { data: comment } = await supabase
      .from("comments")
      .select("secret_key, parent_id")
      .eq("id", id)
      .single();

    if (!comment || comment.secret_key !== secret_key) {
      return NextResponse.json({ error: "삭제 권한이 없습니다." }, { status: 403 });
    }

    const parentId = comment.parent_id;

    const { count: replyCount } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("parent_id", id);

    if (replyCount && replyCount > 0) {
      const { error } = await supabase
        .from("comments")
        .update({ deleted: true, content: "", author: "" })
        .eq("id", id);

      if (error) {
        console.error("comments soft-delete error:", error);
        return NextResponse.json({ error: "삭제에 실패했습니다." }, { status: 500 });
      }
      return NextResponse.json({ ok: true, soft: true });
    }

    const { error } = await supabase.from("comments").delete().eq("id", id);

    if (error) {
      console.error("comments delete error:", error);
      return NextResponse.json({ error: "삭제에 실패했습니다." }, { status: 500 });
    }

    if (parentId) {
      const { count: siblingCount } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("parent_id", parentId)
        .eq("deleted", false);

      if (siblingCount === 0) {
        const { data: parent } = await supabase
          .from("comments")
          .select("deleted")
          .eq("id", parentId)
          .single();

        if (parent?.deleted) {
          await supabase.from("comments").delete().eq("id", parentId);
        }
      }
    }

    return NextResponse.json({ ok: true, soft: false });
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
}
