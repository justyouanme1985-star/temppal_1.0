"use client";

import { useEffect, useState } from "react";
import { getPlayersByGame, Player } from "@/lib/playerData";
import PlayerCard from "./PlayerCard";
import Image from "next/image";

interface HeroProps {
  game?: "lol" | "starcraft" | "valorant" | "battlegrounds";
}

const gameConfig = {
  lol: {
    title: "LoL",
    logo: "/images/game_logo/lol-logo.svg",
  },
  starcraft: {
    title: "StarCraft",
    logo: "/images/game_logo/starcraft-logo.svg",
  },
  valorant: {
    title: "Valorant",
    logo: "/images/game_logo/valorant-logo.svg",
  },
  battlegrounds: {
    title: "Battlegrounds",
    logo: "/images/game_logo/battlegrounds-logo.svg",
  },
};

const ASSETS_PATH = "/images/";

// 5 dummy players for instant placeholder rendering
function createDummyPlayers(): Player[] {
  const dummy: Player[] = [];
  for (let i = 0; i < 5; i++) {
    dummy.push({
      id: `dummy-${i}`,
      team: "",
      teamLogo: "",
      playerName: "",
      playerRealName: "",
      nationality: "",
      playerImage: "",
      equipment: [],
      previousEquipment: [],
      game: "lol",
      profession: "",
      position: "",
      popularityRank: i + 1,
      rankChange: 0,
      clickCount: 0,
    });
  }
  return dummy;
}

const dummyPlayers = createDummyPlayers();

export default function Hero({ game = "lol" }: HeroProps) {
  const [players, setPlayers] = useState<Player[]>(dummyPlayers);
  const config = gameConfig[game as keyof typeof gameConfig];

  useEffect(() => {
    let mounted = true;
    getPlayersByGame(game).then((data) => {
      if (mounted) setPlayers(data);
    });
    return () => {
      mounted = false;
    };
  }, [game]);

  return (
    <div className="w-full bg-white dark:bg-black text-zinc-900 dark:text-white">
      <div className="flex justify-center items-center py-2 px-4">
        {config.logo ? (
          <Image
            src={config.logo}
            alt={config.title}
            width={224}
            height={224}
            className="h-28 sm:h-36 md:h-44 lg:h-56 object-contain dark:invert"
            priority={false}
          />
        ) : (
          <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tighter">
            {config.title}
          </h1>
        )}
      </div>

      <div className="mb-12">
        <div className="mb-2 px-4">
          <div
            className="flex flex-row items-center px-2 py-1 mx-0.5 mb-1 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-md"
            style={{ minWidth: 320 }}
          >
            <div className="shrink-0 w-10 text-left pl-2 pb-1.5">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                랭킹
              </span>
            </div>
            <div className="shrink-0 w-8 text-left pb-1.5" />
            <div className="relative flex items-center flex-1 min-w-0">
              <div className="flex items-center flex-1">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  선수정보
                </span>
              </div>
              <div className="flex items-center text-left shrink-0 pl-2">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  아이템
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-1 sm:px-2 md:px-3 lg:px-4">
          <div className="grid grid-cols-1 gap-1 sm:gap-1 md:gap-1">
            {players.map((player, idx) => (
              <PlayerCard key={player.id || `dummy-${idx}`} player={player} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
