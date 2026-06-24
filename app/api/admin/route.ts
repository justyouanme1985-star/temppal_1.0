import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/security/clientIp";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rateLimit";

const ADMIN_PASSWORD = process.env.COMMENTS_ADMIN_PASSWORD || "";
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: "관리자 기능이 설정되지 않았습니다." }, { status: 503 });
  }

  const ip = getClientIp(req);
  const rate = checkRateLimit(`admin-login:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, ...rateLimitResponse("로그인 시도 횟수를 초과했습니다.", rate.resetAfterMs) },
      { status: 429 },
    );
  }

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
