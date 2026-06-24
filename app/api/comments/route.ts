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
    if (!["player", "equipment", "community"].includes(target_type)) {
      return NextResponse.json({ error: "잘못된 대상 유형입니다." }, { status: 400 });
    }
    if (author.trim().length > 20) {
      return NextResponse.json({ error: "이름은 20자 이하로 입력해주세요." }, { status: 400 });
    }
    if (content.trim().length > 1500) {
      return NextResponse.json({ error: "내용은 1500자 이하로 입력해주세요." }, { status: 400 });
    }

    // Generate a unique secret key for deletion
    const secretKey = crypto.randomUUID();

    const { data, error } = await supabaseAdmin
      .from("comments")
      .insert([{
        target_type,
        target_id,
        parent_id: parent_id || null,
        author: author.trim(),
        content: content.trim(),
        secret_key: secretKey,
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return the secret key so the client can store it in localStorage
    return NextResponse.json({ ...data, secret_key: secretKey }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE /api/comments — body: { id, secret_key }
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, secret_key } = body;

    if (!id || !secret_key) {
      return NextResponse.json({ error: "ID와 삭제 키가 필요합니다." }, { status: 400 });
    }

    // Verify the secret key matches
    const { data: comment } = await supabaseAdmin
      .from("comments")
      .select("secret_key, parent_id")
      .eq("id", id)
      .single();

    if (!comment || comment.secret_key !== secret_key) {
      return NextResponse.json({ error: "삭제 권한이 없습니다." }, { status: 403 });
    }

    const parentId = comment.parent_id;

    // Check if this comment has any replies
    const { count: replyCount } = await supabaseAdmin
      .from("comments")
      .select("*", { count: 'exact', head: true })
      .eq("parent_id", id);

    if (replyCount && replyCount > 0) {
      // Soft-delete: mark as deleted but keep for reply hierarchy
      const { error } = await supabaseAdmin
        .from("comments")
        .update({ deleted: true, content: '', author: '' })
        .eq("id", id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true, soft: true });
    }

    // No replies — safe to hard delete
    const { error } = await supabaseAdmin
      .from("comments")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Auto-cleanup: if parent is soft-deleted and has no remaining undeleted children, hard-delete it
    if (parentId) {
      const { count: siblingCount } = await supabaseAdmin
        .from("comments")
        .select("*", { count: 'exact', head: true })
        .eq("parent_id", parentId)
        .eq("deleted", false);

      if (siblingCount === 0) {
        // No undeleted children left — check if parent is soft-deleted
        const { data: parent } = await supabaseAdmin
          .from("comments")
          .select("deleted")
          .eq("id", parentId)
          .single();

        if (parent && parent.deleted) {
          // Hard-delete the parent too (it was only kept for its children)
          await supabaseAdmin
            .from("comments")
            .delete()
            .eq("id", parentId);
        }
      }
    }

    return NextResponse.json({ ok: true, soft: false });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
