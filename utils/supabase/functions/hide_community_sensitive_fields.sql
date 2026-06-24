-- Prevent clients with the publishable (anon) key from reading community_posts directly.
-- Public reads must go through /api/community routes, which return only safe columns
-- and never expose author_password or ip_address.
--
-- Run once in the Supabase SQL editor after deploying the API change.

DROP POLICY IF EXISTS "Anyone can read community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.community_posts;
DROP POLICY IF EXISTS "Public can read community_posts" ON public.community_posts;
