import type { Metadata } from "next";
import type { Game } from "./playerMapping";
import { getEquipmentTypeLabel } from "./equipmentLabels";
import { getGameHubConfig } from "./gameHubConfig";

export function buildEquipmentCategoryMetadata(
  category: string,
  itemCount: number,
): Metadata {
  const label = getEquipmentTypeLabel(category);

  return {
    title: {
      absolute: `프로게이머 ${label} 랭킹 | 템빨`,
    },
    description: `프로게이머가 가장 많이 사용하는 ${label} ${itemCount}개. 브랜드, 스펙, 사용 선수 수를 확인하세요.`,
    alternates: {
      canonical: `/equipment/${category}`,
    },
    openGraph: {
      title: `프로게이머 ${label} 랭킹 템`,
      description: `${label} 인기 순위 ${itemCount}개 — 프로게이머 실사용 장비`,
      images: [{ url: "/images/banner.svg", alt: `프로게이머 ${label}` }],
    },
  };
}

export function buildGameCategoryMetadata(
  game: Game,
  category: string,
  itemCount: number,
): Metadata {
  const config = getGameHubConfig(game);
  const label = getEquipmentTypeLabel(category);

  return {
    title: {
      absolute: `${config.label} 프로게이머 ${label} - ${config.league} | 템빨`,
    },
    description: `${config.league} ${config.label} 프로게이머가 사용하는 ${label} ${itemCount}개. 인기 순위, 스펙, 사용 선수 확인.`,
    alternates: {
      canonical: `/${game}/${category}`,
    },
    openGraph: {
      title: `${config.label} ${label} 프로게이머 템`,
      description: `${config.league} ${label} ${itemCount}개`,
      images: [{ url: config.logo, alt: config.label }],
    },
  };
}
