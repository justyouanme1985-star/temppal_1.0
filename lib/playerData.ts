// lib/playerData.ts
import { createBrowserClient } from '@supabase/ssr';
import type { LucideIcon } from "lucide-react";
import { 
  Mouse, Keyboard, Headphones, Monitor, 
  RectangleHorizontal, ArmchairIcon, MonitorIcon 
} from "lucide-react";

// Supabase 클라이언트 생성 함수 (최상단에서 바로 만들지 않음)
function createSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

// ==================== Interfaces ====================
export interface Equipment {
  id: string;
  equipmentType: string;
  equipmentName: string;
  productImage: string;
  productUrl: string;
  icon?: LucideIcon;
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
  game: "lol" | "starcraft" | "valorant" | "battlegrounds";
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

interface RawPlayer {
  id: number;
  name: string;
  ign: string;
  nationality: string;
  team: string;
  league: string;
  game: "lol" | "starcraft" | "valorant" | "battlegrounds";
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

// ==================== 정적 데이터 ====================
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

// Player image path builder — uses new {id}-{ign}.webp naming on disk
const GAME_FOLDER_MAP: Record<string, string> = {
  lol: 'lol',
  valorant: 'valorant',
  battlegrounds: 'pubg',
  starcraft: 'starcraft',
};

export function buildPlayerImagePath(id: number | string, ign: string, game: string): string {
  const folder = GAME_FOLDER_MAP[game] || 'lol';
  return `${ASSETS_PATH}players/${folder}/${id}-${ign}.webp`;
}

import { loadEquipmentFromSupabase, hasEquipmentImage } from "./equipmentData";

// Equipment 조립 함수
async function buildEquipment(player: RawPlayer): Promise<Equipment[]> {
  await loadEquipmentFromSupabase();
  
  const equipment: Equipment[] = [];
  if (player.mouse) equipment.push({ id: `${player.ign}-mouse`, equipmentType: "마우스", equipmentName: player.mouse, productImage: "", productUrl: "", icon: Mouse });
  if (player.keyboard) equipment.push({ id: `${player.ign}-keyboard`, equipmentType: "키보드", equipmentName: player.keyboard, productImage: "", productUrl: "", icon: Keyboard });
  if (player.headset) equipment.push({ id: `${player.ign}-headset`, equipmentType: "헤드셋", equipmentName: player.headset, productImage: "", productUrl: "", icon: Headphones });
  if (player.monitor) equipment.push({ id: `${player.ign}-monitor`, equipmentType: "모니터", equipmentName: player.monitor, productImage: "", productUrl: "", icon: Monitor });
  if (player.mousepad) equipment.push({ id: `${player.ign}-mousepad`, equipmentType: "마우스패드", equipmentName: player.mousepad, productImage: "", productUrl: "", icon: RectangleHorizontal });
  if (player.chair) equipment.push({ id: `${player.ign}-chair`, equipmentType: "의자", equipmentName: player.chair, productImage: "", productUrl: "", icon: ArmchairIcon });
  if (player.desk) equipment.push({ id: `${player.ign}-desk`, equipmentType: "책상", equipmentName: player.desk, productImage: "", productUrl: "", icon: MonitorIcon });
  return equipment;
}

// 이전 장비 조립 함수
async function buildPreviousEquipment(player: RawPlayer): Promise<Equipment[]> {
  await loadEquipmentFromSupabase();
  
  const equipment: Equipment[] = [];
  if (player.previous_mouse) equipment.push({ id: `${player.ign}-prev-mouse`, equipmentType: "마우스", equipmentName: player.previous_mouse, productImage: "", productUrl: "", icon: Mouse });
  if (player.previous_keyboard) equipment.push({ id: `${player.ign}-prev-keyboard`, equipmentType: "키보드", equipmentName: player.previous_keyboard, productImage: "", productUrl: "", icon: Keyboard });
  if (player.previous_mousepad) equipment.push({ id: `${player.ign}-prev-mousepad`, equipmentType: "마우스패드", equipmentName: player.previous_mousepad, productImage: "", productUrl: "", icon: RectangleHorizontal });
  return equipment;
}

// ==================== Supabase 함수 ====================

export async function getPlayers(): Promise<RawPlayer[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('gamers_info')
    .select('*');

  if (error) {
    console.error("Supabase 에러:", error);
    throw error;
  }
  return data || [];
}

// 기본(미존재) 이미지.
const DEFAULT_PLAYER_IMAGE = `${ASSETS_PATH}players/lol/no-picture.webp`;

async function getPlayerImageFor(raw: RawPlayer): Promise<string> {
  // Build path dynamically from id + ign + game
  return buildPlayerImagePath(raw.id, raw.ign, raw.game);
}

async function mapRawToPlayer(raw: RawPlayer): Promise<Player> {
  // determine player image using helper
  const image = await getPlayerImageFor(raw);
  const clicks = raw.count_player_cumulative ?? 0;
  const recent = raw.count_player_recent ?? 0;
  const prevRank = raw.previous_admin_power_ranking ?? 0;
  const currRank = raw.admin_power_ranking ?? 0;
  const rankChangeAmt = prevRank > 0 ? prevRank - currRank : 0;
  const equipment = await buildEquipment(raw);
  const previousEquipment = await buildPreviousEquipment(raw);

  return {
    id: raw.ign.toLowerCase(),
    dbId: raw.id,
    team: raw.team,
    teamLogo: teamLogos[raw.team] || "",
    playerName: raw.ign,
    playerRealName: raw.name,
    birthDate: raw.birthdate || raw.birthday || raw.dob || undefined,
    nationality: `🇰🇷 ${raw.nationality}`,
    playerImage: image,
    equipment: equipment,
    previousEquipment: previousEquipment,
    game: raw.game,
    profession: raw.profession,
    position: raw.position,
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

async function dedupeAndRank(rawPlayers: RawPlayer[]): Promise<Player[]> {
  const playerMap = new Map<string, Player>();
  for (const raw of rawPlayers) {
    if (playerMap.has(raw.ign)) continue;
    const player = await mapRawToPlayer(raw);
    playerMap.set(raw.ign, player);
  }
  const players = Array.from(playerMap.values());
  
  // Sort: players with power ranking first (by ranking), then by click count
  players.sort((a, b) => {
    const aRank = a.powerRanking ?? Infinity;
    const bRank = b.powerRanking ?? Infinity;
    if (aRank !== bRank) return aRank - bRank;
    return b.clickCount - a.clickCount;
  });
  
  players.forEach((player, index) => {
    player.popularityRank = index + 1;
  });
  return players;
}

export async function getPlayersByGame(game: "lol" | "starcraft" | "valorant" | "battlegrounds"): Promise<Player[]> {
  const all = await getAllPlayers();
  const filtered = all.filter((p) => p.game === game);
  // Re-rank within this game only
  filtered.sort((a, b) => (a.powerRanking ?? 999) - (b.powerRanking ?? 999));
  filtered.forEach((p, i) => { p.popularityRank = i + 1; });
  return filtered;
}

export async function getPlayerById(id: string): Promise<Player | undefined> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('gamers_info')
    .select('*')
    .ilike('ign', id)
    .single();

  if (error || !data) return undefined;
  return mapRawToPlayer(data);
}

/** Find all players who use a specific equipment name */
export async function getPlayersByEquipmentName(equipmentName: string): Promise<Player[]> {
  const all = await getAllPlayers();
  return all.filter((p) =>
    p.equipment.some((e) => e.equipmentName === equipmentName) ||
    p.previousEquipment.some((e) => e.equipmentName === equipmentName)
  );
}

export async function getAllPlayers(): Promise<Player[]> {
  const rawPlayers = await getPlayers();
  return await dedupeAndRank(rawPlayers);
}

// ── Recently updated players (for header updates dropdown) ──────────────

export interface RecentlyUpdatedPlayer {
  ign: string;
  name: string;
  game: string;
  updated: string;
  team: string;
  playerImage: string;
}

export async function getRecentlyUpdatedPlayers(): Promise<RecentlyUpdatedPlayer[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('gamers_info')
    .select('id, ign, name, game, updated, team')
    .order('updated', { ascending: false })
    .limit(20);

  if (error) {
    console.error("Supabase 에러 (getRecentlyUpdatedPlayers):", error);
    return [];
  }
  return (data || []).map((row: any) => ({
    ign: row.ign ?? '',
    name: row.name ?? '',
    game: row.game ?? '',
    updated: row.updated ?? '',
    team: row.team ?? '',
    playerImage: buildPlayerImagePath(row.id, row.ign, row.game) || '',
  }));
}
export async function searchPlayers(query: string): Promise<Player[]> {
  if (!query.trim()) return [];
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('gamers_info')
    .select('*')
    .or(
      `ign.ilike.%${query}%,` +
      `name.ilike.%${query}%,` +
      `team.ilike.%${query}%,` +
      `collected_words.cs.{${query}}`
    )
    .limit(20);

  if (error) {
    console.error("Search error:", error);
    return [];
  }

  return Promise.all((data || []).map(async (raw: RawPlayer) => {
    const image = await getPlayerImageFor(raw);
    const equipment = await buildEquipment(raw);
    return {
      id: raw.ign.toLowerCase(),
      dbId: raw.id,
      team: raw.team,
      teamLogo: teamLogos[raw.team] || "",
      playerName: raw.ign,
      playerRealName: raw.name,
      nationality: `🇰🇷 ${raw.nationality}`,
      playerImage: image,
      equipment,
      previousEquipment: [],
      game: raw.game,
      profession: raw.profession,
      position: raw.position,
      popularityRank: raw.admin_power_ranking ?? 0,
      rankChange: (raw.previous_admin_power_ranking ?? 0) - (raw.admin_power_ranking ?? 0),
      clickCount: raw.count_player_cumulative ?? 0,
      powerRanking: raw.admin_power_ranking ?? undefined,
      powerScore: raw.total_weighted_points ?? 0,
      collectedWords: raw.collected_words || undefined,
    } as Player;
  }));
}