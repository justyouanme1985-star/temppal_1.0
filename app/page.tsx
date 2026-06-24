import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import HomeClient from "@/components/HomeClient";
import { buildHomePageMetadata } from "@/lib/homeSeo";
import { buildWebSiteJsonLd } from "@/lib/jsonLd/site";
import { shouldIndexPlayer } from "@/lib/indexing";
import { getServerAllPlayers } from "@/lib/serverPlayerData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const players = await getServerAllPlayers();
  const indexedCount = players.filter(shouldIndexPlayer).length;
  return buildHomePageMetadata(indexedCount);
}

export default async function Home() {
  const players = await getServerAllPlayers();

  return (
    <>
      <JsonLd data={buildWebSiteJsonLd()} />
      <HomeClient initialPlayers={players} />
    </>
  );
}
