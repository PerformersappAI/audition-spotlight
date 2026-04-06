UPDATE public.user_credits 
SET total_credits = total_credits + 50, 
    updated_at = now() 
WHERE user_id = '1fa3885d-24fd-4026-8e37-fa474f395e53';

INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description)
VALUES ('1fa3885d-24fd-4026-8e37-fa474f395e53', 50, 'purchase', 'Manual credit grant by admin');