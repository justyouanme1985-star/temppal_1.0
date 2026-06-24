import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "발로란트 프로 선수 장비",
  description: "VCT 프로게이머 장비 세팅과 인기 랭킹",
  alternates: { canonical: "/valorant" },
};

export default function ValorantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
