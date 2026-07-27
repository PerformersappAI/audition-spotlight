
CREATE POLICY "Public read blog-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Admins upload blog-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update blog-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete blog-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION public.publish_due_blog_posts()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.blog_posts
     SET published = true,
         published_at = COALESCE(published_at, now()),
         scheduled_for = NULL
   WHERE published = false
     AND scheduled_for IS NOT NULL
     AND scheduled_for <= now();
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'publish-due-blog-posts') THEN
    PERFORM cron.schedule(
      'publish-due-blog-posts',
      '*/15 * * * *',
      $cron$ SELECT public.publish_due_blog_posts(); $cron$
    );
  END IF;
END $$;
