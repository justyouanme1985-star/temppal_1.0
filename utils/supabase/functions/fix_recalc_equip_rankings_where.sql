-- Patch: Supabase safe-update mode rejects UPDATE without WHERE.
-- Run this in Supabase SQL Editor if recalc_all_equip_rankings fails with
-- "UPDATE requires a WHERE clause".

CREATE OR REPLACE FUNCTION recalc_equip_currently_used()
RETURNS void AS $$
DECLARE
  eq_rec RECORD;
  cnt INTEGER;
BEGIN
  FOR eq_rec IN SELECT id, key FROM equipment_info LOOP
    SELECT COUNT(*) INTO cnt
    FROM (
      SELECT g.id
      FROM gamers_info g
      WHERE LOWER(g.mouse) = LOWER(eq_rec.key)
         OR LOWER(g.keyboard) = LOWER(eq_rec.key)
         OR LOWER(g.headset) = LOWER(eq_rec.key)
         OR LOWER(g.monitor) = LOWER(eq_rec.key)
         OR LOWER(g.mousepad) = LOWER(eq_rec.key)
         OR LOWER(g.chair) = LOWER(eq_rec.key)
         OR LOWER(g.desk) = LOWER(eq_rec.key)
    ) matched;

    UPDATE equipment_info
    SET currently_used = cnt
    WHERE id = eq_rec.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION recalc_all_equip_rankings()
RETURNS void AS $$
BEGIN
  PERFORM recalc_equip_currently_used();

  UPDATE equipment_info
  SET
    apoint = COALESCE(count_items_recent, 0) * 3,
    bpoint = COALESCE(count_items_cumulative, 0) * 1,
    total_points = (COALESCE(count_items_recent, 0) * 3)
                 + (COALESCE(count_items_cumulative, 0) * 1)
                 + (COALESCE(currently_used, 0) * 100)
  WHERE id IS NOT NULL;

  WITH ranked AS (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY category ORDER BY total_points DESC, id ASC) AS nr
    FROM equipment_info
  )
  UPDATE equipment_info e
  SET popularity_rank = r.nr
  FROM ranked r
  WHERE e.id = r.id;
END;
$$ LANGUAGE plpgsql;
