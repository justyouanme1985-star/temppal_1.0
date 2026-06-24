"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isChosungOnly } from "@/lib/koreanSearch";
import type { ScoredPlayer } from "@/lib/serverSearch";
import { Search } from "lucide-react";
import PlayerCard from "@/components/PlayerCard";

export default function SearchPageClient({
  query,
  initialResults,
}: {
  query: string;
  initialResults: ScoredPlayer[];
}) {
  const router = useRouter();
  const q = query.trim();

  useEffect(() => {
    if (initialResults.length === 0) return;
    if (isChosungOnly(q)) return;

    const top = initialResults[0];
    if (top.score >= 1500) {
      const player = top.player;
      if (player.dbId) {
        fetch(`/api/players/${player.dbId}/click`, {
          method: "POST",
          keepalive: true,
        }).catch(console.error);
      }
      router.push(`/player/${player.id}`);
    }
  }, [initialResults, q, router]);

  const isAutoRedirecting =
    initialResults.length > 0 &&
    !isChosungOnly(q) &&
    initialResults[0].score >= 1500;

  if (isAutoRedirecting) return null;

  return (
    <main className="pt-0">
      <div
        className="max-w-7xl mx-auto px-4 pt-6 pb-8"
        style={{ maxWidth: "1920px" }}
      >
        <h1 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
          검색 결과
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          {q ? (
            <>
              &ldquo;{query}&rdquo; 에 대한 검색 결과 {initialResults.length}건
            </>
          ) : (
            <>선수 이름, 팀 이름으로 검색해보세요.</>
          )}
        </p>

        {q && initialResults.length > 0 ? (
          <div className="grid gap-1">
            {initialResults.map(({ player }) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        ) : q ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              &ldquo;{query}&rdquo; 에 대한 검색 결과가 없습니다.
            </p>
            <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1">
              선수 이름, 팀 이름으로 검색해보세요.
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
