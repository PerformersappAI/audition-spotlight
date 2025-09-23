-- Add additional fields to film_festivals table for comprehensive festival data
ALTER TABLE public.film_festivals 
ADD COLUMN IF NOT EXISTS submission_url text,
ADD COLUMN IF NOT EXISTS filmfreeway_url text,
ADD COLUMN IF NOT EXISTS festival_tier text DEFAULT 'Regional',
ADD COLUMN IF NOT EXISTS genres text[],
ADD COLUMN IF NOT EXISTS entry_fees_range text,
ADD COLUMN IF NOT EXISTS awards text[],
ADD COLUMN IF NOT EXISTS acceptance_rate numeric,
ADD COLUMN IF NOT EXISTS early_deadline date,
ADD COLUMN IF NOT EXISTS late_deadline date,
ADD COLUMN IF NOT EXISTS notification_date date;

-- First, create a system user for official festivals
DO $$
DECLARE
    system_user_id uuid;
BEGIN
    -- Create a system user in auth.users if it doesn't exist
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        role,
        aud,
        confirmation_token,
        email_change_token_new,
        email_change_token_current,
        recovery_token
    ) 
    VALUES (
        '00000000-0000-0000-0000-000000000001'::uuid,
        '00000000-0000-0000-0000-000000000000'::uuid,
        'system@opprime.com',
        '$2a$10$dummyhashforsystemuser',
        now(),
        now(), 
        now(),
        'authenticated',
        'authenticated',
        '',
        '',
        '',
        ''
    )
    ON CONFLICT (id) DO NOTHING;
    
    system_user_id := '00000000-0000-0000-0000-000000000001'::uuid;
    
    -- Insert comprehensive festival data using system user
    INSERT INTO public.film_festivals (
      name, location, description, start_date, end_date, submission_deadline, 
      early_deadline, late_deadline, submission_url, filmfreeway_url, 
      festival_tier, genres, entry_fees_range, categories, website, 
      contact_email, user_id, status
    ) VALUES 
    -- Tier 1 - Major International Festivals
    ('Sundance Film Festival', 'Park City, Utah, USA', 'Premier independent film festival showcasing new work from American and international independent filmmakers', '2025-01-23', '2025-02-02', '2024-09-19', '2024-08-29', '2024-09-19', 'https://www.sundance.org/festivals/sundance-film-festival/', 'https://filmfreeway.com/SundanceFilmFestival', 'Tier 1', ARRAY['Drama', 'Documentary', 'Comedy', 'Thriller', 'Horror'], '$65-125', ARRAY['Feature', 'Short', 'Documentary'], 'https://www.sundance.org/', 'programming@sundance.org', system_user_id, 'active'),
    
    ('Cannes Film Festival', 'Cannes, France', 'The world''s most prestigious film festival, showcasing new films from acclaimed international filmmakers', '2025-05-13', '2025-05-24', '2025-02-28', '2025-01-31', '2025-02-28', 'https://www.festival-cannes.com/en/participate/regulations/', 'https://filmfreeway.com/CannesFilmFestival', 'Tier 1', ARRAY['Drama', 'Art House', 'International'], '$0', ARRAY['Feature', 'Short'], 'https://www.festival-cannes.com/', 'selection@festival-cannes.fr', system_user_id, 'active'),
    
    ('Toronto International Film Festival', 'Toronto, Ontario, Canada', 'One of the largest publicly attended film festivals in the world', '2025-09-04', '2025-09-14', '2025-06-06', '2025-05-09', '2025-06-06', 'https://www.tiff.net/submissions/', 'https://filmfreeway.com/TIFF', 'Tier 1', ARRAY['Drama', 'Documentary', 'International', 'Comedy'], '$105-165', ARRAY['Feature', 'Short', 'Documentary'], 'https://www.tiff.net/', 'programming@tiff.net', system_user_id, 'active'),
    
    ('SXSW Film Festival', 'Austin, Texas, USA', 'Showcasing the most innovative, smart, and entertaining new films', '2025-03-07', '2025-03-16', '2024-12-06', '2024-11-08', '2024-12-06', 'https://www.sxsw.com/apply-to-participate/', 'https://filmfreeway.com/sxsw', 'Tier 2', ARRAY['Comedy', 'Drama', 'Documentary', 'Music'], '$45-65', ARRAY['Feature', 'Short', 'Documentary'], 'https://www.sxsw.com/', 'film@sxsw.com', system_user_id, 'active'),
    
    ('Tribeca Film Festival', 'New York, New York, USA', 'Celebrating independent filmmaking and diverse stories', '2025-06-04', '2025-06-15', '2025-02-21', '2025-01-24', '2025-02-21', 'https://tribecafilm.com/festival/submissions/', 'https://filmfreeway.com/TribecaFilmFestival', 'Tier 2', ARRAY['Drama', 'Documentary', 'Comedy'], '$70-90', ARRAY['Feature', 'Short', 'Documentary'], 'https://tribecafilm.com/', 'programming@tribecafilm.com', system_user_id, 'active');
    
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_festivals_tier ON public.film_festivals(festival_tier);
CREATE INDEX IF NOT EXISTS idx_festivals_genres ON public.film_festivals USING GIN(genres);
CREATE INDEX IF NOT EXISTS idx_festivals_deadline ON public.film_festivals(submission_deadline);
CREATE INDEX IF NOT EXISTS idx_festivals_location ON public.film_festivals(location);