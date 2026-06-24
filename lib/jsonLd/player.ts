import { getGameHubConfig } from "@/lib/gameHubConfig";
import type { Player } from "@/lib/playerMapping";
import { getSiteUrl } from "@/lib/site";
import { buildBreadcrumbJsonLd, type BreadcrumbItem } from "./breadcrumb";

const GAME_LABELS: Record<string, string> = {
  lol: "리그 오브 레전드",
  starcraft: "스타크래프트",
  valorant: "발로란트",
  battlegrounds: "배틀그라운드",
};

export function buildPlayerJsonLd(player: Player) {
  const base = getSiteUrl();
  const gameConfig = getGameHubConfig(player.game);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.playerName,
    url: `${base}/player/${player.id}`,
    jobTitle: "프로게이머",
    knowsAbout: player.equipment.map(
      (eq) => `${eq.equipmentType} ${eq.equipmentName}`,
    ),
  };

  if (player.playerRealName) {
    jsonLd.alternateName = player.playerRealName;
  }
  if (player.playerImage) {
    jsonLd.image = `${base}${player.playerImage}`;
  }
  if (player.team) {
    jsonLd.memberOf = {
      "@type": "SportsTeam",
      name: player.team,
    };
  }

  return jsonLd;
}

export function buildPlayerPageJsonLd(player: Player) {
  const gameConfig = getGameHubConfig(player.game);
  const gameLabel = GAME_LABELS[player.game] || player.game;

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "홈", path: "/" },
    { name: gameLabel, path: gameConfig.path },
    { name: player.playerName, path: `/player/${player.id}` },
  ];

  return [buildPlayerJsonLd(player), buildBreadcrumbJsonLd(breadcrumbs)];
}
