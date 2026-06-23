"use client";

import {
  Gamepad2,
  Flame,
  Zap,
  Target,
  Menu,
  ChevronsLeft,
  Shield,
} from "lucide-react";
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
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPwd, setAdminPwd] = useState("");
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminMsg, setAdminMsg] = useState("");

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
                  sessionStorage.removeItem("equip_visibleRows");
                  for (let i = 0; i < sessionStorage.length; i++) {
                    const key = sessionStorage.key(i);
                    if (key?.startsWith("homepage_visibleCount_")) {
                      sessionStorage.removeItem(key);
                      i--;
                    }
                  }
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

      {/* Footer with admin */}
      {isExpanded && (
        <div className="border-t border-zinc-200 dark:border-zinc-700 p-3">
          {showAdmin && !adminAuthed ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await fetch("/api/admin", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ password: adminPwd }),
                });
                if (res.ok) {
                  localStorage.setItem("temppal_admin", "true");
                  sessionStorage.setItem("temppal_admin_pwd", adminPwd);
                  setAdminAuthed(true);
                  setAdminMsg("관리자 모드 활성화");
                } else {
                  setAdminMsg("비밀번호 불일치");
                }
              }}
              className="flex items-center gap-1"
            >
              <input
                type="password"
                value={adminPwd}
                onChange={(e) => setAdminPwd(e.target.value)}
                placeholder="pwd"
                className="flex-1 px-2 py-1 text-[10px] border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="shrink-0 px-2 py-1 text-[10px] font-medium bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded"
              >
                확인
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAdmin(false);
                  setAdminPwd("");
                  setAdminMsg("");
                }}
                className="shrink-0 text-[10px] text-zinc-400 hover:text-zinc-600"
              >
                취소
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                © 2026 템빨
              </span>
              <button
                onClick={() => {
                  if (adminAuthed) {
                    localStorage.removeItem("temppal_admin");
                    sessionStorage.removeItem("temppal_admin_pwd");
                    setAdminAuthed(false);
                    setAdminMsg("");
                  } else {
                    setShowAdmin(true);
                  }
                }}
                className={`transition-colors ${adminAuthed ? "text-green-500" : "text-zinc-300 hover:text-zinc-500 dark:hover:text-zinc-400"}`}
                title={adminAuthed ? "관리자 로그아웃" : "관리자"}
              >
                <Shield className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {adminMsg && (
            <p
              className={`text-[10px] mt-1 ${adminAuthed ? "text-green-500" : "text-red-500"}`}
            >
              {adminMsg}
            </p>
          )}
        </div>
      )}

      {/* Collapsed: shield icon */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-center py-2 text-zinc-300 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors border-t border-zinc-200 dark:border-zinc-700"
          title="관리자"
        >
          <Shield
            className={`w-4 h-4 ${adminAuthed ? "text-green-500" : ""}`}
          />
        </button>
      )}
    </aside>
  );
}
