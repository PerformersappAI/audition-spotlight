ALTER TABLE public.breakdown_projects
  ADD COLUMN IF NOT EXISTS default_currency text NOT NULL DEFAULT 'USD';

CREATE TABLE public.production_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.breakdown_projects(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('receipt','invoice')),
  department text NOT NULL,
  vendor text,
  description text,
  expense_date date NOT NULL DEFAULT current_date,
  currency text NOT NULL DEFAULT 'USD' CHECK (char_length(currency) = 3),
  amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
  payment_method text NOT NULL CHECK (payment_method IN ('reimburse','per_diem','company_card')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','paid')),
  status_note text,
  decided_by_name text,
  decided_at timestamptz,
  notes text,
  line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  invoice_number text,
  bill_to text,
  receipt_path text,
  item_photo_path text,
  ocr_raw text,
  linked_item_id uuid REFERENCES public.breakdown_items(id) ON DELETE SET NULL,
  submitted_by_name text NOT NULL,
  submitted_by_email text,
  submitted_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_by_crew_id uuid REFERENCES public.breakdown_crew(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_production_expenses_project_created ON public.production_expenses (project_id, created_at DESC);
CREATE INDEX idx_production_expenses_project_status ON public.production_expenses (project_id, status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.production_expenses TO authenticated;
GRANT ALL ON public.production_expenses TO service_role;
REVOKE ALL ON public.production_expenses FROM anon;

ALTER TABLE public.production_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project owners and admins manage production expenses"
  ON public.production_expenses FOR ALL TO authenticated
  USING (
    public.owns_breakdown_project(project_id)
    OR public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    public.owns_breakdown_project(project_id)
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE TRIGGER update_production_expenses_updated_at
  BEFORE UPDATE ON public.production_expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();