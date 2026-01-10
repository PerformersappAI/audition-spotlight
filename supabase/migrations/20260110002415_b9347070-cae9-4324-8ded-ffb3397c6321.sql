-- Create homepage settings table for admin-managed content
CREATE TABLE public.homepage_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homepage_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view homepage settings (public content)
CREATE POLICY "Anyone can view homepage settings"
  ON public.homepage_settings
  FOR SELECT
  USING (true);

-- Only admins can insert homepage settings
CREATE POLICY "Admins can insert homepage settings"
  ON public.homepage_settings
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Only admins can update homepage settings
CREATE POLICY "Admins can update homepage settings"
  ON public.homepage_settings
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Only admins can delete homepage settings
CREATE POLICY "Admins can delete homepage settings"
  ON public.homepage_settings
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Insert default YouTube video setting
INSERT INTO public.homepage_settings (setting_key, setting_value)
VALUES ('homepage_youtube_url', '');