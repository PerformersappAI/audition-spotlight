-- Grant admin role to oppenheimerbrianna@gmail.com
INSERT INTO public.user_roles (user_id, role) 
VALUES ('294043c8-3cd5-499b-93a9-1ca7d1dff45d', 'admin') 
ON CONFLICT (user_id, role) DO NOTHING;