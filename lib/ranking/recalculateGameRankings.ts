import type { SupabaseClient } from "@supabase/supabase-js";

type GamerCounts = {
  id: number;
  admin_power_ranking: number | null;
  count_player_recent: number | null;
  count_player_cumulative: number | null;
  count_items_recent: number | null;
  count_items_cumulative: number | null;
};

/** Canonical weighted score used for admin_power_ranking (matches fix_click_log.sql). */
export function computeTotalWeightedPoints(
  row: Pick<
    GamerCounts,
    | "count_player_recent"
    | "count_player_cumulative"
    | "count_items_recent"
    | "count_items_cumulative"
  >,
): number {
  return (
    (row.count_player_recent ?? 0) * 17.5 +
    (row.count_player_cumulative ?? 0) * 5 +
    (row.count_items_recent ?? 0) * 3.5 +
    (row.count_items_cumulative ?? 0) * 1
  );
}

/**
 * Snapshot previous ranks, recompute weighted points, and reorder admin_power_ranking
 * for every player in the same game as `playerId`.
 *
 * Used after log_click because production RPC may still use an outdated formula and
 * skip rank snapshots.
 */
export async function recalculateGameRankings(
  supabase: SupabaseClient,
  playerId: number,
): Promise<void> {
  const { data: trigger, error: triggerError } = await supabase
    .from("gamers_info")
    .select("game")
    .eq("id", playerId)
    .single();

  if (triggerError || !trigger?.game) return;

  const { data: rows, error } = await supabase
    .from("gamers_info")
    .select(
      "id, admin_power_ranking, count_player_recent, count_player_cumulative, count_items_recent, count_items_cumulative",
    )
    .eq("game", trigger.game);

  if (error || !rows?.length) return;

  const ranked = (rows as GamerCounts[])
    .map((row) => ({
      id: row.id,
      total_weighted_points: computeTotalWeightedPoints(row),
      previous_admin_power_ranking: row.admin_power_ranking ?? 0,
    }))
    .sort((a, b) => {
      if (b.total_weighted_points !== a.total_weighted_points) {
        return b.total_weighted_points - a.total_weighted_points;
      }
      return a.id - b.id;
    });

  await Promise.all(
    ranked.map((row, index) =>
      supabase
        .from("gamers_info")
        .update({
          total_weighted_points: row.total_weighted_points,
          previous_admin_power_ranking: row.previous_admin_power_ranking,
          admin_power_ranking: index + 1,
        })
        .eq("id", row.id),
    ),
  );
}

/** Repair every game at once (one-time / script use). */
export async function recalculateAllGameRankings(
  supabase: SupabaseClient,
): Promise<{ games: number; players: number }> {
  const { data: rows, error } = await supabase
    .from("gamers_info")
    .select(
      "id, game, admin_power_ranking, count_player_recent, count_player_cumulative, count_items_recent, count_items_cumulative",
    );

  if (error || !rows?.length) return { games: 0, players: 0 };

  type Row = GamerCounts & { game: string };
  const byGame = new Map<string, Row[]>();
  for (const row of rows as Row[]) {
    if (!row.game) continue;
    if (!byGame.has(row.game)) byGame.set(row.game, []);
    byGame.get(row.game)!.push(row);
  }

  let players = 0;
  for (const [, gameRows] of byGame) {
    const ranked = gameRows
      .map((row) => ({
        id: row.id,
        total_weighted_points: computeTotalWeightedPoints(row),
        previous_admin_power_ranking: row.admin_power_ranking ?? 0,
      }))
      .sort((a, b) => {
        if (b.total_weighted_points !== a.total_weighted_points) {
          return b.total_weighted_points - a.total_weighted_points;
        }
        return a.id - b.id;
      });

    await Promise.all(
      ranked.map((row, index) =>
        supabase
          .from("gamers_info")
          .update({
            total_weighted_points: row.total_weighted_points,
            previous_admin_power_ranking: row.previous_admin_power_ranking,
            admin_power_ranking: index + 1,
          })
          .eq("id", row.id),
      ),
    );
    players += ranked.length;
  }

  return { games: byGame.size, players };
}
