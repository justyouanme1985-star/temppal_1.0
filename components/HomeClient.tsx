"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { type Player } from "@/lib/playerData";
import { playerKeys } from "@/lib/hooks/usePlayers";
import PlayerCard from "@/components/PlayerCard";

const games = [
  {
    name: "리그 오브 레전드",
    href: "/lol",
    icon: "/images/game_logo/lol-icon.svg",
    logo: "/images/game_logo/lol-logo.svg",
  },
  {
    name: "발로란트",
    href: "/valorant",
    icon: "/images/game_logo/valorant-icon.svg",
    logo: "/images/game_logo/valorant-logo.svg",
  },
  {
    name: "배틀그라운드",
    href: "/battlegrounds",
    icon: "/images/game_logo/battlegrounds-icon.svg",
    logo: "/images/game_logo/battlegrounds-logo.svg",
  },
  {
    name: "스타크래프트",
    href: "/starcraft",
    icon: "/images/game_logo/starcraft-icon.svg",
    logo: "/images/game_logo/starcraft-logo.svg",
  },
] as const;

// ── PlayerSection (Client Component: requires useState for "더보기") ─────

function PlayerSection({
  title,
  logo,
  href,
  players = [],
}: {
  title: string;
  logo: string;
  href: string;
  players: Player[];
}) {
  const storageKey = `homepage_visibleCount_${title}`;
  const [visibleCount, setVisibleCount] = useState(5);

  // On mount, restore expanded count from previous session
  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) setVisibleCount(parseInt(saved, 10));
  }, [storageKey]);

  // Persist visibleCount on user interaction only (skip initial mount to avoid
  // overwriting the saved value with the default 5 before the restore runs)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    sessionStorage.setItem(storageKey, String(visibleCount));
  }, [visibleCount, storageKey]);

  const visible = players.slice(0, visibleCount);

  return (
    <section className="mb-10">
      <Link href={href} className="flex justify-center items-center py-4 px-4">
        <img
          src={logo}
          alt={title}
          loading="lazy"
          className="h-12 sm:h-14 object-contain dark:invert hover:opacity-80 transition-opacity"
        />
      </Link>

      <div className="px-1 sm:px-2 md:px-3 lg:px-4">
        <div
          className="flex flex-row items-center px-2 py-1 mx-0.5 mb-1 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-md"
          style={{ minWidth: 320 }}
        >
          <div className="shrink-0 w-10 text-left pl-1 pb-1.5">
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
            <div className="flex items-center text-left shrink-0 pr-4">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                아이템
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-1">
          {visible.map((player) => (
            <PlayerCard key={player.playerName} player={player} />
          ))}
        </div>
      </div>

      {visibleCount < players.length && (
        <div className="flex justify-center mt-3">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="flex items-center gap-1 px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            더보기 <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}

// ── HomeClient ───────────────────────────────────────────────────────────

export default function HomeClient({
  initialPlayers,
}: {
  initialPlayers: Player[];
}) {
  const queryClient = useQueryClient();

  // Hydrate React Query cache so subsequent navigations are instant.
  // Server-rendered HTML already contains the data — no client fetch needed.
  useEffect(() => {
    queryClient.setQueryData(playerKeys.lists(), initialPlayers);
  }, [initialPlayers, queryClient]);

  // ── Scroll save / restore (uses the single layout scroll container) ──
  function getScrollContainer(): HTMLElement | null {
    return document.getElementById("main-scroll");
  }

  function restoreScroll() {
    const saved = sessionStorage.getItem("homepage_scrollY");
    if (!saved) return;
    const targetY = parseInt(saved, 10);
    const container = getScrollContainer();
    if (!container) return;
    history.scrollRestoration = "manual";
    let attempts = 0;
    function tryScroll() {
      attempts++;
      // Keep trying until content is tall enough (max 50 frames ≈ 800ms)
      if (container.scrollHeight <= targetY && attempts < 50) {
        requestAnimationFrame(tryScroll);
        return;
      }
      container.scrollTo(0, targetY);
    }
    requestAnimationFrame(tryScroll);
  }

  const [navCount, setNavCount] = useState(0);
  useEffect(() => {
    function saveScroll() {
      const container = getScrollContainer();
      if (container) {
        sessionStorage.setItem("homepage_scrollY", String(container.scrollTop));
      }
    }
    function onPopState() {
      history.scrollRestoration = "manual";
      setNavCount((c) => c + 1);
    }
    document.addEventListener("mousedown", saveScroll);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("mousedown", saveScroll);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    restoreScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navCount]);

  const lolPlayers = initialPlayers.filter((p) => p.game === "lol");
  const valPlayers = initialPlayers.filter((p) => p.game === "valorant");
  const bgPlayers = initialPlayers.filter((p) => p.game === "battlegrounds");
  const scPlayers = initialPlayers.filter((p) => p.game === "starcraft");

  return (
    <main className="pt-0 overflow-hidden pb-1.5">
      {/* Game Icons */}
      <section className="mb-10 px-4 pt-6">
        <div className="flex justify-center gap-6 sm:gap-10">
          {games.map((game) => (
            <Link
              key={game.href}
              href={game.href}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-colors bg-white dark:bg-black flex items-center justify-center p-2">
                <img
                  src={game.icon}
                  alt={game.name}
                  loading="lazy"
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform dark:invert"
                />
              </div>
              <span className="w-16 sm:w-20 text-center text-[10px] sm:text-[11px] font-medium text-zinc-600 dark:text-zinc-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                {game.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Player sections — rendered from server data, no loading state needed */}
      <PlayerSection
        title="리그 오브 레전드"
        logo="/images/game_logo/lol-logo.svg"
        href="/lol"
        players={lolPlayers}
      />
      <PlayerSection
        title="발로란트"
        logo="/images/game_logo/valorant-logo.svg"
        href="/valorant"
        players={valPlayers}
      />
      <PlayerSection
        title="배틀그라운드"
        logo="/images/game_logo/battlegrounds-logo.svg"
        href="/battlegrounds"
        players={bgPlayers}
      />
      <PlayerSection
        title="스타크래프트"
        logo="/images/game_logo/starcraft-logo.svg"
        href="/starcraft"
        players={scPlayers}
      />
    </main>
  );
}
