/**
 * One-time repair: fix total_weighted_points (17.5/5/3.5/1), snapshot previous
 * ranks, and recalculate admin_power_ranking for every game.
 *
 * Usage: node scripts/repair-rankings.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
  process.env.SUPABASE_SERVICE_KEY?.trim() ||
  process.env.SUPABASE_SECRET_KEY?.trim();

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or service role key");
  process.exit(1);
}

function computeTotalWeightedPoints(row) {
  return (
    (row.count_player_recent ?? 0) * 17.5 +
    (row.count_player_cumulative ?? 0) * 5 +
    (row.count_items_recent ?? 0) * 3.5 +
    (row.count_items_cumulative ?? 0) * 1
  );
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  const { data: rows, error } = await supabase
    .from("gamers_info")
    .select(
      "id, game, ign, admin_power_ranking, previous_admin_power_ranking, count_player_recent, count_player_cumulative, count_items_recent, count_items_cumulative, total_weighted_points",
    );

  if (error) throw error;

  const byGame = new Map();
  for (const row of rows) {
    if (!row.game) continue;
    if (!byGame.has(row.game)) byGame.set(row.game, []);
    byGame.get(row.game).push(row);
  }

  let fixedPoints = 0;
  let players = 0;

  for (const [game, gameRows] of byGame) {
    const ranked = gameRows
      .map((row) => {
        const twp = computeTotalWeightedPoints(row);
        if (Math.abs(twp - (row.total_weighted_points ?? 0)) > 0.01) fixedPoints++;
        return {
          id: row.id,
          ign: row.ign,
          twp,
          previous: row.admin_power_ranking ?? 0,
        };
      })
      .sort((a, b) => b.twp - a.twp || a.id - b.id);

    for (let i = 0; i < ranked.length; i++) {
      const row = ranked[i];
      const { error: updateError } = await supabase
        .from("gamers_info")
        .update({
          total_weighted_points: row.twp,
          previous_admin_power_ranking: row.previous,
          admin_power_ranking: i + 1,
        })
        .eq("id", row.id);
      if (updateError) throw updateError;
      players++;
    }

    const ups = ranked.filter((r, i) => r.previous > 0 && r.previous - (i + 1) > 0).length;
    const downs = ranked.filter((r, i) => r.previous > 0 && r.previous - (i + 1) < 0).length;
    console.log(`${game}: ${ranked.length} players, ${ups} up / ${downs} down indicators`);
  }

  console.log(`\nRepaired ${players} players across ${byGame.size} games (${fixedPoints} point totals corrected).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
