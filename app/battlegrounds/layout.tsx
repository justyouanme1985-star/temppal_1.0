import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "배틀그라운드 프로 선수 장비",
  description: "배틀그라운드 프로게이머 장비 세팅과 인기 랭킹",
  alternates: { canonical: "/battlegrounds" },
};

export default function BattlegroundsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
