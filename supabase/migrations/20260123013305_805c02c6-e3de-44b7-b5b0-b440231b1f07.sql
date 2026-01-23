-- Restore the missing trigger that creates profiles for new users
-- This ensures every auth signup automatically gets a profile record

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Also backfill any existing auth users who are missing profiles
INSERT INTO public.profiles (user_id, email, first_name, role)
SELECT u.id, u.email, COALESCE(u.raw_user_meta_data->>'first_name', ''), 'filmmaker'
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE p.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;