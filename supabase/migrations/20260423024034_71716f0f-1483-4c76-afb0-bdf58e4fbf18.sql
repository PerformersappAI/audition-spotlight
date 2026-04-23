
ALTER TABLE public.storyboard_projects ADD COLUMN IF NOT EXISTS animatic_url TEXT;

INSERT INTO storage.buckets (id, name, public)
VALUES ('storyboard-animatics', 'storyboard-animatics', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view animatics"
ON storage.objects FOR SELECT
USING (bucket_id = 'storyboard-animatics');

CREATE POLICY "Authenticated users can upload animatics"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'storyboard-animatics' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own animatics"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'storyboard-animatics' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own animatics"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'storyboard-animatics' AND auth.uid()::text = (storage.foldername(name))[1]);
