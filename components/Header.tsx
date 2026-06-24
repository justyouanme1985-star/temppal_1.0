"use client";

import {
  History,
  Settings,
  Sun,
  Moon,
  X,
  Mail,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getRecentlyUpdatedPlayers,
  type RecentlyUpdatedPlayer,
} from "@/lib/playerData";

// ── Helpers ─────────────────────────────────────────────────────────────

const GAME_LABELS: Record<string, string> = {
  lol: "LoL",
  valorant: "Valorant",
  battlegrounds: "PUBG",
  starcraft: "StarCraft",
};

const GAME_BADGE_COLORS: Record<string, string> = {
  lol: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  valorant: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  battlegrounds:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  starcraft:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

function timeAgo(dateStr: string, now?: number): string {
  if (!now) return "";
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return "";
  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  const months = Math.floor(days / 30);
  return `${months}개월 전`;
}

export default function Header() {
  const [showUpdates, setShowUpdates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [recentPlayers, setRecentPlayers] = useState<RecentlyUpdatedPlayer[]>(
    [],
  );
  const [loadingUpdates, setLoadingUpdates] = useState(false);
  const [now, setNow] = useState<number>(0); // set only on client to avoid hydration mismatch
  const updatesRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const updatesDropdownRef = useRef<HTMLDivElement>(null);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef(false);
  const pathname = usePathname();

  // Set current time on client only (avoids Date.now() hydration mismatch)
  useEffect(() => {
    setNow(Date.now());
  }, []);

  // Fetch recently updated players when dropdown opens
  useEffect(() => {
    if (showUpdates && !fetchedRef.current && !loadingUpdates) {
      fetchedRef.current = true;
      setLoadingUpdates(true);
      getRecentlyUpdatedPlayers().then((players) => {
        setRecentPlayers(players);
        setLoadingUpdates(false);
      });
    }
  }, [showUpdates, loadingUpdates]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const dark =
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  function toggleTheme() {
    document.documentElement.classList.add("no-transition");
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("no-transition");
    });
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        updatesRef.current &&
        !updatesRef.current.contains(e.target as Node) &&
        updatesDropdownRef.current &&
        !updatesDropdownRef.current.contains(e.target as Node)
      ) {
        setShowUpdates(false);
        fetchedRef.current = false;
      }
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target as Node) &&
        settingsDropdownRef.current &&
        !settingsDropdownRef.current.contains(e.target as Node)
      ) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black shadow-sm sticky top-0 h-14"
      style={{ zIndex: 9998 }}
    >
      <div className="max-w-full mx-auto px-2 h-full flex items-center justify-between">
        {/* Left: Logo + Temppal */}
        <Link
          href="/"
          onClick={(e) => {
            sessionStorage.removeItem("equip_visibleRows");
            // Clear all homepage expand states so it loads fresh
            for (let i = 0; i < sessionStorage.length; i++) {
              const key = sessionStorage.key(i);
              if (key?.startsWith("homepage_visibleCount_")) {
                sessionStorage.removeItem(key);
                i--; // adjust index after removal
              }
            }
            if (pathname === "/") {
              e.preventDefault();
              window.location.href = "/";
            }
          }}
          className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
        >
          <img
            src="/images/banner.svg"
            alt="템빨"
            className="h-8 dark:brightness-[0] dark:invert dark:opacity-100"
          />
        </Link>

        {/* Right: Update icon + Settings gear */}
        <div className="flex items-center gap-1">
          {/* Recent Updates */}
          <div className="relative" ref={updatesRef}>
            <button
              onClick={() => {
                setShowUpdates(!showUpdates);
                setShowSettings(false);
              }}
              className={`p-2 rounded-lg transition-colors ${showUpdates ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-neutral-900"}`}
              aria-label="최근 업데이트"
              title="최근 업데이트"
            >
              <History className="w-5 h-5" />
            </button>

            {showUpdates &&
              createPortal(
                <div
                  ref={updatesDropdownRef}
                  className="fixed right-12 top-14 w-80 bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden"
                  style={{ zIndex: 99999 }}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      최근 업데이트
                    </span>
                    <button
                      onClick={() => setShowUpdates(false)}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {loadingUpdates ? (
                      <div className="px-4 py-8 text-sm text-zinc-400 dark:text-zinc-500 text-center">
                        로딩 중...
                      </div>
                    ) : recentPlayers.length === 0 ? (
                      <div className="px-4 py-8 text-sm text-zinc-400 dark:text-zinc-500 text-center">
                        최근 업데이트가 없습니다.
                      </div>
                    ) : (
                      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {recentPlayers.map((p, i) => (
                          <li key={`${p.ign}-${i}`}>
                            <Link
                              href={`/player/${p.ign.toLowerCase()}`}
                              onClick={() => setShowUpdates(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                            >
                              <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                                <img
                                  src={
                                    p.playerImage ||
                                    "/images/players/lol/no-picture.webp"
                                  }
                                  alt={p.ign}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "/images/players/lol/no-picture.webp";
                                  }}
                                />
                              </div>
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                                  {p.ign}
                                </span>
                                <span
                                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${GAME_BADGE_COLORS[p.game] || "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}
                                >
                                  {GAME_LABELS[p.game] || p.game}
                                </span>
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 ml-auto shrink-0">
                                  {timeAgo(p.updated, now)}
                                </span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>,
                document.body,
              )}
          </div>
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setShowUpdates(false);
              }}
              className={`p-2 rounded-lg transition-colors ${showSettings ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-neutral-900"}`}
              aria-label="설정"
              title="설정"
            >
              <Settings className="w-5 h-5" />
            </button>

            {showSettings &&
              createPortal(
                <div
                  ref={settingsDropdownRef}
                  className="fixed right-2 top-14 w-56 bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden"
                  style={{ zIndex: 99999 }}
                >
                  <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      설정
                    </span>
                  </div>

                  {/* Dark/Light toggle */}
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isDark ? (
                        <Moon className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Sun className="w-4 h-4 text-amber-500" />
                      )}
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        {isDark ? "다크 모드" : "라이트 모드"}
                      </span>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative w-10 h-5 rounded-full transition-colors ${isDark ? "bg-blue-500" : "bg-zinc-300"}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isDark ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                  </div>

                  <div className="border-t border-zinc-200 dark:border-zinc-700">
                    <Link
                      href="/mail/compose/contact"
                      className="w-full text-left px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors flex items-center gap-2"
                      aria-label="문의"
                    >
                      <Mail className="w-4 h-4 text-zinc-500 dark:text-zinc-300" />
                      <span>문의</span>
                    </Link>
                    <Link
                      href="/mail/compose/report"
                      className="w-full text-left px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors flex items-center gap-2"
                      aria-label="신고/접수"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <span>신고/접수</span>
                    </Link>
                  </div>
                </div>,
                document.body,
              )}
          </div>
        </div>
      </div>
    </header>
  );
}
