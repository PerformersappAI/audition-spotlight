// Shared receipt/invoice reading: the prompt, the gateway call and the parser.
// Used by the "read-receipt" function (producers) and the "expense_read_receipt"
// action of "breakdown-crew" (crew members on a private link).

export const RECEIPT_SYSTEM_PROMPT =
  `You are an expense-tracking assistant for a film production. Read this receipt or invoice and return ONLY JSON: {"vendor": string, "date": "YYYY-MM-DD" or "", "currency": ISO 4217 code (infer from symbols/country: € EUR, KM or BAM → BAM, £ GBP, $ USD unless clearly CAD/AUD etc.; "" if unknown), "total": number (the final amount paid, as a plain number with a dot decimal), "lines": [{"text": string, "amount": number}]}. Convert European decimal commas to dots. Do not invent items.`;

export const RECEIPT_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
export const MAX_RECEIPT_BYTES = 8 * 1024 * 1024;
export const RECEIPT_MODEL = "google/gemini-3-flash-preview";

export interface ReceiptLine {
  text: string;
  amount: number;
}

export interface ReceiptData {
  vendor: string;
  date: string;
  currency: string;
  total: number;
  lines: ReceiptLine[];
}

/** Parse a human/AI amount, handling European decimal commas. */
export function receiptAmount(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw)) return Math.round(raw * 100) / 100;
  if (typeof raw !== "string") return 0;
  let s = raw.replace(/[^\d,.\-]/g, "");
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastComma !== -1 && lastDot !== -1) {
    s = lastComma > lastDot ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  } else if (lastComma !== -1) {
    s = s.length - lastComma - 1 === 3 ? s.replace(/,/g, "") : s.replace(/,/g, ".");
  }
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

/** Strip fences / prose and pull the JSON object out of a model reply. */
export function extractJsonBlock(input: string): string {
  let content = (input || "").trim();
  if (content.startsWith("```json")) content = content.slice(7);
  else if (content.startsWith("```")) content = content.slice(3);
  if (content.endsWith("```")) content = content.slice(0, -3);
  content = content.trim();
  const first = content.indexOf("{");
  const last = content.lastIndexOf("}");
  if (first !== -1 && last > first) content = content.slice(first, last + 1);
  return content;
}

/** Returns null when the reply isn't usable JSON. */
export function parseReceipt(rawContent: string): ReceiptData | null {
  const content = extractJsonBlock(rawContent);
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content);
  } catch {
    return null;
  }
  const rawDate = typeof parsed.date === "string" ? parsed.date.trim() : "";
  return {
    vendor: typeof parsed.vendor === "string" ? parsed.vendor.trim().slice(0, 200) : "",
    date: /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate : "",
    currency: typeof parsed.currency === "string" && /^[A-Za-z]{3}$/.test(parsed.currency.trim())
      ? parsed.currency.trim().toUpperCase()
      : "",
    total: receiptAmount(parsed.total),
    lines: Array.isArray(parsed.lines)
      ? parsed.lines
          .map((entry) => {
            if (!entry || typeof entry !== "object") return null;
            const e = entry as Record<string, unknown>;
            const text = typeof e.text === "string" ? e.text.trim().slice(0, 200) : "";
            const amount = receiptAmount(e.amount);
            if (!text && !amount) return null;
            return { text, amount } as ReceiptLine;
          })
          .filter((l): l is ReceiptLine => !!l)
          .slice(0, 80)
      : [],
  };
}

export type ReceiptAiResult =
  | { ok: true; content: string; usage?: { prompt_tokens?: number; completion_tokens?: number } }
  | { ok: false; status: number; body: string };

/** Send the file to the Lovable AI gateway and return the raw reply. */
export async function callReceiptAi(
  apiKey: string,
  fileBase64: string,
  mimeType: string,
): Promise<ReceiptAiResult> {
  const dataUrl = `data:${mimeType};base64,${fileBase64}`;
  const filePart = mimeType === "application/pdf"
    ? { type: "file", file: { filename: "receipt.pdf", file_data: dataUrl } }
    : { type: "image_url", image_url: { url: dataUrl } };

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: RECEIPT_MODEL,
      messages: [
        { role: "system", content: RECEIPT_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Read this receipt or invoice and return the JSON described." },
            filePart,
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    return { ok: false, status: response.status, body: await response.text() };
  }
  const data = await response.json();
  return {
    ok: true,
    content: data.choices?.[0]?.message?.content || "",
    usage: data.usage,
  };
}
