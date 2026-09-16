import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BreakdownItem,
  BreakdownPhoto,
  BreakdownScene,
  BreakdownSignoff,
  DEPARTMENTS,
} from "@/components/breakdown/types";

export interface BreakdownExportInput {
  projectTitle: string;
  company?: string | null;
  /** The scenes to print, already in display order. */
  scenes: BreakdownScene[];
  items: BreakdownItem[];
  signoffs: BreakdownSignoff[];
  photos: BreakdownPhoto[];
  includeScript?: boolean;
  scope: "scene" | "all";
}

const MARGIN = 15;
const BODY = "NotoSans";
const MONO = "NotoSansMono";

const FONT_FILES: Array<{ file: string; family: string; style: "normal" | "bold" }> = [
  { file: "/fonts/NotoSans-Regular.ttf", family: BODY, style: "normal" },
  { file: "/fonts/NotoSans-Bold.ttf", family: BODY, style: "bold" },
  { file: "/fonts/NotoSansMono-Regular.ttf", family: MONO, style: "normal" },
];

let fontCache: Record<string, string> | null = null;

const toBase64 = (buf: ArrayBuffer) => {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
};

/**
 * jsPDF's built-in Helvetica cannot render Latin Extended characters
 * (č ć đ š ž ...), so we embed a subset of Noto Sans / Noto Sans Mono.
 * Falls back to Helvetica/Courier if the files can't be fetched.
 */
async function loadFonts(doc: jsPDF): Promise<{ body: string; mono: string }> {
  try {
    if (!fontCache) {
      const entries = await Promise.all(
        FONT_FILES.map(async (f) => {
          const res = await fetch(f.file);
          if (!res.ok) throw new Error(`font ${f.file}`);
          return [f.file, toBase64(await res.arrayBuffer())] as const;
        }),
      );
      fontCache = Object.fromEntries(entries);
    }
    FONT_FILES.forEach((f) => {
      const name = f.file.split("/").pop() as string;
      doc.addFileToVFS(name, (fontCache as Record<string, string>)[f.file]);
      doc.addFont(name, f.family, f.style);
    });
    return { body: BODY, mono: MONO };
  } catch {
    return { body: "helvetica", mono: "courier" };
  }
}

export const sceneHeading = (s: BreakdownScene) =>
  s.scene_number ? `Scene ${s.scene_number}` : s.label || "Untitled scene";

const shortDate = (iso: string | null | undefined) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });
};

const longDate = (iso: string | null | undefined) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "production";

export function breakdownFileName(input: BreakdownExportInput): string {
  const date = new Date().toISOString().slice(0, 10);
  const base = `breakdown-${slug(input.projectTitle)}`;
  if (input.scope === "all" || input.scenes.length !== 1) return `${base}-all-scenes-${date}.pdf`;
  const scene = input.scenes[0];
  const label = scene.scene_number || scene.label || "scene";
  return `${base}-scene-${slug(label)}-${date}.pdf`;
}

const photoSummary = (rows: BreakdownPhoto[]) => {
  const refs = rows.filter((p) => p.is_reference);
  const own = rows.filter((p) => !p.is_reference);
  const parts: string[] = [];
  if (own.length) {
    const approved = own.filter((p) => p.status === "approved").length;
    const awaiting = own.filter((p) => p.status === "awaiting").length;
    const rejected = own.filter((p) => p.status === "rejected").length;
    const detail = [
      approved ? `${approved} approved` : "",
      awaiting ? `${awaiting} awaiting` : "",
      rejected ? `${rejected} changes needed` : "",
    ].filter(Boolean).join(", ");
    parts.push(detail ? `${own.length} · ${detail}` : `${own.length}`);
  }
  if (refs.length) parts.push(`REF ${refs.length}`);
  return parts.length ? parts.join(" · ") : "—";
};

/** Builds the print-ready breakdown PDF. */
export async function buildBreakdownPDF(input: BreakdownExportInput): Promise<jsPDF> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const { body, mono } = await loadFonts(doc);
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN * 2;

  let y = 28;

  const ensure = (needed: number) => {
    if (y + needed > pageH - 20) {
      doc.addPage();
      y = 28;
    }
  };

  const line = (text: string, size: number, style: "normal" | "bold", grey = false) => {
    doc.setFont(body, style);
    doc.setFontSize(size);
    doc.setTextColor(grey ? 110 : 20, grey ? 110 : 20, grey ? 110 : 20);
    const lines = doc.splitTextToSize(text, contentW) as string[];
    ensure(lines.length * (size * 0.45) + 2);
    lines.forEach((l) => {
      doc.text(l, MARGIN, y);
      y += size * 0.45;
    });
  };

  input.scenes.forEach((scene, sceneIndex) => {
    const sceneItems = input.items.filter((i) => i.scene_id === scene.id);
    const sceneSignoffs = input.signoffs.filter((s) => s.scene_id === scene.id);
    const itemIds = new Set(sceneItems.map((i) => i.id));
    const scenePhotos = input.photos.filter((p) => itemIds.has(p.item_id));

    if (sceneIndex > 0) {
      doc.addPage();
      y = 28;
    }

    line(`${sceneHeading(scene)}${scene.label && scene.scene_number ? ` — ${scene.label}` : ""}`, 16, "bold");
    y += 1;

    const checked = sceneItems.filter((i) => i.checked).length;
    const signed = DEPARTMENTS.filter((d) => sceneSignoffs.some((s) => s.department === d.key)).length;
    const awaiting = scenePhotos.filter((p) => !p.is_reference && p.status === "awaiting").length;
    line(
      `${checked}/${sceneItems.length} items ready · ${signed}/5 departments signed off · ${awaiting} photo${awaiting === 1 ? "" : "s"} awaiting approval`,
      9,
      "normal",
      true,
    );
    y += 4;

    DEPARTMENTS.forEach((dept) => {
      const deptItems = sceneItems
        .filter((i) => i.department === dept.key)
        .sort((a, b) => a.sort_order - b.sort_order);

      ensure(24);
      line(dept.label.toUpperCase(), 11, "bold");
      y += 1;

      if (!deptItems.length) {
        line("Nothing listed.", 9, "normal", true);
      } else {
        autoTable(doc, {
          startY: y,
          head: [["", "Item", "Checked by", "Photos"]],
          body: deptItems.map((item) => {
            const edited = item.original_text && item.original_text !== item.text;
            const text =
              (item.flagged ? "! " : "") +
              item.text +
              (edited ? ` (edited — AI: ${item.original_text})` : "");
            const by = item.checked && item.checked_by_name
              ? `${item.checked_by_name}${shortDate(item.checked_at) ? ` · ${shortDate(item.checked_at)}` : ""}`
              : "—";
            return [item.checked ? "[x]" : "[ ]", text, by, photoSummary(input.photos.filter((p) => p.item_id === item.id))];
          }),
          margin: { left: MARGIN, right: MARGIN, top: 28, bottom: 20 },
          theme: "grid",
          styles: {
            font: body, fontSize: 9, cellPadding: 2, textColor: [30, 30, 30],
            overflow: "linebreak", lineColor: [200, 200, 200], lineWidth: 0.1,
          },
          headStyles: { font: body, fontStyle: "bold", fillColor: [238, 238, 238], textColor: [20, 20, 20], fontSize: 9 },
          columnStyles: {
            0: { cellWidth: 9, halign: "center" },
            1: { cellWidth: "auto" },
            2: { cellWidth: 30 },
            3: { cellWidth: 34 },
          },
          didParseCell: (data) => {
            if (data.section === "body" && data.column.index === 1 && deptItems[data.row.index]?.flagged) {
              data.cell.styles.fontStyle = "bold";
            }
          },
        });
        // @ts-expect-error lastAutoTable is added by jspdf-autotable
        y = (doc.lastAutoTable?.finalY ?? y) + 5;
      }

      const so = sceneSignoffs.find((s) => s.department === dept.key);
      const status = !so
        ? "Status: Not signed off"
        : so.status === "good"
          ? `Status: Ready — ${so.by_name || "crew"}, ${longDate(so.updated_at)}`
          : `Status: Needs help — ${so.by_name || "crew"}, ${longDate(so.updated_at)}`;
      line(status, 9, "normal");
      if (so?.note) line(`Note: ${so.note}`, 9, "normal", true);

      const rejected = deptItems.flatMap((item) =>
        input.photos
          .filter((p) => p.item_id === item.id && !p.is_reference && p.status === "rejected")
          .map((p) => `Changes requested on ${item.text}: ${p.feedback || "no details given"}${p.decided_by_name ? ` (${p.decided_by_name})` : ""}`),
      );
      rejected.forEach((r) => line(r, 8, "normal", true));

      y += 6;
    });

    if (input.includeScript && scene.script_text) {
      ensure(20);
      line("SCENE SCRIPT", 11, "bold");
      y += 1;
      doc.setFont(mono, "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(40, 40, 40);
      scene.script_text.split(/\r?\n/).forEach((raw) => {
        const wrapped = (doc.splitTextToSize(raw || " ", contentW) as string[]);
        wrapped.forEach((l) => {
          if (y + 4 > pageH - 20) { doc.addPage(); y = 28; doc.setFont(mono, "normal"); doc.setFontSize(8.5); }
          doc.text(l, MARGIN, y);
          y += 4;
        });
      });
    }
  });

  // Header + footer on every page
  const generated = new Date().toLocaleString();
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setFont(body, "bold");
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text(`SCRIPT BREAKDOWN — ${input.projectTitle}`, MARGIN, 14);
    if (input.company) {
      doc.setFont(body, "normal");
      doc.setFontSize(9);
      doc.setTextColor(110, 110, 110);
      doc.text(input.company, pageW - MARGIN, 14, { align: "right" });
    }
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

export async function exportBreakdownToPDF(input: BreakdownExportInput): Promise<void> {
  const doc = await buildBreakdownPDF(input);
  doc.save(breakdownFileName(input));
}

export type { BreakdownItem, BreakdownPhoto, BreakdownScene, BreakdownSignoff };
