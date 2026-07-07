
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  cover_image text,
  body text NOT NULL,
  author_name text DEFAULT 'FilmmakerGenius',
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blog posts"
  ON public.blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can insert blog posts"
  ON public.blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
  ON public.blog_posts FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts"
  ON public.blog_posts FOR DELETE
  TO authenticated
  USING (true);

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_blog_posts_published_at ON public.blog_posts(published_at DESC) WHERE published = true;
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);

INSERT INTO public.blog_posts (title, slug, excerpt, cover_image, body, author_name, published, published_at)
VALUES (
  'How to Run Your Entire Indie Film Production in One Place',
  'run-your-entire-indie-film-production-in-one-place',
  'Indie filmmakers waste weeks stitching together tools for scripts, storyboards, crew, and casting. Here''s how FilmmakerGenius puts the whole production in a single system.',
  null,
  E'Making an indie film shouldn''t require twelve different apps, four spreadsheets, and a folder of PDFs nobody can find. Most independent productions burn more time on logistics than on the actual movie.\n\nFilmmakerGenius exists to fix that. Upload your script once, and every downstream step — table reads, storyboards, crew, contracts, casting — flows from the same source of truth.\n\n## What you can do in one place\n\nThe platform is built around the real phases of an indie shoot, not abstract project-management theory. From a single script upload you can:\n\n- Generate an AI table read with distinct voices per character\n- Build a visual storyboard scene by scene\n- Draft crew agreements and contracts from templates\n- Push casting notices straight to GotAuditions and receive submissions back\n- Track your production calendar and call sheets alongside everything else\n\n## Why one system beats ten tabs\n\nWhen your script, your storyboard, and your casting notice all live in the same place, a change in one propagates everywhere. Rename a character, and your table read, your sides, and your casting call update together. That''s the difference between software built for indie filmmakers and generic tools bent into shape.\n\nStart free, upload a script, and run the next production the way it should have worked all along.',
  'FilmmakerGenius',
  true,
  now()
);
