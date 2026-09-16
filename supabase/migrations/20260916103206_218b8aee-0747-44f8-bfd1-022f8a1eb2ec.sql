ALTER TABLE public.breakdown_photos REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.breakdown_photos;