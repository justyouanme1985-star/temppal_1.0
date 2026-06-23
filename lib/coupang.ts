/**
 * Coupang Partners affiliate link generator.
 * Set NEXT_PUBLIC_COUPANG_TRACKING_ID in .env.local
 */
export function coupangLink(query: string): string {
  const trackingId = process.env.NEXT_PUBLIC_COUPANG_TRACKING_ID || "temppal-01";
  const searchUrl = `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(query)}`;
  return `https://link.coupang.com/re/CSHARES?url=${encodeURIComponent(searchUrl)}&shareId=${trackingId}`;
}
