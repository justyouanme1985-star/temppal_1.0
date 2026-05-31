-- ============================================
-- ADD currently_used COLUMN + TRIGGER
-- Tracks how many gamers_info rows reference
-- each equipment key in any equipment field.
-- ============================================

-- Step 1: Add the column
ALTER TABLE public.equipment_info
ADD COLUMN IF NOT EXISTS currently_used INTEGER DEFAULT 0;

-- Step 2: Function to recalculate currently_used for ALL equipment
CREATE OR REPLACE FUNCTION recalc_all_currently_used()
RETURNS void AS $$
DECLARE
  eq_record RECORD;
  cnt INTEGER;
BEGIN
  FOR eq_record IN SELECT id, key FROM equipment_info LOOP
    WITH player_equip AS (
      SELECT unnest(ARRAY[
        LOWER(mouse), LOWER(keyboard), LOWER(headset),
        LOWER(monitor), LOWER(mousepad), LOWER(chair), LOWER(desk),
        LOWER(previous_mouse), LOWER(previous_keyboard), LOWER(previous_mousepad)
      ]) AS equip_name
      FROM gamers_info
    )
    SELECT COUNT(DISTINCT equip_name) INTO cnt
    FROM player_equip
    WHERE equip_name IS NOT NULL
      AND (
        equip_name = LOWER(eq_record.key)
        OR equip_name LIKE '%' || LOWER(eq_record.key) || '%'
        OR LOWER(eq_record.key) LIKE '%' || equip_name || '%'
      );

    UPDATE equipment_info
    SET currently_used = cnt
    WHERE id = eq_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Trigger function to update currently_used when gamers_info is modified
CREATE OR REPLACE FUNCTION update_currently_used_on_gamer_change()
RETURNS TRIGGER AS $$
DECLARE
  changed_equip_names TEXT[];
  eq_name TEXT;
BEGIN
  -- Collect all equipment names from NEW and OLD
  changed_equip_names := ARRAY[
    NEW.mouse, OLD.mouse,
    NEW.keyboard, OLD.keyboard,
    NEW.headset, OLD.headset,
    NEW.monitor, OLD.monitor,
    NEW.mousepad, OLD.mousepad,
    NEW.chair, OLD.chair,
    NEW.desk, OLD.desk,
    NEW.previous_mouse, OLD.previous_mouse,
    NEW.previous_keyboard, OLD.previous_keyboard,
    NEW.previous_mousepad, OLD.previous_mousepad
  ];

  -- For each unique non-null equipment name, recalc count
  FOR eq_name IN SELECT DISTINCT unnest(changed_equip_names) WHERE unnest IS NOT NULL LOOP
    UPDATE equipment_info ei
    SET currently_used = (
      SELECT COUNT(DISTINCT LOWER(pe.equip_name))
      FROM (
        SELECT unnest(ARRAY[
          LOWER(g.mouse), LOWER(g.keyboard), LOWER(g.headset),
          LOWER(g.monitor), LOWER(g.mousepad), LOWER(g.chair), LOWER(g.desk),
          LOWER(g.previous_mouse), LOWER(g.previous_keyboard), LOWER(g.previous_mousepad)
        ]) AS equip_name
        FROM gamers_info g
      ) pe
      WHERE pe.equip_name IS NOT NULL
        AND (
          pe.equip_name = LOWER(ei.key)
          OR pe.equip_name LIKE '%' || LOWER(ei.key) || '%'
          OR LOWER(ei.key) LIKE '%' || pe.equip_name || '%'
        )
    )
    WHERE LOWER(ei.key) = LOWER(eq_name)
       OR LOWER(ei.key) LIKE '%' || LOWER(eq_name) || '%'
       OR LOWER(eq_name) LIKE '%' || LOWER(ei.key) || '%';
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create trigger on gamers_info
DROP TRIGGER IF EXISTS gamer_equip_change_trigger ON public.gamers_info;
CREATE TRIGGER gamer_equip_change_trigger
AFTER INSERT OR UPDATE OF
  mouse, keyboard, headset, monitor, mousepad, chair, desk,
  previous_mouse, previous_keyboard, previous_mousepad
ON public.gamers_info
FOR EACH ROW
EXECUTE FUNCTION update_currently_used_on_gamer_change();

-- Step 5: Update weight_c in admin_power_ranking for equipment system
UPDATE admin_power_ranking
SET weight_c = 100
WHERE system = 'equipment';

-- Step 6: Now recalculate all equipment rankings to factor in currently_used
-- Equipment ranking = (count_items_recent * weight_a) + (count_items_cumulative * weight_b) + (currently_used * weight_c)
-- where weight_a=3, weight_b=1, weight_c=100
CREATE OR REPLACE FUNCTION recalc_all_equip_rankings()
RETURNS void AS $$
BEGIN
  -- Recalculate points with currently_used factor
  UPDATE equipment_info
  SET
    apoint = COALESCE(count_items_recent, 0) * 3,
    bpoint = COALESCE(count_items_cumulative, 0) * 1,
    total_points = (COALESCE(count_items_recent, 0) * 3)
                 + (COALESCE(count_items_cumulative, 0) * 1)
                 + (COALESCE(currently_used, 0) * 100);

  -- Recalculate rankings per category
  WITH ranked AS (
    SELECT id,
      ROW_NUMBER() OVER (PARTITION BY category ORDER BY total_points DESC, id ASC) AS nr
    FROM equipment_info
  )
  UPDATE equipment_info e SET popularity_rank = r.nr FROM ranked r WHERE e.id = r.id;
END;
$$ LANGUAGE plpgsql;
