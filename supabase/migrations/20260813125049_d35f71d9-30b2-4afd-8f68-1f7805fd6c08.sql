UPDATE public.profiles p
SET is_internal = true
FROM auth.users u
WHERE u.id = p.user_id
  AND lower(u.email) IN (
    'samfilmsnyc@gmail.com',
    'samfiomsnyc@gmail.com',
    'deepak@trigunai.com',
    'dk.peace@gmail.com'
  );

DELETE FROM public.user_roles
WHERE user_id IN (
  SELECT id
  FROM auth.users
  WHERE lower(email) IN (
    'samfilmsnyc@gmail.com',
    'samfiomsnyc@gmail.com',
    'deepak@trigunai.com',
    'dk.peace@gmail.com'
  )
)
AND role IN ('admin', 'moderator');