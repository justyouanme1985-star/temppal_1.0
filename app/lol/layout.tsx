import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LoL 프로 선수 장비",
  description:
    "LCK 프로게이머가 사용하는 마우스, 키보드, 헤드셋, 모니터 등 장비 세팅과 인기 랭킹",
  alternates: { canonical: "/lol" },
};

export default function LoLLayout({ children }: { children: React.ReactNode }) {
  return children;
}
