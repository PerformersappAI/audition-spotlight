ALTER TABLE public.storyboard_projects
  ADD COLUMN IF NOT EXISTS project_title text,
  ADD COLUMN IF NOT EXISTS thumbnail_url text,
  ADD COLUMN IF NOT EXISTS art_style text,
  ADD COLUMN IF NOT EXISTS aspect_ratio text,
  ADD COLUMN IF NOT EXISTS scene_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS frame_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cast_data jsonb DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_storyboard_projects_user_complete
  ON public.storyboard_projects (user_id, is_complete, updated_at DESC);