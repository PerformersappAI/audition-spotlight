import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface CastCrewReportContact {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  instagram_handle: string | null;
  job_position: string | null;
  other_role: string | null;
  character_name: string | null;
  actor_type: string | null;
  notes: string | null;
  created_at: string;
}

export interface CastCrewReportOptions {
  productionName?: string | null;
  contacts: CastCrewReportContact[];
}

const TEAL: [number, number, number] = [0, 176, 140];
const DARK: [number, number, number] = [18, 18, 32];

const fullName = (c: CastCrewReportContact) =>
  [c.first_name, c.last_name].filter(Boolean).join(" ").trim() || "—";

const roleOf = (c: CastCrewReportContact) =>
  (c.job_position === "Other" && c.other_role ? c.other_role : c.job_position) || "—";

const isCast = (c: CastCrewReportContact) => {
  const role = (c.job_position || "").toLowerCase();
  return Boolean(c.character_name) || Boolean(c.actor_type) || role.includes("actor") || role.includes("cast");
};

/** Builds the multi-page Cast & Crew contact sheet PDF. */
export function buildCastCrewReportPDF({ productionName, contacts }: CastCrewReportOptions): jsPDF {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const generated = new Date().toLocaleString();

  // Header band
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageWidth, 74, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(productionName?.trim() || "Production", 40, 34);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...TEAL);
  doc.text("CAST & CREW CONTACT SHEET", 40, 54);
  doc.setTextColor(190, 190, 205);
  doc.text(`Generated ${generated}`, pageWidth - 40, 54, { align: "right" });
  doc.text(`${contacts.length} contact${contacts.length === 1 ? "" : "s"}`, pageWidth - 40, 34, {
    align: "right",
  });

  const cast = contacts.filter(isCast);
  const crew = contacts.filter((c) => !isCast(c));

  let cursorY = 100;

  const renderSection = (title: string, rows: CastCrewReportContact[], castMode: boolean) => {
    if (rows.length === 0) return;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...DARK);
    doc.text(`${title} (${rows.length})`, 40, cursorY);
    cursorY += 10;

    const head = castMode
      ? [["Name", "Character", "Type", "Phone", "Email", "Instagram", "Notes"]]
      : [["Name", "Department / Position", "Phone", "Email", "Instagram", "Notes"]];

    const body = rows.map((c) =>
      castMode
        ? [
            fullName(c),
            c.character_name || "—",
            c.actor_type || "—",
            c.phone || "—",
            c.email || "—",
            c.instagram_handle || "—",
            c.notes || "",
          ]
        : [fullName(c), roleOf(c), c.phone || "—", c.email || "—", c.instagram_handle || "—", c.notes || ""],
    );

    autoTable(doc, {
      head,
      body,
      startY: cursorY,
      margin: { left: 40, right: 40 },
      styles: { font: "helvetica", fontSize: 9, cellPadding: 6, textColor: [40, 40, 55], overflow: "linebreak" },
      headStyles: { fillColor: TEAL, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
      alternateRowStyles: { fillColor: [244, 246, 248] },
      theme: "grid",
    });

    // @ts-expect-error lastAutoTable is added by jspdf-autotable
    cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 34;
  };

  if (contacts.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(90, 90, 110);
    doc.text("No contacts submitted yet.", 40, cursorY);
  } else {
    renderSection("CAST", cast, true);
    renderSection("CREW", crew, false);
  }

  // Footer on every page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    const h = doc.internal.pageSize.getHeight();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 155);
    doc.text("Confidential — production contact information. Handle per your production's privacy policy.", 40, h - 22);
    doc.text(`Page ${i} of ${pageCount} · Filmmaker Genius`, pageWidth - 40, h - 22, { align: "right" });
  }

  return doc;
}

export function reportFileName(productionName?: string | null): string {
  const base = (productionName || "cast-crew")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "cast-crew";
  return `${base}-contact-sheet-${new Date().toISOString().slice(0, 10)}.pdf`;
}

export function exportCastCrewReportToPDF(options: CastCrewReportOptions): void {
  buildCastCrewReportPDF(options).save(reportFileName(options.productionName));
}

/** Returns the PDF as a base64 string (no data-URI prefix) for emailing as an attachment. */
export function castCrewReportBase64(options: CastCrewReportOptions): string {
  return buildCastCrewReportPDF(options).output("datauristring").split(",")[1] ?? "";
}
