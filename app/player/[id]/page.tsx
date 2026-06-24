import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlayerPageClient from "@/components/PlayerPageClient";
import { buildPlayerPageMetadata } from "@/lib/playerSeo";
import { getServerPlayerById } from "@/lib/serverPlayerData";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const player = await getServerPlayerById(id);
  if (!player) {
    return { title: "선수를 찾을 수 없습니다 | 템빨" };
  }
  return buildPlayerPageMetadata(player);
}

export default async function PlayerPage({ params }: PageProps) {
  const { id } = await params;
  const player = await getServerPlayerById(id);

  if (!player) {
    notFound();
  }

  return <PlayerPageClient player={player} />;
}
