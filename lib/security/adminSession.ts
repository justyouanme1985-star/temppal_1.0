import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse, type NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "temppal_admin_session";
const SESSION_MAX_AGE_SEC = 24 * 60 * 60;

function getAdminSecret(): string {
  return process.env.COMMENTS_ADMIN_PASSWORD?.trim() || "";
}

export function isAdminConfigured(): boolean {
  return getAdminSecret().length > 0;
}

export function createAdminSessionToken(): string | null {
  const secret = getAdminSecret();
  if (!secret) return null;

  const expires = Date.now() + SESSION_MAX_AGE_SEC * 1000;
  const payload = String(expires);
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const secret = getAdminSecret();
  if (!secret) return false;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;

  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expires = Number(payload);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  if (sig.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function isAdminRequest(req: NextRequest): boolean {
  return verifyAdminSessionToken(req.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export function setAdminSessionCookie(res: NextResponse): NextResponse {
  const token = createAdminSessionToken();
  if (!token) return res;

  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
  return res;
}

export function clearAdminSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

export function adminUnauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
}
