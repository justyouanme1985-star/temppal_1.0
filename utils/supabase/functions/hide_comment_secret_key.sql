-- Prevent clients with the publishable (anon) key from reading comments directly.
-- Public reads must go through GET /api/comments, which selects only safe columns
-- via the service role and never returns secret_key.
--
-- Run once in the Supabase SQL editor after deploying the API change.

DROP POLICY IF EXISTS "Anyone can read comments" ON public.comments;
