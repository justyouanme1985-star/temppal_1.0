import type { Metadata } from "next";
import GameHub from "@/components/GameHub";
import { buildGameHubMetadata } from "@/lib/gameHubSeo";
import { getServerPlayersByGame } from "@/lib/serverPlayerData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const players = await getServerPlayersByGame("lol");
  return buildGameHubMetadata("lol", players);
}

export default function LoLPage() {
  return <GameHub game="lol" />;
}
