import type { NextRequest } from "next/server";

/** Best-effort client IP for rate limiting (trusts x-forwarded-for on Vercel/reverse proxies). */
export function getClientIp(request: Request | NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const client = forwarded.split(",")[0]?.trim();
    if (client) return client;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}
