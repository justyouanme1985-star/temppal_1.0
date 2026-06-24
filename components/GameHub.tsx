import type { Game } from "@/lib/playerMapping";
import JsonLd from "@/components/JsonLd";
import { buildGameHubPageJsonLd } from "@/lib/jsonLd/gameHub";
import { getServerPlayersByGame } from "@/lib/serverPlayerData";
import GameHubClient from "./GameHubClient";

export default async function GameHub({ game }: { game: Game }) {
  const players = await getServerPlayersByGame(game);
  const jsonLd = buildGameHubPageJsonLd(game, players);

  return (
    <main className="pt-0">
      <JsonLd data={jsonLd} />
      <div
        className="max-w-7xl mx-0.5 px-2 pt-2 pb-4"
        style={{ maxWidth: "1280px" }}
      >
        <GameHubClient game={game} initialPlayers={players} />
      </div>
    </main>
  );
}
