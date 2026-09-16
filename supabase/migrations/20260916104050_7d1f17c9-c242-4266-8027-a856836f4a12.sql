ALTER TABLE public.breakdown_items ADD COLUMN IF NOT EXISTS added_by_crew_id uuid REFERENCES public.breakdown_crew(id) ON DELETE SET NULL;
ALTER TABLE public.breakdown_photos ADD COLUMN IF NOT EXISTS uploaded_by_crew_id uuid REFERENCES public.breakdown_crew(id) ON DELETE SET NULL;
ALTER TABLE public.breakdown_crew ADD COLUMN IF NOT EXISTS crew_secret_hash text;