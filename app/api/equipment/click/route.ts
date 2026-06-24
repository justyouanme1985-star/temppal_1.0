import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/security/supabaseAdmin";

export async function POST(req: Request) {
  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { equipment_name } = body;

    if (!equipment_name || typeof equipment_name !== "string") {
      return NextResponse.json(
        { error: "equipment_name is required" },
        { status: 400 },
      );
    }

    const { error } = await supabase.rpc("log_equipment_only", {
      p_equipment_name: equipment_name,
    });

    if (error) {
      console.error("log_equipment_only RPC error:", error);
      return NextResponse.json({ error: "Click failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Equipment click error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
