import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import {
  equipmentValueMatchesKey,
  playerUsesEquipment,
  resolveCanonicalEquipmentKey,
} from './equipment/matchEquipment';
import {
  dedupeAndRank,
  mapRawToPlayer,
  rankPlayers,
  type Player,
  type RawPlayer,
} from './playerMapping';

export const PLAYERS_CACHE_TAG = 'players-list';

function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
}

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

export async function getServerPlayerByIgn(ign: string): Promise<Player | null> {
  if (!ign.trim()) return null;
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('gamers_info')
    .select('*')
    .ilike('ign', ign.trim())
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return mapRawToPlayer(data as RawPlayer);
}

/** Find players whose gamers_info equipment exactly matches the canonical key. */
export async function getServerPlayersByEquipmentName(equipmentName: string): Promise<Player[]> {
  if (!equipmentName.trim()) return [];

  const supabase = createServerSupabase();
  const { data: equipmentRows, error: equipError } = await supabase
    .from('equipment_info')
    .select('key');

  if (equipError) {
    console.error('Server: failed to fetch equipment_info', equipError);
    throw equipError;
  }

  const keys = (equipmentRows ?? []).map((row) => row.key).filter(Boolean);
  const canonicalKey = resolveCanonicalEquipmentKey(equipmentName, keys);
  if (!canonicalKey) return [];

  const allPlayers = await getServerAllPlayers();
  const result = allPlayers.filter((player) =>
    player.equipment.some((eq) => equipmentValueMatchesKey(eq.equipmentName, canonicalKey)),
  );

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
