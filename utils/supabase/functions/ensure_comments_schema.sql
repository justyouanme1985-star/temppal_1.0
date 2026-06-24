-- Ensure comments table has all columns required by the API.
-- Run once in Supabase SQL Editor if comments return server errors.

ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS secret_key TEXT;

ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS deleted BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.comments
  DROP CONSTRAINT IF EXISTS comments_target_type_check;

ALTER TABLE public.comments
  ADD CONSTRAINT comments_target_type_check
  CHECK (target_type IN ('player', 'equipment', 'community'));

SELECT 'comments schema ensured ✅' AS status;
