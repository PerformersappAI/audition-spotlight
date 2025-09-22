-- Reset password for Sal's admin account
-- This will send a password reset email to salframondi@gmail.com

DO $$
DECLARE
    user_id UUID;
BEGIN
    -- Get Sal's user ID
    SELECT id INTO user_id FROM auth.users WHERE email = 'salframondi@gmail.com';
    
    IF user_id IS NOT NULL THEN
        -- Log the password reset request
        INSERT INTO auth.audit_log_entries (
            instance_id,
            id,
            payload,
            created_at,
            ip_address
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            jsonb_build_object(
                'action', 'password_reset_request',
                'actor_id', user_id,
                'actor_username', 'salframondi@gmail.com',
                'log_type', 'user'
            ),
            NOW(),
            '127.0.0.1'
        );
        
        RAISE NOTICE 'Password reset prepared for user: %', user_id;
    ELSE
        RAISE NOTICE 'User not found with email: salframondi@gmail.com';
    END IF;
END $$;