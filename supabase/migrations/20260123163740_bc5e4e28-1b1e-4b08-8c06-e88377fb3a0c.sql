-- Fix overly permissive RLS policy on profiles table
-- Drop the policy that exposes all profile data to anonymous users
DROP POLICY IF EXISTS "Public can view basic profile info" ON public.profiles;

-- Create a view with only non-sensitive public fields
-- This prevents anonymous access to email, phone, and role
CREATE OR REPLACE VIEW public.profiles_public AS
SELECT 
  id,
  user_id,
  first_name,
  last_name,
  bio,
  location,
  website,
  created_at
  -- Explicitly exclude: email, phone, role, company_name
FROM public.profiles;

-- Grant access to the view for public queries (actor profiles, etc.)
GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- Ensure authenticated users can still view their own full profile
-- (This policy should already exist, but ensure it's present)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
  END IF;
END $$;