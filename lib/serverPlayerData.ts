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

/** Find all players who use a specific equipment name, using fuzzy matching. */
export async function getServerPlayersByEquipmentName(equipmentName: string): Promise<Player[]> {
  if (!equipmentName.trim()) return [];

  // 1. Find ALL matching canonical keys from equipment_info via fuzzy match.
  const supabase = createServerSupabase();
  const { data: equipRows } = await supabase
    .from('equipment_info')
    .select('key, category');

  if (!equipRows || equipRows.length === 0) return [];

  const matchedKeys = fuzzyMatchKeys(equipRows as { key: string }[], equipmentName);
  if (matchedKeys.length === 0) return [];

  // 2. Search players using ilike EXACT match against ALL matched keys.
  //    This prevents false positives — only exact matches count.
  const cols = ['mouse', 'keyboard', 'headset', 'monitor', 'mousepad', 'chair', 'desk'];
  const orParts = matchedKeys.flatMap(k =>
    cols.map(c => `${c}.ilike.${k}`)
  );
  // Limit to avoid overly large queries
  const safeParts = orParts.slice(0, 200);

  const { data: rawPlayers } = await supabase
    .from('gamers_info')
    .select('*')
    .or(safeParts.join(','));

  if (!rawPlayers || rawPlayers.length === 0) return [];

  // 3. Dedupe by ign and map to Player.
  const seen = new Set<string>();
  const result: Player[] = [];
  for (const raw of rawPlayers as RawPlayer[]) {
    const normIgn = (raw.ign || "").toLowerCase().trim();
    if (!normIgn || seen.has(normIgn)) continue;
    seen.add(normIgn);
    result.push(mapRawToPlayer(raw));
  }

  // 4. Sort: power ranking → power score → game order.
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
function fuzzyMatchKeys(rows: { key: string }[], search: string): string[] {
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

export { rankPlayers };
