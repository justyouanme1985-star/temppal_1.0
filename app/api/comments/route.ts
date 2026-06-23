import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

// Admin client with service role key for delete operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const ADMIN_PASSWORD = process.env.COMMENTS_ADMIN_PASSWORD || "";

// GET /api/comments?type=player|equipment&id=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetType = searchParams.get("type");
  const targetId = searchParams.get("id");

  if (!targetType || !targetId) {
    return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/comments — body: { target_type, target_id, parent_id?, author, content }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { target_type, target_id, parent_id, author, content } = body;

    if (!target_type || !target_id || !author?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
    }
    if (author.trim().length > 20) {
      return NextResponse.json({ error: "이름은 20자 이하로 입력해주세요." }, { status: 400 });
    }
    if (content.trim().length > 1500) {
      return NextResponse.json({ error: "내용은 1500자 이하로 입력해주세요." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("comments")
      .insert([{
        target_type,
        target_id,
        parent_id: parent_id || null,
        author: author.trim(),
        content: content.trim(),
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE /api/comments — body: { id, password }
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, password } = body;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "관리자 비밀번호가 일치하지 않습니다." }, { status: 403 });
    }

    // Delete the comment (replies cascade via FK)
    const { error } = await supabaseAdmin
      .from("comments")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
