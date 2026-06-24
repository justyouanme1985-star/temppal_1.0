import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EquipmentPageClient from "@/components/EquipmentPageClient";
import { buildEquipmentPageMetadata } from "@/lib/equipmentSeo";
import { isValidEquipmentType } from "@/lib/equipmentLabels";
import { getServerEquipmentPageData } from "@/lib/serverEquipmentData";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ type: string; name: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { type, name } = await params;
  if (!isValidEquipmentType(type)) {
    return { title: "장비를 찾을 수 없습니다 | 템빨" };
  }

  const data = await getServerEquipmentPageData(type, name);
  if (!data) {
    return { title: "장비를 찾을 수 없습니다 | 템빨" };
  }

  return buildEquipmentPageMetadata(data);
}

export default async function EquipmentPage({ params }: PageProps) {
  const { type, name } = await params;

  if (!isValidEquipmentType(type)) {
    notFound();
  }

  const data = await getServerEquipmentPageData(type, name);
  if (!data) {
    notFound();
  }

  return <EquipmentPageClient data={data} />;
}
