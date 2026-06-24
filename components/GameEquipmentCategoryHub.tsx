import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import EquipmentRankingClient from "@/components/EquipmentRankingClient";
import { getEquipmentTypeLabel, isValidEquipmentType } from "@/lib/equipmentLabels";
import { getGameHubConfig } from "@/lib/gameHubConfig";
import { buildGameCategoryJsonLd } from "@/lib/jsonLd/gameHub";
import type { Game } from "@/lib/playerMapping";
import { getServerGameCategoryEquipment } from "@/lib/serverCategoryRanking";

type Props = {
  game: Game;
  category: string;
};

export default async function GameEquipmentCategoryHub({ game, category }: Props) {
  if (!isValidEquipmentType(category)) {
    notFound();
  }

  const items = await getServerGameCategoryEquipment(game, category);
  if (items.length === 0) {
    notFound();
  }

  const config = getGameHubConfig(game);
  const label = getEquipmentTypeLabel(category);
  const jsonLd = buildGameCategoryJsonLd(game, category, items);

  return (
    <>
      <JsonLd data={jsonLd} />
      <EquipmentRankingClient
        initialEquipments={items}
        title={`${config.label} ${label} 랭킹`}
        focusCategory={category}
        hideCategoryNav
      />
    </>
  );
}
