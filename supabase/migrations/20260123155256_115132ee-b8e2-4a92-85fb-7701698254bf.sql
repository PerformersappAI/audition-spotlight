-- Add new columns to call_sheets table
ALTER TABLE public.call_sheets
ADD COLUMN IF NOT EXISTS lx_precall_time TIME,
ADD COLUMN IF NOT EXISTS unit_call_time TIME,
ADD COLUMN IF NOT EXISTS current_schedule TEXT,
ADD COLUMN IF NOT EXISTS current_script TEXT,
ADD COLUMN IF NOT EXISTS unit_base TEXT,
ADD COLUMN IF NOT EXISTS unit_base_address TEXT;

-- Add new columns to call_sheet_cast table
ALTER TABLE public.call_sheet_cast
ADD COLUMN IF NOT EXISTS swf TEXT,
ADD COLUMN IF NOT EXISTS makeup_time TIME,
ADD COLUMN IF NOT EXISTS costume_time TIME,
ADD COLUMN IF NOT EXISTS travel_time TIME,
ADD COLUMN IF NOT EXISTS on_set_time TIME;

-- Add new columns to call_sheet_scenes table
ALTER TABLE public.call_sheet_scenes
ADD COLUMN IF NOT EXISTS start_time TIME,
ADD COLUMN IF NOT EXISTS int_ext TEXT;

-- Create call_sheet_breaks table
CREATE TABLE IF NOT EXISTS public.call_sheet_breaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_sheet_id UUID NOT NULL REFERENCES public.call_sheets(id) ON DELETE CASCADE,
  break_type TEXT NOT NULL,
  after_scene_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create call_sheet_requirements table
CREATE TABLE IF NOT EXISTS public.call_sheet_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_sheet_id UUID NOT NULL REFERENCES public.call_sheets(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.call_sheet_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_sheet_requirements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for call_sheet_breaks
CREATE POLICY "Users can view their own call sheet breaks"
ON public.call_sheet_breaks
FOR SELECT
USING (
  call_sheet_id IN (
    SELECT id FROM public.call_sheets WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create breaks for their call sheets"
ON public.call_sheet_breaks
FOR INSERT
WITH CHECK (
  call_sheet_id IN (
    SELECT id FROM public.call_sheets WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own call sheet breaks"
ON public.call_sheet_breaks
FOR UPDATE
USING (
  call_sheet_id IN (
    SELECT id FROM public.call_sheets WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own call sheet breaks"
ON public.call_sheet_breaks
FOR DELETE
USING (
  call_sheet_id IN (
    SELECT id FROM public.call_sheets WHERE user_id = auth.uid()
  )
);

-- Create RLS policies for call_sheet_requirements
CREATE POLICY "Users can view their own call sheet requirements"
ON public.call_sheet_requirements
FOR SELECT
USING (
  call_sheet_id IN (
    SELECT id FROM public.call_sheets WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create requirements for their call sheets"
ON public.call_sheet_requirements
FOR INSERT
WITH CHECK (
  call_sheet_id IN (
    SELECT id FROM public.call_sheets WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own call sheet requirements"
ON public.call_sheet_requirements
FOR UPDATE
USING (
  call_sheet_id IN (
    SELECT id FROM public.call_sheets WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own call sheet requirements"
ON public.call_sheet_requirements
FOR DELETE
USING (
  call_sheet_id IN (
    SELECT id FROM public.call_sheets WHERE user_id = auth.uid()
  )
);