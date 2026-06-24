// lib/playerData.ts
// Browser-facing player data layer. List/search/equipment queries go through
// the cached `/api/players` routes (server-side) instead of querying the full
// gamers_info table from the browser. Mapping/ranking logic is shared via
// playerMapping.ts.
import { createBrowserClient } from '@supabase/ssr';
import {
  mapRawToPlayer,
  buildPlayerImagePath,
  type Player,
  type Equipment,
  type RawPlayer,
} from './playerMapping';

export type { Player, Equipment, RawPlayer };
export { teamLogos, buildPlayerImagePath } from './playerMapping';

function createSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

// ==================== List / search (via cached API) ====================

export async function getAllPlayers(): Promise<Player[]> {
  const res = await fetch('/api/players');
  if (!res.ok) throw new Error('Failed to fetch players');
  return (await res.json()) as Player[];
}

export async function getPlayersByGame(
  game: 'lol' | 'starcraft' | 'valorant' | 'battlegrounds',
): Promise<Player[]> {
  const all = await getAllPlayers();
  const filtered = all.filter((p) => p.game === game);
  filtered.forEach((p, i) => {
    p.popularityRank = i + 1;
  });
  return filtered;
}

export async function searchPlayers(query: string): Promise<Player[]> {
  const all = await getAllPlayers();
  const { filterPlayersByQuery } = await import('@/lib/playerSearch');
  return filterPlayersByQuery(all, query);
}

export async function getPlayersByEquipmentName(equipmentName: string): Promise<Player[]> {
  if (!equipmentName.trim()) return [];
  const res = await fetch(`/api/players/by-equipment?name=${encodeURIComponent(equipmentName)}`);
  if (!res.ok) return [];
  return (await res.json()) as Player[];
}

// ==================== Single-row queries (lightweight, direct) ====================

export async function getPlayerById(id: string): Promise<Player | undefined> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('gamers_info')
    .select('*')
    .ilike('ign', id)
    .single();

  if (error || !data) return undefined;
  return mapRawToPlayer(data as RawPlayer);
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
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('gamers_info')
    .select('id, ign, name, game, updated, team')
    .gte('updated', sevenDaysAgo)
    .order('updated', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Supabase 에러 (getRecentlyUpdatedPlayers):', error);
    return [];
  }
  type RecentRow = { id: number; ign: string | null; name: string | null; game: string | null; updated: string | null; team: string | null };
  return ((data || []) as RecentRow[]).map((row) => ({
    ign: row.ign ?? '',
    name: row.name ?? '',
    game: row.game ?? '',
    updated: row.updated ?? '',
    team: row.team ?? '',
    playerImage: buildPlayerImagePath(row.id, row.ign ?? '', row.game ?? '') || '',
  }));
}
