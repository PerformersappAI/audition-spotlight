ALTER TABLE public.breakdown_items REPLICA IDENTITY FULL;
ALTER TABLE public.breakdown_signoffs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.breakdown_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.breakdown_signoffs;