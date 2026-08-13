WITH targets AS (
  SELECT u.id AS user_id, u.email, uc.available_credits AS removed
  FROM auth.users u
  JOIN public.user_credits uc ON uc.user_id = u.id
  WHERE lower(u.email) IN (
    'samfilmsnyc@gmail.com',
    'samfiomsnyc@gmail.com',
    'deepak@trigunai.com',
    'dk.peace@gmail.com'
  )
),
adjustments AS (
  UPDATE public.user_credits
  SET total_credits = used_credits,
      updated_at = now()
  FROM targets
  WHERE public.user_credits.user_id = targets.user_id
  RETURNING public.user_credits.user_id, targets.removed
)
INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description)
  SELECT user_id, -removed, 'usage', 'Admin: credits cleared (inactive account)'
FROM adjustments;