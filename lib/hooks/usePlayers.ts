'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllPlayers, type Player } from '@/lib/playerData';
import { searchPlayers } from '@/lib/playerData';

export function useSearchPlayers(query: string) {
  return useQuery({
    queryKey: ['players', 'search', query],
    queryFn: () => searchPlayers(query),
    enabled: query.trim().length > 0,
    staleTime: 0,
  });
}
// ── Query keys (centralised for cache invalidation) ─────────────────────
export const playerKeys = {
  all: ['players'] as const,
  lists: () => [...playerKeys.all, 'list'] as const,
  list: (filters: string) => [...playerKeys.lists(), filters] as const,
};

// ── Fetch all players ───────────────────────────────────────────────────
export function useAllPlayers() {
  return useQuery({
    queryKey: playerKeys.lists(),
    queryFn: getAllPlayers,
    staleTime: 0,
    gcTime: 30 * 1000,
  });
}

// ── Fetch players filtered by game ──────────────────────────────────────
const GAMES = ['lol', 'starcraft', 'valorant', 'battlegrounds'] as const;
export type Game = (typeof GAMES)[number];

export function usePlayersByGame(game: Player['game']) {
  const query = useAllPlayers();
  const data = query.data?.filter((p) => p.game === game) ?? [];
  return { ...query, data };
}

// ── Fetch a single player by ID ─────────────────────────────────────────
export function usePlayerById(id: string) {
  const query = useAllPlayers();
  const player = query.data?.find((p) => p.id === id.toLowerCase()) ?? null;
  return { ...query, data: player, isLoading: query.isLoading };
}
