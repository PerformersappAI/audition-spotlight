import jsPDF from "jspdf";
import { LANGUAGES, languageLabel } from "@/lib/languages";
import { loadUnicodeFonts } from "@/utils/exportBreakdownToPDF";
import { weatherLine } from "@/lib/translator/weather";
import {
  messageSubjects,
  messageTranslations,
  PDF_UNSUPPORTED_LANGUAGES,
  type ProductionMessage,
} from "@/lib/translator/types";

const MARGIN = 15;

const nativeName = (code: string) => LANGUAGES[code]?.native || code;

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "production";

const stamp = (iso?: string) => {
  const d = iso ? new Date(iso) : new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
};

export function messageFileName(productionTitle: string, ext: "txt" | "pdf", createdAt?: string) {
  return `message-${slug(productionTitle)}-${stamp(createdAt)}.${ext}`;
}

export interface MessageExportInput {
  message: ProductionMessage;
  productionTitle: string;
  shootLocation?: string | null;
}

interface HeaderInfo {
  lines: string[];
}

async function buildHeader(input: MessageExportInput): Promise<HeaderInfo> {
  const { message, productionTitle } = input;
  const targets = messageTranslations(message).map((t) => t.code);
  const lines = [
    productionTitle,
    message.subject ? `Subject: ${message.subject}` : "",
    new Date(message.created_at || Date.now()).toLocaleString(),
    `${languageLabel(message.source_language)} → ${targets.map((c) => nativeName(c)).join(", ") || "—"}`,
  ].filter(Boolean);
  const weather = await weatherLine(input.shootLocation);
  if (weather) lines.push(weather);
  return { lines };
}

/** Plain-text export: header block, original, then every translation. */
export async function buildMessageText(input: MessageExportInput): Promise<string> {
  const { message } = input;
  const header = await buildHeader(input);
  const subjects = messageSubjects(message);
  const blocks: string[] = [header.lines.join("\n")];

  blocks.push(
    `— ${nativeName(message.source_language)} (Original) —\n${message.subject ? `${message.subject}\n\n` : ""}${message.source_text}`,
  );

  messageTranslations(message).forEach(({ code, text }) => {
    blocks.push(`— ${nativeName(code)} —\n${subjects[code] ? `${subjects[code]}\n\n` : ""}${text}`);
  });

  return `${blocks.join("\n\n\n")}\n`;
}

/** "Copy all" text — every language, each under a native-name heading. */
export function allLanguagesText(message: ProductionMessage): string {
  const subjects = messageSubjects(message);
  const blocks = [
    `— ${nativeName(message.source_language)} (Original) —\n${message.subject ? `${message.subject}\n\n` : ""}${message.source_text}`,
    ...messageTranslations(message).map(
      ({ code, text }) =>
        `— ${nativeName(code)} —\n${subjects[code] ? `${subjects[code]}\n\n` : ""}${text}`,
    ),
  ];
  return blocks.join("\n\n\n");
}

export async function downloadMessageText(input: MessageExportInput): Promise<void> {
  const text = await buildMessageText(input);
  const blob = new Blob([`\uFEFF${text}`], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = messageFileName(input.productionTitle, "txt", input.message.created_at);
  a.click();
  URL.revokeObjectURL(url);
}

export async function buildMessagePDF(input: MessageExportInput): Promise<jsPDF> {
  const { message } = input;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const { body } = await loadUnicodeFonts(doc);
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN * 2;
  const header = await buildHeader(input);
  const subjects = messageSubjects(message);

  let y = 28;

  const line = (text: string, size: number, style: "normal" | "bold", grey = false) => {
    doc.setFont(body, style);
    doc.setFontSize(size);
    doc.setTextColor(grey ? 110 : 20, grey ? 110 : 20, grey ? 110 : 20);
    const lines = doc.splitTextToSize(text || " ", contentW) as string[];
    lines.forEach((l) => {
      if (y + size * 0.5 > pageH - 20) {
        doc.addPage();
        y = 28;
        doc.setFont(body, style);
        doc.setFontSize(size);
      }
      doc.text(l, MARGIN, y);
      y += size * 0.5;
    });
  };

  const paragraphs = (text: string, size: number) => {
    text.split(/\r?\n/).forEach((raw) => line(raw, size, "normal"));
  };

  header.lines.slice(1).forEach((l) => line(l, 9.5, "normal", true));
  y += 4;

  line(`${nativeName(message.source_language)} — Original`, 13, "bold");
  y += 1;
  if (message.subject) line(message.subject, 10.5, "bold");
  paragraphs(message.source_text, 10);
  y += 6;

  const skipped: string[] = [];
  messageTranslations(message).forEach(({ code, text }) => {
    if (PDF_UNSUPPORTED_LANGUAGES.has(code)) {
      skipped.push(`${languageLabel(code)}: see the app or the .txt download`);
      return;
    }
    line(`${nativeName(code)} — ${LANGUAGES[code]?.name || code}`, 13, "bold");
    y += 1;
    if (subjects[code]) line(subjects[code], 10.5, "bold");
    paragraphs(text, 10);
    y += 6;
  });

  if (skipped.length) {
    line("Not printable in this PDF", 11, "bold");
    skipped.forEach((s) => line(s, 9.5, "normal", true));
  }

  const generated = new Date().toLocaleString();
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setFont(body, "bold");
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text(`CREW MESSAGE — ${input.productionTitle}`, MARGIN, 14);
    doc.setDrawColor(190, 190, 190);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, 17.5, pageW - MARGIN, 17.5);
    doc.setFont(body, "normal");
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    doc.text(`Generated ${generated} · filmmakergenius.com`, MARGIN, pageH - 10);
    doc.text(`Page ${i} of ${pages}`, pageW - MARGIN, pageH - 10, { align: "right" });
  }

  return doc;
}

export async function downloadMessagePDF(input: MessageExportInput): Promise<void> {
  const doc = await buildMessagePDF(input);
  doc.save(messageFileName(input.productionTitle, "pdf", input.message.created_at));
}
