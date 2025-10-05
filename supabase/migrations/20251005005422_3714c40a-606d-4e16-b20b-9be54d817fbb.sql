-- Add new fields to audition_notices table
ALTER TABLE public.audition_notices
ADD COLUMN IF NOT EXISTS logline TEXT,
ADD COLUMN IF NOT EXISTS synopsis TEXT,
ADD COLUMN IF NOT EXISTS shoot_city TEXT,
ADD COLUMN IF NOT EXISTS shoot_country TEXT,
ADD COLUMN IF NOT EXISTS audition_window TEXT,
ADD COLUMN IF NOT EXISTS callback_dates TEXT,
ADD COLUMN IF NOT EXISTS self_tape_deadline TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS location_type TEXT,
ADD COLUMN IF NOT EXISTS travel_lodging TEXT,
ADD COLUMN IF NOT EXISTS travel_details TEXT,
ADD COLUMN IF NOT EXISTS compensation_type TEXT,
ADD COLUMN IF NOT EXISTS compensation_rate TEXT,
ADD COLUMN IF NOT EXISTS usage_terms TEXT,
ADD COLUMN IF NOT EXISTS agent_fee_included BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS conflicts TEXT,
ADD COLUMN IF NOT EXISTS has_nudity BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_intimacy BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_violence BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS safety_details TEXT,
ADD COLUMN IF NOT EXISTS has_minors BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS headshot_url TEXT,
ADD COLUMN IF NOT EXISTS resume_url TEXT,
ADD COLUMN IF NOT EXISTS slate_link TEXT,
ADD COLUMN IF NOT EXISTS reel_link TEXT,
ADD COLUMN IF NOT EXISTS additional_materials TEXT,
ADD COLUMN IF NOT EXISTS posting_targets TEXT[],
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public',
ADD COLUMN IF NOT EXISTS production_company TEXT,
ADD COLUMN IF NOT EXISTS director_cd TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS website TEXT;

-- Create audition_roles table for multiple roles per audition
CREATE TABLE IF NOT EXISTS public.audition_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audition_id UUID NOT NULL REFERENCES public.audition_notices(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL,
  role_type TEXT,
  age_range TEXT,
  gender_presentation TEXT,
  open_ethnicity BOOLEAN DEFAULT true,
  skills TEXT,
  description TEXT NOT NULL,
  work_dates TEXT,
  rate TEXT,
  sides_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audition_roles
ALTER TABLE public.audition_roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for audition_roles
CREATE POLICY "Everyone can view roles for active auditions"
ON public.audition_roles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.audition_notices
    WHERE id = audition_roles.audition_id
    AND (status = 'active' OR user_id = auth.uid())
  )
);

CREATE POLICY "Users can create roles for their auditions"
ON public.audition_roles
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.audition_notices
    WHERE id = audition_roles.audition_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update roles for their auditions"
ON public.audition_roles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.audition_notices
    WHERE id = audition_roles.audition_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete roles for their auditions"
ON public.audition_roles
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.audition_notices
    WHERE id = audition_roles.audition_id
    AND user_id = auth.uid()
  )
);

-- Create trigger for updated_at on audition_roles
CREATE TRIGGER update_audition_roles_updated_at
  BEFORE UPDATE ON public.audition_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();