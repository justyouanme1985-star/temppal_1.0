import { createClient } from '@supabase/supabase-js';
import {
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

function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
}

export async function getServerAllPlayers(): Promise<Player[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from('gamers_info').select('*');

  if (error) {
    console.error('Server: failed to fetch gamers_info', error);
    throw error;
  }

  return dedupeAndRank((data ?? []) as RawPlayer[]);
}

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

/** Find players using equipment by catalog id (preferred) or resolved key text match. */
export async function getServerPlayersByEquipmentName(
  equipmentName: string,
  category?: string,
): Promise<Player[]> {
  if (!equipmentName.trim()) return [];
  const supabase = createServerSupabase();

  const { data: equipmentRows, error: equipError } = await supabase
    .from('equipment_info')
    .select('id, key, category');

  if (equipError) {
    console.error('Server: failed to fetch equipment_info', equipError);
    throw equipError;
  }

  const keys = (equipmentRows ?? []).map((row) => row.key).filter(Boolean);
  const canonicalKey = resolveCanonicalEquipmentKey(equipmentName, keys);
  if (!canonicalKey) return [];

  const equipRow = (equipmentRows ?? []).find((row) => row.key === canonicalKey);
  const equipmentId = equipRow?.id ?? null;
  const equipCategory = (equipRow?.category || category || '').toLowerCase() || undefined;

  const { data: rawPlayers, error: playersError } = await supabase
    .from('gamers_info')
    .select('*');

  if (playersError) {
    console.error('Server: failed to fetch gamers_info for equipment lookup', playersError);
    throw playersError;
  }

  const seen = new Set<string>();
  const result: Player[] = [];

  for (const raw of rawPlayers ?? []) {
    const typed = raw as RawPlayer;
    if (seen.has(typed.ign)) continue;
    if (!playerUsesEquipment(typed, canonicalKey, keys, equipmentId, equipCategory)) continue;

    seen.add(typed.ign);
    result.push(mapRawToPlayer(typed));
  }

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
