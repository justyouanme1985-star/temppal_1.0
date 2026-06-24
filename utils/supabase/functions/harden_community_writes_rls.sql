-- Block direct anon writes to community_posts (must use POST /api/community).
-- Complements hide_community_sensitive_fields.sql (read policies).
--
-- Run once in Supabase SQL Editor.

DROP POLICY IF EXISTS "Anyone can insert community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Anyone can update community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Anyone can delete community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.community_posts;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.community_posts;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.community_posts;
DROP POLICY IF EXISTS "Public can insert community_posts" ON public.community_posts;
DROP POLICY IF EXISTS "Public can update community_posts" ON public.community_posts;
DROP POLICY IF EXISTS "Public can delete community_posts" ON public.community_posts;

SELECT 'community_posts anon WRITE policies removed ✅' AS status;
