-- FILM FESTIVALS: restrict base table to owner + admins
DROP POLICY IF EXISTS "Everyone can view active festivals" ON public.film_festivals;

CREATE POLICY "Owners and admins can view full festivals"
ON public.film_festivals
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

REVOKE SELECT ON public.film_festivals FROM anon;

CREATE OR REPLACE VIEW public.film_festivals_public
WITH (security_invoker = false) AS
SELECT
  id, user_id, name, description, location, start_date, end_date,
  submission_deadline, early_deadline, late_deadline, notification_date,
  website, submission_url, filmfreeway_url, submission_fee, entry_fees_range,
  categories, genres, requirements, awards, acceptance_rate, festival_tier,
  status, featured, created_at, updated_at
FROM public.film_festivals
WHERE status = 'active';

GRANT SELECT ON public.film_festivals_public TO anon, authenticated;

-- PROJECTS: restrict base table to owner + admins
DROP POLICY IF EXISTS "Authenticated users can view active projects" ON public.projects;

CREATE POLICY "Owners and admins can view full projects"
ON public.projects
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

REVOKE SELECT ON public.projects FROM anon;

CREATE OR REPLACE VIEW public.projects_public
WITH (security_invoker = false) AS
SELECT
  id, user_id, title, project_name, description, project_type,
  casting_director, production_company, location, audition_date,
  deadline_date, age_range, gender_preference, compensation, requirements,
  status, featured, created_at, updated_at
FROM public.projects
WHERE status = 'active';

GRANT SELECT ON public.projects_public TO authenticated;