-- Set a new password for Sal's account directly
-- This bypasses the normal password reset flow for admin convenience

UPDATE auth.users 
SET 
    encrypted_password = crypt('EnricoVader$', gen_salt('bf')),
    updated_at = NOW(),
    password_changed_at = NOW()
WHERE email = 'salframondi@gmail.com';

-- Also ensure the profile is correctly set as admin
UPDATE profiles 
SET role = 'admin', updated_at = NOW()
WHERE email = 'salframondi@gmail.com';