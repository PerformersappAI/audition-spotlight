CREATE POLICY "Expense owners can read their expense receipts"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'expense-receipts'
    AND (
      public.owns_breakdown_project(NULLIF((storage.foldername(name))[1], '')::uuid)
      OR public.has_role(auth.uid(), 'admin')
    )
  );

CREATE POLICY "Expense owners can upload expense receipts"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'expense-receipts'
    AND (
      public.owns_breakdown_project(NULLIF((storage.foldername(name))[1], '')::uuid)
      OR public.has_role(auth.uid(), 'admin')
    )
  );

CREATE POLICY "Expense owners can update expense receipts"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'expense-receipts'
    AND (
      public.owns_breakdown_project(NULLIF((storage.foldername(name))[1], '')::uuid)
      OR public.has_role(auth.uid(), 'admin')
    )
  );

CREATE POLICY "Expense owners can delete expense receipts"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'expense-receipts'
    AND (
      public.owns_breakdown_project(NULLIF((storage.foldername(name))[1], '')::uuid)
      OR public.has_role(auth.uid(), 'admin')
    )
  );