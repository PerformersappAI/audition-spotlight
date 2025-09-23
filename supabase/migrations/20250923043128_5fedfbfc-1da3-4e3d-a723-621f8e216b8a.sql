-- Add additional fields to film_festivals table for comprehensive festival data
ALTER TABLE public.film_festivals 
ADD COLUMN IF NOT EXISTS submission_url text,
ADD COLUMN IF NOT EXISTS filmfreeway_url text,
ADD COLUMN IF NOT EXISTS festival_tier text DEFAULT 'Regional',
ADD COLUMN IF NOT EXISTS genres text[],
ADD COLUMN IF NOT EXISTS entry_fees_range text,
ADD COLUMN IF NOT EXISTS awards text[],
ADD COLUMN IF NOT EXISTS acceptance_rate numeric,
ADD COLUMN IF NOT EXISTS early_deadline date,
ADD COLUMN IF NOT EXISTS late_deadline date,
ADD COLUMN IF NOT EXISTS notification_date date;

-- Insert comprehensive festival data
INSERT INTO public.film_festivals (
  name, location, description, start_date, end_date, submission_deadline, 
  early_deadline, late_deadline, submission_url, filmfreeway_url, 
  festival_tier, genres, entry_fees_range, categories, website, 
  contact_email, user_id, status
) VALUES 
-- Tier 1 - Major International Festivals
('Sundance Film Festival', 'Park City, Utah, USA', 'Premier independent film festival showcasing new work from American and international independent filmmakers', '2025-01-23', '2025-02-02', '2024-09-19', '2024-08-29', '2024-09-19', 'https://www.sundance.org/festivals/sundance-film-festival/', 'https://filmfreeway.com/SundanceFilmFestival', 'Tier 1', ARRAY['Drama', 'Documentary', 'Comedy', 'Thriller', 'Horror'], '$65-125', ARRAY['Feature', 'Short', 'Documentary'], 'https://www.sundance.org/', 'programming@sundance.org', '00000000-0000-0000-0000-000000000000', 'active'),

('Cannes Film Festival', 'Cannes, France', 'The world''s most prestigious film festival, showcasing new films from acclaimed international filmmakers', '2025-05-13', '2025-05-24', '2025-02-28', '2025-01-31', '2025-02-28', 'https://www.festival-cannes.com/en/participate/regulations/', 'https://filmfreeway.com/CannesFilmFestival', 'Tier 1', ARRAY['Drama', 'Art House', 'International'], '$0', ARRAY['Feature', 'Short'], 'https://www.festival-cannes.com/', 'selection@festival-cannes.fr', '00000000-0000-0000-0000-000000000000', 'active'),

('Toronto International Film Festival', 'Toronto, Ontario, Canada', 'One of the largest publicly attended film festivals in the world', '2025-09-04', '2025-09-14', '2025-06-06', '2025-05-09', '2025-06-06', 'https://www.tiff.net/submissions/', 'https://filmfreeway.com/TIFF', 'Tier 1', ARRAY['Drama', 'Documentary', 'International', 'Comedy'], '$105-165', ARRAY['Feature', 'Short', 'Documentary'], 'https://www.tiff.net/', 'programming@tiff.net', '00000000-0000-0000-0000-000000000000', 'active'),

('Berlin International Film Festival', 'Berlin, Germany', 'Major international film festival showcasing artistic cinema', '2025-02-13', '2025-02-23', '2024-11-01', '2024-10-01', '2024-11-01', 'https://www.berlinale.de/en/participate/', 'https://filmfreeway.com/Berlinale', 'Tier 1', ARRAY['Drama', 'Art House', 'International'], '$0', ARRAY['Feature', 'Short', 'Documentary'], 'https://www.berlinale.de/', 'info@berlinale.de', '00000000-0000-0000-0000-000000000000', 'active'),

('Venice International Film Festival', 'Venice, Italy', 'Oldest film festival in the world, part of the Venice Biennale', '2025-08-27', '2025-09-06', '2025-05-30', '2025-04-30', '2025-05-30', 'https://www.labiennale.org/en/cinema/2025/participation', '', 'Tier 1', ARRAY['Drama', 'Art House', 'International'], '$0', ARRAY['Feature', 'Short'], 'https://www.labiennale.org/', 'cinema@labiennale.org', '00000000-0000-0000-0000-000000000000', 'active'),

-- Tier 2 - Major Regional/Genre Festivals
('SXSW Film Festival', 'Austin, Texas, USA', 'Showcasing the most innovative, smart, and entertaining new films', '2025-03-07', '2025-03-16', '2024-12-06', '2024-11-08', '2024-12-06', 'https://www.sxsw.com/apply-to-participate/', 'https://filmfreeway.com/sxsw', 'Tier 2', ARRAY['Comedy', 'Drama', 'Documentary', 'Music'], '$45-65', ARRAY['Feature', 'Short', 'Documentary'], 'https://www.sxsw.com/', 'film@sxsw.com', '00000000-0000-0000-0000-000000000000', 'active'),

('Tribeca Film Festival', 'New York, New York, USA', 'Celebrating independent filmmaking and diverse stories', '2025-06-04', '2025-06-15', '2025-02-21', '2025-01-24', '2025-02-21', 'https://tribecafilm.com/festival/submissions/', 'https://filmfreeway.com/TribecaFilmFestival', 'Tier 2', ARRAY['Drama', 'Documentary', 'Comedy'], '$70-90', ARRAY['Feature', 'Short', 'Documentary'], 'https://tribecafilm.com/', 'programming@tribecafilm.com', '00000000-0000-0000-0000-000000000000', 'active'),

('Fantastic Fest', 'Austin, Texas, USA', 'The largest genre film festival in the US', '2025-09-18', '2025-09-25', '2025-06-13', '2025-05-16', '2025-06-13', 'https://fantasticfest.com/submissions/', 'https://filmfreeway.com/FantasticFest', 'Tier 2', ARRAY['Horror', 'Thriller', 'Sci-Fi', 'Fantasy'], '$35-55', ARRAY['Feature', 'Short'], 'https://fantasticfest.com/', 'programming@fantasticfest.com', '00000000-0000-0000-0000-000000000000', 'active'),

('Hot Docs', 'Toronto, Ontario, Canada', 'North America''s largest documentary festival', '2025-04-24', '2025-05-04', '2025-01-10', '2024-12-06', '2025-01-10', 'https://hotdocs.ca/festival/submissions/', 'https://filmfreeway.com/HotDocs', 'Tier 2', ARRAY['Documentary'], '$45-75', ARRAY['Documentary'], 'https://hotdocs.ca/', 'programming@hotdocs.ca', '00000000-0000-0000-0000-000000000000', 'active'),

-- Tier 3 - Strong Regional Festivals
('Nashville Film Festival', 'Nashville, Tennessee, USA', 'Celebrating independent filmmaking with music integration', '2025-09-26', '2025-10-05', '2025-06-20', '2025-05-23', '2025-06-20', 'https://nashfilm.org/submissions/', 'https://filmfreeway.com/NashvilleFilmFestival', 'Regional', ARRAY['Drama', 'Music', 'Documentary'], '$35-55', ARRAY['Feature', 'Short', 'Documentary'], 'https://nashfilm.org/', 'programming@nashfilm.org', '00000000-0000-0000-0000-000000000000', 'active'),

('Heartland Film Festival', 'Indianapolis, Indiana, USA', 'Inspiring audiences through film', '2025-10-17', '2025-10-26', '2025-07-18', '2025-06-20', '2025-07-18', 'https://heartlandfilm.org/submissions/', 'https://filmfreeway.com/HeartlandFilmFestival', 'Regional', ARRAY['Drama', 'Family', 'Documentary'], '$35-65', ARRAY['Feature', 'Short', 'Documentary'], 'https://heartlandfilm.org/', 'programming@heartlandfilm.org', '00000000-0000-0000-0000-000000000000', 'active'),

('Austin Film Festival', 'Austin, Texas, USA', 'The writers festival focusing on story and screenwriting', '2025-10-23', '2025-10-30', '2025-07-11', '2025-06-13', '2025-07-11', 'https://austinfilmfestival.com/submit/', 'https://filmfreeway.com/AustinFilmFestival', 'Regional', ARRAY['Drama', 'Comedy', 'Screenplay'], '$40-60', ARRAY['Feature', 'Short', 'Screenplay'], 'https://austinfilmfestival.com/', 'programming@austinfilmfestival.com', '00000000-0000-0000-0000-000000000000', 'active'),

('Maryland Film Festival', 'Baltimore, Maryland, USA', 'Celebrating bold, smart films', '2025-05-01', '2025-05-11', '2025-02-14', '2025-01-17', '2025-02-14', 'https://md-filmfest.com/submissions/', 'https://filmfreeway.com/MarylandFilmFestival', 'Regional', ARRAY['Drama', 'Documentary', 'International'], '$25-45', ARRAY['Feature', 'Short', 'Documentary'], 'https://md-filmfest.com/', 'programming@md-filmfest.com', '00000000-0000-0000-0000-000000000000', 'active'),

('Sidewalk Film Festival', 'Birmingham, Alabama, USA', 'Showcasing independent films in the South', '2025-08-22', '2025-08-31', '2025-05-16', '2025-04-18', '2025-05-16', 'https://sidewalkfest.com/submissions/', 'https://filmfreeway.com/SidewalkFilmFestival', 'Regional', ARRAY['Drama', 'Documentary', 'Comedy'], '$25-45', ARRAY['Feature', 'Short', 'Documentary'], 'https://sidewalkfest.com/', 'programming@sidewalkfest.com', '00000000-0000-0000-0000-000000000000', 'active'),

-- International Regional Festivals
('Edinburgh International Film Festival', 'Edinburgh, Scotland', 'World''s longest continuously running film festival', '2025-06-19', '2025-06-30', '2025-03-14', '2025-02-14', '2025-03-14', 'https://www.edfilmfest.org.uk/submissions/', 'https://filmfreeway.com/EdinburghInternationalFilmFestival', 'Tier 2', ARRAY['Drama', 'Documentary', 'International'], '$35-55', ARRAY['Feature', 'Short', 'Documentary'], 'https://www.edfilmfest.org.uk/', 'programming@edfilmfest.org.uk', '00000000-0000-0000-0000-000000000000', 'active'),

('Sydney Film Festival', 'Sydney, Australia', 'Australia''s premier film festival', '2025-06-04', '2025-06-15', '2025-02-28', '2025-01-31', '2025-02-28', 'https://www.sff.org.au/public/page.aspx?id=220', 'https://filmfreeway.com/SydneyFilmFestival', 'Tier 2', ARRAY['Drama', 'Documentary', 'International'], '$40-70', ARRAY['Feature', 'Short', 'Documentary'], 'https://www.sff.org.au/', 'programming@sff.org.au', '00000000-0000-0000-0000-000000000000', 'active'),

('Busan International Film Festival', 'Busan, South Korea', 'Asia''s most significant film festival', '2025-10-02', '2025-10-11', '2025-06-20', '2025-05-23', '2025-06-20', 'https://www.biff.kr/eng/html/program/prog_submission.asp', '', 'Tier 2', ARRAY['Drama', 'Asian Cinema', 'International'], '$0', ARRAY['Feature', 'Short'], 'https://www.biff.kr/', 'program@biff.kr', '00000000-0000-0000-0000-000000000000', 'active'),

-- Genre-Specific Festivals  
('Screamfest Horror Film Festival', 'Los Angeles, California, USA', 'The largest horror film festival in the United States', '2025-10-10', '2025-10-19', '2025-08-01', '2025-07-04', '2025-08-01', 'https://screamfestla.com/submissions/', 'https://filmfreeway.com/ScreamfestHorrorFilmFestival', 'Genre', ARRAY['Horror', 'Thriller', 'Supernatural'], '$30-50', ARRAY['Feature', 'Short'], 'https://screamfestla.com/', 'programming@screamfestla.com', '00000000-0000-0000-0000-000000000000', 'active'),

('OutFest Los Angeles', 'Los Angeles, California, USA', 'Premier LGBTQ+ film festival', '2025-07-10', '2025-07-20', '2025-04-11', '2025-03-14', '2025-04-11', 'https://outfest.org/submissions/', 'https://filmfreeway.com/Outfest', 'Genre', ARRAY['LGBTQ+', 'Drama', 'Documentary'], '$40-70', ARRAY['Feature', 'Short', 'Documentary'], 'https://outfest.org/', 'programming@outfest.org', '00000000-0000-0000-0000-000000000000', 'active'),

('AFI DOCS', 'Washington, D.C., USA', 'Documentary films festival', '2025-06-17', '2025-06-22', '2025-03-07', '2025-02-07', '2025-03-07', 'https://docs.afi.com/submissions/', 'https://filmfreeway.com/AFIDOCS', 'Genre', ARRAY['Documentary'], '$50-80', ARRAY['Documentary'], 'https://docs.afi.com/', 'programming@afi.com', '00000000-0000-0000-0000-000000000000', 'active');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_festivals_tier ON public.film_festivals(festival_tier);
CREATE INDEX IF NOT EXISTS idx_festivals_genres ON public.film_festivals USING GIN(genres);
CREATE INDEX IF NOT EXISTS idx_festivals_deadline ON public.film_festivals(submission_deadline);
CREATE INDEX IF NOT EXISTS idx_festivals_location ON public.film_festivals(location);