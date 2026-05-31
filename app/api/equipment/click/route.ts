import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  try {
    const body = await req.json();
    const { equipment_name } = body;

    if (!equipment_name) {
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
