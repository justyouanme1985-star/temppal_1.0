-- Equipment Ranking System for Temppal
-- apoint: count_items_recent * 3 points
-- bpoint: count_items_cumulative * 1 point
-- Rankings are per-category (7 categories → 7 rank #1s)

-- Step 1: Drop existing triggers/functions FIRST (before altering columns)
DROP TRIGGER IF EXISTS equip_points_trigger ON public.equipment_info;
DROP TRIGGER IF EXISTS equip_ranking_trigger ON public.equipment_info;
DROP TRIGGER IF EXISTS equip_click_log_trigger ON public.click_log;
DROP FUNCTION IF EXISTS calculate_equip_points() CASCADE;
DROP FUNCTION IF EXISTS update_equip_rankings() CASCADE;
DROP FUNCTION IF EXISTS on_equip_click_log_insert() CASCADE;
DROP FUNCTION IF EXISTS reset_equip_recent_counts() CASCADE;
DROP FUNCTION IF EXISTS recalc_all_equip_rankings() CASCADE;

-- Step 2: NOW safe to convert count columns from TEXT to INTEGER and add point/ranking columns
ALTER TABLE public.equipment_info 
  ALTER COLUMN count_items_recent TYPE INTEGER USING COALESCE(count_items_recent::integer, 0),
  ALTER COLUMN count_items_cumulative TYPE INTEGER USING COALESCE(count_items_cumulative::integer, 0);

ALTER TABLE public.equipment_info 
ADD COLUMN IF NOT EXISTS apoint NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS bpoint NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_points NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS popularity_rank INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_recent_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS currently_used INTEGER DEFAULT 0;

-- Step 3: Populate currently_used from gamers_info (fuzzy match)
DO $$
DECLARE
  eq_rec RECORD;
  cnt INTEGER;
BEGIN
  FOR eq_rec IN SELECT id, key FROM equipment_info LOOP
    WITH player_equip AS (
      SELECT DISTINCT LOWER(unnest(ARRAY[
        g.mouse, g.keyboard, g.headset, g.monitor, g.mousepad, g.chair, g.desk,
        g.previous_mouse, g.previous_keyboard, g.previous_mousepad
      ])) AS equip_name
      FROM gamers_info g
      WHERE g.mouse IS NOT NULL OR g.keyboard IS NOT NULL OR g.headset IS NOT NULL
         OR g.monitor IS NOT NULL OR g.mousepad IS NOT NULL OR g.chair IS NOT NULL
         OR g.desk IS NOT NULL
    )
    SELECT COUNT(*) INTO cnt
    FROM player_equip
    WHERE equip_name IS NOT NULL
      AND (
        equip_name = LOWER(eq_rec.key)
        OR equip_name LIKE '%' || LOWER(eq_rec.key) || '%'
        OR LOWER(eq_rec.key) LIKE '%' || equip_name || '%'
      );

    UPDATE equipment_info
    SET currently_used = cnt
    WHERE id = eq_rec.id;
  END LOOP;
END;
$$;

-- Step 4: Count from click_log when a new equipment click is logged
CREATE OR REPLACE FUNCTION on_equip_click_log_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.click_type = 'equipment' AND NEW.equipment_name IS NOT NULL THEN
    -- Try to find matching equipment_info row
    UPDATE equipment_info 
    SET 
      count_items_recent = COALESCE(count_items_recent, 0) + 1,
      count_items_cumulative = COALESCE(count_items_cumulative, 0) + 1
    WHERE LOWER("key") = LOWER(NEW.equipment_name);
    
    -- If no exact match, try partial match
    IF NOT FOUND THEN
      UPDATE equipment_info 
      SET 
        count_items_recent = COALESCE(count_items_recent, 0) + 1,
        count_items_cumulative = COALESCE(count_items_cumulative, 0) + 1
      WHERE LOWER("key") LIKE '%' || LOWER(NEW.equipment_name) || '%'
         OR LOWER(NEW.equipment_name) LIKE '%' || LOWER("key") || '%';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER equip_click_log_trigger
AFTER INSERT ON public.click_log
FOR EACH ROW
EXECUTE FUNCTION on_equip_click_log_insert();

-- STEP 4-B: Calculate weighted points when count columns change
-- (also factors in currently_used with weight_c=100)
CREATE OR REPLACE FUNCTION calculate_equip_points()
RETURNS TRIGGER AS $$
BEGIN
  -- recent * 3 + cumulative * 1 + currently_used * 100
  NEW.apoint := COALESCE(NEW.count_items_recent, 0) * 3;
  NEW.bpoint := COALESCE(NEW.count_items_cumulative, 0) * 1;
  NEW.total_points := (COALESCE(NEW.count_items_recent, 0) * 3)
                    + (COALESCE(NEW.count_items_cumulative, 0) * 1)
                    + (COALESCE(NEW.currently_used, 0) * 100);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER equip_points_trigger
BEFORE INSERT OR UPDATE OF count_items_recent, count_items_cumulative 
ON public.equipment_info
FOR EACH ROW
EXECUTE FUNCTION calculate_equip_points();

-- Step 5: Update rankings per category
CREATE OR REPLACE FUNCTION update_equip_rankings()
RETURNS TRIGGER AS $$
BEGIN
  WITH ranked AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY category
        ORDER BY COALESCE(total_points, 0) DESC, id ASC
      ) AS new_rank
    FROM equipment_info
  )
  UPDATE equipment_info e
  SET popularity_rank = r.new_rank
  FROM ranked r
  WHERE e.id = r.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER equip_ranking_trigger
AFTER INSERT OR UPDATE OF total_points ON public.equipment_info
FOR EACH STATEMENT
EXECUTE FUNCTION update_equip_rankings();

-- Step 6: 90-day reset (clears recent only)
CREATE OR REPLACE FUNCTION reset_equip_recent_counts()
RETURNS void AS $$
BEGIN
  UPDATE equipment_info
  SET 
    count_items_recent = '0',
    last_recent_reset = NOW()
  WHERE 
    last_recent_reset < NOW() - INTERVAL '90 days'
    AND COALESCE(count_items_recent, 0) > 0;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Initial calculation for all equipment (now includes currently_used)
UPDATE equipment_info
SET 
  apoint = COALESCE(count_items_recent, 0) * 3,
  bpoint = COALESCE(count_items_cumulative, 0) * 1,
  total_points = (COALESCE(count_items_recent, 0) * 3)
               + (COALESCE(count_items_cumulative, 0) * 1)
               + (COALESCE(currently_used, 0) * 100);

-- Step 8: Update all rankings per category
WITH ranked AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY category
      ORDER BY COALESCE(total_points, 0) DESC, id ASC
    ) AS new_rank
  FROM equipment_info
)
UPDATE equipment_info e
SET popularity_rank = r.new_rank
FROM ranked r
WHERE e.id = r.id;

-- Step 9: Function to recalculate currently_used from gamers_info
CREATE OR REPLACE FUNCTION recalc_equip_currently_used()
RETURNS void AS $$
DECLARE
  eq_rec RECORD;
  cnt INTEGER;
BEGIN
  FOR eq_rec IN SELECT id, key FROM equipment_info LOOP
    WITH player_equip AS (
      SELECT DISTINCT LOWER(unnest(ARRAY[
        g.mouse, g.keyboard, g.headset, g.monitor, g.mousepad, g.chair, g.desk,
        g.previous_mouse, g.previous_keyboard, g.previous_mousepad
      ])) AS equip_name
      FROM gamers_info g
    )
    SELECT COUNT(*) INTO cnt
    FROM player_equip
    WHERE equip_name IS NOT NULL
      AND (
        equip_name = LOWER(eq_rec.key)
        OR equip_name LIKE '%' || LOWER(eq_rec.key) || '%'
        OR LOWER(eq_rec.key) LIKE '%' || equip_name || '%'
      );

    UPDATE equipment_info
    SET currently_used = cnt
    WHERE id = eq_rec.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Step 10: Recalculate points and rankings manually (also recalculates currently_used)
CREATE OR REPLACE FUNCTION recalc_all_equip_rankings()
RETURNS void AS $$
BEGIN
  -- Recalculate currently_used from gamers_info
  PERFORM recalc_equip_currently_used();

  -- Recalculate points
  UPDATE equipment_info
  SET 
    apoint = COALESCE(count_items_recent, 0) * 3,
    bpoint = COALESCE(count_items_cumulative, 0) * 1,
    total_points = (COALESCE(count_items_recent, 0) * 3)
                 + (COALESCE(count_items_cumulative, 0) * 1)
                 + (COALESCE(currently_used, 0) * 100);
  WITH ranked AS (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY category ORDER BY total_points DESC, id ASC) AS nr
    FROM equipment_info
  )
  UPDATE equipment_info e SET popularity_rank = r.nr FROM ranked r WHERE e.id = r.id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON COLUMN equipment_info.count_items_recent IS 'Recent 90-day clicks (INTEGER)';
COMMENT ON COLUMN equipment_info.count_items_cumulative IS 'All-time cumulative clicks (INTEGER)';
COMMENT ON COLUMN equipment_info.apoint IS 'count_items_recent * 3 (NUMERIC)';
COMMENT ON COLUMN equipment_info.bpoint IS 'count_items_cumulative * 1 (NUMERIC)';
COMMENT ON COLUMN equipment_info.total_points IS 'apoint + bpoint (NUMERIC)';
COMMENT ON COLUMN equipment_info.popularity_rank IS 'Rank per category (1=highest)';

-- Step 10: Verify - show top 3 per category
SELECT 
  category, popularity_rank, key, brand, model,
  count_items_recent as "Recent", count_items_cumulative as "Total",
  apoint as "A", bpoint as "B", total_points as "Points"
FROM equipment_info
WHERE popularity_rank <= 3
ORDER BY category, popularity_rank;
