import { getServerAllPlayers } from "@/lib/serverPlayerData";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const players = await getServerAllPlayers();
  return <HomeClient initialPlayers={players} />;
}
