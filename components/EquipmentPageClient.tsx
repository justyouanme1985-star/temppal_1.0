"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShoppingCart } from "lucide-react";
import type { Player } from "@/lib/playerMapping";
import type {
  EquipmentPageData,
  EquipmentSpec,
} from "@/lib/serverEquipmentData";
import CommentSection from "@/components/CommentSection";
import { coupangLink, openCoupangLink } from "@/lib/coupang";
import { useScrollRestore } from "@/lib/hooks/useScrollRestore";

const gameNames: Record<string, string> = {
  lol: "리그 오브 레전드",
  starcraft: "스타크래프트",
  valorant: "발로란트",
  battlegrounds: "배틀그라운드",
};

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-zinc-500 dark:text-zinc-400 min-w-[60px]">
        {label}
      </span>
      <span className="text-zinc-800 dark:text-zinc-200">{value}</span>
    </div>
  );
}

function EquipmentPlayerCard({ player }: { player: Player }) {
  const lastClickRef = useRef(0);

  function handleClick() {
    if (!player.dbId) return;
    const now = Date.now();
    if (now - lastClickRef.current < 10_000) return;
    lastClickRef.current = now;

    fetch(`/api/players/${player.dbId}/click`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <Link
      href={`/player/${player.id}`}
      onClick={handleClick}
      className="block bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden hover:border-blue-500 dark:hover:border-blue-400 transition-colors no-underline"
    >
      <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mt-4 bg-zinc-50 dark:bg-zinc-900">
        {player.playerImage ? (
          <img
            src={player.playerImage}
            alt={player.playerName}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/images/players/lol/no-picture.webp";
            }}
          />
        ) : (
          <div className="w-40 h-40 flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-xs">
            ?
          </div>
        )}
      </div>

      <div className="p-3 space-y-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          {player.teamLogo ? (
            <img
              src={player.teamLogo}
              alt={player.team}
              className="w-4 h-4 object-contain shrink-0"
            />
          ) : (
            <div className="w-4 h-4 shrink-0" />
          )}
          <span className="text-xs font-medium text-blue-500 dark:text-blue-400 truncate">
            {player.team || ""}
          </span>
        </div>

        <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
          {player.playerName}
        </p>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
          {player.playerRealName && (
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {player.playerRealName}
            </span>
          )}
          {player.playerRealName && " · "}
          {gameNames[player.game] || player.game}
        </p>
      </div>
    </Link>
  );
}

function EquipmentSpecs({ spec }: { spec: EquipmentSpec }) {
  return (
    <div className="space-y-2 mb-6">
      {spec._type === "mouse" && (
        <>
          {typeof spec.connection === "string" && spec.connection && (
            <SpecRow label="연결" value={spec.connection} />
          )}
          {typeof spec.weight === "string" && spec.weight && (
            <SpecRow label="무게" value={spec.weight} />
          )}
          {typeof spec.sensor === "string" && spec.sensor && (
            <SpecRow label="센서" value={spec.sensor} />
          )}
          {typeof spec.dpi === "string" && spec.dpi && (
            <SpecRow label="DPI" value={spec.dpi} />
          )}
          {typeof spec.buttons === "string" && spec.buttons && (
            <SpecRow label="버튼" value={spec.buttons} />
          )}
        </>
      )}
      {spec._type === "keyboard" && (
        <>
          {typeof spec.switchType === "string" && spec.switchType && (
            <SpecRow label="스위치" value={spec.switchType} />
          )}
          {typeof spec.layout === "string" && spec.layout && (
            <SpecRow label="레이아웃" value={spec.layout} />
          )}
          {typeof spec.connection === "string" && spec.connection && (
            <SpecRow label="연결" value={spec.connection} />
          )}
        </>
      )}
      {spec._type === "headset" && (
        <>
          {typeof spec.driver === "string" && spec.driver && (
            <SpecRow label="드라이버" value={spec.driver} />
          )}
          {typeof spec.freqResponse === "string" && spec.freqResponse && (
            <SpecRow label="주파수" value={spec.freqResponse} />
          )}
        </>
      )}
      {spec._type === "monitor" && (
        <>
          {typeof spec.refreshRate === "string" && spec.refreshRate && (
            <SpecRow label="주사율" value={spec.refreshRate} />
          )}
          {typeof spec.size === "string" && spec.size && (
            <SpecRow label="크기" value={spec.size} />
          )}
          {typeof spec.resolution === "string" && spec.resolution && (
            <SpecRow label="해상도" value={spec.resolution} />
          )}
          {typeof spec.panelType === "string" && spec.panelType && (
            <SpecRow label="패널" value={spec.panelType} />
          )}
        </>
      )}
      {spec._type === "mousepad" && (
        <>
          {typeof spec.size === "string" && spec.size && (
            <SpecRow label="크기" value={spec.size} />
          )}
          {typeof spec.surface === "string" && spec.surface && (
            <SpecRow label="표면" value={spec.surface} />
          )}
          {typeof spec.thickness === "string" && spec.thickness && (
            <SpecRow label="두께" value={spec.thickness} />
          )}
        </>
      )}
    </div>
  );
}

export default function EquipmentPageClient({
  data,
}: {
  data: EquipmentPageData;
}) {
  const { typeLabel, equipmentName, spec, players } = data;
  useScrollRestore("scroll_equippage");

  const displayTitle =
    spec?.brand && spec?.model ? `${spec.brand} ${spec.model}` : equipmentName;

  return (
    <div className="flex-1 overflow-y-auto pb-1.5">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <button
          onClick={() =>
            window.history.length > 1
              ? window.history.back()
              : (window.location.href = "/")
          }
          className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </button>

        <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 bg-zinc-50 dark:bg-zinc-900 p-3 sm:p-8 flex items-center justify-center min-h-[160px] sm:min-h-[300px]">
              {spec?.image ? (
                <Image
                  src={spec.image}
                  alt={displayTitle}
                  width={280}
                  height={280}
                  className="max-h-full max-w-full object-contain"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
              ) : (
                <div className="text-zinc-400 dark:text-zinc-600 text-sm">
                  이미지 없음
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 p-3 sm:p-6 flex flex-col">
              <span className="inline-block text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full w-fit mb-3">
                {typeLabel}
              </span>

              <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-3 sm:mb-4">
                {displayTitle}
              </h1>

              {spec && <EquipmentSpecs spec={spec} />}

              <div className="flex gap-3 mt-auto">
                {spec?.officialUrl && (
                  <a
                    href={spec.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 text-xs sm:text-sm font-medium bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white py-2 sm:py-2.5 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    공식사이트
                  </a>
                )}
                <button
                  onClick={() =>
                    openCoupangLink(
                      coupangLink(displayTitle, spec?.affiliate_url),
                    )
                  }
                  className="flex-1 flex items-center justify-center gap-1 text-xs sm:text-sm font-medium bg-[#FF6F00] hover:bg-[#E85E00] text-white py-2 sm:py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  득템
                </button>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
          이 장비를 사용하는 선수
        </h2>

        {players.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            이 장비를 사용하는 선수가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {players.map((player) => (
              <EquipmentPlayerCard key={player.id} player={player} />
            ))}
          </div>
        )}

        <CommentSection targetType="equipment" targetId={equipmentName} />
      </div>
    </div>
  );
}
