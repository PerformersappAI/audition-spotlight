import * as XLSX from "xlsx";

export const SPREADSHEET_MAX_BYTES = 5 * 1024 * 1024;

const isSpreadsheetName = (name: string) => /\.(csv|xlsx|xls)$/i.test(name);

export function isSpreadsheetFile(file: File): boolean {
  return isSpreadsheetName(file.name);
}

/**
 * Reads a .csv / .xlsx / .xls file in the browser and returns aligned plain text:
 * one heading per sheet, then one line per row with cells separated by " | ".
 */
export async function spreadsheetToText(file: File): Promise<string> {
  if (file.size > SPREADSHEET_MAX_BYTES) {
    throw new Error("That spreadsheet is larger than 5 MB. Please trim it and try again.");
  }
  const buffer = await file.arrayBuffer();
  const book = XLSX.read(buffer, { type: "array" });
  const blocks: string[] = [];

  book.SheetNames.forEach((name) => {
    const sheet = book.Sheets[name];
    if (!sheet) return;
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, blankrows: false, defval: "" });
    const lines = rows
      .map((row) =>
        (Array.isArray(row) ? row : [])
          .map((cell) => (cell == null ? "" : String(cell).trim()))
          .join(" | ")
          .replace(/(\s\|\s)+$/, "")
          .trim(),
      )
      .filter((line) => line.length > 0);
    if (!lines.length) return;
    blocks.push(book.SheetNames.length > 1 ? `${name}\n${lines.join("\n")}` : lines.join("\n"));
  });

  const text = blocks.join("\n\n").trim();
  if (!text) throw new Error("That spreadsheet looks empty.");
  return text;
}
