import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerPlayerByIgn } from "@/lib/serverPlayerData";
import { absoluteUrl, pageTitle } from "@/lib/seo/site";
import PlayerPageClient from "./PlayerPageClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const player = await getServerPlayerByIgn(decodeURIComponent(id));

  if (!player) {
    return { title: "선수를 찾을 수 없음" };
  }

  const title = `${player.playerName}${player.team ? ` (${player.team})` : ""} 장비`;
  const description = `${player.playerRealName || player.playerName} 프로게이머가 사용하는 장비 세팅 — ${player.equipment.map((e) => e.equipmentName).slice(0, 3).join(", ") || "장비 정보"}`;

  return {
    title: pageTitle(title),
    description,
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/player/${encodeURIComponent(player.id)}`),
    },
    alternates: {
      canonical: `/player/${encodeURIComponent(player.id)}`,
    },
  };
}

export default async function PlayerPage({ params }: Props) {
  const { id } = await params;
  const decoded = decodeURIComponent(id);
  const player = await getServerPlayerByIgn(decoded);

  if (!player) {
    notFound();
  }

  return <PlayerPageClient id={decoded} />;
}
