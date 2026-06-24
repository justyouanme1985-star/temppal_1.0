"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ExternalLink, ShoppingCart } from "lucide-react";
import { coupangLink, openCoupangLink } from "@/lib/coupang";
import { equipmentImages } from "@/lib/equipmentData";
import type { EquipmentRankItem } from "@/lib/serverEquipmentData";

const typeLabelMap: Record<string, string> = {
  mouse: "마우스",
  keyboard: "키보드",
  headset: "헤드셋",
  monitor: "모니터",
  mousepad: "마우스패드",
  chair: "의자",
  desk: "책상",
};

const categoryOrder = [
  "mouse",
  "keyboard",
  "headset",
  "mousepad",
  "monitor",
  "chair",
  "desk",
];

const categoryIcons: Record<string, string> = {
  mouse: "🖱️",
  keyboard: "⌨️",
  headset: "🎧",
  mousepad: "⬜",
  monitor: "🖥️",
  chair: "🪑",
  desk: "desk-svg",
};

function DeskIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Table top */}
      <rect x="2" y="8" width="20" height="2" rx="0.5" />
      {/* Left leg */}
      <rect x="5" y="10" width="2" height="10" rx="0.5" />
      {/* Right leg */}
      <rect x="17" y="10" width="2" height="10" rx="0.5" />
    </svg>
  );
}

export default function EquipmentRankingClient({
  initialEquipments,
}: {
  initialEquipments: EquipmentRankItem[];
}) {
  const [equipments] = useState<EquipmentRankItem[]>(initialEquipments);
  const [visibleRows, setVisibleRows] = useState<Record<string, number>>({});

  // Restore visibleRows on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("equip_visibleRows");
      if (saved) setVisibleRows(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Persist visibleRows whenever it changes
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    sessionStorage.setItem("equip_visibleRows", JSON.stringify(visibleRows));
  }, [visibleRows]);

  // Items per row (matches grid cols: 5 on xl)
  const ITEMS_PER_ROW = 5;

  const groupedByCategory = categoryOrder.reduce(
    (acc, cat) => {
      acc[cat] = equipments.filter((e) => e.category === cat);
      return acc;
    },
    {} as Record<string, EquipmentRankItem[]>,
  );

  // ── Scroll save / restore (uses the single layout scroll container) ──
  const [navCount, setNavCount] = useState(0);
  useEffect(() => {
    function saveScroll() {
      const container = document.getElementById("main-scroll");
      if (container) {
        sessionStorage.setItem(
          "equip_ranking_scrollY",
          String(container.scrollTop),
        );
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
    const saved = sessionStorage.getItem("equip_ranking_scrollY");
    const container = document.getElementById("main-scroll");
    if (!saved || !container) return;
    history.scrollRestoration = "manual";
    const targetY = parseInt(saved, 10);
    let attempts = 0;
    function tryScroll() {
      if (!container) return;
      attempts++;
      if (container.scrollHeight <= targetY && attempts < 50) {
        requestAnimationFrame(tryScroll);
        return;
      }
      container.scrollTo(0, targetY);
    }
    requestAnimationFrame(tryScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navCount]);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-3 sm:mb-4 text-center">
        인기 장비 랭킹
      </h1>

      {/* Category Navigation Icons — smooth scroll */}
      <div className="flex items-stretch justify-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {categoryOrder.map((cat) => {
          const items = groupedByCategory[cat] || [];
          if (items.length === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => {
                const container = document.getElementById("main-scroll");
                const section = document.getElementById(`cat-${cat}`);
                if (container && section) {
                  const top =
                    section.getBoundingClientRect().top +
                    container.scrollTop -
                    60;
                  container.scrollTo({ top, behavior: "smooth" });
                }
              }}
              className="flex flex-col items-center justify-center gap-0.5 shrink-0 w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <span className="text-base leading-none">
                {cat === "desk" ? (
                  <DeskIcon className="w-5 h-5" />
                ) : (
                  categoryIcons[cat] || "📦"
                )}
              </span>
              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                {typeLabelMap[cat] || cat}
              </span>
            </button>
          );
        })}
      </div>

      {categoryOrder.map((cat) => {
        const items = groupedByCategory[cat] || [];
        if (items.length === 0) return null;

        const rowsToShow = visibleRows[cat] ?? 2;
        const visibleItems = items.slice(0, rowsToShow * ITEMS_PER_ROW);
        const hasMore = visibleItems.length < items.length;

        return (
          <section key={cat} id={`cat-${cat}`} className="mb-10 scroll-mt-20">
            <h2 className="text-sm sm:text-base font-bold text-zinc-800 dark:text-zinc-200 mb-2 sm:mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full" />
              {typeLabelMap[cat] || cat}
              <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500">
                ({items.length})
              </span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1.5 sm:gap-2">
              {visibleItems.map((item) => (
                <EquipmentRankCard key={item.id} item={item} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-3">
                <button
                  onClick={() =>
                    setVisibleRows((prev) => ({
                      ...prev,
                      [cat]: (prev[cat] ?? 2) + 2,
                    }))
                  }
                  className="flex items-center gap-1 px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  더보기 <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function EquipmentRankCard({ item }: { item: EquipmentRankItem }) {
  const imgSrc = equipmentImages[item.key] || null;
  const equipmentUrl = `/equipment/${item.category}/${encodeURIComponent(item.key)}`;

  return (
    <Link
      href={equipmentUrl}
      className="flex flex-col bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden hover:border-blue-500 dark:hover:border-blue-400 transition-colors no-underline"
    >
      {/* Top: Rank badge + Brand + Model */}
      <div className="px-2.5 pt-2 pb-1 space-y-0.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
              item.popularity_rank === 1
                ? "bg-[#008bf2]"
                : item.popularity_rank === 2
                  ? "bg-[#00bba3]"
                  : item.popularity_rank === 3
                    ? "bg-[#e8a803]"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            #{item.popularity_rank}
          </span>
          <span className="text-[11px] text-blue-500 dark:text-blue-400 font-medium truncate">
            {item.brand}
          </span>
          <span className="text-[11px] font-semibold text-zinc-900 dark:text-white truncate">
            {item.model}
          </span>
        </div>
      </div>

      {/* Image */}
      <div className="relative bg-zinc-50 dark:bg-zinc-900 p-2 flex items-center justify-center aspect-square shrink-0">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={item.key}
            width={160}
            height={160}
            className="max-h-full max-w-full object-contain"
            style={{ width: "auto", height: "auto" }}
          />
        ) : (
          <div className="text-zinc-400 dark:text-zinc-600 text-sm">
            이미지 없음
          </div>
        )}
      </div>

      {/* Bottom: Features + Buttons */}
      <div className="p-2.5 space-y-1.5 flex flex-col flex-1">
        {/* Row 3: Features - 유선/무선, size, weight, speed in order */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400">
          {(() => {
            const features: { label: string; value?: string | null }[] = [
              { label: "conn", value: item.connection },
              { label: "size", value: item.size },
              { label: "weight", value: item.weight },
              { label: "speed", value: item.maxSpeed || item.dpi },
            ];
            return features
              .filter(
                (f) =>
                  f.value && !/^(n\/?a|null|none|-)$/i.test(f.value.trim()),
              )
              .map((f) => {
                let display = f.value!.trim();
                // Summarize values
                if (display.includes("IPS")) {
                  display = display.replace(/\s*IPS.*/, "").trim() + "ips";
                }
                if (display.includes("DPI")) {
                  display = display.replace(/\s*DPI.*/, "").trim();
                }
                if (display.includes("mm")) {
                  display = display.replace(/\s*x\s*.*/, "").trim();
                }
                if (display.length > 12) display = display.slice(0, 10) + "...";
                return (
                  <span
                    key={f.label}
                    className="bg-zinc-100 dark:bg-zinc-700 px-1.5 py-0.5 rounded truncate max-w-[70px]"
                  >
                    {display}
                  </span>
                );
              });
          })()}
        </div>
        {/* Player Count */}
        <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
          사용중인 선수 : {item.currently_used}명
        </div>
        {/* Action Buttons */}
        <div className="flex gap-1.5 mt-auto pt-1">
          {item.officialUrl && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(item.officialUrl, "_blank", "noopener,noreferrer");
              }}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-medium bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-800 dark:text-white rounded-md transition-colors cursor-pointer"
              type="button"
            >
              <ExternalLink className="w-2.5 h-2.5" />
              공식사이트
            </button>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openCoupangLink(coupangLink(item.key, item.affiliate_url));
            }}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-medium bg-[#FF6F00] hover:bg-[#E85E00] text-white rounded-md transition-colors cursor-pointer"
            type="button"
          >
            <ShoppingCart className="w-2.5 h-2.5" />
            득템
          </button>
        </div>
      </div>
    </Link>
  );
}
