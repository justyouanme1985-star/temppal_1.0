type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAfterMs: number;
};

const buckets = new Map<string, number[]>();

/**
 * In-memory sliding-window rate limiter.
 * Resets on serverless cold starts — still useful as a first line of defense.
 */
export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;
  const recent = (buckets.get(key) || []).filter((t) => t > windowStart);

  if (recent.length >= max) {
    buckets.set(key, recent);
    const oldest = recent[0] ?? now;
    return {
      ok: false,
      remaining: 0,
      resetAfterMs: Math.max(0, windowMs - (now - oldest)),
    };
  }

  recent.push(now);
  buckets.set(key, recent);
  return {
    ok: true,
    remaining: max - recent.length,
    resetAfterMs: windowMs,
  };
}

export function rateLimitResponse(message: string, resetAfterMs: number) {
  const minutes = Math.max(1, Math.ceil(resetAfterMs / 60000));
  return {
    error: `${message} ${minutes}분 후에 다시 시도해주세요.`,
    retryAfter: resetAfterMs,
  };
}
