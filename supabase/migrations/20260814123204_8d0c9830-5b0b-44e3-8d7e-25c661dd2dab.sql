ALTER VIEW public.audition_notices_public SET (security_invoker = true);

GRANT SELECT (
  id, user_id, project_name, project_type, union_status, producer, director,
  casting_director, line_producer, first_ad, additional_credits, audition_date,
  shoot_start_date, shoot_end_date, location, role_name, role_description,
  character_background, ethnicity_requirement, age_range, gender_preference,
  work_type, rate_of_pay, work_dates, work_location, storyline, genre,
  submission_deadline, materials_required, special_instructions, allow_online_demo,
  status, created_at, updated_at, logline, synopsis, shoot_city, shoot_country,
  audition_window, callback_dates, self_tape_deadline, location_type,
  travel_lodging, travel_details, compensation_type, compensation_rate,
  usage_terms, agent_fee_included, conflicts, has_nudity, has_intimacy,
  has_violence, safety_details, has_minors, headshot_url, resume_url, slate_link,
  reel_link, additional_materials, posting_targets, visibility,
  production_company, director_cd, website
) ON public.audition_notices TO anon, authenticated;

GRANT SELECT ON public.audition_notices_public TO anon, authenticated;

DROP POLICY IF EXISTS "Public can view active audition notices" ON public.audition_notices;
CREATE POLICY "Public can view active audition notices"
ON public.audition_notices
FOR SELECT
TO anon, authenticated
USING (status = 'active');