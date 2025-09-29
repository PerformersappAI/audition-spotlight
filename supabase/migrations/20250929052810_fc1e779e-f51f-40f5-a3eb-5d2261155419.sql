-- Create table for script analyses
CREATE TABLE public.script_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  script_text TEXT NOT NULL,
  genre TEXT,
  tone TEXT,
  selected_directors TEXT[],
  character_count INTEGER DEFAULT 0,
  analysis_result JSONB,
  confidence_score DECIMAL(3,2), -- For anti-hallucination scoring
  is_validated BOOLEAN DEFAULT false, -- Manual validation flag
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storyboard projects
CREATE TABLE public.storyboard_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  script_text TEXT NOT NULL,
  genre TEXT,
  tone TEXT,
  character_count INTEGER DEFAULT 0,
  shots JSONB, -- Array of shot breakdowns
  storyboard_frames JSONB, -- Array of generated frames
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.script_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storyboard_projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for script_analyses
CREATE POLICY "Users can view their own script analyses" 
ON public.script_analyses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own script analyses" 
ON public.script_analyses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own script analyses" 
ON public.script_analyses 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own script analyses" 
ON public.script_analyses 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for storyboard_projects
CREATE POLICY "Users can view their own storyboard projects" 
ON public.storyboard_projects 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own storyboard projects" 
ON public.storyboard_projects 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own storyboard projects" 
ON public.storyboard_projects 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own storyboard projects" 
ON public.storyboard_projects 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_script_analyses_updated_at
BEFORE UPDATE ON public.script_analyses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_storyboard_projects_updated_at
BEFORE UPDATE ON public.storyboard_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_script_analyses_user_id ON public.script_analyses(user_id);
CREATE INDEX idx_script_analyses_created_at ON public.script_analyses(created_at DESC);
CREATE INDEX idx_storyboard_projects_user_id ON public.storyboard_projects(user_id);
CREATE INDEX idx_storyboard_projects_created_at ON public.storyboard_projects(created_at DESC);