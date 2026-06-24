-- Fix rank-change display: log_click must snapshot previous_admin_power_ranking
-- BEFORE recalculating admin_power_ranking for the game.
--
-- Without this, players who move up show ↑ but players pushed down never get
-- previous_admin_power_ranking updated, so rankChange stays 0 and ↓ is hidden.
--
-- Run once in Supabase SQL Editor (re-applies log_click only).

CREATE OR REPLACE FUNCTION log_click(
  p_player_id INTEGER,
  p_click_type TEXT,
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
  SELECT ign INTO v_player_ign FROM gamers_info WHERE id = p_player_id;

  IF p_equipment_name IS NOT NULL THEN
    SELECT category INTO v_equip_category FROM equipment_info WHERE LOWER("key") = LOWER(p_equipment_name);
  END IF;

  INSERT INTO click_log (item_type, item_id, equipment_name, equipment_category, player_ign, clicked_at)
  VALUES (p_click_type, p_player_id, p_equipment_name, v_equip_category, v_player_ign, v_now);

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

  UPDATE gamers_info
  SET total_weighted_points =
      (COALESCE(count_player_recent, 0) * 17.5) +
      (COALESCE(count_player_cumulative, 0) * 5) +
      (COALESCE(count_items_recent, 0) * 3.5) +
      (COALESCE(count_items_cumulative, 0) * 1)
  WHERE id = p_player_id;

  -- Save previous ranks for the whole game, then recalculate (enables both ↑ and ↓).
  UPDATE gamers_info
  SET previous_admin_power_ranking = COALESCE(admin_power_ranking, 0)
  WHERE game = (SELECT game FROM gamers_info WHERE id = p_player_id);

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

  UPDATE gamers_info
  SET last_clicked = v_now
  WHERE id = p_player_id;

  RETURN v_result;
END;
$$;

SELECT 'log_click rank snapshot fix applied ✅' AS status;
