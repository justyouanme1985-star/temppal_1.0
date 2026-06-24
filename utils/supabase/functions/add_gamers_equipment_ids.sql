-- Link gamers_info equipment to equipment_info.id for reliable matching.
-- Run once in Supabase SQL Editor, then: node scripts/sync_equipment_ids.mjs --execute

ALTER TABLE public.gamers_info
  ADD COLUMN IF NOT EXISTS mouse_id INTEGER,
  ADD COLUMN IF NOT EXISTS keyboard_id INTEGER,
  ADD COLUMN IF NOT EXISTS headset_id INTEGER,
  ADD COLUMN IF NOT EXISTS monitor_id INTEGER,
  ADD COLUMN IF NOT EXISTS mousepad_id INTEGER,
  ADD COLUMN IF NOT EXISTS chair_id INTEGER,
  ADD COLUMN IF NOT EXISTS desk_id INTEGER;

COMMENT ON COLUMN public.gamers_info.mouse_id IS 'FK equipment_info.id (mouse)';
COMMENT ON COLUMN public.gamers_info.keyboard_id IS 'FK equipment_info.id (keyboard)';
COMMENT ON COLUMN public.gamers_info.headset_id IS 'FK equipment_info.id (headset)';
COMMENT ON COLUMN public.gamers_info.monitor_id IS 'FK equipment_info.id (monitor)';
COMMENT ON COLUMN public.gamers_info.mousepad_id IS 'FK equipment_info.id (mousepad)';
COMMENT ON COLUMN public.gamers_info.chair_id IS 'FK equipment_info.id (chair)';
COMMENT ON COLUMN public.gamers_info.desk_id IS 'FK equipment_info.id (desk)';
