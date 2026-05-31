"use client";

import { Search } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import SideMenu from "@/components/SideMenu";
import { searchPlayers, Player } from "@/lib/playerData";
import { scoreQuery } from "@/lib/koreanSearch";

export default function SearchBar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Player[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setNoResults(false);
      setSelectedIndex(-1);
      return;
    }

    setIsLoading(true);
    try {
      const data = await searchPlayers(q);
      const scored = data
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
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((r) => r.player);

      setResults(scored);
      setNoResults(scored.length === 0);
    } catch (err) {
      console.error("Search failed:", err);
      setNoResults(true);
    } finally {
      setIsLoading(false);
    }
    setSelectedIndex(-1);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      search(val);
    }, 300);
  };

  const navigateToPlayer = (player: Player) => {
    setQuery("");
    setResults([]);
    setIsSearchFocused(false);
    inputRef.current?.blur();
    router.push(`/player/${player.id}`);
  };

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (selectedIndex >= 0 && results[selectedIndex]) {
      navigateToPlayer(results[selectedIndex]);
      return;
    }

    const exactMatch = results.find(
      (p) => p.playerName.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exactMatch) {
      navigateToPlayer(exactMatch);
      return;
    }

    if (results.length > 0 || trimmed) {
      setQuery("");
      setResults([]);
      setNoResults(false);
      setIsSearchFocused(false);
      inputRef.current?.blur();
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      setResults([]);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-black sticky top-14 h-12 transition-colors"
      style={{ zIndex: 50 }}
    >
      <div className="max-w-full mx-auto px-2 h-full flex items-center gap-2">
        <SideMenu />

        <div className="flex-1 relative" ref={dropdownRef}>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 group-focus-within:text-zinc-600 dark:group-focus-within:text-zinc-300 transition-colors" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="검색"
              className={`
                w-full bg-white dark:bg-zinc-800
                hover:bg-zinc-50 dark:hover:bg-zinc-700
                border border-zinc-300 dark:border-zinc-600
                focus:border-blue-500 dark:focus:border-blue-400
                focus:bg-white dark:focus:bg-zinc-800
                text-zinc-900 dark:text-white
                rounded-lg py-1.5 pl-9 pr-4
                text-sm outline-none
                transition-all duration-200
                placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                ${isSearchFocused ? "shadow-sm" : ""}
              `}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          {(results.length > 0 || noResults || isLoading) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg overflow-hidden z-50">
              {isLoading ? (
                <div className="px-4 py-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
                  검색 중...
                </div>
              ) : results.length > 0 ? (
                results.map((player, i) => (
                  <button
                    key={player.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      navigateToPlayer(player);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      i === selectedIndex
                        ? "bg-blue-50 dark:bg-zinc-700"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                    }`}
                  >
                    {player.playerImage ? (
                      <img
                        src={player.playerImage}
                        alt={player.playerName}
                        loading="lazy"
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-600 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0">
                        {player.playerName[0]}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {player.teamLogo && (
                          <img
                            src={player.teamLogo}
                            alt={player.team}
                            loading="lazy"
                            className="w-4 h-4 object-contain shrink-0"
                          />
                        )}
                        <span className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                          {player.playerName}
                        </span>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                          {player.playerRealName}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 dark:text-zinc-500">
                        {player.team} · {player.position}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-zinc-400 dark:text-zinc-500">
                    검색 결과가 없습니다.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
