DROP POLICY IF EXISTS "Authenticated users can read documents" ON storage.objects;
CREATE POLICY "Admins can read documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Table read audio is publicly accessible" ON storage.objects;
CREATE POLICY "Owners can read their own table-reads files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'table-reads'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);