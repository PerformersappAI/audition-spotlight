export interface CurrencyDef {
  code: string;
  label: string;
  /** Symbol shown in compact contexts (BAM prints as KM). */
  short: string;
}

export const CURRENCIES: CurrencyDef[] = [
  { code: "USD", label: "USD — US Dollar", short: "$" },
  { code: "EUR", label: "EUR — Euro", short: "€" },
  { code: "GBP", label: "GBP — British Pound", short: "£" },
  { code: "CAD", label: "CAD — Canadian Dollar", short: "CA$" },
  { code: "AUD", label: "AUD — Australian Dollar", short: "A$" },
  { code: "BAM", label: "BAM — Bosnian Mark (KM)", short: "KM" },
  { code: "CHF", label: "CHF — Swiss Franc", short: "CHF" },
  { code: "MXN", label: "MXN — Mexican Peso", short: "MX$" },
  { code: "NZD", label: "NZD — New Zealand Dollar", short: "NZ$" },
  { code: "SEK", label: "SEK — Swedish Krona", short: "kr" },
  { code: "NOK", label: "NOK — Norwegian Krone", short: "kr" },
  { code: "DKK", label: "DKK — Danish Krone", short: "kr" },
  { code: "PLN", label: "PLN — Polish Zloty", short: "zł" },
  { code: "CZK", label: "CZK — Czech Koruna", short: "Kč" },
  { code: "HUF", label: "HUF — Hungarian Forint", short: "Ft" },
  { code: "RSD", label: "RSD — Serbian Dinar", short: "din" },
  { code: "JPY", label: "JPY — Japanese Yen", short: "¥" },
  { code: "INR", label: "INR — Indian Rupee", short: "₹" },
  { code: "ZAR", label: "ZAR — South African Rand", short: "R" },
  { code: "BRL", label: "BRL — Brazilian Real", short: "R$" },
];

export const CURRENCY_CODES = CURRENCIES.map((c) => c.code);

export const isSupportedCurrency = (code: string) => CURRENCY_CODES.includes(code.toUpperCase());

const formatters = new Map<string, Intl.NumberFormat>();

/** Money formatter. BAM is displayed with the local "KM" mark. */
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
  if (code === "BAM") out = out.replace(/BAM/gi, "KM").trim();
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
