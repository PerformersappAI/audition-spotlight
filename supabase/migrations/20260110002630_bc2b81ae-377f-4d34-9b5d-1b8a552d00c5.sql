-- Add admin role for will@actorwillroberts.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('0177e438-9c14-415e-a32e-f1c0c2b4ecc4', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;