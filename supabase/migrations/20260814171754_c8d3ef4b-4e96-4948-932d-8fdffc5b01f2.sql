CREATE OR REPLACE FUNCTION public.prevent_profile_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow service_role / internal jobs (no auth context) to manage roles
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  IF (NEW.role IS DISTINCT FROM OLD.role)
     OR (NEW.is_internal IS DISTINCT FROM OLD.is_internal) THEN
    IF NOT public.has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'Only admins can change a profile role or internal flag';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_profile_role_escalation ON public.profiles;
CREATE TRIGGER prevent_profile_role_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_profile_role_escalation();