"use client";

import { X, Gamepad2, Flame, Zap, Target, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setIsVisible(true)),
      );
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  return (
    <div className="md:hidden">
      {/* Menu button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-black rounded-lg transition-colors shrink-0"
        aria-label="메뉴 열기"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Left slide menu */}
      {isMounted &&
        createPortal(
          <div className="fixed inset-0 top-14" style={{ zIndex: 99999 }}>
            {/* Backdrop */}
            <div
              className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu panel */}
            <div
              className={`absolute left-0 top-0 h-full w-60 bg-white dark:bg-black border-r border-zinc-200 dark:border-black border-t border-t-zinc-200 dark:border-t-black flex flex-col shadow-2xl transition-transform duration-300 ${isVisible ? "translate-x-0" : "-translate-x-full"}`}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-4 h-12 border-b border-zinc-200 dark:border-black bg-zinc-50 dark:bg-black">
                <Menu className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-black rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Game list */}
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex flex-col gap-1">
                  {games.map((game) => {
                    const IconComponent = game.icon;
                    return (
                      <Link
                        key={game.href}
                        href={game.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-black transition-colors dark:text-zinc-300 group"
                      >
                        {game.image ? (
                          <img
                            src={game.image} // ← Now using Blob URL
                            alt={game.name}
                            loading="lazy"
                            className="w-5 h-5 object-contain group-hover:scale-110 transition-transform dark:invert"
                          />
                        ) : (
                          <IconComponent
                            className={`w-5 h-5 ${game.color} group-hover:scale-110 transition-transform`}
                          />
                        )}
                        <span className="font-medium text-sm">{game.name}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-700 my-4" />

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      sessionStorage.removeItem("homepage_scrollY");
                      window.location.href = "/";
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors dark:text-zinc-300 text-sm font-medium cursor-pointer"
                  >
                    홈
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      sessionStorage.removeItem("equip_ranking_scrollY");
                      sessionStorage.removeItem("equip_visibleRows");
                      window.location.href = "/equipment";
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-neutral-900 transition-colors dark:text-zinc-300 text-sm font-medium cursor-pointer"
                  >
                    인기 장비 랭킹
                  </button>
                  <a
                    href="#"
                    className="px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors dark:text-zinc-300 text-sm font-medium"
                  >
                    커뮤니티
                  </a>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-zinc-200 dark:border-zinc-700 p-4 text-xs text-zinc-400 dark:text-zinc-500">
                © 2026 템빨
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
