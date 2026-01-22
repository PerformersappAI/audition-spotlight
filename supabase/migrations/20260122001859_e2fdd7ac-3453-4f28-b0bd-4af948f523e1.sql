-- Insert missing profile for will@howtoselftape.com
INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
VALUES (
  '6bf92c38-b8dd-4cc0-be1a-cc076565d6f1',
  'will@howtoselftape.com',
  'Will',
  NULL,
  'filmmaker'
)
ON CONFLICT (user_id) DO NOTHING;

-- Improve the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', '')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log but don't fail auth
  RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$function$;