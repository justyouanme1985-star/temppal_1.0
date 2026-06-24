import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "장비 랭킹",
  description: "프로게이머들이 많이 사용하는 마우스, 키보드, 모니터 인기 장비 랭킹",
  alternates: { canonical: "/equipment" },
};

export default function EquipmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
