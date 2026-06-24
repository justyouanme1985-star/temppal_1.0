"use client";

import { use, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShoppingCart } from "lucide-react";
import { usePlayerById } from "@/lib/hooks/usePlayers";
import CommentSection from "@/components/CommentSection";
import { coupangLink, openCoupangLink } from "@/lib/coupang";
import {
  loadEquipmentFromSupabase,
  getSupabaseEquipmentSpec,
  formatEquipmentSpec,
  getEquipmentSpec,
  equipmentImages,
} from "@/lib/equipmentData";

const equipmentTypeMap: Record<string, string> = {
  마우스: "mouse",
  키보드: "keyboard",
  헤드셋: "headset",
  모니터: "monitor",
  마우스패드: "mousepad",
  의자: "chair",
  책상: "desk",
};

function formatDateString(s?: string) {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function EquipmentCard({
  type,
  name,
  playerDbId,
}: {
  type: string;
  name: string;
  playerDbId?: number;
}) {
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const lastEquipClickRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    let mounted = true;
    async function load() {
      await loadEquipmentFromSupabase();
      const typeKey = equipmentTypeMap[type];
      if (!typeKey) {
        if (mounted) setLoading(false);
        return;
      }
      // Try Supabase first, fall back to static DB
      let raw = getSupabaseEquipmentSpec(typeKey, name);
      if (!raw) {
        const staticSpec = getEquipmentSpec(type, name);
        if (staticSpec) {
          // Override image with correct path from equipmentImages mapping
          const correctImage = equipmentImages[name];
          if (correctImage) staticSpec.image = correctImage;
          if (mounted) {
            setSpec(staticSpec as any);
            setLoading(false);
          }
        }
        return;
      }
      if (mounted) {
        setSpec(raw ? formatEquipmentSpec(raw, typeKey) : null);
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [type, name]);

  // Track equipment button clicks (debounced per player-equipment combo)
  function handleEquipmentBtnClick() {
    if (!playerDbId) return;
    const now = Date.now();
    const key = `eqpage-${playerDbId}-${name}`;
    const last = lastEquipClickRef.current.get(key) || 0;
    if (now - last < 10_000) return;
    lastEquipClickRef.current.set(key, now);

    fetch(`/api/players/${playerDbId}/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "equipment", equipment_name: name }),
      keepalive: true,
    }).catch(() => {});
  }

  function handleCardClick() {
    if (!playerDbId) return;
    const now = Date.now();
    const key = `eqcard-${playerDbId}-${name}`;
    const last = lastEquipClickRef.current.get(key) || 0;
    if (now - last < 10_000) return;
    lastEquipClickRef.current.set(key, now);

    fetch(`/api/players/${playerDbId}/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "equipment", equipment_name: name }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <Link
      href={`/equipment/${equipmentTypeMap[type] || type}/${encodeURIComponent(name)}${playerDbId ? `?playerId=${playerDbId}` : ""}`}
      onClick={handleCardClick}
      className="block bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex flex-col no-underline"
    >
      {/* Equipment Image */}
      <div className="relative bg-zinc-50 dark:bg-zinc-900 p-4 flex items-center justify-center h-48 group">
        {spec && spec.image ? (
          <Image
            src={spec.image}
            alt={name}
            width={160}
            height={160}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
            priority={false}
          />
        ) : (
          <div className="text-zinc-400 dark:text-zinc-600 text-sm">
            이미지 없음
          </div>
        )}
        {/* Type badge */}
        <span className="absolute top-2 left-2 text-[11px] font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
          {type}
        </span>
      </div>

      {/* Equipment Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-zinc-900 dark:text-white text-sm mb-2 line-clamp-2">
          {spec ? `${spec.brand} ${spec.model}` : name}
        </h3>

        {/* Specs Grid */}
        {spec && spec._type === "mouse" && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
            {spec.connection && (
              <div>
                연결:{" "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {spec.connection}
                </span>
              </div>
            )}
            {spec.weight && (
              <div>
                무게:{" "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {spec.weight}
                </span>
              </div>
            )}
            {spec.sensor && (
              <div>
                센서:{" "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {spec.sensor}
                </span>
              </div>
            )}
            {spec.dpi && (
              <div>
                DPI:{" "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {spec.dpi}
                </span>
              </div>
            )}
          </div>
        )}

        {spec && spec._type === "keyboard" && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
            {spec.switchType && (
              <div>
                스위치:{" "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {spec.switchType}
                </span>
              </div>
            )}
            {spec.layout && (
              <div>
                레이아웃:{" "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {spec.layout}
                </span>
              </div>
            )}
            {spec.connection && (
              <div>
                연결:{" "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {spec.connection}
                </span>
              </div>
            )}
          </div>
        )}

        {spec && spec._type === "headset" && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
            {spec.driver && (
              <div>
                드라이버:{" "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {spec.driver}
                </span>
              </div>
            )}
            {spec.freqResponse && (
              <div>
                주파수:{" "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {spec.freqResponse}
                </span>
              </div>
            )}
          </div>
        )}

        {spec && spec._type === "monitor" && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
            {spec.refreshRate && (
              <div>
                주사율:{" "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {spec.refreshRate}
                </span>
              </div>
            )}
            {spec.size && (
              <div>
                크기:{" "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {spec.size}
                </span>
              </div>
            )}
            {spec.resolution && (
              <div>
                해상도:{" "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {spec.resolution}
                </span>
              </div>
            )}
            {spec.panelType && (
              <div>
                패널:{" "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {spec.panelType}
                </span>
              </div>
            )}
          </div>
        )}

        {spec && spec._type === "mousepad" && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
            {spec.size && (
              <div>
                크기:{" "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {spec.size}
                </span>
              </div>
            )}
            {spec.surface && (
              <div>
                표면:{" "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {spec.surface}
                </span>
              </div>
            )}
            {spec.thickness && (
              <div>
                두께:{" "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {spec.thickness}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto pt-3">
          {spec && spec.officialUrl && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEquipmentBtnClick();
                window.open(spec.officialUrl, "_blank", "noopener,noreferrer");
              }}
              className="flex-1 flex items-center justify-center gap-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white py-2 rounded-lg transition-colors cursor-pointer"
              type="button"
            >
              <ExternalLink className="w-3 h-3" />
              공식사이트
            </button>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleEquipmentBtnClick();
              openCoupangLink(
                coupangLink(
                  spec ? `${spec.brand} ${spec.model}` : name,
                  spec?.affiliate_url,
                ),
              );
            }}
            className="flex-1 flex items-center justify-center gap-1 text-xs font-medium bg-[#FF6F00] hover:bg-[#E85E00] text-white py-2 rounded-lg transition-colors cursor-pointer"
            type="button"
          >
            <ShoppingCart className="w-3 h-3" />
            득템
          </button>
        </div>
      </div>
    </Link>
  );
}

const gameNames: Record<string, string> = {
  lol: "리그 오브 레전드",
  starcraft: "스타크래프트",
  valorant: "발로란트",
  battlegrounds: "배틀그라운드",
};

const SCROLL_STORAGE_KEY = "playerpage_scrollY";

export default function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: player, isLoading } = usePlayerById(id);

  // ── Scroll save / restore (uses the single layout scroll container) ──
  const [navCount, setNavCount] = useState(0);
  useEffect(() => {
    function saveScroll() {
      const container = document.getElementById("main-scroll");
      if (container) {
        sessionStorage.setItem(SCROLL_STORAGE_KEY, String(container.scrollTop));
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
    const saved = sessionStorage.getItem(SCROLL_STORAGE_KEY);
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

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">로딩 중...</div>
    );
  }

  if (!player) {
    notFound();
  }

  return (
    <div className="flex-1 overflow-y-auto pb-1.5">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
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

        {/* Player Profile Section */}
        <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Player Image - 2x bigger */}
            <div className="shrink-0 w-44 h-44 rounded-full overflow-hidden flex items-center justify-center bg-zinc-50 dark:bg-zinc-800">
              <img
                src={
                  player.playerImage || "/images/players/lol/no-picture.webp"
                }
                alt={player.playerName}
                loading="lazy"
                className="w-48 h-48 rounded-full object-cover border-0 border-zinc-200 dark:border-zinc-800"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/players/lol/no-picture.webp";
                }}
              />
            </div>

            {/* Player Info */}
            <div className="flex-1 text-center sm:text-left">
              {/* Line 1: team name + IGN */}
              <div className="flex items-center gap-3 justify-center sm:justify-start mb-1 flex-wrap">
                {player.teamLogo && (
                  <img
                    src={player.teamLogo}
                    alt={player.team}
                    loading="lazy"
                    className="w-6 h-6 object-contain"
                  />
                )}
                {player.team && (
                  <span className="text-base text-blue-500 dark:text-blue-400 font-medium">
                    {player.team}
                  </span>
                )}
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {player.playerName}
                </h1>
              </div>

              {/* Line 2: real name + nationality */}
              <div className="text-sm mb-1">
                {player.playerRealName && (
                  <span className="mr-2 font-bold text-zinc-900 dark:text-white">
                    {player.playerRealName}
                    {player.birthDate && (
                      <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-2 font-normal">
                        {formatDateString(player.birthDate)}
                      </span>
                    )}
                  </span>
                )}
                {player.nationality && (
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {player.nationality}
                  </span>
                )}
              </div>

              {/* Line 3: rest (game · profession · position) */}
              <div className="flex items-center gap-3 justify-center sm:justify-start mb-2 flex-wrap">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {gameNames[player.game]} · 프로게이머
                  {player.position ? ` · ${player.position}` : ""}
                </span>
              </div>

              {/* Line 4: SNS Links */}
              <div className="flex items-center gap-4 justify-center sm:justify-start">
                {player.youtube && (
                  <a
                    href={player.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                  >
                    <img
                      src="/images/sns_icons/youtube.png"
                      alt="YouTube"
                      loading="lazy"
                      className="w-9 h-8 rounded-md"
                    />
                  </a>
                )}
                {player.soop && (
                  <a
                    href={player.soop}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                  >
                    <img
                      src="/images/sns_icons/soop.png"
                      alt="SOOP"
                      loading="lazy"
                      className="w-6 h-6 rounded-md"
                    />
                  </a>
                )}
                {player.chzzk && (
                  <a
                    href={player.chzzk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                  >
                    <img
                      src="/images/sns_icons/chzzk.png"
                      alt="치지직"
                      loading="lazy"
                      className="w-6 h-6 rounded-md"
                    />
                  </a>
                )}
                {player.instagram && (
                  <a
                    href={player.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                  >
                    <img
                      src="/images/sns_icons/instagram.png"
                      alt="Instagram"
                      loading="lazy"
                      className="w-6 h-6 rounded-md"
                    />
                  </a>
                )}
                {player.twitter && (
                  <a
                    href={player.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                  >
                    <img
                      src="/images/sns_icons/x.png"
                      alt="X (Twitter)"
                      loading="lazy"
                      className="w-6 h-6 rounded-md"
                    />
                  </a>
                )}
                {player.facebook && (
                  <a
                    href={player.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                  >
                    <img
                      src="/images/sns_icons/facebook.png"
                      alt="Facebook"
                      loading="lazy"
                      className="w-6 h-6 rounded-md"
                    />
                  </a>
                )}
                {player.twitch && (
                  <a
                    href={player.twitch}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                  >
                    <img
                      src="/images/sns_icons/twitch.png"
                      alt="Twitch"
                      loading="lazy"
                      className="w-6 h-6 rounded-md"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Section */}
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
          사용 장비
        </h2>

        {player.equipment.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            장비 정보가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {player.equipment.map((eq) => (
              <EquipmentCard
                key={eq.id}
                type={eq.equipmentType}
                name={eq.equipmentName}
                playerDbId={player.dbId}
              />
            ))}
          </div>
        )}

        {/* Previous Equipment Section */}
        {player.previousEquipment.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 mt-8">
              이전 장비
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
              {player.previousEquipment.map((eq) => (
                <div key={eq.id} className="opacity-50">
                  <EquipmentCard
                    type={eq.equipmentType}
                    name={eq.equipmentName}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Comments */}
        <CommentSection targetType="player" targetId={id} />
      </div>
    </div>
  );
}
