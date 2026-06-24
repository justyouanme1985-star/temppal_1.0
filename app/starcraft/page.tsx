import type { Metadata } from "next";
import GameHub from "@/components/GameHub";
import { buildGameHubMetadata } from "@/lib/gameHubSeo";
import { getServerPlayersByGame } from "@/lib/serverPlayerData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const players = await getServerPlayersByGame("starcraft");
  return buildGameHubMetadata("starcraft", players);
}

export default function StarCraftPage() {
  return <GameHub game="starcraft" />;
}
