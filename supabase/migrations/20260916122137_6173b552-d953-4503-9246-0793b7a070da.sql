ALTER TABLE public.breakdown_projects
  ADD COLUMN IF NOT EXISTS languages text[] NOT NULL DEFAULT ARRAY['en']::text[],
  ADD COLUMN IF NOT EXISTS shoot_location text NULL;

ALTER TABLE public.breakdown_crew
  ADD COLUMN IF NOT EXISTS preferred_language text NULL;

CREATE TABLE public.production_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.breakdown_projects(id) ON DELETE CASCADE,
  subject text NULL,
  source_language text NOT NULL,
  source_text text NOT NULL,
  translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_kind text NOT NULL DEFAULT 'text' CHECK (source_kind IN ('text','pdf','image','spreadsheet')),
  sent_at timestamptz NULL,
  sent_to jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by_name text NOT NULL,
  created_by_user_id uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by_crew_id uuid NULL REFERENCES public.breakdown_crew(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.production_messages TO authenticated;
GRANT ALL ON public.production_messages TO service_role;
REVOKE ALL ON public.production_messages FROM anon;

ALTER TABLE public.production_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and admins manage production messages"
ON public.production_messages
FOR ALL
TO authenticated
USING (public.owns_breakdown_project(project_id) OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.owns_breakdown_project(project_id) OR public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_production_messages_project_created
  ON public.production_messages (project_id, created_at DESC);

CREATE TRIGGER update_production_messages_updated_at
BEFORE UPDATE ON public.production_messages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();