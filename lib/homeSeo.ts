import type { Metadata } from "next";

export function buildHomePageMetadata(playerCount: number): Metadata {
  return {
    title: {
      absolute: "템빨 - 프로게이머 장비 랭킹 (LoL, 발로란트, 스타, 배그)",
    },
    description: `LCK, VCT 등 프로게이머 ${playerCount}명의 마우스, 키보드, 모니터 실사용 정보.`,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: "템빨 - 프로게이머 장비 랭킹",
      description: `프로게이머 ${playerCount}명의 게이밍 장비 랭킹`,
      images: [{ url: "/images/banner.svg", alt: "템빨" }],
    },
  };
}
