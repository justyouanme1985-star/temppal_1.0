import { getEquipmentTypeLabel } from "./equipmentLabels";
import type { Game } from "./playerMapping";
import {
  getServerEquipmentRanking,
  type EquipmentRankItem,
} from "./serverEquipmentData";
import { getServerPlayersByGame } from "./serverPlayerData";

/** Global pro-gamer ranking for one equipment category (e.g. mouse). */
export async function getServerEquipmentByCategory(
  category: string,
): Promise<EquipmentRankItem[]> {
  const all = await getServerEquipmentRanking();
  return all.filter(
    (item) => item.category === category && item.currently_used > 0,
  );
}

/** Equipment ranking for one game + category, sorted by usage within that game. */
export async function getServerGameCategoryEquipment(
  game: Game,
  category: string,
): Promise<EquipmentRankItem[]> {
  const typeLabel = getEquipmentTypeLabel(category);
  const players = await getServerPlayersByGame(game);
  const counts = new Map<string, number>();

  for (const player of players) {
    for (const eq of player.equipment) {
      if (eq.equipmentType === typeLabel && eq.equipmentName) {
        counts.set(
          eq.equipmentName,
          (counts.get(eq.equipmentName) || 0) + 1,
        );
      }
    }
  }

  if (counts.size === 0) return [];

  const all = await getServerEquipmentRanking();
  const matched = all
    .filter((item) => item.category === category && counts.has(item.key))
    .sort((a, b) => (counts.get(b.key) || 0) - (counts.get(a.key) || 0));

  return matched.map((item, index) => ({
    ...item,
    popularity_rank: index + 1,
    currently_used: counts.get(item.key) || 0,
  }));
}
