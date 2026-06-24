import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import EquipmentRankingClient from "@/components/EquipmentRankingClient";
import { buildEquipmentRankingMetadata } from "@/lib/equipmentRankingSeo";
import { buildEquipmentRankingJsonLd } from "@/lib/jsonLd/gameHub";
import { shouldIndexPlayer } from "@/lib/indexing";
import { getServerEquipmentRanking } from "@/lib/serverEquipmentData";
import { getServerAllPlayers } from "@/lib/serverPlayerData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [equipments, players] = await Promise.all([
    getServerEquipmentRanking(),
    getServerAllPlayers(),
  ]);
  const indexedPlayerCount = players.filter(shouldIndexPlayer).length;
  const equipmentCount = equipments.filter((item) => item.currently_used > 0).length;
  return buildEquipmentRankingMetadata(equipmentCount, indexedPlayerCount);
}

export default async function EquipmentRankingPage() {
  const equipments = await getServerEquipmentRanking();
  const indexedCount = equipments.filter((item) => item.currently_used > 0).length;
  const jsonLd = buildEquipmentRankingJsonLd(indexedCount);

  return (
    <>
      <JsonLd data={jsonLd} />
      <EquipmentRankingClient initialEquipments={equipments} />
    </>
  );
}
