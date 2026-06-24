import type { Metadata } from "next";
import GameHub from "@/components/GameHub";
import { buildGameHubMetadata } from "@/lib/gameHubSeo";
import { getServerPlayersByGame } from "@/lib/serverPlayerData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const players = await getServerPlayersByGame("valorant");
  return buildGameHubMetadata("valorant", players);
}

export default function ValorantPage() {
  return <GameHub game="valorant" />;
}
