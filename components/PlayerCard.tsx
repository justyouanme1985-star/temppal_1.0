"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Player } from "@/lib/playerData";
import {
  Mouse,
  Keyboard,
  Headphones,
  RectangleHorizontal,
  ArmchairIcon,
  MonitorIcon,
  Monitor,
  ChevronUp,
  ChevronDown,
  Minus,
} from "lucide-react";

const equipmentIcons = [
  { key: "mouse", icon: Mouse, label: "마우스" },
  { key: "keyboard", icon: Keyboard, label: "키보드" },
  { key: "headphone", icon: Headphones, label: "헤드셋" },
  { key: "mousepad", icon: RectangleHorizontal, label: "마우스패드" },
  { key: "monitor", icon: Monitor, label: "모니터" },
  { key: "chair", icon: ArmchairIcon, label: "의자" },
  { key: "desk", icon: MonitorIcon, label: "책상" },
];

interface PlayerCardProps {
  player: Player;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  const router = useRouter();
  const lastClickRef = useRef<Map<string, number>>(new Map());

  // Track click on player card (debounced: max 1 click per 10s per player)
  function handleCardClick() {
    if (!player.dbId) return;
    const now = Date.now();
    const last = lastClickRef.current.get(String(player.dbId)) || 0;
    if (now - last < 10_000) return;
    lastClickRef.current.set(String(player.dbId), now);

    fetch(`/api/players/${player.dbId}/click`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  }

  // Track click on equipment icon
  function handleEquipmentClick(e: React.MouseEvent, eqName: string) {
    if (!player.dbId) return;
    e.preventDefault();
    e.stopPropagation();
    const now = Date.now();
    const key = `eq-${player.dbId}-${eqName}`;
    const last = lastClickRef.current.get(key) || 0;
    if (now - last < 10_000) return;
    lastClickRef.current.set(key, now);

    fetch(`/api/players/${player.dbId}/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "equipment", equipment_name: eqName }),
      keepalive: true,
    }).catch(() => {});
  }

  // Render blank placeholder for dummy players (before Supabase data loads)
  // Matches the exact structure of a real card for zero layout shift
  if (!player.playerName) {
    return (
      <div
        className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md h-14 flex flex-row items-center px-1 gap-0.5 mx-0.5"
        style={{ minWidth: 320 }}
      >
        <div className="shrink-0 flex items-center w-12 gap-1">
          <div className="w-6" />
          <div className="w-6" />
        </div>
        <div className="shrink-0 w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-700" />
        <div className="flex items-center flex-1 min-w-0 px-1">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4" />
              <div className="w-20 h-3 bg-zinc-100 dark:bg-zinc-700 rounded" />
              <div className="w-16 h-3 bg-zinc-100 dark:bg-zinc-700 rounded" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-24 h-2.5 bg-zinc-100 dark:bg-zinc-700 rounded" />
              <div className="w-12 h-2.5 bg-zinc-100 dark:bg-zinc-700 rounded" />
            </div>
          </div>
        </div>
        <div className="w-28 sm:w-36 md:w-56 shrink-0 flex items-center justify-start space-x-1 pr-2">
          <div className="w-5 h-5 bg-zinc-100 dark:bg-zinc-700 rounded" />
          <div className="w-5 h-5 bg-zinc-100 dark:bg-zinc-700 rounded" />
          <div className="w-5 h-5 bg-zinc-100 dark:bg-zinc-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Link
        href={`/player/${player.id}`}
        onClick={handleCardClick}
        className="
          bg-white dark:bg-zinc-800 border 
          border-zinc-200 dark:border-zinc-700 
          rounded-md overflow-hidden 
          hover:border-blue-500 dark:hover:border-blue-400 
          h-14 flex flex-row items-center px-1 gap-0.5 mx-0.5
          cursor-pointer no-underline"
        style={{ minWidth: 320 }}
      >
        {/* Rank Badge */}
        <div className="shrink-0 flex items-center w-12">
          <div className="w-6 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
              {player.popularityRank}
            </span>
          </div>
          <div className="w-6 flex items-center justify-center shrink-0">
            {player.rankChange > 0 ? (
              <>
                <ChevronUp className="w-3 h-3 text-green-500" />
                <span className="text-[10px] font-medium text-green-500">
                  {player.rankChange}
                </span>
              </>
            ) : player.rankChange < 0 ? (
              <>
                <ChevronDown className="w-3 h-3 text-red-500" />
                <span className="text-[10px] font-medium text-red-500">
                  {Math.abs(player.rankChange)}
                </span>
              </>
            ) : (
              <Minus className="w-3 h-3 text-zinc-400" />
            )}
          </div>
        </div>

        {/* Player Image - perfect circular avatar */}
        <div className="shrink-0 w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-zinc-900">
          {player.playerImage ? (
            <img
              src={player.playerImage}
              alt={player.playerName}
              loading="lazy"
              className="w-11 h-11 object-cover object-center block"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/images/players/lol/no-picture.webp";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 text-xs font-bold text-zinc-500">
              {player.playerName?.[0] || "?"}
            </div>
          )}
        </div>

        {/* Info + Equipment: independent horizontal scrolls for small screens */}
        <div className="flex items-center flex-1 min-w-0 px-1">
          {/* Info column: scrollable on small screens */}
          <div className="flex-1 min-w-0 mr-0">
            <div className="overflow-x-auto md:overflow-x-hidden scrollbar-hide">
              <div className="min-w-max md:min-w-0 flex items-center gap-2">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    {player.teamLogo ? (
                      <img
                        src={player.teamLogo}
                        alt={player.team}
                        loading="lazy"
                        className="w-4 h-4 object-contain shrink-0 mr-1"
                      />
                    ) : (
                      <div className="w-4 h-4 mr-1" />
                    )}
                    <span className="text-blue-500 dark:text-blue-400 font-medium truncate">
                      {player.team || ""}
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-white truncate">
                      {player.playerName}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-700 dark:text-zinc-300 truncate">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate">
                        {player.playerRealName
                          ? player.playerRealName
                          : "\u00A0"}
                      </span>
                      {player.position && (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {player.position}
                        </span>
                      )}
                      {player.nationality && (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {player.nationality}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* SNS Icons removed from card view - shown only on player detail page */}
              </div>
            </div>
          </div>

          {/* Equipment column: fixed width, scrollable on small screens */}
          <div className="w-28 sm:w-36 md:w-56 shrink-0">
            <div className="overflow-x-auto md:overflow-x-hidden scrollbar-hide">
              <div className="min-w-max flex items-center justify-start space-x-1 pr-0">
                {equipmentIcons.map((eq) => {
                  // only render icons for equipment the player actually has
                  const has =
                    player.equipment &&
                    player.equipment.some((e) => e.equipmentType === eq.label);
                  if (!has) return null;
                  const Icon = eq.icon;
                  const eqData = player.equipment.find(
                    (e) => e.equipmentType === eq.label,
                  );
                  return (
                    <button
                      key={eq.key}
                      onClick={(e) => {
                        handleEquipmentClick(
                          e,
                          eqData?.equipmentName || eq.label,
                        );
                        router.push(
                          `/equipment/${eq.key}/${encodeURIComponent(eqData?.equipmentName || eq.label)}${player.dbId ? `?playerId=${player.dbId}` : ""}`,
                        );
                      }}
                      className={`p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors group cursor-pointer`}
                      title={eq.label}
                    >
                      <Icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
