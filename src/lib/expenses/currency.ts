export interface CurrencyDef {
  code: string;
  label: string;
}

/** ISO 4217 codes a production can bill in, most widely used first. */
const CODES = [
  "USD", "EUR", "GBP", "CAD", "AUD", "JPY", "INR", "CNY", "MXN", "BRL",
  "ZAR", "NZD", "CHF", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "KRW",
  "SGD", "HKD", "AED", "TRY", "NGN", "KES", "ARS", "CLP", "COP", "PHP",
  "THB", "IDR", "MYR", "ILS", "RON", "BAM", "RSD",
];

/** "USD — US Dollar" using the runtime's own currency names where available. */
const currencyName = (code: string): string => {
  try {
    const names = new Intl.DisplayNames(["en"], { type: "currency" });
    return names.of(code) || code;
  } catch {
    return code;
  }
};

export const CURRENCIES: CurrencyDef[] = CODES.map((code) => {
  const name = currencyName(code);
  return { code, label: name === code ? code : `${code} — ${name}` };
});

export const CURRENCY_CODES = CURRENCIES.map((c) => c.code);

export const isSupportedCurrency = (code: string) => CURRENCY_CODES.includes(code.toUpperCase());

const formatters = new Map<string, Intl.NumberFormat>();

/** Money formatter, using the runtime's own symbol for each currency. */
export const formatMoney = (amount: number, currency: string): string => {
  const code = (currency || "USD").toUpperCase();
  const value = Number.isFinite(amount) ? amount : 0;
  let out: string;
  try {
    let fmt = formatters.get(code);
    if (!fmt) {
      fmt = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: code,
        currencyDisplay: "narrowSymbol",
      });
      formatters.set(code, fmt);
    }
    out = fmt.format(value);
  } catch {
    out = `${code} ${value.toFixed(2)}`;
  }
  return out;
};

/**
 * Parse a human-typed amount, supporting "1,234.56", "1.234,56", "12,50" and "1 234,56".
 */
export const parseAmount = (raw: string | number | null | undefined): number => {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : 0;
  if (!raw) return 0;
  let s = String(raw).replace(/[^\d,.\-]/g, "");
  if (!s) return 0;
  const negative = s.startsWith("-");
  s = s.replace(/-/g, "");

  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    // Whichever comes last is the decimal separator.
    if (lastComma > lastDot) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(/,/g, "");
  } else if (lastComma !== -1) {
    const decimals = s.length - lastComma - 1;
    const groups = s.split(",");
    // "1,234" / "1,234,567" → thousands separators; "12,50" → decimal comma.
    if (decimals === 3 && groups.length >= 2 && groups[0].length <= 3) s = s.replace(/,/g, "");
    else s = s.replace(/,/g, ".");
  } else if (lastDot !== -1) {
    const decimals = s.length - lastDot - 1;
    const groups = s.split(".");
    if (decimals === 3 && groups.length >= 2 && groups[0].length <= 3) s = s.replace(/\./g, "");
  }

  const n = Number.parseFloat(s);
  if (!Number.isFinite(n)) return 0;
  return negative ? -n : n;
};

export const round2 = (n: number) => Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
