-- Create storage bucket for character reference images
INSERT INTO storage.buckets (id, name, public)
VALUES ('storyboard-characters', 'storyboard-characters', true);

-- RLS policy: Users can upload their own character images
CREATE POLICY "Users can upload character images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'storyboard-characters');

-- RLS policy: Anyone can view character images (public bucket)
CREATE POLICY "Anyone can view character images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'storyboard-characters');

-- RLS policy: Users can delete their own character images
CREATE POLICY "Users can delete their character images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'storyboard-characters' AND owner = auth.uid());