-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('filmmaker', 'film_festival', 'admin');

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  bio TEXT,
  role user_role NOT NULL DEFAULT 'filmmaker',
  location TEXT,
  website TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table for audition notices
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  project_type TEXT NOT NULL DEFAULT 'film', -- film, tv, commercial, theater, etc
  casting_director TEXT,
  production_company TEXT,
  location TEXT,
  audition_date TIMESTAMP WITH TIME ZONE,
  deadline_date TIMESTAMP WITH TIME ZONE,
  age_range TEXT,
  gender_preference TEXT,
  compensation TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  requirements TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active, closed, draft
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create film festivals table
CREATE TABLE public.film_festivals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  submission_deadline DATE,
  website TEXT,
  submission_fee TEXT,
  categories TEXT[], -- array of festival categories
  requirements TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active, closed, draft
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table for tracking applications to projects
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  film_festival_id UUID REFERENCES public.film_festivals(id) ON DELETE CASCADE,
  applicant_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
  notes TEXT,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT application_type_check CHECK (
    (project_id IS NOT NULL AND film_festival_id IS NULL) OR 
    (project_id IS NULL AND film_festival_id IS NOT NULL)
  )
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.film_festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for projects
CREATE POLICY "Everyone can view active projects" ON public.projects FOR SELECT USING (status = 'active' OR user_id = auth.uid());
CREATE POLICY "Users can create own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for film festivals
CREATE POLICY "Everyone can view active festivals" ON public.film_festivals FOR SELECT USING (status = 'active' OR user_id = auth.uid());
CREATE POLICY "Users can create own festivals" ON public.film_festivals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own festivals" ON public.film_festivals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own festivals" ON public.film_festivals FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for applications
CREATE POLICY "Users can view related applications" ON public.applications FOR SELECT USING (
  applicant_user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.film_festivals f WHERE f.id = film_festival_id AND f.user_id = auth.uid())
);
CREATE POLICY "Users can create applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = applicant_user_id);
CREATE POLICY "Project owners can update applications" ON public.applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.film_festivals f WHERE f.id = film_festival_id AND f.user_id = auth.uid())
);

-- Create functions to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_film_festivals_updated_at BEFORE UPDATE ON public.film_festivals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger to run function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();