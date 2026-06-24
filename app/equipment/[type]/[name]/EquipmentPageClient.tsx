"use client";

import { use, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, ShoppingCart } from "lucide-react";
import CommentSection from "@/components/CommentSection";
import { coupangLink, openCoupangLink } from "@/lib/coupang";
import {
  loadEquipmentFromSupabase,
  getSupabaseEquipmentSpec,
  formatEquipmentSpec,
  getEquipmentSpec,
  getEquipmentImage,
  resolveEquipmentLinkKey,
} from "@/lib/equipmentData";
import { getPlayersByEquipmentName, type Player } from "@/lib/playerData";

const typeLabelMap: Record<string, string> = {
  mouse: "마우스",
  keyboard: "키보드",
  headset: "헤드셋",
  monitor: "모니터",
  mousepad: "마우스패드",
  chair: "의자",
  desk: "책상",
};

export default function EquipmentPageClient({
  params,
  searchParams,
}: {
  params: Promise<{ type: string; name: string }>;
  searchParams?: Promise<{ playerId?: string }>;
}) {
  const { type: typeKey, name: encodedName } = use(params);
  const equipmentName = decodeURIComponent(encodedName);
  const typeLabel = typeLabelMap[typeKey] || typeKey;
  const resolvedSearchParams = searchParams ? use(searchParams) : undefined;
  const fromPlayerId = resolvedSearchParams?.playerId
    ? Number(resolvedSearchParams.playerId)
    : undefined;

  const [navCount, setNavCount] = useState(0);
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playersLoading, setPlayersLoading] = useState(true);

  // ── Scroll save / restore (uses the single layout scroll container) ──
  useEffect(() => {
    function saveScroll() {
      const container = document.getElementById("main-scroll");
      if (container) {
        sessionStorage.setItem(
          "equippage_scrollY",
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
    const saved = sessionStorage.getItem("equippage_scrollY");
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

  // Load equipment spec
  useEffect(() => {
    let mounted = true;
    async function load() {
      await loadEquipmentFromSupabase();
      const linkKey = resolveEquipmentLinkKey(typeKey, equipmentName);

      // Try Supabase first
      let raw = getSupabaseEquipmentSpec(typeKey, equipmentName);
      if (raw) {
        if (mounted) {
          setSpec(formatEquipmentSpec(raw, typeKey));
          setLoading(false);
        }
        return;
      }

      // Fall back to static DB (alias + normalized lookup)
      const staticSpec =
        getEquipmentSpec(typeLabel, equipmentName) ??
        getEquipmentSpec(typeLabel, linkKey);
      if (staticSpec) {
        const correctImage = getEquipmentImage(typeKey, linkKey);
        if (correctImage) staticSpec.image = correctImage;
        if (mounted) {
          setSpec(staticSpec as any);
          setLoading(false);
        }
        return;
      }

      const imageOnly = getEquipmentImage(typeKey, linkKey);
      if (imageOnly && mounted) {
        setSpec({ brand: "", model: linkKey, image: imageOnly, _type: typeKey });
        setLoading(false);
        return;
      }

      // No spec found — still show with just the name
      if (mounted) {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [typeKey, equipmentName, typeLabel]);

  // Load players using this equipment
  useEffect(() => {
    let mounted = true;
    async function load() {
      await loadEquipmentFromSupabase();
      const linkKey = resolveEquipmentLinkKey(typeKey, equipmentName);
      const result = await getPlayersByEquipmentName(linkKey, typeKey);
      if (mounted) {
        setPlayers(result);
        setPlayersLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [typeKey, equipmentName]);

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
        로딩 중...
      </div>
    );
  }

  // Not found — no spec and no players use it
  if (!spec && players.length === 0) {
    notFound();
  }

  return (
    <div className="flex-1 overflow-y-auto pb-1.5">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
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

        {/* Equipment Hero Section */}
        <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Equipment Image */}
            <div className="w-full md:w-1/2 bg-zinc-50 dark:bg-zinc-900 p-3 sm:p-8 flex items-center justify-center min-h-[160px] sm:min-h-[300px]">
              {spec && spec.image ? (
                <Image
                  src={spec.image}
                  alt={equipmentName}
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

            {/* Equipment Info */}
            <div className="w-full md:w-1/2 p-3 sm:p-6 flex flex-col">
              {/* Type badge */}
              <span className="inline-block text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full w-fit mb-3">
                {typeLabel}
              </span>

              {/* Name */}
              <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-3 sm:mb-4">
                {spec ? `${spec.brand} ${spec.model}` : equipmentName}
              </h1>

              {/* Specs */}
              {spec && (
                <div className="space-y-2 mb-6">
                  {spec._type === "mouse" && (
                    <>
                      {spec.connection && (
                        <SpecRow label="연결" value={spec.connection} />
                      )}
                      {spec.weight && (
                        <SpecRow label="무게" value={spec.weight} />
                      )}
                      {spec.sensor && (
                        <SpecRow label="센서" value={spec.sensor} />
                      )}
                      {spec.dpi && <SpecRow label="DPI" value={spec.dpi} />}
                      {spec.buttons && (
                        <SpecRow label="버튼" value={spec.buttons} />
                      )}
                    </>
                  )}
                  {spec._type === "keyboard" && (
                    <>
                      {spec.switchType && (
                        <SpecRow label="스위치" value={spec.switchType} />
                      )}
                      {spec.layout && (
                        <SpecRow label="레이아웃" value={spec.layout} />
                      )}
                      {spec.connection && (
                        <SpecRow label="연결" value={spec.connection} />
                      )}
                    </>
                  )}
                  {spec._type === "headset" && (
                    <>
                      {spec.driver && (
                        <SpecRow label="드라이버" value={spec.driver} />
                      )}
                      {spec.freqResponse && (
                        <SpecRow label="주파수" value={spec.freqResponse} />
                      )}
                    </>
                  )}
                  {spec._type === "monitor" && (
                    <>
                      {spec.refreshRate && (
                        <SpecRow label="주사율" value={spec.refreshRate} />
                      )}
                      {spec.size && <SpecRow label="크기" value={spec.size} />}
                      {spec.resolution && (
                        <SpecRow label="해상도" value={spec.resolution} />
                      )}
                      {spec.panelType && (
                        <SpecRow label="패널" value={spec.panelType} />
                      )}
                    </>
                  )}
                  {spec._type === "mousepad" && (
                    <>
                      {spec.size && <SpecRow label="크기" value={spec.size} />}
                      {spec.surface && (
                        <SpecRow label="표면" value={spec.surface} />
                      )}
                      {spec.thickness && (
                        <SpecRow label="두께" value={spec.thickness} />
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-auto">
                {spec && spec.officialUrl && (
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
                      coupangLink(
                        spec ? `${spec.brand} ${spec.model}` : equipmentName,
                        spec?.affiliate_url,
                      ),
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

        {/* Players Using This Equipment */}
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
          이 장비를 사용하는 선수
        </h2>

        {playersLoading ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">로딩 중...</p>
        ) : players.length === 0 ? (
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

        {/* Comments */}
        <CommentSection targetType="equipment" targetId={equipmentName} />
      </div>
    </div>
  );
}

const gameNames: Record<string, string> = {
  lol: "리그 오브 레전드",
  starcraft: "스타크래프트",
  valorant: "발로란트",
  battlegrounds: "배틀그라운드",
};

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
      {/* Player Image - circular */}
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

      {/* Info Section */}
      <div className="p-3 space-y-1.5">
        {/* Row 1: Team logo + Team name */}
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

        {/* Row 2: IGN */}
        <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
          {player.playerName}
        </p>

        {/* Row 3: Real name · Game */}
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
