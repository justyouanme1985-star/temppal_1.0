"use client";

import { Gamepad2, Flame, Zap, Target, Menu, ChevronsLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const games = [
  {
    name: "롤",
    href: "/lol",
    icon: Flame,
    color: "text-blue-400",
    image: "/images/game_logo/lol-icon.svg",
  },
  {
    name: "발로란트",
    href: "/valorant",
    icon: Target,
    color: "text-red-400",
    image: "/images/game_logo/valorant-icon.svg",
  },
  {
    name: "배틀그라운드",
    href: "/battlegrounds",
    icon: Gamepad2,
    color: "text-purple-400",
    image: "/images/game_logo/battlegrounds-icon.svg",
  },
  {
    name: "스타크래프트",
    href: "/starcraft",
    icon: Zap,
    color: "text-yellow-400",
    image: "/images/game_logo/starcraft-icon.svg",
  },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 h-[calc(100vh-6.5rem)] bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-700 transition-all duration-300 ${
        isExpanded ? "w-52" : "w-14"
      }`}
    >
      {/* Toggle button */}
      <div className="flex items-center justify-between h-10 border-b border-zinc-200 dark:border-zinc-700 px-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Game list */}
      <div className="flex-1 overflow-y-auto py-2">
        {isExpanded && (
          <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 mb-2 uppercase tracking-widest px-4"></p>
        )}

        <div className="flex flex-col gap-0.5 px-2">
          {games.map((game) => {
            const IconComponent = game.icon;
            return (
              <Link
                key={game.href}
                href={game.href}
                className={`flex items-center gap-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors dark:text-zinc-300 group ${isExpanded ? "px-3 py-2" : "justify-center p-2"}`}
                title={game.name}
              >
                {game.image ? (
                  <img
                    src={game.image} // ← Now using Vercel Blob URL
                    alt={game.name}
                    loading="lazy"
                    className="w-7 h-7 object-contain group-hover:scale-110 transition-transform shrink-0 dark:invert"
                  />
                ) : (
                  <IconComponent
                    className={`w-7 h-7 ${game.color} group-hover:scale-110 transition-transform shrink-0`}
                  />
                )}
                {isExpanded && (
                  <span className="font-medium text-sm">{game.name}</span>
                )}
              </Link>
            );
          })}
        </div>

        {isExpanded && (
          <>
            <div className="border-t border-zinc-200 dark:border-zinc-700 my-3 mx-2" />
            <div className="flex flex-col gap-0.5 px-2">
              <button
                onClick={() => {
                  sessionStorage.removeItem("homepage_scrollY");
                  window.location.href = "/";
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors dark:text-zinc-300 text-sm font-medium cursor-pointer"
              >
                홈
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem("equip_ranking_scrollY");
                  sessionStorage.removeItem("equip_visibleRows");
                  window.location.href = "/equipment";
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors dark:text-zinc-300 text-sm font-medium cursor-pointer"
              >
                인기 장비 랭킹
              </button>
              <a
                href="#"
                className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors dark:text-zinc-300 text-sm font-medium"
              >
                커뮤니티
              </a>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      {isExpanded && (
        <div className="border-t border-zinc-200 dark:border-zinc-700 p-3 text-xs text-zinc-400 dark:text-zinc-500">
          © 2026 템빨
        </div>
      )}
    </aside>
  );
}
