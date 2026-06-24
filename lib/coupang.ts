/**
 * Coupang Partners affiliate link generator.
 * Set NEXT_PUBLIC_COUPANG_TRACKING_ID in .env.local
 *
 * If `affiliateUrl` is provided (from Supabase equipment_info.affiliate_url),
 * use it directly — this is the preferred Coupang Partners short link.
 * Otherwise fall back to a search-based affiliate link.
 */
export function isValidCoupangPartnersUrl(url: string): boolean {
  return /^https:\/\/link\.coupang\.com\//i.test(url.trim());
}

export function coupangLink(query: string, affiliateUrl?: string | null): string {
  if (affiliateUrl && isValidCoupangPartnersUrl(affiliateUrl)) {
    return affiliateUrl.trim();
  }
  const trackingId = process.env.NEXT_PUBLIC_COUPANG_TRACKING_ID || "temppal-01";
  const searchUrl = `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(query)}`;
  return `https://link.coupang.com/re/CSHARES?url=${encodeURIComponent(searchUrl)}&shareId=${trackingId}`;
}

/**
 * Open a Coupang affiliate link.
 * On mobile, tries to open the Coupang app first via coupang:// URL scheme;
 * falls back to the web affiliate link if the app is not installed.
 * On desktop, opens the web affiliate link directly.
 */
export function openCoupangLink(url: string): void {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(
    typeof navigator !== 'undefined' ? navigator.userAgent : '',
  );

  if (!isMobile) {
    window.open(url, '_blank');
    return;
  }

  // Mobile: try Coupang app via hidden iframe, fall back to web
  const appUrl = url.replace(/^https?:\/\/link\.coupang\.com\/a\//, 'coupang://');

  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = appUrl;
  document.body.appendChild(iframe);

  setTimeout(() => {
    document.body.removeChild(iframe);
    window.open(url, '_blank');
  }, 600);
}
