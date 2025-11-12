-- Create academy_courses table
CREATE TABLE academy_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'pre-production', 'production', 'post-production', 'distribution', 'funding'
  instructor TEXT DEFAULT 'Feifer Film Academy',
  duration_hours INTEGER,
  level TEXT, -- 'beginner', 'intermediate', 'advanced'
  thumbnail_url TEXT,
  video_url TEXT,
  materials_url TEXT,
  related_tool TEXT, -- Links to toolbox modules: 'script_analysis', 'storyboarding', etc
  price_credits INTEGER DEFAULT 0, -- 0 for free courses
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_course_progress table
CREATE TABLE user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  progress_percentage INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create user_certifications table
CREATE TABLE user_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE,
  issued_at TIMESTAMPTZ DEFAULT now(),
  certificate_url TEXT, -- Generated PDF certificate
  skills_earned TEXT[], -- Array of skills learned
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE academy_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_certifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for academy_courses
CREATE POLICY "Everyone can view active courses"
  ON academy_courses FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert courses"
  ON academy_courses FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update courses"
  ON academy_courses FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete courses"
  ON academy_courses FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for user_course_progress
CREATE POLICY "Users can view own progress"
  ON user_course_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_course_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_course_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for user_certifications
CREATE POLICY "Users can view own certifications"
  ON user_certifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert certifications"
  ON user_certifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_academy_courses_category ON academy_courses(category);
CREATE INDEX idx_academy_courses_related_tool ON academy_courses(related_tool);
CREATE INDEX idx_academy_courses_featured ON academy_courses(is_featured);
CREATE INDEX idx_user_course_progress_user_id ON user_course_progress(user_id);
CREATE INDEX idx_user_course_progress_course_id ON user_course_progress(course_id);
CREATE INDEX idx_user_certifications_user_id ON user_certifications(user_id);

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_academy_courses_updated_at
  BEFORE UPDATE ON academy_courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_course_progress_updated_at
  BEFORE UPDATE ON user_course_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed initial courses
INSERT INTO academy_courses (title, description, category, duration_hours, level, related_tool, is_featured, order_index) VALUES
  -- Pre-Production Courses
  ('Script Breakdown Fundamentals', 'Master the art of breaking down scripts for production planning. Learn to identify all elements needed for shooting, from props to locations.', 'pre-production', 8, 'beginner', 'script_analysis', true, 1),
  
  ('Storyboarding for Indie Features', 'Create professional storyboards that communicate your vision effectively. Perfect for low-budget productions.', 'pre-production', 6, 'beginner', 'storyboarding', true, 2),
  
  ('Budgeting & Scheduling Essentials', 'Learn to create realistic budgets and shooting schedules for independent films. Maximize your resources and minimize waste.', 'pre-production', 10, 'intermediate', 'calendar', true, 3),
  
  ('Location Scouting & Management', 'Find and secure the perfect locations for your film. Includes contracts, permits, and location management best practices.', 'pre-production', 5, 'beginner', null, false, 4),
  
  ('Casting & Working with Actors', 'Discover effective casting strategies and learn to direct actors on indie budgets. Build your talent network.', 'pre-production', 7, 'intermediate', 'auditions', false, 5),
  
  -- Production Courses
  ('On-Set Protocols & Safety', 'Essential safety protocols and professional on-set behavior. Create a safe and efficient shooting environment.', 'production', 4, 'beginner', null, false, 6),
  
  ('Directing Actors on Indie Budgets', 'Get authentic performances without spending a fortune. Communication techniques and actor direction strategies.', 'production', 8, 'intermediate', null, false, 7),
  
  ('Camera & Lighting Basics', 'Understand camera operation and lighting fundamentals for cinematic storytelling on any budget.', 'production', 12, 'beginner', null, false, 8),
  
  ('Sound Recording for Film', 'Capture professional-quality audio in challenging environments. Essential for indie filmmakers.', 'production', 6, 'beginner', null, false, 9),
  
  -- Post-Production Courses
  ('Editing Workflow for Indies', 'Efficient editing workflows that save time and money. From rough cut to final picture lock.', 'post-production', 10, 'intermediate', null, false, 10),
  
  ('Sound Design on a Budget', 'Create immersive soundscapes without expensive libraries. DIY sound design techniques that work.', 'post-production', 7, 'intermediate', null, false, 11),
  
  ('Color Grading Fundamentals', 'Learn to color grade your films to achieve a professional cinematic look using accessible tools.', 'post-production', 8, 'beginner', null, false, 12),
  
  -- Distribution Courses
  ('Festival Strategy & Submissions', 'Navigate the film festival circuit strategically. Maximize your chances of acceptance and build buzz.', 'distribution', 6, 'intermediate', 'festivals', true, 13),
  
  ('Building Your EPK', 'Create a compelling Electronic Press Kit that gets attention from distributors and press.', 'distribution', 4, 'beginner', 'docs_library', false, 14),
  
  ('DIY Film Distribution', 'Self-distribution strategies for the modern filmmaker. Own your distribution and maximize profits.', 'distribution', 9, 'advanced', null, false, 15),
  
  -- Funding Courses
  ('Crowdfunding Campaigns That Work', 'Plan and execute successful crowdfunding campaigns. From Kickstarter to Indiegogo, learn what works.', 'funding', 6, 'beginner', null, false, 16),
  
  ('Grants & Sponsorships', 'Find and apply for film grants and sponsorships. Templates and strategies that get funded.', 'funding', 5, 'intermediate', null, false, 17),
  
  ('Pitching to Investors', 'Craft compelling pitches that attract investment. Learn to present your vision professionally.', 'funding', 7, 'advanced', null, false, 18);