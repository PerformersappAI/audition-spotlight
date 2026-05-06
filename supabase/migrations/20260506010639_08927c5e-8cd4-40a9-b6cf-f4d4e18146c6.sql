
-- 1. Tighten projects: hide contact info from anon
DROP POLICY IF EXISTS "Everyone can view active projects" ON public.projects;
CREATE POLICY "Authenticated users can view active projects"
ON public.projects FOR SELECT
TO authenticated
USING (status = 'active' OR user_id = auth.uid());

-- 2. Restrict quiz_questions SELECT to authenticated users
DROP POLICY IF EXISTS "Anyone can view questions" ON public.quiz_questions;
CREATE POLICY "Authenticated users can view questions"
ON public.quiz_questions FOR SELECT
TO authenticated
USING (true);

-- 3. Remove user-facing INSERT/UPDATE on user_credits (server/admin only via trigger + admin policies)
DROP POLICY IF EXISTS "Users can insert own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can update own credits" ON public.user_credits;

-- 4. Require authentication for increment_discussion_views
CREATE OR REPLACE FUNCTION public.increment_discussion_views(discussion_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  UPDATE course_discussions
  SET view_count = view_count + 1
  WHERE id = discussion_id;
END;
$$;

-- 5. Make certificates bucket private (signed URLs already used in client)
UPDATE storage.buckets SET public = false WHERE id = 'certificates';
