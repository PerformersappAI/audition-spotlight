-- 1. Restrict base table SELECT to owner + admins
DROP POLICY IF EXISTS "Everyone can view active audition notices" ON public.audition_notices;

CREATE POLICY "Owners and admins can view full audition notices"
ON public.audition_notices
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update any audition notice"
ON public.audition_notices
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete any audition notice"
ON public.audition_notices
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- anon must not read the base table anymore
REVOKE ALL ON public.audition_notices FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audition_notices TO authenticated;
GRANT ALL ON public.audition_notices TO service_role;

-- 2. Safe public view without contact_email / contact_phone
DROP VIEW IF EXISTS public.audition_notices_public;

CREATE VIEW public.audition_notices_public
WITH (security_invoker = false)
AS
SELECT
  id, user_id, project_name, project_type, union_status, producer, director,
  casting_director, line_producer, first_ad, additional_credits,
  audition_date, shoot_start_date, shoot_end_date, location, role_name,
  role_description, character_background, ethnicity_requirement, age_range,
  gender_preference, work_type, rate_of_pay, work_dates, work_location,
  storyline, genre, submission_deadline, materials_required,
  special_instructions, allow_online_demo, status, created_at, updated_at,
  logline, synopsis, shoot_city, shoot_country, audition_window,
  callback_dates, self_tape_deadline, location_type, travel_lodging,
  travel_details, compensation_type, compensation_rate, usage_terms,
  agent_fee_included, conflicts, has_nudity, has_intimacy, has_violence,
  safety_details, has_minors, headshot_url, resume_url, slate_link,
  reel_link, additional_materials, posting_targets, visibility,
  production_company, director_cd, website
FROM public.audition_notices
WHERE status = 'active' OR user_id = auth.uid();

GRANT SELECT ON public.audition_notices_public TO anon, authenticated;
GRANT SELECT ON public.audition_notices_public TO service_role;