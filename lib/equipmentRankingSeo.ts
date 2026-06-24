import type { Metadata } from "next";

export function buildEquipmentRankingMetadata(
  equipmentCount: number,
  indexedPlayerCount: number,
): Metadata {
  return {
    title: {
      absolute: "프로게이머 인기 장비 랭킹 - 마우스, 키보드, 모니터 | 템빨",
    },
    description: `프로게이머 ${indexedPlayerCount}명이 사용하는 ${equipmentCount}개 장비 인기 랭킹. 마우스, 키보드, 헤드셋, 모니터 스펙과 사용 선수 수.`,
    alternates: {
      canonical: "/equipment",
    },
    openGraph: {
      title: "프로게이머 인기 장비 랭킹 템",
      description: `마우스, 키보드, 모니터 등 ${equipmentCount}개 장비 인기 순위`,
      images: [{ url: "/images/banner.svg", alt: "템빨 장비 랭킹" }],
    },
  };
}
