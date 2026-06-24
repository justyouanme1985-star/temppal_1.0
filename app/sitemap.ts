import type { MetadataRoute } from "next";
import { EQUIPMENT_CATEGORY_KEYS } from "@/lib/equipmentLabels";
import type { Game } from "@/lib/playerMapping";
import { getSiteUrl } from "@/lib/site";
import {
  getServerEquipmentByCategory,
  getServerGameCategoryEquipment,
} from "@/lib/serverCategoryRanking";
import { getServerAllPlayers } from "@/lib/serverPlayerData";
import { getServerEquipmentSitemapEntries } from "@/lib/serverSitemapData";

const GAMES: Game[] = ["lol", "starcraft", "valorant", "battlegrounds"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/lol`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/starcraft`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/valorant`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/battlegrounds`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/equipment`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/community`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const [players, equipment, ...categoryResults] = await Promise.all([
    getServerAllPlayers(),
    getServerEquipmentSitemapEntries(),
    ...EQUIPMENT_CATEGORY_KEYS.map((category) =>
      getServerEquipmentByCategory(category).then((items) => ({
        type: "equipment" as const,
        category,
        count: items.length,
      })),
    ),
    ...GAMES.flatMap((game) =>
      EQUIPMENT_CATEGORY_KEYS.map((category) =>
        getServerGameCategoryEquipment(game, category).then((items) => ({
          type: "game" as const,
          game,
          category,
          count: items.length,
        })),
      ),
    ),
  ]);

  const playerRoutes: MetadataRoute.Sitemap = players
    .filter((p) => p.equipment.length > 0)
    .map((p) => ({
      url: `${base}/player/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const equipmentRoutes: MetadataRoute.Sitemap = equipment.map((item) => ({
    url: `${base}/equipment/${item.category}/${encodeURIComponent(item.key)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categoryResults
    .filter((result) => result.count > 0)
    .map((result) => {
      if (result.type === "equipment") {
        return {
          url: `${base}/equipment/${result.category}`,
          lastModified: now,
          changeFrequency: "daily" as const,
          priority: 0.85,
        };
      }

      return {
        url: `${base}/${result.game}/${result.category}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.85,
      };
    });

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...playerRoutes,
    ...equipmentRoutes,
  ];
}
