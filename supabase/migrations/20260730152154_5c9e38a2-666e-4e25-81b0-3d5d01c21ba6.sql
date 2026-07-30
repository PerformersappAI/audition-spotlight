
-- 1. grant_credits (one-time top-up: ADD to total)
CREATE OR REPLACE FUNCTION public.grant_credits(_user_id uuid, _amount int, _reason text, _metadata jsonb DEFAULT '{}'::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, total_credits, used_credits)
  VALUES (_user_id, _amount, 0)
  ON CONFLICT (user_id) DO UPDATE
    SET total_credits = public.user_credits.total_credits + _amount,
        updated_at = now();

  INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description)
  VALUES (_user_id, _amount, 'purchase', _reason);
END;
$$;

-- 2. refresh_plan_credits (monthly cycle: SET available = _amount)
CREATE OR REPLACE FUNCTION public.refresh_plan_credits(_user_id uuid, _amount int, _reason text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _used int;
BEGIN
  SELECT used_credits INTO _used FROM public.user_credits WHERE user_id = _user_id;

  IF _used IS NULL THEN
    INSERT INTO public.user_credits (user_id, total_credits, used_credits)
    VALUES (_user_id, _amount, 0);
  ELSE
    UPDATE public.user_credits
       SET total_credits = _used + _amount,
           updated_at = now()
     WHERE user_id = _user_id;
  END IF;

  INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description)
  VALUES (_user_id, _amount, 'subscription', _reason);
END;
$$;

-- 3. subscription_plans single source of truth
UPDATE public.subscription_plans SET name = name WHERE false;

DELETE FROM public.subscription_plans WHERE lower(name) IN ('basic','pro');

INSERT INTO public.subscription_plans (name, price, currency, description, features, limits, stripe_price_id)
VALUES
  ('Basic', 19.99, 'usd', '50 monthly credits',
    '["50 monthly credits","All tools unlocked"]'::jsonb,
    '{"monthly_credits": 50}'::jsonb,
    'price_1SqO1pC3S0CSSOB1n4OuEQDt'),
  ('Pro', 24.99, 'usd', '100 monthly credits',
    '["100 monthly credits","All tools unlocked","Priority support"]'::jsonb,
    '{"monthly_credits": 100}'::jsonb,
    'price_1SqO2nC3S0CSSOB1aHEwmdqz');

-- 4. processed_webhook_events (idempotency)
CREATE TABLE IF NOT EXISTS public.processed_webhook_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id text NOT NULL UNIQUE,
  event_type text,
  processed_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT ALL ON public.processed_webhook_events TO service_role;
ALTER TABLE public.processed_webhook_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only webhook events"
  ON public.processed_webhook_events FOR ALL
  USING (false) WITH CHECK (false);

-- 5. api_usage_logs
CREATE TABLE IF NOT EXISTS public.api_usage_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  function_name text NOT NULL,
  provider text,
  operation text,
  estimated_cost_usd numeric,
  tokens_input int,
  tokens_output int,
  status text,
  latency_ms int,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT ON public.api_usage_logs TO authenticated;
GRANT ALL ON public.api_usage_logs TO service_role;
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view api usage logs"
  ON public.api_usage_logs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 6. ensure every new user gets a user_credits row
DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_credits();
