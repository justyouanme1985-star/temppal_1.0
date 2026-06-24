import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "스타크래프트 프로 선수 장비",
  description: "스타크래프트 프로게이머 장비 세팅과 인기 랭킹",
  alternates: { canonical: "/starcraft" },
};

export default function StarcraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
