import type { Metadata } from "next";
import GameHub from "@/components/GameHub";
import { buildGameHubMetadata } from "@/lib/gameHubSeo";
import { getServerPlayersByGame } from "@/lib/serverPlayerData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const players = await getServerPlayersByGame("battlegrounds");
  return buildGameHubMetadata("battlegrounds", players);
}

export default function BattlegroundsPage() {
  return <GameHub game="battlegrounds" />;
}
