import { homePageMetadata } from "@/lib/homeSeo";
import { getServerAllPlayers } from "@/lib/serverPlayerData";
import HomeClient from "@/components/HomeClient";

export const revalidate = 60;

export const metadata = homePageMetadata;

export default async function Home() {
  const players = await getServerAllPlayers();
  return <HomeClient initialPlayers={players} />;
}
