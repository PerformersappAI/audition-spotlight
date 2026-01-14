import jsPDF from "jspdf";

export interface FundingStrategyData {
  projectTitle: string;
  projectType: string;
  logline: string;
  genre: string;
  budgetRange: string;
  timeline: string;
  currentFunding: string;
  hasAttachedTalent: boolean;
  hasDirector: boolean;
  hasProducer: boolean;
  hasCompletedScript: boolean;
  hasPreviousCredits: boolean;
  teamNotes: string;
  selectedSources: string[];
  targetAmount: string;
  askingFor: string;
  investorPitch: string;
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  feature: "Feature Film",
  short: "Short Film",
  documentary: "Documentary",
  tv_series: "TV Series",
  web_series: "Web Series",
  pilot: "TV Pilot",
};

const BUDGET_LABELS: Record<string, { label: string; range: string }> = {
  micro: { label: "Micro Budget", range: "Under $50,000" },
  low: { label: "Low Budget", range: "$50,000 - $250,000" },
  mid_low: { label: "Mid-Low Budget", range: "$250,000 - $500,000" },
  mid: { label: "Mid Budget", range: "$500,000 - $1,000,000" },
  mid_high: { label: "Mid-High Budget", range: "$1M - $5M" },
  high: { label: "High Budget", range: "$5M+" },
};

const TIMELINE_LABELS: Record<string, string> = {
  immediate: "Immediate (within 3 months)",
  short: "Short-term (6-12 months)",
  medium: "Medium-term (1-2 years)",
  development: "In Development",
};

const FUNDING_SOURCE_DETAILS: Record<string, { label: string; description: string; tips: string[] }> = {
  grants: {
    label: "Grants & Fellowships",
    description: "Non-repayable funding from foundations and arts organizations.",
    tips: [
      "Apply to Sundance Institute Documentary Fund (early deadlines)",
      "Film Independent offers Fiscal Sponsorship for tax-deductible donations",
      "Creative Capital awards up to $50,000 for bold projects",
      "SFFILM Documentary Film Fund opens in summer",
    ],
  },
  crowdfunding: {
    label: "Crowdfunding",
    description: "Community-supported funding through online platforms.",
    tips: [
      "Seed&Spark has 75% success rate (aim for 80% goal)",
      "Kickstarter works best for high-concept projects with existing fanbase",
      "Indiegogo offers Flexible Funding (keep what you raise)",
      "Build your audience before launching your campaign",
    ],
  },
  tax_incentives: {
    label: "Tax Incentives & Rebates",
    description: "Production rebates offered by states and countries to attract filming.",
    tips: [
      "Georgia: 20% credit for post-production (2026, $500k spend minimum)",
      "Canary Islands: Up to 54% on first €1M of local spend",
      "Illinois: 35% credit for local labor (extended through 2039)",
      "You can 'loan' against expected rebates for upfront cash",
    ],
  },
  investors: {
    label: "Private Equity Investment",
    description: "Capital from individuals or funds in exchange for ownership stake.",
    tips: [
      "Investors increasingly prefer 'Slates' (multiple films) to diversify risk",
      "Prepare a detailed recoupment waterfall document",
      "Consider offering Associate Producer or Executive Producer credits",
      "Have an entertainment attorney review all investor agreements",
    ],
  },
  presales: {
    label: "Pre-Sales",
    description: "Selling distribution rights to specific territories before production.",
    tips: [
      "Attach recognizable talent to increase pre-sale value",
      "Major markets: Germany, France, UK, Japan, Australia",
      "Work with an international sales agent",
      "Pre-sales can trigger gap financing from banks",
    ],
  },
  gap_financing: {
    label: "Gap/Bridge Loans",
    description: "Specialized loans against unsold territories or tax rebates.",
    tips: [
      "Entertainment Partners and similar lenders specialize in this",
      "Typically covers 10-20% of unsold foreign territories",
      "Requires strong pre-sales and/or tax incentive contracts",
      "Interest rates are higher than traditional financing",
    ],
  },
  studio: {
    label: "Studio or Streamer Deal",
    description: "Financing from major studios or streaming platforms.",
    tips: [
      "Requires established track record or major attachments",
      "Consider negative pickup deals (studio buys finished film)",
      "Streamers often want worldwide rights",
      "Work with an agent or manager with studio relationships",
    ],
  },
  self: {
    label: "Self-Financed",
    description: "Personal, family, or credit-based funding.",
    tips: [
      "Set a clear budget limit you can afford to lose",
      "Consider as seed money to attract additional funding",
      "Document all investments properly for tax purposes",
      "Be cautious with credit card debt for filmmaking",
    ],
  },
};

export const exportFundingStrategyToPDF = async (data: FundingStrategyData): Promise<void> => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  const addNewPage = () => {
    pdf.addPage();
    yPosition = margin;
  };

  const checkPageBreak = (height: number) => {
    if (yPosition + height > pageHeight - margin) {
      addNewPage();
    }
  };

  // =====================
  // COVER PAGE
  // =====================
  
  // Header bar
  pdf.setFillColor(16, 185, 129); // Emerald
  pdf.rect(0, 0, pageWidth, 50, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont("helvetica", "bold");
  pdf.text("FUNDING STRATEGY BRIEF", pageWidth / 2, 30, { align: "center" });
  
  yPosition = 70;
  
  // Project Title
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text(data.projectTitle || "Untitled Project", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 15;
  
  // Project Type & Genre
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 100, 100);
  const typeGenre = [
    PROJECT_TYPE_LABELS[data.projectType] || "",
    data.genre,
  ].filter(Boolean).join(" • ");
  if (typeGenre) {
    pdf.text(typeGenre, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 12;
  }
  
  // Budget & Timeline
  const budget = BUDGET_LABELS[data.budgetRange];
  if (budget) {
    pdf.setFontSize(16);
    pdf.setTextColor(16, 185, 129);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${budget.label} (${budget.range})`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 20;
  }
  
  // Logline
  if (data.logline) {
    yPosition += 10;
    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "italic");
    const loglineLines = pdf.splitTextToSize(`"${data.logline}"`, contentWidth - 20);
    pdf.text(loglineLines, pageWidth / 2, yPosition, { align: "center" });
    yPosition += loglineLines.length * 6 + 10;
  }

  // Key Metrics Box
  yPosition += 10;
  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(margin, yPosition, contentWidth, 50, 3, 3, "F");
  
  const metricsY = yPosition + 15;
  const colWidth = contentWidth / 3;
  
  // Target Amount
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(10);
  pdf.text("TARGET RAISE", margin + colWidth * 0.5, metricsY, { align: "center" });
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(data.targetAmount || "TBD", margin + colWidth * 0.5, metricsY + 10, { align: "center" });
  
  // Current Funding
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("SECURED", margin + colWidth * 1.5, metricsY, { align: "center" });
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(data.currentFunding || "$0", margin + colWidth * 1.5, metricsY + 10, { align: "center" });
  
  // Timeline
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("TIMELINE", margin + colWidth * 2.5, metricsY, { align: "center" });
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(TIMELINE_LABELS[data.timeline] || "TBD", margin + colWidth * 2.5, metricsY + 10, { align: "center" });

  yPosition += 60;

  // What We're Asking For
  if (data.askingFor) {
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(16, 185, 129);
    pdf.text("SEEKING:", margin, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "normal");
    pdf.text(data.askingFor, margin + 25, yPosition);
    yPosition += 15;
  }

  // Team Assets
  const assets: string[] = [];
  if (data.hasCompletedScript) assets.push("Completed Script");
  if (data.hasDirector) assets.push("Attached Director");
  if (data.hasProducer) assets.push("Attached Producer");
  if (data.hasAttachedTalent) assets.push("Attached Talent");
  if (data.hasPreviousCredits) assets.push("Proven Track Record");

  if (assets.length > 0) {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(16, 185, 129);
    pdf.text("PACKAGE INCLUDES:", margin, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "normal");
    pdf.text(assets.join(" • "), margin + 45, yPosition);
    yPosition += 15;
  }

  // =====================
  // FUNDING STRATEGY PAGE
  // =====================
  addNewPage();
  
  // Section Header
  pdf.setFillColor(16, 185, 129);
  pdf.rect(0, 0, pageWidth, 25, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("RECOMMENDED FUNDING SOURCES", pageWidth / 2, 16, { align: "center" });
  
  yPosition = 40;

  if (data.selectedSources.length === 0) {
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(12);
    pdf.text("No funding sources selected.", margin, yPosition);
  } else {
    data.selectedSources.forEach((sourceId, index) => {
      const source = FUNDING_SOURCE_DETAILS[sourceId];
      if (!source) return;

      checkPageBreak(60);

      // Source Header
      pdf.setFillColor(245, 245, 245);
      pdf.roundedRect(margin, yPosition, contentWidth, 8, 2, 2, "F");
      pdf.setTextColor(16, 185, 129);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${index + 1}. ${source.label}`, margin + 5, yPosition + 6);
      yPosition += 14;

      // Description
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text(source.description, margin + 5, yPosition);
      yPosition += 10;

      // Tips
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      source.tips.forEach((tip) => {
        checkPageBreak(8);
        pdf.text(`• ${tip}`, margin + 8, yPosition);
        yPosition += 7;
      });

      yPosition += 10;
    });
  }

  // Investor Pitch (if provided)
  if (data.investorPitch) {
    checkPageBreak(40);
    yPosition += 10;
    
    pdf.setFillColor(16, 185, 129);
    pdf.rect(0, yPosition - 5, pageWidth, 20, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("WHY INVEST IN THIS PROJECT", pageWidth / 2, yPosition + 7, { align: "center" });
    yPosition += 25;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    const pitchLines = pdf.splitTextToSize(data.investorPitch, contentWidth);
    pdf.text(pitchLines, margin, yPosition);
    yPosition += pitchLines.length * 6 + 15;
  }

  // =====================
  // RESOURCES PAGE
  // =====================
  addNewPage();

  pdf.setFillColor(16, 185, 129);
  pdf.rect(0, 0, pageWidth, 25, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("ESSENTIAL RESOURCES & NEXT STEPS", pageWidth / 2, 16, { align: "center" });

  yPosition = 40;

  // Document Checklist
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Production Package Checklist", margin, yPosition);
  yPosition += 10;

  const checklist = [
    { item: "Lookbook/Pitch Deck", desc: "Visual representation of tone and style" },
    { item: "Finance Plan", desc: "Breakdown of funding sources and percentages" },
    { item: "Recoupment Waterfall", desc: "Document showing investor payback order" },
    { item: "Line-Item Budget", desc: "Professional cost breakdown" },
    { item: "Production Schedule", desc: "Realistic timeline with milestones" },
  ];

  pdf.setFontSize(11);
  checklist.forEach((item) => {
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(`☐ ${item.item}`, margin + 5, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    pdf.text(`- ${item.desc}`, margin + 60, yPosition);
    yPosition += 8;
  });

  yPosition += 15;

  // Key Resources
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("2026 Funding Resources", margin, yPosition);
  yPosition += 10;

  const resources = [
    "Sundance Institute: sundance.org/programs",
    "Film Independent: filmindependent.org",
    "Seed&Spark: seedandspark.com",
    "IFP (Independent Filmmaker Project): ifp.org",
    "Creative Capital: creative-capital.org",
  ];

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  resources.forEach((resource) => {
    pdf.text(`• ${resource}`, margin + 5, yPosition);
    yPosition += 7;
  });

  // Footer
  yPosition = pageHeight - 30;
  pdf.setFillColor(240, 240, 240);
  pdf.rect(0, yPosition - 5, pageWidth, 35, "F");
  
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.text(
    "Generated by Filmmaker Genius • filmmakergenius.com",
    pageWidth / 2,
    yPosition + 5,
    { align: "center" }
  );
  pdf.text(
    `Created: ${new Date().toLocaleDateString()}`,
    pageWidth / 2,
    yPosition + 12,
    { align: "center" }
  );
  pdf.setFontSize(8);
  pdf.text(
    "This document is for informational purposes only. Consult with legal and financial professionals.",
    pageWidth / 2,
    yPosition + 20,
    { align: "center" }
  );

  // Save
  const filename = `${(data.projectTitle || "project").replace(/[^a-z0-9]/gi, "_")}_Funding_Strategy.pdf`;
  pdf.save(filename);
};