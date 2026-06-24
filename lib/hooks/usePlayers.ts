'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllPlayers, type Player } from '@/lib/playerData';
import { filterPlayersByQuery } from '@/lib/playerSearch';

export const playerKeys = {
  all: ['players'] as const,
  lists: () => [...playerKeys.all, 'list'] as const,
  list: (filters: string) => [...playerKeys.lists(), filters] as const,
};

// Match API Cache-Control s-maxage=60
const PLAYERS_STALE_MS = 60 * 1000;

export function useAllPlayers() {
  return useQuery({
    queryKey: playerKeys.lists(),
    queryFn: getAllPlayers,
    staleTime: PLAYERS_STALE_MS,
  });
}

const GAMES = ['lol', 'starcraft', 'valorant', 'battlegrounds'] as const;
export type Game = (typeof GAMES)[number];

export function usePlayersByGame(game: Player['game']) {
  const query = useAllPlayers();
  const data = useMemo(
    () => query.data?.filter((p) => p.game === game) ?? [],
    [query.data, game],
  );
  return { ...query, data };
}

export function usePlayerById(id: string) {
  const query = useAllPlayers();
  const player = useMemo(
    () => query.data?.find((p) => p.id === id.toLowerCase()) ?? null,
    [query.data, id],
  );
  return { ...query, data: player, isLoading: query.isLoading };
}

/** Filters the shared cached list — no extra network per keystroke. */
export function useSearchPlayers(query: string) {
  const allQuery = useAllPlayers();
  const q = query.trim();
  const data = useMemo(() => {
    if (!q || !allQuery.data) return [];
    return filterPlayersByQuery(allQuery.data, q);
  }, [q, allQuery.data]);

  return {
    ...allQuery,
    data,
    isLoading: allQuery.isLoading && q.length > 0,
    isError: allQuery.isError,
  };
}
