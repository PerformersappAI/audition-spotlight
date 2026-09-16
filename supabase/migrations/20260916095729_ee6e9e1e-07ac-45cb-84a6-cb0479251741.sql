-- 1) breakdown_projects
CREATE TABLE public.breakdown_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled Production',
  company text,
  status text NOT NULL DEFAULT 'in_production' CHECK (status IN ('upcoming','in_production','wrapped')),
  start_date date,
  share_token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  sharing_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.breakdown_projects TO authenticated;
GRANT ALL ON public.breakdown_projects TO service_role;
ALTER TABLE public.breakdown_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and admins can view breakdown projects"
  ON public.breakdown_projects FOR SELECT TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create their own breakdown projects"
  ON public.breakdown_projects FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners and admins can update breakdown projects"
  ON public.breakdown_projects FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners and admins can delete breakdown projects"
  ON public.breakdown_projects FOR DELETE TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_breakdown_projects_updated_at
  BEFORE UPDATE ON public.breakdown_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helper: does the current user own this breakdown project?
CREATE OR REPLACE FUNCTION public.owns_breakdown_project(_project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.breakdown_projects p
    WHERE p.id = _project_id
      AND p.owner_id = auth.uid()
  )
$$;

-- 2) breakdown_scenes
CREATE TABLE public.breakdown_scenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.breakdown_projects(id) ON DELETE CASCADE,
  scene_number text,
  label text,
  script_text text,
  sort_order int NOT NULL DEFAULT 0,
  analyzed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_breakdown_scenes_project ON public.breakdown_scenes (project_id, sort_order);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.breakdown_scenes TO authenticated;
GRANT ALL ON public.breakdown_scenes TO service_role;
ALTER TABLE public.breakdown_scenes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and admins manage breakdown scenes"
  ON public.breakdown_scenes FOR ALL TO authenticated
  USING (public.owns_breakdown_project(project_id) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.owns_breakdown_project(project_id) OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_breakdown_scenes_updated_at
  BEFORE UPDATE ON public.breakdown_scenes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) breakdown_items
CREATE TABLE public.breakdown_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id uuid NOT NULL REFERENCES public.breakdown_scenes(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES public.breakdown_projects(id) ON DELETE CASCADE,
  department text NOT NULL CHECK (department IN ('props','locations','makeup_sfx','wardrobe','vehicles')),
  text text NOT NULL,
  original_text text,
  source text NOT NULL DEFAULT 'ai' CHECK (source IN ('ai','manual','note')),
  flagged boolean NOT NULL DEFAULT false,
  checked boolean NOT NULL DEFAULT false,
  checked_by_name text,
  checked_at timestamptz,
  added_by_name text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_breakdown_items_scene_dept_order ON public.breakdown_items (scene_id, department, sort_order);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.breakdown_items TO authenticated;
GRANT ALL ON public.breakdown_items TO service_role;
ALTER TABLE public.breakdown_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and admins manage breakdown items"
  ON public.breakdown_items FOR ALL TO authenticated
  USING (public.owns_breakdown_project(project_id) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.owns_breakdown_project(project_id) OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_breakdown_items_updated_at
  BEFORE UPDATE ON public.breakdown_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) breakdown_signoffs
CREATE TABLE public.breakdown_signoffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id uuid NOT NULL REFERENCES public.breakdown_scenes(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES public.breakdown_projects(id) ON DELETE CASCADE,
  department text NOT NULL CHECK (department IN ('props','locations','makeup_sfx','wardrobe','vehicles')),
  status text NOT NULL CHECK (status IN ('good','need_help')),
  note text,
  by_name text,
  by_department text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (scene_id, department)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.breakdown_signoffs TO authenticated;
GRANT ALL ON public.breakdown_signoffs TO service_role;
ALTER TABLE public.breakdown_signoffs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and admins manage breakdown signoffs"
  ON public.breakdown_signoffs FOR ALL TO authenticated
  USING (public.owns_breakdown_project(project_id) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.owns_breakdown_project(project_id) OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_breakdown_signoffs_updated_at
  BEFORE UPDATE ON public.breakdown_signoffs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) breakdown_photos
CREATE TABLE public.breakdown_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.breakdown_items(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES public.breakdown_projects(id) ON DELETE CASCADE,
  storage_path text,
  external_url text,
  is_reference boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'awaiting' CHECK (status IN ('awaiting','approved','rejected')),
  feedback text,
  uploaded_by_name text,
  decided_by_name text,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT breakdown_photos_source_present CHECK (storage_path IS NOT NULL OR external_url IS NOT NULL)
);
CREATE INDEX idx_breakdown_photos_item ON public.breakdown_photos (item_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.breakdown_photos TO authenticated;
GRANT ALL ON public.breakdown_photos TO service_role;
ALTER TABLE public.breakdown_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and admins manage breakdown photos"
  ON public.breakdown_photos FOR ALL TO authenticated
  USING (public.owns_breakdown_project(project_id) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.owns_breakdown_project(project_id) OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_breakdown_photos_updated_at
  BEFORE UPDATE ON public.breakdown_photos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6) breakdown_crew
CREATE TABLE public.breakdown_crew (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.breakdown_projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  department text,
  last_seen_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_breakdown_crew_project ON public.breakdown_crew (project_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.breakdown_crew TO authenticated;
GRANT ALL ON public.breakdown_crew TO service_role;
ALTER TABLE public.breakdown_crew ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and admins manage breakdown crew"
  ON public.breakdown_crew FOR ALL TO authenticated
  USING (public.owns_breakdown_project(project_id) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.owns_breakdown_project(project_id) OR public.has_role(auth.uid(), 'admin'));

-- Column-level protection: only owners/admins can change share_token (policies already
-- restrict updates to owners/admins; explicitly deny the column to anon).
REVOKE ALL ON public.breakdown_projects FROM anon;
REVOKE ALL ON public.breakdown_scenes FROM anon;
REVOKE ALL ON public.breakdown_items FROM anon;
REVOKE ALL ON public.breakdown_signoffs FROM anon;
REVOKE ALL ON public.breakdown_photos FROM anon;
REVOKE ALL ON public.breakdown_crew FROM anon;

-- Storage policies for the private breakdown-photos bucket
CREATE POLICY "Breakdown owners can read their breakdown photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'breakdown-photos'
    AND (
      public.owns_breakdown_project(NULLIF((storage.foldername(name))[1], '')::uuid)
      OR public.has_role(auth.uid(), 'admin')
    )
  );

CREATE POLICY "Breakdown owners can upload breakdown photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'breakdown-photos'
    AND (
      public.owns_breakdown_project(NULLIF((storage.foldername(name))[1], '')::uuid)
      OR public.has_role(auth.uid(), 'admin')
    )
  );

CREATE POLICY "Breakdown owners can update breakdown photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'breakdown-photos'
    AND (
      public.owns_breakdown_project(NULLIF((storage.foldername(name))[1], '')::uuid)
      OR public.has_role(auth.uid(), 'admin')
    )
  );

CREATE POLICY "Breakdown owners can delete breakdown photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'breakdown-photos'
    AND (
      public.owns_breakdown_project(NULLIF((storage.foldername(name))[1], '')::uuid)
      OR public.has_role(auth.uid(), 'admin')
    )
  );