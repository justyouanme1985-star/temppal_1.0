import { scoreQuery } from "./koreanSearch";
import { filterPlayersByQuery } from "./playerSearch";
import type { Player } from "./playerMapping";
import { getServerAllPlayers } from "./serverPlayerData";

export type ScoredPlayer = {
  player: Player;
  score: number;
};

export async function getServerSearchResults(
  query: string,
): Promise<ScoredPlayer[]> {
  const q = query.trim();
  if (!q) return [];

  const all = await getServerAllPlayers();
  return filterPlayersByQuery(all, q)
    .map((player) => ({
      player,
      score: scoreQuery(
        q,
        player.playerName,
        player.playerRealName,
        player.team,
        player.collectedWords,
      ),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return (
        (a.player.powerRanking ?? 999) - (b.player.powerRanking ?? 999)
      );
    });
}
