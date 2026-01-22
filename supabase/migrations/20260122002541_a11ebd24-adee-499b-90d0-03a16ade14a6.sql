-- Re-insert the missing profile for will@howtoselftape.com
INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
VALUES (
  '6bf92c38-b8dd-4cc0-be1a-cc076565d6f1',
  'will@howtoselftape.com',
  'Will',
  'Roberts',
  'filmmaker'
)
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name;