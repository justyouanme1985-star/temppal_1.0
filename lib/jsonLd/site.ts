import { getSiteUrl } from "@/lib/site";

export function buildWebSiteJsonLd() {
  const base = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "템빨",
    alternateName: "Temppal",
    url: base,
    description: "프로게이머 게이밍 장비 랭킹과 실사용 정보",
    inLanguage: "ko-KR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${base}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
