import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.COMMENTS_ADMIN_PASSWORD || "";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
