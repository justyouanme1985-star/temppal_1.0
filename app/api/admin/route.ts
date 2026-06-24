import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/security/clientIp";
import {
  adminUnauthorizedResponse,
  clearAdminSessionCookie,
  isAdminConfigured,
  isAdminRequest,
  setAdminSessionCookie,
} from "@/lib/security/adminSession";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rateLimit";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export async function GET(req: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ ok: false, configured: false });
  }
  return NextResponse.json({
    ok: isAdminRequest(req),
    configured: true,
  });
}

export async function POST(req: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "관리자 기능이 설정되지 않았습니다." },
      { status: 503 },
    );
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
    const adminPassword = process.env.COMMENTS_ADMIN_PASSWORD || "";
    if (!password || password !== adminPassword) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }

    const res = NextResponse.json({ ok: true });
    return setAdminSessionCookie(res);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return adminUnauthorizedResponse();
  }

  const res = NextResponse.json({ ok: true });
  return clearAdminSessionCookie(res);
}
