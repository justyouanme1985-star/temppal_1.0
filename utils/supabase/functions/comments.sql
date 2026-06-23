-- Comments table for player and equipment pages
CREATE TABLE IF NOT EXISTS public.comments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  target_type TEXT NOT NULL CHECK (target_type IN ('player', 'equipment')),
  target_id TEXT NOT NULL,  -- player slug or equipment key
  parent_id BIGINT REFERENCES public.comments(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_comments_target ON public.comments(target_type, target_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read
CREATE POLICY "Anyone can read comments"
  ON public.comments FOR SELECT
  USING (true);

-- Allow anonymous insert
CREATE POLICY "Anyone can insert comments"
  ON public.comments FOR INSERT
  WITH CHECK (true);
