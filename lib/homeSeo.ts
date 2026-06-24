import type { Metadata } from "next";

export const homePageMetadata: Metadata = {
  title: {
    absolute: "템빨 - 프로게이머 장비 랭킹 (LoL, 발로란트, 스타, 배그)",
  },
  description:
    "LoL LCK, VCT, 스타크래프트, 배틀그라운드 프로게이머가 실제 사용하는 마우스, 키보드, 모니터, 헤드셋 장비 랭킹과 스펙.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "템빨 - 프로들의 템",
    description: "프로게이머 게이밍 장비 랭킹",
    images: [{ url: "/images/banner.svg", alt: "템빨" }],
  },
};
