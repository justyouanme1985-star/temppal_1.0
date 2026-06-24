import type { Metadata } from "next";

export const equipmentRankingMetadata: Metadata = {
  title: {
    absolute: "프로게이머 인기 장비 랭킹 - 마우스, 키보드, 모니터 | 템빨",
  },
  description:
    "프로게이머가 가장 많이 사용하는 마우스, 키보드, 헤드셋, 모니터, 마우스패드 인기 랭킹. 브랜드, 스펙, 사용 선수 수 확인.",
  alternates: {
    canonical: "/equipment",
  },
  openGraph: {
    title: "프로게이머 인기 장비 랭킹 템",
    description: "마우스, 키보드, 모니터 등 프로게이머 장비 인기 순위",
    images: [{ url: "/images/banner.svg", alt: "템빨 장비 랭킹" }],
  },
};
