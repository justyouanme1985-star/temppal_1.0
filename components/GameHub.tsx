import type { Game } from "@/lib/playerMapping";
import { getServerPlayersByGame } from "@/lib/serverPlayerData";
import GameHubClient from "./GameHubClient";

export default async function GameHub({ game }: { game: Game }) {
  const players = await getServerPlayersByGame(game);

  return (
    <main className="pt-0">
      <div
        className="max-w-7xl mx-0.5 px-2 pt-2 pb-4"
        style={{ maxWidth: "1280px" }}
      >
        <GameHubClient game={game} initialPlayers={players} />
      </div>
    </main>
  );
}
