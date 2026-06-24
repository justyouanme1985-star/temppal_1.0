-- Ensure gamers_info.last_clicked exists for click throttling in /api/players/[id]/click
-- Run once in Supabase SQL Editor (safe to re-run).

ALTER TABLE public.gamers_info
  ADD COLUMN IF NOT EXISTS last_clicked TIMESTAMPTZ;

SELECT 'gamers_info.last_clicked ensured ✅' AS status;
