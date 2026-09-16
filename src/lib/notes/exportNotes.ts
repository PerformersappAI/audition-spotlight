import jsPDF from "jspdf";
import { LANGUAGES, languageLabel } from "@/lib/languages";
import { loadUnicodeFonts } from "@/utils/exportBreakdownToPDF";
import { weatherLine } from "@/lib/translator/weather";
import { PDF_UNSUPPORTED_LANGUAGES } from "@/lib/translator/types";
import {
  groupByTag,
  noteTranslations,
  prettyDay,
  sceneLabel,
  tagLabel,
  type NoteScene,
  type ProductionNote,
} from "@/lib/notes/types";

const MARGIN = 15;

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "production";

export function notesFileName(productionTitle: string, day: string) {
  return `notes-${slug(productionTitle)}-${day}.pdf`;
}

export interface NotesReportInput {
  notes: ProductionNote[];
  productionTitle: string;
  day: string;
  shootLocation?: string | null;
  scenes?: NoteScene[];
}

export async function buildNotesPDF(input: NotesReportInput): Promise<jsPDF> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const { body } = await loadUnicodeFonts(doc);
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN * 2;
  const sceneById = new Map((input.scenes || []).map((s) => [s.id, s]));

  let y = 28;

  const line = (
    text: string,
    size: number,
    style: "normal" | "bold" = "normal",
    opts: { grey?: boolean; indent?: number } = {},
  ) => {
    const indent = opts.indent || 0;
    doc.setFont(body, style);
    doc.setFontSize(size);
    const tone = opts.grey ? 110 : 20;
    doc.setTextColor(tone, tone, tone);
    const lines = doc.splitTextToSize(text || " ", contentW - indent) as string[];
    lines.forEach((l) => {
      if (y + size * 0.5 > pageH - 20) {
        doc.addPage();
        y = 28;
        doc.setFont(body, style);
        doc.setFontSize(size);
        doc.setTextColor(tone, tone, tone);
      }
      doc.text(l, MARGIN + indent, y);
      y += size * 0.5;
    });
  };

  const paragraphs = (text: string, size: number, indent = 0) => {
    text.split(/\r?\n/).forEach((raw) => line(raw, size, "normal", { indent }));
  };

  const weather = await weatherLine(input.shootLocation);
  if (weather) {
    line(weather, 9.5, "normal", { grey: true });
    y += 3;
  }

  if (!input.notes.length) {
    line("No notes for this shoot day.", 11, "normal", { grey: true });
  }

  const skippedLanguages = new Set<string>();

  groupByTag(input.notes).forEach((group) => {
    y += 3;
    line(tagLabel(group.tag).toUpperCase(), 12, "bold");
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y - 3, pageW - MARGIN, y - 3);
    y += 2;

    group.notes.forEach((n) => {
      const meta = [
        n.priority !== "normal" ? n.priority.toUpperCase() : "",
        n.scene_id ? sceneLabel(sceneById.get(n.scene_id)) : "",
        n.created_by_name + (n.created_by_department ? ` (${n.created_by_department})` : ""),
        new Date(n.created_at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
        n.resolved ? "Resolved" : "",
      ].filter(Boolean).join(" · ");

      if (meta) line(meta, 8.5, "bold", { grey: true });
      paragraphs(n.body, 10);

      noteTranslations(n).forEach(({ code, text }) => {
        if (PDF_UNSUPPORTED_LANGUAGES.has(code)) {
          skippedLanguages.add(code);
          return;
        }
        line(`${LANGUAGES[code]?.native || code}:`, 9, "bold", { grey: true, indent: 6 });
        paragraphs(text, 9.5, 6);
      });

      y += 4;
    });
  });

  if (skippedLanguages.size) {
    y += 3;
    line("Not printable in this PDF", 11, "bold");
    [...skippedLanguages].forEach((code) =>
      line(`${languageLabel(code)}: see the app`, 9.5, "normal", { grey: true }),
    );
  }

  const generated = new Date().toLocaleString();
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setFont(body, "bold");
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text(
      `PRODUCTION NOTES — ${input.productionTitle} — ${prettyDay(input.day)}`,
      MARGIN,
      14,
    );
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

export async function downloadNotesPDF(input: NotesReportInput): Promise<void> {
  const doc = await buildNotesPDF(input);
  doc.save(notesFileName(input.productionTitle, input.day));
}
