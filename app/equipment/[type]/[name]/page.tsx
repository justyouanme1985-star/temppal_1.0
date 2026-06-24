import type { Metadata } from "next";
import { absoluteUrl, pageTitle } from "@/lib/seo/site";
import EquipmentPageClient from "./EquipmentPageClient";

const typeLabelMap: Record<string, string> = {
  mouse: "마우스",
  keyboard: "키보드",
  headset: "헤드셋",
  monitor: "모니터",
  mousepad: "마우스패드",
  chair: "의자",
  desk: "책상",
};

type Props = {
  params: Promise<{ type: string; name: string }>;
  searchParams?: Promise<{ playerId?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, name } = await params;
  const equipmentName = decodeURIComponent(name);
  const typeLabel = typeLabelMap[type] || type;
  const title = `${equipmentName} (${typeLabel})`;
  const description = `${equipmentName} ${typeLabel} 스펙과 이 장비를 사용하는 프로게이머 목록`;

  return {
    title: pageTitle(title),
    description,
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/equipment/${type}/${encodeURIComponent(equipmentName)}`),
    },
    alternates: {
      canonical: `/equipment/${type}/${encodeURIComponent(equipmentName)}`,
    },
  };
}

export default function EquipmentPage(props: Props) {
  return <EquipmentPageClient {...props} />;
}
