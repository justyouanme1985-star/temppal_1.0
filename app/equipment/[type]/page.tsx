import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import EquipmentRankingClient from "@/components/EquipmentRankingClient";
import { buildEquipmentCategoryMetadata } from "@/lib/categoryLandingSeo";
import {
  getEquipmentTypeLabel,
  isValidEquipmentType,
} from "@/lib/equipmentLabels";
import { buildEquipmentCategoryJsonLd } from "@/lib/jsonLd/equipment";
import { getServerEquipmentByCategory } from "@/lib/serverCategoryRanking";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ type: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { type } = await params;
  if (!isValidEquipmentType(type)) {
    return { title: "카테고리를 찾을 수 없습니다 | 템빨" };
  }

  const items = await getServerEquipmentByCategory(type);
  if (items.length === 0) {
    return { title: "카테고리를 찾을 수 없습니다 | 템빨" };
  }

  return buildEquipmentCategoryMetadata(type, items.length);
}

export default async function EquipmentCategoryPage({ params }: PageProps) {
  const { type } = await params;
  if (!isValidEquipmentType(type)) {
    notFound();
  }

  const items = await getServerEquipmentByCategory(type);
  if (items.length === 0) {
    notFound();
  }

  const label = getEquipmentTypeLabel(type);
  const jsonLd = buildEquipmentCategoryJsonLd(type, items.length);

  return (
    <>
      <JsonLd data={jsonLd} />
      <EquipmentRankingClient
        initialEquipments={items}
        title={`프로게이머 ${label} 랭킹`}
        focusCategory={type}
        hideCategoryNav
      />
    </>
  );
}
