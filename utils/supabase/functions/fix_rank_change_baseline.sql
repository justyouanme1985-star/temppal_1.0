-- Reset rank-change baseline and repair total_weighted_points for all players.
-- Run in Supabase SQL Editor AFTER deploying the click-route ranking fix, or
-- use: node scripts/repair-rankings.mjs
--
-- Also re-applies the canonical log_click (correct 17.5/5/3.5/1 formula + snapshot).

-- 1) Fix all weighted points with the canonical formula
UPDATE gamers_info
SET total_weighted_points =
  (COALESCE(count_player_recent, 0) * 17.5) +
  (COALESCE(count_player_cumulative, 0) * 5) +
  (COALESCE(count_items_recent, 0) * 3.5) +
  (COALESCE(count_items_cumulative, 0) * 1);

-- 2) Snapshot current displayed ranks before reordering
UPDATE gamers_info
SET previous_admin_power_ranking = COALESCE(admin_power_ranking, 0);

-- 3) Recalculate per-game admin_power_ranking from corrected points
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (
      PARTITION BY game
      ORDER BY total_weighted_points DESC, id ASC
    ) AS nr
  FROM gamers_info
)
UPDATE gamers_info g
SET admin_power_ranking = r.nr
FROM ranked r
WHERE g.id = r.id;

-- 4) Then run utils/supabase/functions/fix_click_log.sql in the same SQL Editor session
--    so future RPC clicks also use the canonical formula + snapshot.

-- 5) Quick sanity check
SELECT game,
  COUNT(*) FILTER (WHERE previous_admin_power_ranking > admin_power_ranking) AS rank_up,
  COUNT(*) FILTER (WHERE previous_admin_power_ranking < admin_power_ranking) AS rank_down,
  COUNT(*) FILTER (WHERE previous_admin_power_ranking = admin_power_ranking) AS unchanged
FROM gamers_info
GROUP BY game
ORDER BY game;
