-- ============================================================
-- SIMPLE CLICK LOG FIX
-- Matches YOUR actual click_log schema:
--   item_type, item_id, clicked_at, equipment_name, ...
-- Paste this ENTIRE file into Supabase SQL Editor and run it
-- ============================================================

-- Clean up dead functions from failed attempts
DROP FUNCTION IF EXISTS log_click(INTEGER, TEXT, TEXT, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS log_equipment_only(TEXT) CASCADE;
DROP FUNCTION IF EXISTS log_player_click(INTEGER, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS log_player_click(INTEGER, TEXT, TEXT, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS log_equipment_click(TEXT) CASCADE;

-- 1. Unified click logger — handles player clicks & equipment clicks on a player page
CREATE OR REPLACE FUNCTION log_click(
  p_player_id INTEGER,
  p_click_type TEXT,           -- 'player' | 'equipment'
  p_equipment_name TEXT DEFAULT NULL,
  p_existing_cumulative INTEGER DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_now TIMESTAMPTZ := timezone('Asia/Seoul', NOW());
  v_recent INTEGER;
  v_cumulative INTEGER;
  v_final_cum INTEGER;
  v_result JSONB;
  v_player_ign TEXT;
  v_equip_category TEXT;
BEGIN
  -- Look up player IGN
  SELECT ign INTO v_player_ign FROM gamers_info WHERE id = p_player_id;

  -- Look up equipment category if equipment_name provided
  IF p_equipment_name IS NOT NULL THEN
    SELECT category INTO v_equip_category FROM equipment_info WHERE LOWER("key") = LOWER(p_equipment_name);
  END IF;

  -- Insert into click_log with ign + category filled in
  INSERT INTO click_log (item_type, item_id, equipment_name, equipment_category, player_ign, clicked_at)
  VALUES (p_click_type, p_player_id, p_equipment_name, v_equip_category, v_player_ign, v_now);

  -- PLAYER click → update count_player_*
  IF p_click_type = 'player' THEN
    SELECT COUNT(*) FILTER (WHERE clicked_at >= v_now - INTERVAL '90 days'),
           COUNT(*)
    INTO v_recent, v_cumulative
    FROM click_log
    WHERE item_id = p_player_id AND item_type = 'player';

    v_final_cum := GREATEST(v_cumulative, COALESCE(p_existing_cumulative, 0));

    UPDATE gamers_info
    SET count_player_recent = v_recent,
        count_player_cumulative = v_final_cum
    WHERE id = p_player_id;

    -- Upsert click_stats for player
    INSERT INTO click_stats (item_type, item_id, total_clicks, recent_clicks, last_clicked, updated_at, player_ign)
    VALUES ('player', p_player_id, v_cumulative, v_recent, v_now, v_now, v_player_ign)
    ON CONFLICT (item_type, item_id)
    DO UPDATE SET
      total_clicks = EXCLUDED.total_clicks,
      recent_clicks = EXCLUDED.recent_clicks,
      last_clicked = EXCLUDED.last_clicked,
      updated_at = EXCLUDED.updated_at,
      player_ign = EXCLUDED.player_ign;

    v_result := jsonb_build_object(
      'click_logged', true,
      'count_player_recent', v_recent,
      'count_player_cumulative', v_final_cum
    );

  -- EQUIPMENT click → update count_items_* on player + equipment_info
  ELSIF p_click_type = 'equipment' THEN
    SELECT COUNT(*) FILTER (WHERE clicked_at >= v_now - INTERVAL '90 days'),
           COUNT(*)
    INTO v_recent, v_cumulative
    FROM click_log
    WHERE item_id = p_player_id AND item_type = 'equipment';

    v_final_cum := GREATEST(v_cumulative, COALESCE(p_existing_cumulative, 0));

    UPDATE gamers_info
    SET count_items_recent = v_recent,
        count_items_cumulative = v_final_cum
    WHERE id = p_player_id;

    -- Also bump equipment popularity + points (recent*3 + cumulative*1)
    IF p_equipment_name IS NOT NULL THEN
      UPDATE equipment_info
      SET count_items_recent = (
            SELECT COUNT(*) FROM click_log
            WHERE LOWER(equipment_name) = LOWER(p_equipment_name)
              AND item_type = 'equipment'
              AND clicked_at >= v_now - INTERVAL '90 days'),
          count_items_cumulative = (
            SELECT COUNT(*) FROM click_log
            WHERE LOWER(equipment_name) = LOWER(p_equipment_name)
              AND item_type = 'equipment'),
          apoint = (
            SELECT COUNT(*) FROM click_log
            WHERE LOWER(equipment_name) = LOWER(p_equipment_name)
              AND item_type = 'equipment'
              AND clicked_at >= v_now - INTERVAL '90 days') * 3,
          bpoint = (
            SELECT COUNT(*) FROM click_log
            WHERE LOWER(equipment_name) = LOWER(p_equipment_name)
              AND item_type = 'equipment'),
          total_points = (
            (SELECT COUNT(*) FROM click_log
             WHERE LOWER(equipment_name) = LOWER(p_equipment_name)
               AND item_type = 'equipment'
               AND clicked_at >= v_now - INTERVAL '90 days') * 3
            +
            (SELECT COUNT(*) FROM click_log
             WHERE LOWER(equipment_name) = LOWER(p_equipment_name)
               AND item_type = 'equipment')
          )
      WHERE LOWER("key") = LOWER(p_equipment_name);
    END IF;

    -- Upsert click_stats for equipment click on this player
    INSERT INTO click_stats (item_type, item_id, total_clicks, recent_clicks, last_clicked, updated_at, player_ign, equipment_key, equipment_category)
    VALUES ('equipment', p_player_id, v_cumulative, v_recent, v_now, v_now, v_player_ign, p_equipment_name, v_equip_category)
    ON CONFLICT (item_type, item_id)
    DO UPDATE SET
      total_clicks = EXCLUDED.total_clicks,
      recent_clicks = EXCLUDED.recent_clicks,
      last_clicked = EXCLUDED.last_clicked,
      updated_at = EXCLUDED.updated_at,
      player_ign = EXCLUDED.player_ign,
      equipment_key = EXCLUDED.equipment_key,
      equipment_category = EXCLUDED.equipment_category;

    v_result := jsonb_build_object(
      'click_logged', true,
      'count_items_recent', v_recent,
      'count_items_cumulative', v_final_cum
    );
  END IF;

  -- Recalculate total_weighted_points for this player
  UPDATE gamers_info
  SET total_weighted_points =
      (COALESCE(count_player_recent, 0) * 17.5) +
      (COALESCE(count_player_cumulative, 0) * 5) +
      (COALESCE(count_items_recent, 0) * 3.5) +
      (COALESCE(count_items_cumulative, 0) * 1)
  WHERE id = p_player_id;

  -- Snapshot current ranks before recalculating so rank-change arrows (↑/↓) stay balanced.
  UPDATE gamers_info
  SET previous_admin_power_ranking = COALESCE(admin_power_ranking, 0)
  WHERE game = (SELECT game FROM gamers_info WHERE id = p_player_id);

  -- Recalculate admin_power_ranking for this player's game
  WITH ranked AS (
    SELECT id,
      ROW_NUMBER() OVER (
        PARTITION BY game
        ORDER BY total_weighted_points DESC, id ASC
      ) AS nr
    FROM gamers_info
    WHERE game = (SELECT game FROM gamers_info WHERE id = p_player_id)
  )
  UPDATE gamers_info g
  SET admin_power_ranking = r.nr
  FROM ranked r
  WHERE g.id = r.id;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION log_click(INTEGER, TEXT, TEXT, INTEGER) TO service_role;

-- 2. Stand-alone function for generic equipment clicks (no player)
--    item_id = 0 means "no specific player / generic view"
CREATE OR REPLACE FUNCTION log_equipment_only(
  p_equipment_name TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_now TIMESTAMPTZ := timezone('Asia/Seoul', NOW());
  v_equip_category TEXT;
BEGIN
  -- Look up equipment category
  SELECT category INTO v_equip_category FROM equipment_info WHERE LOWER("key") = LOWER(p_equipment_name);

  INSERT INTO click_log (item_type, item_id, equipment_name, equipment_category, player_ign, clicked_at)
  VALUES ('equipment', 0, p_equipment_name, v_equip_category, NULL, v_now);

  UPDATE equipment_info
  SET count_items_recent = (
        SELECT COUNT(*) FROM click_log
        WHERE LOWER(equipment_name) = LOWER(p_equipment_name)
          AND item_type = 'equipment'
          AND clicked_at >= v_now - INTERVAL '90 days'),
      count_items_cumulative = (
        SELECT COUNT(*) FROM click_log
        WHERE LOWER(equipment_name) = LOWER(p_equipment_name)
          AND item_type = 'equipment'),
      apoint = (
        SELECT COUNT(*) FROM click_log
        WHERE LOWER(equipment_name) = LOWER(p_equipment_name)
          AND item_type = 'equipment'
          AND clicked_at >= v_now - INTERVAL '90 days') * 3,
      bpoint = (
        SELECT COUNT(*) FROM click_log
        WHERE LOWER(equipment_name) = LOWER(p_equipment_name)
          AND item_type = 'equipment'),
      total_points = (
        (SELECT COUNT(*) FROM click_log
         WHERE LOWER(equipment_name) = LOWER(p_equipment_name)
           AND item_type = 'equipment'
           AND clicked_at >= v_now - INTERVAL '90 days') * 3
        +
        (SELECT COUNT(*) FROM click_log
         WHERE LOWER(equipment_name) = LOWER(p_equipment_name)
           AND item_type = 'equipment')
      )
  WHERE LOWER("key") = LOWER(p_equipment_name);

  -- Upsert click_stats for generic equipment view
  INSERT INTO click_stats (item_type, item_id, total_clicks, recent_clicks, last_clicked, updated_at, equipment_key, equipment_category)
  VALUES ('equipment', 0,
    (SELECT COUNT(*) FROM click_log WHERE LOWER(equipment_name) = LOWER(p_equipment_name) AND item_type = 'equipment'),
    (SELECT COUNT(*) FROM click_log WHERE LOWER(equipment_name) = LOWER(p_equipment_name) AND item_type = 'equipment' AND clicked_at >= v_now - INTERVAL '90 days'),
    v_now, v_now, p_equipment_name, v_equip_category)
  ON CONFLICT (item_type, item_id)
  DO UPDATE SET
    total_clicks = EXCLUDED.total_clicks,
    recent_clicks = EXCLUDED.recent_clicks,
    last_clicked = EXCLUDED.last_clicked,
    updated_at = EXCLUDED.updated_at,
    equipment_key = EXCLUDED.equipment_key,
    equipment_category = EXCLUDED.equipment_category;

  RETURN jsonb_build_object('click_logged', true);
END;
$$;

GRANT EXECUTE ON FUNCTION log_equipment_only(TEXT) TO service_role;

-- 3. Add reference columns to click_stats if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='click_stats' AND column_name='player_ign') THEN
    ALTER TABLE click_stats ADD COLUMN player_ign TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='click_stats' AND column_name='equipment_category') THEN
    ALTER TABLE click_stats ADD COLUMN equipment_category TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='click_stats' AND column_name='equipment_key') THEN
    ALTER TABLE click_stats ADD COLUMN equipment_key TEXT;
  END IF;
END $$;

-- 4. Fix update_weighted_rankings() to save previous rank FIRST
DROP FUNCTION IF EXISTS update_weighted_rankings() CASCADE;

CREATE OR REPLACE FUNCTION update_weighted_rankings()
RETURNS void AS $$
BEGIN
  -- Save current ranking as previous BEFORE recalculating
  UPDATE gamers_info
  SET previous_admin_power_ranking = COALESCE(admin_power_ranking, 0);

  -- Recalculate per-game rankings by total_weighted_points
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
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION update_weighted_rankings() TO service_role;

-- Refresh cache
NOTIFY pgrst, 'reload schema';

SELECT 'log_click function created ✅' AS status;
SELECT 'log_equipment_only function created ✅' AS status;
SELECT 'click_stats columns added ✅' AS status;
SELECT 'update_weighted_rankings fixed ✅' AS status;
