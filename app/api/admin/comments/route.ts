import { NextRequest, NextResponse } from "next/server";
import {
  adminUnauthorizedResponse,
  isAdminRequest,
} from "@/lib/security/adminSession";
import { getClientIp } from "@/lib/security/clientIp";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rateLimit";
import { getSupabaseAdmin } from "@/lib/security/supabaseAdmin";

const DELETE_LIMIT = 120;
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

async function adminDeleteComment(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  id: number,
) {
  await supabase.from("comments").delete().eq("parent_id", id);
  const { error } = await supabase.from("comments").delete().eq("id", id);
  return error;
}

export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return adminUnauthorizedResponse();
  }

  const ip = getClientIp(req);
  const rate = checkRateLimit(`admin-comments-delete:${ip}`, DELETE_LIMIT, WINDOW_MS);
  if (!rate.ok) {
    return NextResponse.json(
      rateLimitResponse("삭제 시도 한도를 초과했습니다.", rate.resetAfterMs),
      { status: 429 },
    );
  }

  try {
    const body = await req.json();
    const rawIds = body.id !== undefined ? [body.id] : body.ids;
    if (!Array.isArray(rawIds) || rawIds.length === 0) {
      return NextResponse.json({ error: "삭제할 댓글 ID가 필요합니다." }, { status: 400 });
    }

    const ids = [...new Set(rawIds.map((value: unknown) => Number(value)).filter((n) => Number.isFinite(n) && n > 0))];
    if (ids.length === 0) {
      return NextResponse.json({ error: "유효한 댓글 ID가 없습니다." }, { status: 400 });
    }
    if (ids.length > 100) {
      return NextResponse.json({ error: "한 번에 최대 100개까지 삭제할 수 있습니다." }, { status: 400 });
    }

    const { supabase, error: configError } = getSupabaseOrError();
    if (configError || !supabase) return configError!;

    let deleted = 0;
    for (const id of ids) {
      const error = await adminDeleteComment(supabase, id);
      if (error) {
        console.error("admin comment delete error:", id, error);
        return NextResponse.json({ error: "댓글 삭제에 실패했습니다." }, { status: 500 });
      }
      deleted += 1;
    }

    console.info("admin deleted comments", { ip, ids, deleted });
    return NextResponse.json({ ok: true, deleted });
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
}
