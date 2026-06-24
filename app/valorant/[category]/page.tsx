import type { Metadata } from "next";
import GameEquipmentCategoryHub from "@/components/GameEquipmentCategoryHub";
import { buildGameCategoryMetadata } from "@/lib/categoryLandingSeo";
import { isValidEquipmentType } from "@/lib/equipmentLabels";
import { getServerGameCategoryEquipment } from "@/lib/serverCategoryRanking";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isValidEquipmentType(category)) {
    return { title: "카테고리를 찾을 수 없습니다 | 템빨" };
  }

  const items = await getServerGameCategoryEquipment("valorant", category);
  if (items.length === 0) {
    return { title: "카테고리를 찾을 수 없습니다 | 템빨" };
  }

  return buildGameCategoryMetadata("valorant", category, items.length);
}

export default async function ValorantCategoryPage({ params }: PageProps) {
  const { category } = await params;
  return <GameEquipmentCategoryHub game="valorant" category={category} />;
}
