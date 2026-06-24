// lib/playerMapping.ts
// Pure, framework-agnostic player mapping & ranking logic shared between the
// browser data layer (playerData.ts) and the server data layer
// (serverPlayerData.ts / API routes). Must NOT import any browser-only or
// server-only modules (no supabase client, no next/headers, no React).

// ==================== Types ====================
export type Game = "lol" | "starcraft" | "valorant" | "battlegrounds";

export interface Equipment {
  id: string;
  equipmentType: string;
  equipmentName: string;
  productImage: string;
  productUrl: string;
}

export interface Player {
  id: string;
  dbId?: number;
  team: string;
  teamLogo: string;
  playerName: string;
  playerRealName: string;
  birthDate?: string;
  nationality: string;
  playerImage: string;
  equipment: Equipment[];
  previousEquipment: Equipment[];
  game: Game;
  profession: string;
  position: string;
  popularityRank: number;
  rankChange: number;
  clickCount: number;
  powerRanking?: number;
  powerScore?: number;
  youtube?: string;
  soop?: string;
  instagram?: string;
  twitter?: string;
  twitch?: string;
  chzzk?: string;
  facebook?: string;
  collectedWords?: string[];
}

export interface RawPlayer {
  id: number;
  name: string;
  ign: string;
  nationality: string;
  team: string;
  league: string;
  game: Game;
  profession: string;
  position: string;
  birthdate?: string | null;
  birthday?: string | null;
  dob?: string | null;
  mouse: string | null;
  keyboard: string | null;
  headset: string | null;
  monitor: string | null;
  mousepad: string | null;
  chair: string | null;
  desk: string | null;
  previous_mouse: string | null;
  previous_keyboard: string | null;
  previous_mousepad: string | null;
  youtube: string | null;
  soop: string | null;
  instagram: string | null;
  twitter: string | null;
  twitch: string | null;
  chzzk?: string | null;
  facebook?: string | null;
  collected_words?: string[];
  count_player_cumulative?: number;
  count_player_recent?: number;
  count_items_recent?: number;
  count_items_cumulative?: number;
  admin_power_ranking?: number;
  previous_admin_power_ranking?: number;
  total_weighted_points?: number;
  playerImage?: string | null;
}

// ==================== Static data ====================
const ASSETS_PATH = "/images/";

export const teamLogos: Record<string, string> = {
  "T1": `${ASSETS_PATH}team-logo/team-logo-t1.webp`,
  "DN SOOPers": `${ASSETS_PATH}team-logo/team-logo-dn-soopers.webp`,
  "Gen.G": `${ASSETS_PATH}team-logo/team-logo-gen.g.webp`,
  "Dplus KIA": `${ASSETS_PATH}team-logo/team-logo-dplus-kia.webp`,
  "BNK FearX": `${ASSETS_PATH}team-logo/team-logo-bnk-fearx.webp`,
  "Hanwha Life Esports": `${ASSETS_PATH}team-logo/team-logo-hanwha-life-esports.webp`,
  "KT Rolster": `${ASSETS_PATH}team-logo/team-logo-kt-rolster.webp`,
  "Nongshim RedForce": `${ASSETS_PATH}team-logo/team-logo-nongshim-red-force.webp`,
  "Hanjin Brion": `${ASSETS_PATH}team-logo/team-logo-hanjin-brion.webp`,
  "Kiwoom DRX": `${ASSETS_PATH}team-logo/team-logo-kiwoom-drx.webp`,
  "LYON": `${ASSETS_PATH}team-logo/team-logo-lyon.webp`,
  "LNG Esports": `${ASSETS_PATH}team-logo/team-logo-lng-esports.webp`,
  "은퇴": "",
  "DRX": `${ASSETS_PATH}team-logo/team-logo-kiwoom-drx.webp`,
  "Team Liquid": "",
  "IAM": "",
  "T1 Esports Academy": `${ASSETS_PATH}team-logo/team-logo-t1.webp`,
  "ASL": `${ASSETS_PATH}team-logo/team-logo-asl.webp`,
  "DetonatioN FocusMe": `${ASSETS_PATH}team-logo/team-logo-DetonatioN FocusMe.webp`,
  "Global Esports": `${ASSETS_PATH}team-logo/team-logo-global-esports.webp`,
  "VARREL": `${ASSETS_PATH}team-logo/team-logo-varrel.webp`,
  "ZETA DIVISION": `${ASSETS_PATH}team-logo/team-logo-ZETA DIVISION-dark.webp`,
  "Gen.G Esports": `${ASSETS_PATH}team-logo/team-logo-gen.g.webp`,
  "DNS Challengers": `${ASSETS_PATH}team-logo/team-logo-dn-soopers.webp`,
};

const GAME_FOLDER_MAP: Record<string, string> = {
  lol: "lol",
  valorant: "valorant",
  battlegrounds: "pubg",
  starcraft: "starcraft",
};

export function buildPlayerImagePath(id: number | string, ign: string, game: string): string {
  const folder = GAME_FOLDER_MAP[game] || "lol";
  return `${ASSETS_PATH}players/${folder}/${id}-${ign}.webp`;
}

export const GAME_ORDER: Game[] = ["lol", "valorant", "battlegrounds", "starcraft"];

// ==================== Equipment assembly ====================
const CURRENT_EQUIPMENT_FIELDS: { field: keyof RawPlayer; type: string; slug: string }[] = [
  { field: "mouse", type: "마우스", slug: "mouse" },
  { field: "keyboard", type: "키보드", slug: "keyboard" },
  { field: "headset", type: "헤드셋", slug: "headset" },
  { field: "monitor", type: "모니터", slug: "monitor" },
  { field: "mousepad", type: "마우스패드", slug: "mousepad" },
  { field: "chair", type: "의자", slug: "chair" },
  { field: "desk", type: "책상", slug: "desk" },
];

const PREVIOUS_EQUIPMENT_FIELDS: { field: keyof RawPlayer; type: string; slug: string }[] = [
  { field: "previous_mouse", type: "마우스", slug: "prev-mouse" },
  { field: "previous_keyboard", type: "키보드", slug: "prev-keyboard" },
  { field: "previous_mousepad", type: "마우스패드", slug: "prev-mousepad" },
];

function buildEquipment(raw: RawPlayer): Equipment[] {
  const ign = raw.ign || "";
  const equipment: Equipment[] = [];
  for (const { field, type, slug } of CURRENT_EQUIPMENT_FIELDS) {
    const value = raw[field] as string | null | undefined;
    if (value) {
      equipment.push({ id: `${ign}-${slug}`, equipmentType: type, equipmentName: value, productImage: "", productUrl: "" });
    }
  }
  return equipment;
}

function buildPreviousEquipment(raw: RawPlayer): Equipment[] {
  const ign = raw.ign || "";
  const equipment: Equipment[] = [];
  for (const { field, type, slug } of PREVIOUS_EQUIPMENT_FIELDS) {
    const value = raw[field] as string | null | undefined;
    if (value) {
      equipment.push({ id: `${ign}-${slug}`, equipmentType: type, equipmentName: value, productImage: "", productUrl: "" });
    }
  }
  return equipment;
}

// ==================== Mapping ====================
export function mapRawToPlayer(raw: RawPlayer): Player {
  const clicks = raw.count_player_cumulative ?? 0;
  const prevRank = raw.previous_admin_power_ranking ?? 0;
  const currRank = raw.admin_power_ranking ?? 0;
  const rankChangeAmt =
    prevRank > 0 && currRank > 0 ? prevRank - currRank : 0;

  return {
    id: (raw.ign || "").toLowerCase().trim(),
    dbId: raw.id,
    team: raw.team || "",
    teamLogo: teamLogos[raw.team] || "",
    playerName: raw.ign || "",
    playerRealName: raw.name || "",
    birthDate: raw.birthdate || raw.birthday || raw.dob || undefined,
    nationality: `🇰🇷 ${raw.nationality || ""}`,
    playerImage: buildPlayerImagePath(raw.id, raw.ign, raw.game),
    equipment: buildEquipment(raw),
    previousEquipment: buildPreviousEquipment(raw),
    game: raw.game || "lol",
    profession: raw.profession || "",
    position: raw.position || "",
    popularityRank: 0,
    rankChange: rankChangeAmt,
    clickCount: clicks,
    powerRanking: raw.admin_power_ranking ?? undefined,
    powerScore: raw.total_weighted_points ?? 0,
    youtube: raw.youtube || undefined,
    soop: raw.soop || undefined,
    instagram: raw.instagram || undefined,
    twitter: raw.twitter || undefined,
    twitch: raw.twitch || undefined,
    chzzk: raw.chzzk || undefined,
    facebook: raw.facebook || undefined,
    collectedWords: raw.collected_words || undefined,
  };
}

/** Sort a list of players (in place) by power ranking, then click count, and assign popularityRank. */
export function rankPlayers(players: Player[]): Player[] {
  players.sort((a, b) => {
    const aRank = a.powerRanking ?? Infinity;
    const bRank = b.powerRanking ?? Infinity;
    if (aRank !== bRank) return aRank - bRank;
    return b.clickCount - a.clickCount;
  });
  players.forEach((p, i) => {
    p.popularityRank = i + 1;
  });
  return players;
}

/**
 * Dedupe raw rows by ign, map to Player, then rank within each game.
 * Returns players flattened in canonical game order, each carrying its
 * per-game popularityRank.
 */
export function dedupeAndRank(rawPlayers: RawPlayer[]): Player[] {
  const playerMap = new Map<string, Player>();
  for (const raw of rawPlayers) {
    const normIgn = (raw.ign || "").toLowerCase().trim();
    if (!normIgn || playerMap.has(normIgn)) continue;
    playerMap.set(normIgn, mapRawToPlayer(raw));
  }

  const byGame: Record<string, Player[]> = {};
  for (const p of playerMap.values()) {
    (byGame[p.game] ||= []).push(p);
  }

  for (const game of Object.keys(byGame)) {
    rankPlayers(byGame[game]);
  }

  return GAME_ORDER.flatMap((game) => byGame[game] || []);
}
