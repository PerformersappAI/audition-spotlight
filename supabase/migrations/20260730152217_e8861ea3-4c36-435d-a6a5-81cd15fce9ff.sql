
REVOKE EXECUTE ON FUNCTION public.grant_credits(uuid, int, text, jsonb) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.refresh_plan_credits(uuid, int, text) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.grant_credits(uuid, int, text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.refresh_plan_credits(uuid, int, text) TO service_role;
