-- Migration: allow 'community' as a comment target_type.
-- The comments table originally only permitted ('player', 'equipment'),
-- but CommentSection is used on community post pages with targetType="community".
-- Run this once against the live database.

ALTER TABLE public.comments
  DROP CONSTRAINT IF EXISTS comments_target_type_check;

ALTER TABLE public.comments
  ADD CONSTRAINT comments_target_type_check
  CHECK (target_type IN ('player', 'equipment', 'community'));
