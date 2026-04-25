UPDATE public.user_credits
SET total_credits = total_credits + 50,
    updated_at = now()
WHERE user_id = '0177e438-9c14-415e-a32e-f1c0c2b4ecc4';

INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description)
VALUES ('0177e438-9c14-415e-a32e-f1c0c2b4ecc4', 50, 'purchase', 'Manual top-up: +50 credits (support adjustment)');