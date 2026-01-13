-- =============================================
-- SUBSCRIPTION SYSTEM DATABASE SCHEMA
-- =============================================

-- 1. Create subscription_plans table
CREATE TABLE public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  description text,
  features jsonb DEFAULT '{}'::jsonb,
  limits jsonb NOT NULL DEFAULT '{"credits": 10}'::jsonb,
  stripe_price_id text,
  paypal_plan_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS for subscription_plans
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscription plans are viewable by everyone"
  ON public.subscription_plans FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage subscription plans"
  ON public.subscription_plans FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. Add new columns to existing user_subscriptions table
ALTER TABLE public.user_subscriptions 
ADD COLUMN IF NOT EXISTS plan_id uuid REFERENCES public.subscription_plans(id),
ADD COLUMN IF NOT EXISTS is_trial boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS trial_started_at timestamptz,
ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz,
ADD COLUMN IF NOT EXISTS purchased_at timestamptz,
ADD COLUMN IF NOT EXISTS subscription_started_at timestamptz,
ADD COLUMN IF NOT EXISTS next_billing_date timestamptz,
ADD COLUMN IF NOT EXISTS signup_source text DEFAULT 'direct';

-- 3. Create user_usage table
CREATE TABLE public.user_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id uuid NOT NULL REFERENCES public.user_subscriptions(id) ON DELETE CASCADE,
  credits_remaining numeric NOT NULL DEFAULT 0,
  credits_total numeric NOT NULL DEFAULT 0,
  script_analyses_used integer NOT NULL DEFAULT 0,
  ai_messages_used integer NOT NULL DEFAULT 0,
  video_verifications_used integer NOT NULL DEFAULT 0,
  detailed_usage_log jsonb DEFAULT '[]'::jsonb,
  credit_calculation_version integer DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, subscription_id)
);

-- RLS for user_usage
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage"
  ON public.user_usage FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own usage"
  ON public.user_usage FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
  ON public.user_usage FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user usage"
  ON public.user_usage FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Create cancellation_feedback table
CREATE TABLE public.cancellation_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  subscription_id uuid REFERENCES public.user_subscriptions(id),
  reason_code text NOT NULL,
  additional_feedback text,
  plan_name text,
  credits_remaining numeric,
  user_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS for cancellation_feedback
ALTER TABLE public.cancellation_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own cancellation feedback"
  ON public.cancellation_feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all cancellation feedback"
  ON public.cancellation_feedback FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Create database functions

-- Function to get user subscription status
CREATE OR REPLACE FUNCTION public.get_user_subscription_status(_user_id uuid)
RETURNS TABLE(
  user_id uuid,
  credits numeric,
  has_active_subscription boolean,
  current_period_end timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    us.user_id,
    COALESCE(uu.credits_remaining, 0) as credits,
    COALESCE(us.status = 'active', false) as has_active_subscription,
    us.current_period_end
  FROM public.user_subscriptions us
  LEFT JOIN public.user_usage uu ON uu.subscription_id = us.id
  WHERE us.user_id = _user_id 
    AND us.status = 'active'
  LIMIT 1;
$$;

-- Function to log credit usage
CREATE OR REPLACE FUNCTION public.log_credit_usage(
  p_user_id uuid,
  p_subscription_id uuid,
  p_feature_type text,
  p_credit_cost numeric,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_usage
  SET 
    detailed_usage_log = detailed_usage_log || jsonb_build_object(
      'timestamp', extract(epoch from now()),
      'feature_type', p_feature_type,
      'credit_cost', p_credit_cost,
      'metadata', p_metadata
    ),
    updated_at = now()
  WHERE user_id = p_user_id 
    AND subscription_id = p_subscription_id;
END;
$$;

-- 6. Insert sample subscription plans
INSERT INTO public.subscription_plans (name, price, description, limits, stripe_price_id) VALUES
  ('Free', 0, 'Basic access with limited credits', '{"credits": 3}', NULL),
  ('7 Day Trial', 0, 'Full access trial period', '{"credits": 10}', NULL),
  ('Pro', 19.99, 'Professional filmmaker toolkit', '{"credits": 25}', NULL),
  ('Elite', 24.99, 'Advanced features for serious filmmakers', '{"credits": 35}', NULL),
  ('Elite Tier II', 34.99, 'Maximum credits for production teams', '{"credits": 55}', NULL);

-- 7. Create updated_at trigger for new tables
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_usage_updated_at
  BEFORE UPDATE ON public.user_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();