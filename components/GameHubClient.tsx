"use client";

import { useState } from "react";
import type { Player } from "@/lib/playerMapping";
import type { Game } from "@/lib/playerMapping";
import { getGameHubConfig } from "@/lib/gameHubConfig";
import PlayerCard from "./PlayerCard";
import Image from "next/image";
import Link from "next/link";
import {
  Grid3X3,
  List,
  Mouse,
  Keyboard,
  Headphones,
  Monitor,
  RectangleHorizontal,
  ArmchairIcon,
  MonitorIcon,
} from "lucide-react";

const GAME_FOLDER: Record<string, string> = {
  lol: "lol",
  starcraft: "starcraft",
  valorant: "valorant",
  battlegrounds: "pubg",
};

const gameAbbr: Record<string, string> = {
  lol: "LCK",
  starcraft: "스타",
  valorant: "VCT",
  battlegrounds: "배그",
};

const equipIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  마우스: Mouse,
  키보드: Keyboard,
  헤드셋: Headphones,
  모니터: Monitor,
  마우스패드: RectangleHorizontal,
  의자: ArmchairIcon,
  책상: MonitorIcon,
};

export default function GameHubClient({
  game,
  initialPlayers,
}: {
  game: Game;
  initialPlayers: Player[];
}) {
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const config = getGameHubConfig(game);

  return (
    <div className="w-full bg-white dark:bg-black text-zinc-900 dark:text-white">
      <h1 className="sr-only">{config.label} 프로게이머 장비 랭킹</h1>

      <div className="flex justify-center items-center py-2 px-4">
        {config.logo ? (
          <Image
            src={config.logo}
            alt={config.label}
            width={224}
            height={224}
            className="h-28 sm:h-36 md:h-44 lg:h-56 object-contain dark:invert"
            priority
          />
        ) : (
          <p className="text-lg sm:text-xl md:text-2xl font-black tracking-tighter">
            {config.title}
          </p>
        )}
      </div>

      <div className="flex justify-center px-4 mb-4 -mt-2">
        <div className="inline-flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === "list"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <List className="w-4 h-4" />
            리스트
          </button>
          <button
            onClick={() => setViewMode("card")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === "card"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            카드
          </button>
        </div>
      </div>

      {initialPlayers.length === 0 ? (
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 pb-12">
          등록된 선수가 없습니다.
        </p>
      ) : viewMode === "list" ? (
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
            <div className="grid grid-cols-1 gap-1">
              {initialPlayers.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-12 px-1 sm:px-2 md:px-3 lg:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
            {initialPlayers.map((player) => (
              <PlayerCardItem key={player.id} player={player} game={game} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerCardItem({ player, game }: { player: Player; game: string }) {
  const folder = GAME_FOLDER[game] || "lol";
  const imgSrc =
    player.playerImage || `/images/players/${folder}/no-picture.webp`;

  return (
    <Link
      href={`/player/${player.id}`}
      className="flex flex-col bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden hover:border-blue-500 dark:hover:border-blue-400 transition-colors no-underline"
    >
      <div className="px-2.5 pt-2 pb-1 flex items-center gap-1.5">
        <span
          className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
            (player.powerRanking ?? 999) === 1
              ? "bg-[#008bf2]"
              : (player.powerRanking ?? 999) === 2
                ? "bg-[#00bba3]"
                : (player.powerRanking ?? 999) === 3
                  ? "bg-[#e8a803]"
                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
          }`}
        >
          #{player.powerRanking ?? player.popularityRank}
        </span>
        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 shrink-0">
          {gameAbbr[game] || game}
        </span>
        <span className="text-xs font-bold text-zinc-900 dark:text-white truncate min-w-0">
          {player.playerName}
        </span>
        {player.rankChange > 0 ? (
          <span className="text-[10px] font-medium text-green-500 shrink-0">
            ↑{player.rankChange}
          </span>
        ) : player.rankChange < 0 ? (
          <span className="text-[10px] font-medium text-red-500 shrink-0">
            ↓{Math.abs(player.rankChange)}
          </span>
        ) : null}
      </div>

      <div className="relative bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center aspect-square overflow-hidden shrink-0">
        <img
          src={imgSrc}
          alt={player.playerName}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/images/players/lol/no-picture.webp";
          }}
        />
      </div>

      <div className="p-2.5 flex flex-col flex-1 gap-1">
        <div className="flex items-center gap-1 min-w-0">
          {player.teamLogo && (
            <img
              src={player.teamLogo}
              alt={player.team}
              className="w-3.5 h-3.5 object-contain shrink-0"
            />
          )}
          <span className="text-[10px] text-blue-500 dark:text-blue-400 font-medium truncate">
            {player.team || ""}
          </span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
            {player.playerRealName || ""}
          </span>
        </div>
        <div className="flex gap-1.5 mt-auto pt-1.5">
          {player.equipment.slice(0, 5).map((eq) => {
            const Icon = equipIconMap[eq.equipmentType] || null;
            return Icon ? (
              <div
                key={eq.id}
                className="w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center"
                title={eq.equipmentName}
              >
                <Icon className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
              </div>
            ) : null;
          })}
        </div>
      </div>
    </Link>
  );
}
