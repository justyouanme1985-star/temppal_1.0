import { equipmentRankingMetadata } from "@/lib/equipmentRankingSeo";
import { getServerEquipmentRanking } from "@/lib/serverEquipmentData";
import EquipmentRankingClient from "@/components/EquipmentRankingClient";

export const revalidate = 60;

export const metadata = equipmentRankingMetadata;

export default async function EquipmentRankingPage() {
  const equipments = await getServerEquipmentRanking();
  return <EquipmentRankingClient initialEquipments={equipments} />;
}
