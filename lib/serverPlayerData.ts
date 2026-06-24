import { createClient } from '@supabase/supabase-js';
import {
  dedupeAndRank,
  mapRawToPlayer,
  rankPlayers,
  type Player,
  type RawPlayer,
} from './playerMapping';

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

export async function getServerAllPlayers(): Promise<Player[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from('gamers_info').select('*');

  if (error) {
    console.error('Server: failed to fetch gamers_info', error);
    throw error;
  }

  return dedupeAndRank((data ?? []) as RawPlayer[]);
}

/** Find all players who use a specific equipment name (exact, case-insensitive). */
export async function getServerPlayersByEquipmentName(equipmentName: string): Promise<Player[]> {
  if (!equipmentName.trim()) return [];
  const supabase = createServerSupabase();

  // 1. Resolve the canonical key from equipment_info.
  const { data: equip } = await supabase
    .from('equipment_info')
    .select('key')
    .ilike('key', equipmentName)
    .maybeSingle();

  if (!equip) return [];
  const exactKey = equip.key;

  // 2. Match against current equipment columns only.
  const { data: rawPlayers } = await supabase
    .from('gamers_info')
    .select('*')
    .or(
      `mouse.ilike.${exactKey},keyboard.ilike.${exactKey},headset.ilike.${exactKey},monitor.ilike.${exactKey},mousepad.ilike.${exactKey},chair.ilike.${exactKey},desk.ilike.${exactKey}`,
    );

  if (!rawPlayers || rawPlayers.length === 0) return [];

  // 3. Dedupe by ign and map to Player.
  const seen = new Set<string>();
  const result: Player[] = [];
  for (const raw of rawPlayers as RawPlayer[]) {
    if (seen.has(raw.ign)) continue;
    seen.add(raw.ign);
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

export { rankPlayers };
