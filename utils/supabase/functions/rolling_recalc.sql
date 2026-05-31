-- ============================================
-- ROLLING 90-DAY WINDOW SYSTEM
-- recent = clicks in last 90 days from click_log
-- cumulative = all-time clicks, never changes
-- ============================================

-- GAMER SYSTEM: recalculate count_player_recent from click_log
CREATE OR REPLACE FUNCTION recalc_gamer_recent_counts()
RETURNS void AS $$
BEGIN
  UPDATE gamers_info g
  SET count_player_recent = (
    SELECT COUNT(*)
    FROM click_log c
    WHERE c.player_id = g.id
      AND c.click_type = 'player'
      AND c.clicked_at >= NOW() - INTERVAL '90 days'
  );
END;
$$ LANGUAGE plpgsql;

-- GAMER SYSTEM: recalculate count_items_recent from click_log
CREATE OR REPLACE FUNCTION recalc_gamer_items_recent()
RETURNS void AS $$
BEGIN
  UPDATE gamers_info g
  SET count_items_recent = (
    SELECT COUNT(*)
    FROM click_log c
    WHERE c.player_id = g.id
      AND c.click_type = 'equipment'
      AND c.clicked_at >= NOW() - INTERVAL '90 days'
  );
END;
$$ LANGUAGE plpgsql;

-- EQUIPMENT SYSTEM: recalculate count_items_recent from click_log
CREATE OR REPLACE FUNCTION recalc_equip_recent_counts()
RETURNS void AS $$
BEGIN
  UPDATE equipment_info e
  SET count_items_recent = (
    SELECT COUNT(*)
    FROM click_log c
    WHERE LOWER(c.equipment_name) = LOWER(e.key)
      AND c.click_type = 'equipment'
      AND c.clicked_at >= NOW() - INTERVAL '90 days'
  );
END;
$$ LANGUAGE plpgsql;

-- EQUIPMENT SYSTEM: recalculate count_items_cumulative from click_log (all-time)
CREATE OR REPLACE FUNCTION recalc_equip_cumulative_counts()
RETURNS void AS $$
BEGIN
  UPDATE equipment_info e
  SET count_items_cumulative = (
    SELECT COUNT(*)
    FROM click_log c
    WHERE LOWER(c.equipment_name) = LOWER(e.key)
      AND c.click_type = 'equipment'
  );
END;
$$ LANGUAGE plpgsql;

-- MASTER FUNCTION: run all + save previous rank + recalculate points/rankings
CREATE OR REPLACE FUNCTION recalc_all_recent_and_rankings()
RETURNS void AS $$
BEGIN
  -- Step 1: Recalculate recent counts from click_log (rolling 90 days)
  PERFORM recalc_gamer_recent_counts();
  PERFORM recalc_gamer_items_recent();
  PERFORM recalc_equip_recent_counts();
  PERFORM recalc_equip_cumulative_counts();

  -- Step 2: Save previous rankings BEFORE recalculating
  UPDATE gamers_info g
  SET previous_admin_power_ranking = g.admin_power_ranking;

  -- Step 3: Recalculate gamer points
  UPDATE gamers_info
  SET
    apoint = COALESCE(count_player_recent, 0) * 17.5,
    bpoint = COALESCE(count_player_cumulative, 0) * 5,
    cpoint = COALESCE(count_items_recent, 0) * 3.5,
    dpoint = COALESCE(count_items_cumulative, 0) * 1,
    total_weighted_points =
      (COALESCE(count_player_recent, 0) * 17.5) +
      (COALESCE(count_player_cumulative, 0) * 5) +
      (COALESCE(count_items_recent, 0) * 3.5) +
      (COALESCE(count_items_cumulative, 0) * 1);

  -- Step 4: Recalculate gamer rankings (per-game)
  WITH ranked AS (
    SELECT id,
      ROW_NUMBER() OVER (PARTITION BY game ORDER BY total_weighted_points DESC, id ASC) AS nr
    FROM gamers_info
  )
  UPDATE gamers_info g SET admin_power_ranking = r.nr FROM ranked r WHERE g.id = r.id;

  -- Step 5: Recalculate equipment points (now includes currently_used with weight_c=100)
  UPDATE equipment_info
  SET
    apoint = COALESCE(count_items_recent, 0) * 3,
    bpoint = COALESCE(count_items_cumulative, 0) * 1,
    total_points = (COALESCE(count_items_recent, 0) * 3)
                 + (COALESCE(count_items_cumulative, 0) * 1)
                 + (COALESCE(currently_used, 0) * 100);

  -- Step 6: Recalculate equipment rankings (per-category)
  WITH ranked AS (
    SELECT id,
      ROW_NUMBER() OVER (PARTITION BY category ORDER BY total_points DESC, id ASC) AS nr
    FROM equipment_info
  )
  UPDATE equipment_info e SET popularity_rank = r.nr FROM ranked r WHERE e.id = r.id;
END;
$$ LANGUAGE plpgsql;
