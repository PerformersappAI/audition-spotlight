-- Set a new password for Sal's account directly
-- Using the correct auth.users table structure

UPDATE auth.users 
SET 
    encrypted_password = crypt('EnricoVader$', gen_salt('bf')),
    updated_at = NOW()
WHERE email = 'salframondi@gmail.com';

-- Ensure the profile is correctly set as admin
UPDATE profiles 
SET role = 'admin', updated_at = NOW()
WHERE email = 'salframondi@gmail.com';