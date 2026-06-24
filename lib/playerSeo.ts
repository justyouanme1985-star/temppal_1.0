import type { Metadata } from "next";
import type { Player } from "./playerMapping";

const GAME_LABELS: Record<string, string> = {
  lol: "리그 오브 레전드",
  starcraft: "스타크래프트",
  valorant: "발로란트",
  battlegrounds: "배틀그라운드",
};

const DEFAULT_OG_IMAGE = "/images/players/lol/no-picture.webp";

function buildOgTitle(player: Player): string {
  const parts: string[] = [];
  if (player.team) parts.push(player.team);
  parts.push(player.playerName);
  if (player.playerRealName) parts.push(player.playerRealName);
  parts.push("템");
  return parts.join(" ");
}

function buildGoogleTitle(player: Player): string {
  const team = player.team ? `${player.team} ` : "";
  const realName = player.playerRealName ? `(${player.playerRealName})` : "";
  return `${team}${player.playerName}${realName} 사용 장비 | 템빨`;
}

function buildDescription(player: Player): string {
  const team = player.team ? `${player.team} ` : "";
  const realName = player.playerRealName ? `(${player.playerRealName})` : "";
  const game = GAME_LABELS[player.game] || player.game;

  const lines: string[] = [
    `${team}${player.playerName}${realName} — ${game} 프로게이머 게이밍 장비.`,
  ];

  if (player.equipment.length > 0) {
    const gear = player.equipment
      .map((eq) => `${eq.equipmentType} ${eq.equipmentName}`)
      .join(", ");
    lines.push(gear);
  }

  if (player.collectedWords && player.collectedWords.length > 0) {
    lines.push(`관련: ${player.collectedWords.join(", ")}`);
  }

  return lines.join(" ");
}

function buildOgDescription(player: Player): string {
  if (player.equipment.length === 0) {
    return `${player.playerName} 프로게이머 장비 정보`;
  }
  return player.equipment
    .slice(0, 4)
    .map((eq) => `${eq.equipmentType}: ${eq.equipmentName}`)
    .join(" · ");
}

function resolveOgImage(player: Player): string {
  return player.playerImage || DEFAULT_OG_IMAGE;
}

export function buildPlayerPageMetadata(player: Player): Metadata {
  const ogTitle = buildOgTitle(player);
  const description = buildDescription(player);
  const ogDescription = buildOgDescription(player);
  const ogImage = resolveOgImage(player);

  return {
    title: {
      absolute: buildGoogleTitle(player),
    },
    description,
    alternates: {
      canonical: `/player/${player.id}`,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "profile",
      images: [
        {
          url: ogImage,
          alt: `${player.playerName} 프로필`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };
}