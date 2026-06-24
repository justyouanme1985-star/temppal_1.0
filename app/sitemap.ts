import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { getServerAllPlayers } from "@/lib/serverPlayerData";
import { getServerEquipmentSitemapEntries } from "@/lib/serverSitemapData";

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

  const [players, equipment] = await Promise.all([
    getServerAllPlayers(),
    getServerEquipmentSitemapEntries(),
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

  return [...staticRoutes, ...playerRoutes, ...equipmentRoutes];
}
