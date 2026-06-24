import { matchesQuery } from "@/lib/koreanSearch";
import type { Player } from "@/lib/playerMapping";

/** Client-side player search over an in-memory list (no network). */
export function filterPlayersByQuery(players: Player[], query: string): Player[] {
  const q = query.trim();
  if (!q) return [];
  return players.filter((p) =>
    matchesQuery(q, p.playerName, p.playerRealName, p.team, p.collectedWords),
  );
}
