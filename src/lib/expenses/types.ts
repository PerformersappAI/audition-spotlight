export const EXPENSE_DEPARTMENTS = [
  "Director",
  "Producer",
  "Assistant Director",
  "Props",
  "Locations",
  "Makeup & SFX",
  "Wardrobe",
  "Transport / Vehicles",
  "Camera",
  "Art Department",
  "Other",
] as const;

export const PAYMENT_METHODS = [
  { key: "reimburse", label: "Reimburse me" },
  { key: "per_diem", label: "Per diem" },
  { key: "company_card", label: "Company card" },
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]["key"];

export const paymentLabel = (key: string) =>
  PAYMENT_METHODS.find((p) => p.key === key)?.label ?? key;

export const STATUSES = [
  { key: "pending", label: "Pending", color: "#f5a524", tint: "rgba(245,165,36,0.14)" },
  { key: "approved", label: "Approved", color: "#3ecf6e", tint: "rgba(62,207,110,0.14)" },
  { key: "rejected", label: "Rejected", color: "#f5544e", tint: "rgba(245,84,78,0.14)" },
  { key: "paid", label: "Paid", color: "#00d4aa", tint: "rgba(0,212,170,0.14)" },
] as const;

export type ExpenseStatus = (typeof STATUSES)[number]["key"];

export const statusDef = (key: string) => STATUSES.find((s) => s.key === key) ?? STATUSES[0];

export interface ExpenseLine {
  text: string;
  amount: number;
  qty?: number;
  rate?: number;
}

export interface Expense {
  id: string;
  project_id: string;
  kind: string;
  department: string;
  vendor: string | null;
  description: string | null;
  expense_date: string;
  currency: string;
  amount: number;
  payment_method: string;
  status: string;
  status_note: string | null;
  decided_by_name: string | null;
  decided_at: string | null;
  notes: string | null;
  line_items: ExpenseLine[];
  invoice_number: string | null;
  bill_to: string | null;
  receipt_path: string | null;
  item_photo_path: string | null;
  linked_item_id: string | null;
  submitted_by_name: string;
  submitted_by_email: string | null;
  created_at: string;
}

export const EXPENSE_FIELDS =
  "id, project_id, kind, department, vendor, description, expense_date, currency, amount, payment_method, status, status_note, decided_by_name, decided_at, notes, line_items, invoice_number, bill_to, receipt_path, item_photo_path, linked_item_id, submitted_by_name, submitted_by_email, created_at";

export const EXPENSE_BUCKET = "expense-receipts";

export const normalizeLines = (raw: unknown): ExpenseLine[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const e = entry as Record<string, unknown>;
      const text = typeof e.text === "string" ? e.text : "";
      const amount = Number(e.amount);
      const line: ExpenseLine = { text, amount: Number.isFinite(amount) ? amount : 0 };
      if (e.qty !== undefined && Number.isFinite(Number(e.qty))) line.qty = Number(e.qty);
      if (e.rate !== undefined && Number.isFinite(Number(e.rate))) line.rate = Number(e.rate);
      return line;
    })
    .filter((l): l is ExpenseLine => !!l && (!!l.text || !!l.amount));
};

export const toExpense = (row: Record<string, unknown>): Expense => ({
  ...(row as unknown as Expense),
  amount: Number(row.amount ?? 0),
  line_items: normalizeLines(row.line_items),
});
