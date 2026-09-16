CREATE TABLE public.production_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.breakdown_projects(id) ON DELETE CASCADE,
  tag text NOT NULL CHECK (tag IN ('general','talent','location','props','wardrobe','makeup','camera','sound','safety','director','ad','production')),
  body text NOT NULL CHECK (char_length(body) <= 5000 AND char_length(btrim(body)) > 0),
  source_language text NULL,
  translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  shoot_day date NULL,
  scene_id uuid NULL REFERENCES public.breakdown_scenes(id) ON DELETE SET NULL,
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal','important','urgent')),
  pinned boolean NOT NULL DEFAULT false,
  resolved boolean NOT NULL DEFAULT false,
  resolved_by_name text NULL,
  resolved_at timestamptz NULL,
  created_by_name text NOT NULL,
  created_by_department text NULL,
  created_by_user_id uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by_crew_id uuid NULL REFERENCES public.breakdown_crew(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX production_notes_project_created_idx ON public.production_notes (project_id, created_at DESC);
CREATE INDEX production_notes_project_day_idx ON public.production_notes (project_id, shoot_day);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.production_notes TO authenticated;
GRANT ALL ON public.production_notes TO service_role;
REVOKE ALL ON public.production_notes FROM anon;

ALTER TABLE public.production_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and admins manage production notes"
ON public.production_notes
FOR ALL
TO authenticated
USING (public.owns_breakdown_project(project_id) OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.owns_breakdown_project(project_id) OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_production_notes_updated_at
BEFORE UPDATE ON public.production_notes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.production_notes;