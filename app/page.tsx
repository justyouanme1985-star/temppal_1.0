import type { Metadata } from "next";
import { getServerAllPlayers } from "@/lib/serverPlayerData";
import HomeClient from "@/components/HomeClient";
import { pageTitle } from "@/lib/seo/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: pageTitle("홈"),
  description:
    "LoL, 스타크래프트, 발로란트, 배그 프로게이머 장비 세팅과 인기 랭킹을 한눈에 확인하세요.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const players = await getServerAllPlayers();
  return <HomeClient initialPlayers={players} />;
}
