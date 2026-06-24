import type { MetadataRoute } from "next";
import { getServerAllPlayers } from "@/lib/serverPlayerData";
import { absoluteUrl, getSiteUrl } from "@/lib/seo/site";

const GAME_PATHS = ["/lol", "/starcraft", "/valorant", "/battlegrounds"] as const;
const STATIC_PATHS = ["/", "/community", "/equipment", "/search", "/terms", "/privacy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    ...STATIC_PATHS.map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...GAME_PATHS.map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];

  try {
    const players = await getServerAllPlayers();
    const playerEntries: MetadataRoute.Sitemap = players.map((p) => ({
      url: absoluteUrl(`/player/${encodeURIComponent(p.id)}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    return [...staticEntries, ...playerEntries];
  } catch {
    return staticEntries;
  }
}

// Ensure sitemap URLs resolve even without env at build time
void getSiteUrl();
