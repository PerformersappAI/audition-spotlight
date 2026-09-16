import { crewCall, type CrewIdentity } from "@/lib/breakdown/adapter";
import { normalizeLines, type ExpenseLine } from "./types";

/** The subset of an expense a crew member is allowed to see. */
export interface CrewExpense {
  id: string;
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
  notes: string | null;
  line_items: ExpenseLine[];
  invoice_number: string | null;
  receipt_path: string | null;
  item_photo_path: string | null;
  created_at: string;
}

export interface CrewReceiptRead {
  vendor: string;
  date: string;
  currency: string;
  total: number;
  lines: ExpenseLine[];
  ai_unavailable?: boolean;
}

const toCrewExpense = (row: Record<string, unknown>): CrewExpense => ({
  ...(row as unknown as CrewExpense),
  amount: Number(row.amount ?? 0),
  line_items: normalizeLines(row.line_items),
});

export const crewExpenseApi = (token: string, identity: CrewIdentity) => {
  const auth = { crew_id: identity.crew_id, crew_secret: identity.crew_secret };

  return {
    async readReceipt(fileBase64: string, mimeType: string): Promise<CrewReceiptRead> {
      return crewCall<CrewReceiptRead>(token, "expense_read_receipt", {
        ...auth, file_base64: fileBase64, mime_type: mimeType,
      });
    },

    async submit(payload: Record<string, unknown>): Promise<{ expense: CrewExpense; email_sent: { crew: boolean; owner: boolean } }> {
      const res = await crewCall<{ expense: Record<string, unknown>; email_sent: { crew: boolean; owner: boolean } }>(
        token, "expense_submit", { ...auth, ...payload },
      );
      return { expense: toCrewExpense(res.expense), email_sent: res.email_sent };
    },

    async listMine(): Promise<{ expenses: CrewExpense[]; urls: Record<string, string> }> {
      const res = await crewCall<{ expenses: Record<string, unknown>[]; urls: Record<string, string> }>(
        token, "expense_list_mine", auth,
      );
      return { expenses: (res.expenses || []).map(toCrewExpense), urls: res.urls || {} };
    },

    async deleteMine(expenseId: string): Promise<void> {
      await crewCall(token, "expense_delete_mine", { ...auth, expense_id: expenseId });
    },
  };
};

export type CrewExpenseApi = ReturnType<typeof crewExpenseApi>;
