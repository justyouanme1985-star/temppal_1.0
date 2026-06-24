-- ============================================================
-- MASTER SECURITY HARDENING — run once in Supabase SQL Editor
-- Order: (1) fix_click_log.sql  (2) this file
-- Safe to re-run (uses IF NOT EXISTS / DROP IF EXISTS).
-- ============================================================

-- 1) Schema prerequisites
ALTER TABLE public.gamers_info
  ADD COLUMN IF NOT EXISTS last_clicked TIMESTAMPTZ;

ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS secret_key TEXT;

ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS deleted BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.comments
  DROP CONSTRAINT IF EXISTS comments_target_type_check;

ALTER TABLE public.comments
  ADD CONSTRAINT comments_target_type_check
  CHECK (target_type IN ('player', 'equipment', 'community'));

-- 2) Block anon direct access to comments
DROP POLICY IF EXISTS "Anyone can read comments" ON public.comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON public.comments;

-- 3) Block anon direct access to community_posts (read + write)
DROP POLICY IF EXISTS "Anyone can read community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.community_posts;
DROP POLICY IF EXISTS "Public can read community_posts" ON public.community_posts;
DROP POLICY IF EXISTS "Anyone can insert community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Anyone can update community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Anyone can delete community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.community_posts;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.community_posts;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.community_posts;
DROP POLICY IF EXISTS "Public can insert community_posts" ON public.community_posts;
DROP POLICY IF EXISTS "Public can update community_posts" ON public.community_posts;
DROP POLICY IF EXISTS "Public can delete community_posts" ON public.community_posts;

-- 4) Revoke anon/authenticated RPC (must use Next.js API + service role)
REVOKE EXECUTE ON FUNCTION log_click(INTEGER, TEXT, TEXT, INTEGER) FROM anon;
REVOKE EXECUTE ON FUNCTION log_click(INTEGER, TEXT, TEXT, INTEGER) FROM authenticated;
REVOKE EXECUTE ON FUNCTION log_equipment_only(TEXT) FROM anon;
REVOKE EXECUTE ON FUNCTION log_equipment_only(TEXT) FROM authenticated;
REVOKE EXECUTE ON FUNCTION update_weighted_rankings() FROM anon;
REVOKE EXECUTE ON FUNCTION update_weighted_rankings() FROM authenticated;

GRANT EXECUTE ON FUNCTION log_click(INTEGER, TEXT, TEXT, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION log_equipment_only(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION update_weighted_rankings() TO service_role;

NOTIFY pgrst, 'reload schema';

SELECT 'Security hardening applied ✅' AS status;
SELECT 'IMPORTANT: also run fix_click_log.sql if log_click was not updated yet' AS reminder;
