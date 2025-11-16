-- Add foreign key relationship from audition_notices to profiles
ALTER TABLE public.audition_notices
ADD CONSTRAINT audition_notices_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(user_id)
ON DELETE CASCADE;