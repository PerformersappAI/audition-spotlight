import jsPDF from "jspdf";

interface ShotRow {
  shotNumber: number;
  location?: string;
  action?: string;
  description?: string;
  visualDescription?: string;
  shotType?: string;
  cameraAngle?: string;
  cameraMovement?: string;
  dialogue?: string;
  characters?: string[];
}

interface Options {
  title?: string;
  genre?: string;
  tone?: string;
}

export function exportShotListPDF(shots: ShotRow[], options: Options = {}) {
  const pdf = new jsPDF("portrait", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 12;
  let y = margin;

  // Header
  pdf.setFontSize(18);
  pdf.setFont(undefined, "bold");
  pdf.text(options.title || "Shot List", margin, y);
  y += 7;

  pdf.setFontSize(10);
  pdf.setFont(undefined, "normal");
  pdf.setTextColor(100, 100, 100);
  const meta = [
    options.genre && `Genre: ${options.genre}`,
    options.tone && `Tone: ${options.tone}`,
    `Shots: ${shots.length}`,
    `Generated: ${new Date().toLocaleDateString()}`,
  ]
    .filter(Boolean)
    .join("  •  ");
  pdf.text(meta, margin, y);
  y += 8;
  pdf.setTextColor(0, 0, 0);

  // Column layout
  const cols = [
    { label: "#", width: 10 },
    { label: "Location", width: 32 },
    { label: "Action", width: 50 },
    { label: "Shot Type", width: 28 },
    { label: "Camera Move", width: 28 },
    { label: "Dialogue", width: pageWidth - margin * 2 - 10 - 32 - 50 - 28 - 28 },
  ];

  const drawHeader = () => {
    pdf.setFillColor(30, 30, 30);
    pdf.rect(margin, y, pageWidth - margin * 2, 7, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont(undefined, "bold");
    let x = margin + 2;
    cols.forEach((c) => {
      pdf.text(c.label, x, y + 5);
      x += c.width;
    });
    y += 7;
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, "normal");
  };

  drawHeader();

  pdf.setFontSize(8);
  shots.forEach((shot, idx) => {
    const row = [
      String(shot.shotNumber),
      shot.location || "—",
      shot.action || shot.visualDescription || shot.description || "—",
      shot.shotType || shot.cameraAngle || "—",
      shot.cameraMovement || "Static",
      shot.dialogue && shot.dialogue !== "None" ? shot.dialogue : "—",
    ];

    // Calculate row height based on tallest wrapped column
    const wrapped = row.map((text, i) =>
      pdf.splitTextToSize(text, cols[i].width - 2)
    );
    const lineCount = Math.max(...wrapped.map((w) => w.length));
    const rowHeight = Math.max(7, lineCount * 3.5 + 2);

    // New page if needed
    if (y + rowHeight > pageHeight - margin) {
      pdf.addPage();
      y = margin;
      drawHeader();
    }

    // Zebra stripe
    if (idx % 2 === 0) {
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin, y, pageWidth - margin * 2, rowHeight, "F");
    }

    let x = margin + 2;
    wrapped.forEach((lines, i) => {
      pdf.text(lines, x, y + 4);
      x += cols[i].width;
    });

    y += rowHeight;
  });

  // Footer
  const pages = pdf.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `Page ${i} of ${pages} • Filmmaker Genius`,
      pageWidth / 2,
      pageHeight - 5,
      { align: "center" }
    );
  }

  const safeName = (options.title || "shot-list")
    .replace(/[^a-z0-9]+/gi, "_")
    .toLowerCase();
  pdf.save(`${safeName}_${new Date().toISOString().split("T")[0]}.pdf`);
}
