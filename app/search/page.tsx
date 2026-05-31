"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";
import { useSearchPlayers } from "@/lib/hooks/usePlayers";
import { scoreQuery } from "@/lib/koreanSearch";
import { Search } from "lucide-react";
import PlayerCard from "@/components/PlayerCard";

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const q = query.trim();

  const { data: results, isLoading, isError } = useSearchPlayers(q);

  const scoredResults = useMemo(() => {
    if (!q || !results) return [];
    return results
      .map((p) => ({
        player: p,
        score: scoreQuery(
          q,
          p.playerName,
          p.playerRealName,
          p.team,
          p.collectedWords,
        ),
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [q, results]);

  useEffect(() => {
    if (scoredResults.length > 0 && scoredResults[0].score >= 1000) {
      const player = scoredResults[0].player;
      if (player.dbId) {
        fetch(`/api/players/${player.dbId}/click`, {
          method: "POST",
          keepalive: true,
        }).catch(console.error);
      }
      router.push(`/player/${player.id}`);
    }
  }, [scoredResults, router]);

  if (scoredResults.length > 0 && scoredResults[0].score >= 1000) return null;

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
          &ldquo;{query}&rdquo; 에 대한 검색 결과 {scoredResults.length}건
        </p>

        {isError ? (
          <div className="flex items-center justify-center py-20 text-sm text-red-500">
            검색 중 오류가 발생했습니다. 다시 시도해주세요.
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-20 text-sm text-zinc-500 dark:text-zinc-400">
            로딩 중...
          </div>
        ) : scoredResults.length > 0 ? (
          <div className="grid gap-1">
            {scoredResults
              .sort(
                (a, b) =>
                  (a.player.powerRanking ?? 999) -
                  (b.player.powerRanking ?? 999),
              )
              .map(({ player }) => (
                <PlayerCard key={player.id} player={player} />
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              &ldquo;{query}&rdquo; 에 대한 검색 결과가 없습니다.
            </p>
            <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1">
              선수 이름, 팀 이름으로 검색해보세요.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
