-- Create audition_notices table for professional casting breakdowns
CREATE TABLE public.audition_notices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_name TEXT NOT NULL,
  project_type TEXT NOT NULL,
  union_status TEXT,
  
  -- Production Credits
  producer TEXT,
  director TEXT,
  casting_director TEXT,
  line_producer TEXT,
  first_ad TEXT,
  additional_credits TEXT,
  
  -- Dates & Location
  audition_date TIMESTAMPTZ,
  shoot_start_date DATE,
  shoot_end_date DATE,
  location TEXT NOT NULL,
  
  -- Role Details
  role_name TEXT NOT NULL,
  role_description TEXT NOT NULL,
  character_background TEXT,
  ethnicity_requirement TEXT,
  age_range TEXT,
  gender_preference TEXT,
  work_type TEXT NOT NULL,
  
  -- Compensation & Work Details
  rate_of_pay TEXT NOT NULL,
  work_dates TEXT,
  work_location TEXT,
  
  -- Project Story
  storyline TEXT NOT NULL,
  genre TEXT,
  
  -- Submission Requirements
  submission_deadline DATE NOT NULL,
  materials_required TEXT[],
  special_instructions TEXT,
  allow_online_demo BOOLEAN DEFAULT true,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audition_notices ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Everyone can view active audition notices"
ON public.audition_notices
FOR SELECT
USING (status = 'active' OR user_id = auth.uid());

CREATE POLICY "Users can create their own audition notices"
ON public.audition_notices
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audition notices"
ON public.audition_notices
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audition notices"
ON public.audition_notices
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_audition_notices_updated_at
BEFORE UPDATE ON public.audition_notices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();