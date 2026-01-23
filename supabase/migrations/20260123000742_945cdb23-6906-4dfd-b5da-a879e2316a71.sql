-- Insert 50 credits for will@actorwillroberts.com
INSERT INTO public.user_credits (user_id, total_credits, used_credits)
VALUES ('0177e438-9c14-415e-a32e-f1c0c2b4ecc4', 50, 0)
ON CONFLICT (user_id) DO UPDATE SET 
  total_credits = user_credits.total_credits + 50,
  updated_at = now();