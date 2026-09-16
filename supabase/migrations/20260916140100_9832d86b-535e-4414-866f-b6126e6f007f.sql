ALTER TABLE public.cast_crew_forms
  ADD COLUMN IF NOT EXISTS project_id uuid NULL REFERENCES public.breakdown_projects(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS auto_confirm boolean NOT NULL DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS cast_crew_forms_project_unique
  ON public.cast_crew_forms (project_id) WHERE project_id IS NOT NULL;

ALTER TABLE public.cast_crew_contacts
  ADD COLUMN IF NOT EXISTS confirmation_sent_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS notes_internal text NULL,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS update_cast_crew_contacts_updated_at ON public.cast_crew_contacts;
CREATE TRIGGER update_cast_crew_contacts_updated_at
BEFORE UPDATE ON public.cast_crew_contacts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

REVOKE ALL ON public.cast_crew_forms FROM anon;
REVOKE ALL ON public.cast_crew_contacts FROM anon;

DROP POLICY IF EXISTS "Admins manage cast crew forms" ON public.cast_crew_forms;
CREATE POLICY "Admins manage cast crew forms"
ON public.cast_crew_forms FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins view collected contacts" ON public.cast_crew_contacts;
CREATE POLICY "Admins view collected contacts"
ON public.cast_crew_contacts FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update collected contacts" ON public.cast_crew_contacts;
CREATE POLICY "Admins update collected contacts"
ON public.cast_crew_contacts FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete collected contacts" ON public.cast_crew_contacts;
CREATE POLICY "Admins delete collected contacts"
ON public.cast_crew_contacts FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.cast_crew_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES public.cast_crew_forms(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  sent_by_user_id uuid NULL
);

GRANT SELECT, DELETE ON public.cast_crew_reminders TO authenticated;
GRANT ALL ON public.cast_crew_reminders TO service_role;
REVOKE ALL ON public.cast_crew_reminders FROM anon;

ALTER TABLE public.cast_crew_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners view their reminder history"
ON public.cast_crew_reminders FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cast_crew_forms f
    WHERE f.id = cast_crew_reminders.form_id AND f.owner_user_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Owners delete their reminder history"
ON public.cast_crew_reminders FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cast_crew_forms f
    WHERE f.id = cast_crew_reminders.form_id AND f.owner_user_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
);

CREATE INDEX IF NOT EXISTS idx_cast_crew_reminders_form ON public.cast_crew_reminders (form_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_cast_crew_reminders_sender ON public.cast_crew_reminders (sent_by_user_id, sent_at DESC);