-- Grant admin privileges to specified users
UPDATE profiles 
SET role = 'admin' 
WHERE email IN ('will@actorwillroberts.com', 'salframondi@gmail.com');