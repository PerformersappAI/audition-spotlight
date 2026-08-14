CREATE TABLE public.cast_crew_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL,
  slug text UNIQUE NOT NULL,
  production_name text,
  notify_email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cast_crew_forms TO authenticated;
GRANT ALL ON public.cast_crew_forms TO service_role;

ALTER TABLE public.cast_crew_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage their own cast crew forms"
ON public.cast_crew_forms FOR ALL TO authenticated
USING (owner_user_id = auth.uid())
WITH CHECK (owner_user_id = auth.uid());

CREATE TRIGGER update_cast_crew_forms_updated_at
BEFORE UPDATE ON public.cast_crew_forms
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.cast_crew_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES public.cast_crew_forms(id) ON DELETE CASCADE,
  owner_user_id uuid NOT NULL,
  first_name text,
  last_name text,
  phone text,
  email text,
  instagram_handle text,
  job_position text,
  other_role text,
  character_name text,
  actor_type text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE, DELETE ON public.cast_crew_contacts TO authenticated;
GRANT ALL ON public.cast_crew_contacts TO service_role;

ALTER TABLE public.cast_crew_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their own collected contacts"
ON public.cast_crew_contacts FOR SELECT TO authenticated
USING (owner_user_id = auth.uid());

CREATE POLICY "Owners can update their own collected contacts"
ON public.cast_crew_contacts FOR UPDATE TO authenticated
USING (owner_user_id = auth.uid())
WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "Owners can delete their own collected contacts"
ON public.cast_crew_contacts FOR DELETE TO authenticated
USING (owner_user_id = auth.uid());

CREATE INDEX idx_cast_crew_contacts_owner ON public.cast_crew_contacts (owner_user_id, created_at DESC);
CREATE INDEX idx_cast_crew_contacts_form ON public.cast_crew_contacts (form_id);