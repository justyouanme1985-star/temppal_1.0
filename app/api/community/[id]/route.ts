import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_COMMUNITY_POST_COLUMNS } from "@/lib/communityPosts";
import { getSupabaseAdmin } from "@/lib/security/supabaseAdmin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId) || postId <= 0) {
    return NextResponse.json({ error: "잘못된 게시글 ID입니다." }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return NextResponse.json({ error: "서버 설정 오류입니다." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("community_posts")
    .select(PUBLIC_COMMUNITY_POST_COLUMNS)
    .eq("id", postId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "게시글을 불러오지 못했습니다." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json(data);
}
