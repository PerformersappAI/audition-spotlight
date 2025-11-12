-- Create course discussions table
CREATE TABLE public.course_discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create discussion replies table
CREATE TABLE public.discussion_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES public.course_discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_solution BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_discussions
CREATE POLICY "Anyone can view discussions"
  ON public.course_discussions
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create discussions"
  ON public.course_discussions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own discussions"
  ON public.course_discussions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any discussion"
  ON public.course_discussions
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can delete own discussions"
  ON public.course_discussions
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any discussion"
  ON public.course_discussions
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for discussion_replies
CREATE POLICY "Anyone can view replies"
  ON public.discussion_replies
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON public.discussion_replies
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own replies"
  ON public.discussion_replies
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any reply"
  ON public.discussion_replies
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can delete own replies"
  ON public.discussion_replies
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any reply"
  ON public.discussion_replies
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX idx_course_discussions_course_id ON public.course_discussions(course_id);
CREATE INDEX idx_course_discussions_user_id ON public.course_discussions(user_id);
CREATE INDEX idx_discussion_replies_discussion_id ON public.discussion_replies(discussion_id);
CREATE INDEX idx_discussion_replies_user_id ON public.discussion_replies(user_id);

-- Trigger for updating updated_at
CREATE TRIGGER update_course_discussions_updated_at
  BEFORE UPDATE ON public.course_discussions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discussion_replies_updated_at
  BEFORE UPDATE ON public.discussion_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();