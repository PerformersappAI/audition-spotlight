-- Drop and recreate view with SECURITY INVOKER (default, safer)
DROP VIEW IF EXISTS public.profiles_public;

CREATE VIEW public.profiles_public 
WITH (security_invoker = true)
AS
SELECT 
  id,
  user_id,
  first_name,
  last_name,
  bio,
  location,
  website,
  created_at
FROM public.profiles;

-- Re-grant access to the view
GRANT SELECT ON public.profiles_public TO anon, authenticated;