import type { Game } from "./playerMapping";

export type GameHubConfig = {
  game: Game;
  title: string;
  label: string;
  league: string;
  logo: string;
  icon: string;
  path: string;
};

export const GAME_HUB_CONFIG: Record<Game, GameHubConfig> = {
  lol: {
    game: "lol",
    title: "LoL",
    label: "리그 오브 레전드",
    league: "LCK",
    logo: "/images/game_logo/lol-logo.svg",
    icon: "/images/game_logo/lol-icon.svg",
    path: "/lol",
  },
  starcraft: {
    game: "starcraft",
    title: "StarCraft",
    label: "스타크래프트",
    league: "ASL",
    logo: "/images/game_logo/starcraft-logo.svg",
    icon: "/images/game_logo/starcraft-icon.svg",
    path: "/starcraft",
  },
  valorant: {
    game: "valorant",
    title: "Valorant",
    label: "발로란트",
    league: "VCT",
    logo: "/images/game_logo/valorant-logo.svg",
    icon: "/images/game_logo/valorant-icon.svg",
    path: "/valorant",
  },
  battlegrounds: {
    game: "battlegrounds",
    title: "Battlegrounds",
    label: "배틀그라운드",
    league: "PUBG",
    logo: "/images/game_logo/battlegrounds-logo.svg",
    icon: "/images/game_logo/battlegrounds-icon.svg",
    path: "/battlegrounds",
  },
};

export function getGameHubConfig(game: Game): GameHubConfig {
  return GAME_HUB_CONFIG[game];
}
