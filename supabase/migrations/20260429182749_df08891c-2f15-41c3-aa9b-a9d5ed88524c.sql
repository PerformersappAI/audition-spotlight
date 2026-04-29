-- Table Reads
CREATE TABLE public.table_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Table Read',
  audio_url TEXT,
  character_count INTEGER NOT NULL DEFAULT 0,
  line_count INTEGER NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.table_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own table reads"
  ON public.table_reads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public table reads are viewable by anyone"
  ON public.table_reads FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can create their own table reads"
  ON public.table_reads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own table reads"
  ON public.table_reads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own table reads"
  ON public.table_reads FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_table_reads_updated_at
  BEFORE UPDATE ON public.table_reads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_table_reads_user_id ON public.table_reads(user_id);
CREATE INDEX idx_table_reads_public ON public.table_reads(is_public) WHERE is_public = true;

-- Storage bucket for MP3 files
INSERT INTO storage.buckets (id, name, public)
VALUES ('table-reads', 'table-reads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Table read audio is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'table-reads');

CREATE POLICY "Users can upload to their own table-reads folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'table-reads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own table-reads files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'table-reads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own table-reads files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'table-reads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
