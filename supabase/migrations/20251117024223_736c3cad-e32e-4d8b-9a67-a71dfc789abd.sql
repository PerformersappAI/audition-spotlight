-- Create call_sheets table
CREATE TABLE public.call_sheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Header Information
  production_company TEXT NOT NULL,
  project_name TEXT NOT NULL,
  shoot_date DATE NOT NULL,
  day_number TEXT,
  script_color TEXT DEFAULT 'White',
  schedule_color TEXT DEFAULT 'White',
  
  -- Call Times
  general_crew_call TIME,
  shooting_call TIME,
  lunch_time TIME,
  courtesy_breakfast_time TIME,
  wrap_time TIME,
  
  -- Key Personnel
  executive_producers TEXT[],
  producers TEXT[],
  director TEXT,
  associate_director TEXT,
  line_producer TEXT,
  upm TEXT,
  
  -- Location & Safety
  production_office_address TEXT,
  shooting_location TEXT,
  location_address TEXT,
  crew_parking TEXT,
  basecamp TEXT,
  nearest_hospital TEXT,
  hospital_address TEXT,
  
  -- Weather
  weather_description TEXT,
  high_temp TEXT,
  low_temp TEXT,
  sunrise_time TEXT,
  sunset_time TEXT,
  dawn_time TEXT,
  twilight_time TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT call_sheets_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create call_sheet_scenes table
CREATE TABLE public.call_sheet_scenes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_sheet_id UUID NOT NULL,
  scene_number TEXT NOT NULL,
  pages TEXT,
  set_description TEXT NOT NULL,
  day_night TEXT,
  cast_ids TEXT[],
  notes TEXT,
  location TEXT,
  order_index INTEGER DEFAULT 0,
  
  CONSTRAINT call_sheet_scenes_call_sheet_id_fkey FOREIGN KEY (call_sheet_id) REFERENCES public.call_sheets(id) ON DELETE CASCADE
);

-- Create call_sheet_cast table
CREATE TABLE public.call_sheet_cast (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_sheet_id UUID NOT NULL,
  cast_id TEXT,
  character_name TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  status TEXT,
  pickup_time TIME,
  call_time TIME,
  set_ready_time TIME,
  special_instructions TEXT,
  order_index INTEGER DEFAULT 0,
  
  CONSTRAINT call_sheet_cast_call_sheet_id_fkey FOREIGN KEY (call_sheet_id) REFERENCES public.call_sheets(id) ON DELETE CASCADE
);

-- Create call_sheet_crew table
CREATE TABLE public.call_sheet_crew (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_sheet_id UUID NOT NULL,
  department TEXT NOT NULL,
  title TEXT NOT NULL,
  name TEXT NOT NULL,
  call_time TIME,
  order_index INTEGER DEFAULT 0,
  
  CONSTRAINT call_sheet_crew_call_sheet_id_fkey FOREIGN KEY (call_sheet_id) REFERENCES public.call_sheets(id) ON DELETE CASCADE
);

-- Create call_sheet_background table
CREATE TABLE public.call_sheet_background (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_sheet_id UUID NOT NULL,
  quantity INTEGER,
  description TEXT NOT NULL,
  call_time TIME,
  notes TEXT,
  
  CONSTRAINT call_sheet_background_call_sheet_id_fkey FOREIGN KEY (call_sheet_id) REFERENCES public.call_sheets(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.call_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_sheet_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_sheet_cast ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_sheet_crew ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_sheet_background ENABLE ROW LEVEL SECURITY;

-- Create policies for call_sheets
CREATE POLICY "Users can view their own call sheets"
ON public.call_sheets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own call sheets"
ON public.call_sheets FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own call sheets"
ON public.call_sheets FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own call sheets"
ON public.call_sheets FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for call_sheet_scenes
CREATE POLICY "Users can view scenes for their call sheets"
ON public.call_sheet_scenes FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.call_sheets
  WHERE call_sheets.id = call_sheet_scenes.call_sheet_id
  AND call_sheets.user_id = auth.uid()
));

CREATE POLICY "Users can create scenes for their call sheets"
ON public.call_sheet_scenes FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.call_sheets
  WHERE call_sheets.id = call_sheet_scenes.call_sheet_id
  AND call_sheets.user_id = auth.uid()
));

CREATE POLICY "Users can update scenes for their call sheets"
ON public.call_sheet_scenes FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.call_sheets
  WHERE call_sheets.id = call_sheet_scenes.call_sheet_id
  AND call_sheets.user_id = auth.uid()
));

CREATE POLICY "Users can delete scenes for their call sheets"
ON public.call_sheet_scenes FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.call_sheets
  WHERE call_sheets.id = call_sheet_scenes.call_sheet_id
  AND call_sheets.user_id = auth.uid()
));

-- Create policies for call_sheet_cast (same pattern)
CREATE POLICY "Users can view cast for their call sheets"
ON public.call_sheet_cast FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.call_sheets
  WHERE call_sheets.id = call_sheet_cast.call_sheet_id
  AND call_sheets.user_id = auth.uid()
));

CREATE POLICY "Users can create cast for their call sheets"
ON public.call_sheet_cast FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.call_sheets
  WHERE call_sheets.id = call_sheet_cast.call_sheet_id
  AND call_sheets.user_id = auth.uid()
));

CREATE POLICY "Users can update cast for their call sheets"
ON public.call_sheet_cast FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.call_sheets
  WHERE call_sheets.id = call_sheet_cast.call_sheet_id
  AND call_sheets.user_id = auth.uid()
));

CREATE POLICY "Users can delete cast for their call sheets"
ON public.call_sheet_cast FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.call_sheets
  WHERE call_sheets.id = call_sheet_cast.call_sheet_id
  AND call_sheets.user_id = auth.uid()
));

-- Create policies for call_sheet_crew (same pattern)
CREATE POLICY "Users can view crew for their call sheets"
ON public.call_sheet_crew FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.call_sheets
  WHERE call_sheets.id = call_sheet_crew.call_sheet_id
  AND call_sheets.user_id = auth.uid()
));

CREATE POLICY "Users can create crew for their call sheets"
ON public.call_sheet_crew FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.call_sheets
  WHERE call_sheets.id = call_sheet_crew.call_sheet_id
  AND call_sheets.user_id = auth.uid()
));

CREATE POLICY "Users can update crew for their call sheets"
ON public.call_sheet_crew FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.call_sheets
  WHERE call_sheets.id = call_sheet_crew.call_sheet_id
  AND call_sheets.user_id = auth.uid()
));

CREATE POLICY "Users can delete crew for their call sheets"
ON public.call_sheet_crew FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.call_sheets
  WHERE call_sheets.id = call_sheet_crew.call_sheet_id
  AND call_sheets.user_id = auth.uid()
));

-- Create policies for call_sheet_background (same pattern)
CREATE POLICY "Users can view background for their call sheets"
ON public.call_sheet_background FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.call_sheets
  WHERE call_sheets.id = call_sheet_background.call_sheet_id
  AND call_sheets.user_id = auth.uid()
));

CREATE POLICY "Users can create background for their call sheets"
ON public.call_sheet_background FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.call_sheets
  WHERE call_sheets.id = call_sheet_background.call_sheet_id
  AND call_sheets.user_id = auth.uid()
));

CREATE POLICY "Users can update background for their call sheets"
ON public.call_sheet_background FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.call_sheets
  WHERE call_sheets.id = call_sheet_background.call_sheet_id
  AND call_sheets.user_id = auth.uid()
));

CREATE POLICY "Users can delete background for their call sheets"
ON public.call_sheet_background FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.call_sheets
  WHERE call_sheets.id = call_sheet_background.call_sheet_id
  AND call_sheets.user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_call_sheet_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_call_sheets_updated_at
BEFORE UPDATE ON public.call_sheets
FOR EACH ROW
EXECUTE FUNCTION public.update_call_sheet_updated_at_column();