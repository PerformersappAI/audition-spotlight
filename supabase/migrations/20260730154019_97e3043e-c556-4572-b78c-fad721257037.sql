CREATE OR REPLACE FUNCTION public.get_available_credits(_user_id uuid)
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT available_credits FROM public.user_credits WHERE user_id = _user_id), 0)::numeric;
$$;

REVOKE ALL ON FUNCTION public.get_available_credits(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_available_credits(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.spend_credits(
  _user_id uuid,
  _cost numeric,
  _feature text,
  _metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE(success boolean, available_credits numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _row public.user_credits%ROWTYPE;
  _charge int := GREATEST(CEIL(COALESCE(_cost, 0))::int, 0);
BEGIN
  SELECT * INTO _row FROM public.user_credits WHERE user_id = _user_id FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.user_credits (user_id, total_credits, used_credits)
    VALUES (_user_id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
    SELECT * INTO _row FROM public.user_credits WHERE user_id = _user_id FOR UPDATE;
  END IF;

  IF (_row.total_credits - _row.used_credits) < _charge THEN
    RETURN QUERY SELECT false, (_row.total_credits - _row.used_credits)::numeric;
    RETURN;
  END IF;

  UPDATE public.user_credits
     SET used_credits = used_credits + _charge,
         updated_at = now()
   WHERE user_id = _user_id
   RETURNING * INTO _row;

  INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description)
  VALUES (_user_id, -_charge, 'usage', COALESCE(_feature, 'ai_usage') || CASE WHEN _metadata IS NULL OR _metadata = '{}'::jsonb THEN '' ELSE ' ' || _metadata::text END);

  RETURN QUERY SELECT true, (_row.total_credits - _row.used_credits)::numeric;
END;
$$;

REVOKE ALL ON FUNCTION public.spend_credits(uuid, numeric, text, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.spend_credits(uuid, numeric, text, jsonb) TO service_role;