import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import {
  dedupeAndRank,
  mapRawToPlayer,
  rankPlayers,
  type Player,
  type RawPlayer,
} from './playerMapping';

export const PLAYERS_CACHE_TAG = 'players-list';

// Cookie-free client for public read-only data. Allows the calling route to be
// cached/revalidated instead of being forced dynamic by cookies().
function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
}

// ── Public API ───────────────────────────────────────────────────────────

async function fetchAllPlayersFromDb(): Promise<Player[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from('gamers_info').select('*');

  if (error) {
    console.error('Server: failed to fetch gamers_info', error);
    throw error;
  }

  return dedupeAndRank((data ?? []) as RawPlayer[]);
}

/** Cached server-side player list — one DB read per revalidate window. */
export const getServerAllPlayers = unstable_cache(
  fetchAllPlayersFromDb,
  ['server-all-players'],
  { revalidate: 60, tags: [PLAYERS_CACHE_TAG] },
);

/** Lookup a single player by URL slug (ign, lowercased). Uses cached player list. */
export async function getServerPlayerById(id: string): Promise<Player | null> {
  const slug = id.toLowerCase().trim();
  if (!slug) return null;
  const players = await getServerAllPlayers();
  return players.find((p) => p.id === slug) ?? null;
}

/** Players for a single game, in power-ranking order from cached list. */
export async function getServerPlayersByGame(
  game: Player["game"],
): Promise<Player[]> {
  const players = await getServerAllPlayers();
  return players.filter((p) => p.game === game);
}

/**
 * Korean → English brand mapping for equipment normalisation.
 */
const KOREAN_BRAND_MAP: Record<string, string> = {
  로지텍: "Logitech",
  레이저: "Razer",
  커세어: "Corsair",
  조위: "Zowie",
  조위기어: "Zowie",
  카마: "Commatech",
  바이퍼: "Razer",
  엑스트리파이: "Xtrfy",
  자오핀: "Zaopin",
  커머텍: "Commatech",
  제닉스: "Xenics",
};

/** Colour / decorative suffix words to strip before matching. */
const COLOR_WORDS = [
  "black", "white", "magenta", "red", "blue", "green",
  "pink", "cyan", "yellow", "purple", "orange", "gray", "grey",
];

/**
 * Normalise an equipment name string for comparison:
 *   1. Map Korean brand names → English
 *   2. Lowercase
 *   3. Remove colour suffix words
 *   4. Collapse whitespace
 */
function normaliseEquipmentName(raw: string): string {
  let s = raw;
  for (const [ko, en] of Object.entries(KOREAN_BRAND_MAP)) {
    s = s.replace(new RegExp(ko, "gi"), en);
  }
  s = s.toLowerCase();
  for (const color of COLOR_WORDS) {
    s = s.replace(new RegExp("\\b" + color + "\\b", "gi"), "");
  }
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

/** Find all players who use a specific equipment name, using exact model matching. */
export async function getServerPlayersByEquipmentName(equipmentName: string): Promise<Player[]> {
  if (!equipmentName.trim()) return [];

  const supabase = createServerSupabase();

  // 1. Resolve the canonical key from equipment_info via exact normalised matching
  const { data: equipRows } = await supabase
    .from("equipment_info")
    .select("key");

  if (!equipRows || equipRows.length === 0) return [];

  const target = normaliseEquipmentName(equipmentName);
  const canonicalKey = (equipRows as { key: string }[]).find(
    (r) => normaliseEquipmentName(r.key) === target,
  )?.key;

  if (!canonicalKey) return [];

  // 2. Fetch all players and filter by exact normalised match
  const { data: rawPlayers } = await supabase
    .from("gamers_info")
    .select("*");

  if (!rawPlayers || rawPlayers.length === 0) return [];

  const eqCols = ["mouse", "keyboard", "headset", "monitor", "mousepad", "chair", "desk"];
  const resultSet = new Map<string, Player>();

  for (const raw of rawPlayers as RawPlayer[]) {
    const normIgn = (raw.ign || "").toLowerCase().trim();
    if (!normIgn || resultSet.has(normIgn)) continue;

    const found = eqCols.some((col) => {
      const val = raw[col as keyof RawPlayer] as string | undefined;
      if (!val) return false;
      return normaliseEquipmentName(val) === target;
    });

    if (found) {
      const player = mapRawToPlayer(raw);
      resultSet.set(normIgn, player);
    }
  }

  const result = Array.from(resultSet.values());
  const gameOrder: Record<string, number> = { lol: 0, starcraft: 1, valorant: 2, battlegrounds: 3 };
  result.sort((a, b) => {
    const aRank = a.powerRanking ?? 999;
    const bRank = b.powerRanking ?? 999;
    if (aRank !== bRank) return aRank - bRank;
    const aScore = a.powerScore ?? 0;
    const bScore = b.powerScore ?? 0;
    if (bScore !== aScore) return bScore - aScore;
    return (gameOrder[a.game] ?? 99) - (gameOrder[b.game] ?? 99);
  });

  return result;
}

/**
 * Fuzzy-match an equipment search string against a set of equipment_info keys.
 * Returns all canonical keys that match (exact, substring, or token >= 50%).
 */
export function fuzzyMatchKeys(rows: { key: string }[], search: string): string[] {
  const keys = rows.map(r => r.key);
  const lower = search.toLowerCase().trim();
  const norm = search.replace(/[-_\s]+/g, ' ').toLowerCase().trim();

  // 1) Case-insensitive exact match
  const exactMatch = keys.find(k => k.toLowerCase() === lower);
  if (exactMatch) return [exactMatch];

  // 2) Token matches (>= 50%) — no substring to prevent
  //    "Custom Keyboard" → "Custom Keyboard Frog F12" false positives.
  const searchTokens = norm.split(' ').filter(t => t.length > 1);
  if (searchTokens.length === 0) return [];

  const scored: { key: string; score: number }[] = [];
  for (const k of keys) {
    const kTokens = k.replace(/[-_\s]+/g, ' ').toLowerCase().trim().split(' ').filter(t => t.length > 1);
    let matchCount = 0;
    for (const t of searchTokens) {
      if (kTokens.includes(t)) matchCount++;
    }
    const score = matchCount / Math.max(kTokens.length, searchTokens.length);
    if (score >= 0.5) scored.push({ key: k, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.key);
}

/**
 * Match a player's equipment name against a canonical key.
 * Safe one-directional fuzzy matching:
 *   1) Exact case-insensitive
 *   2) Player data contains canonical key ("Superlight 2 Black" ⊃ "Superlight 2")
 *   3) Token >= 50%
 * Does NOT match if canonical key is longer than player data
 * ("Custom Keyboard" ⊅ "Custom Keyboard Frog F12").
 */
export function playerHasEquipment(eqName: string, canonicalKey: string): boolean {
  const a = eqName.replace(/[-_\s]+/g, ' ').toLowerCase().trim();
  const b = canonicalKey.replace(/[-_\s]+/g, ' ').toLowerCase().trim();

  // 1) Exact match
  if (a === b) return true;

  // 2) Token match >= 75% — no substring, prevents
  //    "Zowie G-SR SE" → "Zowie G-SR" false positives (66.7% < 75%).
  const aTokens = a.split(' ').filter(t => t.length > 1);
  const bTokens = b.split(' ').filter(t => t.length > 1);
  if (aTokens.length === 0 || bTokens.length === 0) return false;

  let matchCount = 0;
  for (const t of bTokens) {
    if (aTokens.includes(t)) matchCount++;
  }
  return matchCount / Math.max(aTokens.length, bTokens.length) >= 0.75;
}

export { rankPlayers };
