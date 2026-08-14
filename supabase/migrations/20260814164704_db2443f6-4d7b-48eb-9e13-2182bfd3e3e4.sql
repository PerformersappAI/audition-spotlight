DROP POLICY IF EXISTS "Public can view active audition notices" ON public.audition_notices;
ALTER VIEW public.audition_notices_public SET (security_invoker = false);
GRANT SELECT ON public.audition_notices_public TO anon, authenticated;