import type { Metadata } from "next";
import type { Game, Player } from "./playerMapping";
import { getGameHubConfig } from "./gameHubConfig";

function buildTopPlayerNames(players: Player[], limit = 5): string {
  return players
    .slice(0, limit)
    .map((p) => p.playerName)
    .filter(Boolean)
    .join(", ");
}

export function buildGameHubMetadata(
  game: Game,
  players: Player[] = [],
): Metadata {
  const config = getGameHubConfig(game);
  const count = players.length;
  const topNames = buildTopPlayerNames(players);

  const googleTitle = `${config.label} 프로게이머 장비 랭킹 - ${config.league} | 템빨`;
  const ogTitle = `${config.label} ${config.league} 프로게이머 템`;

  const descriptionParts = [
    `${config.label}(${config.league}) 프로게이머 ${count}명의 게이밍 장비 랭킹.`,
    "마우스, 키보드, 모니터, 헤드셋 등 실제 사용 장비 확인.",
  ];
  if (topNames) {
    descriptionParts.push(`인기 선수: ${topNames}`);
  }
  descriptionParts.push(
    `관련: ${config.label} 프로게이머 장비, ${config.league} 선수 마우스, ${config.label} 장비 랭킹`,
  );

  const description = descriptionParts.join(" ");
  const ogDescription = `${config.league} ${config.label} 프로게이머 ${count}명 장비 랭킹`;

  return {
    title: {
      absolute: googleTitle,
    },
    description,
    alternates: {
      canonical: config.path,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      images: [
        {
          url: config.logo,
          alt: `${config.label} 프로게이머 장비`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [config.logo],
    },
  };
}
