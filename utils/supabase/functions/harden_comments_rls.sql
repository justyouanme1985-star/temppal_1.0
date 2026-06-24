-- Block direct anon inserts into comments (must go through POST /api/comments).
-- Reads are already blocked by hide_comment_secret_key.sql.
--
-- Run once in Supabase SQL Editor.

DROP POLICY IF EXISTS "Anyone can insert comments" ON public.comments;

SELECT 'comments anon INSERT policy removed ✅' AS status;
