import jsPDF from "jspdf";
import type { PitchDeckData } from "@/pages/PitchDeckMaker";

const projectTypeLabels: Record<string, string> = {
  feature: "Feature Film",
  short: "Short Film",
  tv_series: "TV Series",
  documentary: "Documentary",
  web_series: "Web Series",
};

const budgetLabels: Record<string, string> = {
  micro: "Micro Budget (<$50K)",
  low: "Low Budget ($50K - $500K)",
  mid: "Mid Budget ($500K - $5M)",
  high: "High Budget ($5M+)",
};

export const exportPitchDeckToPDF = async (data: PitchDeckData): Promise<void> => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  const addNewPageIfNeeded = (requiredSpace: number = 30) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  const addSection = (title: string) => {
    addNewPageIfNeeded(40);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(217, 119, 6); // Amber color
    pdf.text(title, margin, yPos);
    yPos += 10;
    pdf.setTextColor(0, 0, 0);
  };

  const addParagraph = (text: string, fontSize: number = 11) => {
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", "normal");
    const lines = pdf.splitTextToSize(text, contentWidth);
    lines.forEach((line: string) => {
      addNewPageIfNeeded(8);
      pdf.text(line, margin, yPos);
      yPos += 6;
    });
    yPos += 4;
  };

  const addLabel = (label: string, value: string) => {
    if (!value) return;
    addNewPageIfNeeded(12);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${label}: `, margin, yPos);
    const labelWidth = pdf.getTextWidth(`${label}: `);
    pdf.setFont("helvetica", "normal");
    const valueLines = pdf.splitTextToSize(value, contentWidth - labelWidth);
    pdf.text(valueLines[0], margin + labelWidth, yPos);
    yPos += 6;
    for (let i = 1; i < valueLines.length; i++) {
      addNewPageIfNeeded(8);
      pdf.text(valueLines[i], margin, yPos);
      yPos += 6;
    }
    yPos += 2;
  };

  // ===== COVER PAGE =====
  pdf.setFillColor(20, 20, 30);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // Add poster image if available - full cover
  if (data.posterImage) {
    try {
      pdf.addImage(data.posterImage, "JPEG", 0, 0, pageWidth, pageHeight * 0.65);
      // Add dark gradient at bottom (simple overlay without opacity)
      pdf.setFillColor(20, 20, 30);
      for (let i = 0; i < 50; i++) {
        const alpha = i / 50;
        const y = pageHeight * 0.45 + (pageHeight * 0.55 * (i / 50));
        pdf.setFillColor(20, 20, 30);
        pdf.rect(0, y, pageWidth, pageHeight * 0.55 / 50, "F");
      }
    } catch (e) {
      console.log("Could not add poster image to PDF:", e);
    }
  }

  pdf.setFontSize(12);
  pdf.setTextColor(217, 119, 6);
  pdf.setFont("helvetica", "normal");
  pdf.text("PITCH DECK", pageWidth / 2, pageHeight * 0.55, { align: "center" });

  pdf.setFontSize(32);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  const titleLines = pdf.splitTextToSize(data.projectTitle || "Untitled Project", contentWidth);
  let titleY = pageHeight * 0.6;
  titleLines.forEach((line: string) => {
    pdf.text(line, pageWidth / 2, titleY, { align: "center" });
    titleY += 14;
  });

  if (data.projectType) {
    pdf.setFontSize(14);
    pdf.setTextColor(150, 150, 150);
    pdf.text(projectTypeLabels[data.projectType] || data.projectType, pageWidth / 2, titleY + 10, { align: "center" });
  }

  if (data.genre.length > 0) {
    pdf.setFontSize(12);
    pdf.setTextColor(217, 119, 6);
    pdf.text(data.genre.join(" • "), pageWidth / 2, titleY + 25, { align: "center" });
  }

  if (data.logline) {
    pdf.setFontSize(14);
    pdf.setTextColor(200, 200, 200);
    pdf.setFont("helvetica", "italic");
    const loglineLines = pdf.splitTextToSize(`"${data.logline}"`, contentWidth - 20);
    let loglineY = titleY + 45;
    loglineLines.forEach((line: string) => {
      pdf.text(line, pageWidth / 2, loglineY, { align: "center" });
      loglineY += 8;
    });
  }

  if (data.targetRating) {
    pdf.setFontSize(11);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Rated ${data.targetRating}`, pageWidth / 2, pageHeight - 20, { align: "center" });
  }

  // ===== SYNOPSIS PAGE =====
  if (data.synopsis || data.directorVision || data.synopsisImage) {
    pdf.addPage();
    
    // Add synopsis scene image as background if available
    if (data.synopsisImage) {
      try {
        pdf.addImage(data.synopsisImage, "JPEG", 0, 0, pageWidth, pageHeight * 0.4);
        // Add gradient overlay
        pdf.setFillColor(255, 255, 255);
        for (let i = 0; i < 30; i++) {
          const y = pageHeight * 0.25 + (pageHeight * 0.15 * (i / 30));
          pdf.rect(0, y, pageWidth, pageHeight * 0.15 / 30, "F");
        }
      } catch (e) {
        console.log("Could not add synopsis image:", e);
      }
      yPos = pageHeight * 0.42;
    } else {
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      yPos = margin;
    }

    addSection("The Story");

    if (data.synopsis) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Synopsis", margin, yPos);
      yPos += 8;
      addParagraph(data.synopsis);
    }

    if (data.directorVision) {
      yPos += 5;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Director's Vision", margin, yPos);
      yPos += 8;
      pdf.setFont("helvetica", "italic");
      addParagraph(data.directorVision);
    }

    if (data.toneMood) {
      addLabel("Tone & Mood", data.toneMood);
    }
  }

  // ===== CHARACTERS PAGE =====
  if (data.characters.length > 0) {
    pdf.addPage();
    yPos = margin;

    addSection("Characters");

    // Calculate grid layout for character portraits
    const charsWithPortraits = data.characters.filter(c => c.aiPortrait || c.referencePhoto);
    const hasPortraits = charsWithPortraits.length > 0;

    if (hasPortraits) {
      // Grid layout with portraits
      const portraitWidth = 35;
      const portraitHeight = 45;
      const cardWidth = (contentWidth - 10) / 2;
      const cardHeight = portraitHeight + 30;
      let col = 0;

      data.characters.forEach((char, index) => {
        if (yPos + cardHeight > pageHeight - margin) {
          pdf.addPage();
          yPos = margin;
          col = 0;
        }

        const xPos = margin + col * (cardWidth + 10);
        
        // Draw card background
        pdf.setFillColor(245, 245, 245);
        pdf.roundedRect(xPos, yPos, cardWidth, cardHeight, 3, 3, "F");
        
        // Add portrait if available
        const portrait = char.aiPortrait || char.referencePhoto;
        if (portrait) {
          try {
            pdf.addImage(portrait, "JPEG", xPos + 5, yPos + 5, portraitWidth, portraitHeight);
          } catch (e) {
            console.log("Could not add character portrait:", e);
          }
        }

        // Add character info
        const textX = portrait ? xPos + portraitWidth + 10 : xPos + 5;
        const textWidth = portrait ? cardWidth - portraitWidth - 15 : cardWidth - 10;
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(char.name || "Unnamed", textX, yPos + 12);
        
        pdf.setFontSize(9);
        pdf.setTextColor(217, 119, 6);
        pdf.text(char.role.toUpperCase(), textX, yPos + 18);
        
        if (char.description) {
          pdf.setFontSize(8);
          pdf.setTextColor(80, 80, 80);
          const descLines = pdf.splitTextToSize(char.description, textWidth);
          descLines.slice(0, 4).forEach((line: string, i: number) => {
            pdf.text(line, textX, yPos + 25 + (i * 5));
          });
        }

        col++;
        if (col >= 2) {
          col = 0;
          yPos += cardHeight + 5;
        }
      });

      if (col !== 0) {
        yPos += cardHeight + 5;
      }
    } else {
      // Text-only layout
      data.characters.forEach((char) => {
        addNewPageIfNeeded(30);
        pdf.setFontSize(13);
        pdf.setFont("helvetica", "bold");
        pdf.text(char.name || "Unnamed Character", margin, yPos);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 100, 100);
        pdf.text(` (${char.role})`, margin + pdf.getTextWidth(char.name || "Unnamed Character") + 2, yPos);
        pdf.setTextColor(0, 0, 0);
        yPos += 8;
        if (char.description) {
          addParagraph(char.description, 10);
        }
        yPos += 4;
      });
    }
  }

  // ===== VISUAL STYLE PAGE =====
  if (data.visualStyle || (data.moodboardUploads && data.moodboardUploads.length > 0) || data.moodboardImages.filter(Boolean).length > 0) {
    pdf.addPage();
    yPos = margin;

    addSection("Visual Style");
    
    if (data.visualStyle) {
      addParagraph(data.visualStyle);
    }

    // Add moodboard images
    const allImages = [
      ...(data.moodboardUploads || []),
      ...data.moodboardImages.filter(Boolean)
    ];

    if (allImages.length > 0) {
      yPos += 10;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Moodboard", margin, yPos);
      yPos += 10;

      // Create a 2x3 grid for images
      const imgWidth = (contentWidth - 10) / 2;
      const imgHeight = imgWidth * 0.6;
      let col = 0;
      let row = 0;

      for (const imgSrc of allImages.slice(0, 6)) {
        const x = margin + col * (imgWidth + 10);
        const y = yPos + row * (imgHeight + 5);

        if (y + imgHeight > pageHeight - margin) {
          pdf.addPage();
          yPos = margin;
          row = 0;
        }

        try {
          pdf.addImage(imgSrc, "JPEG", x, y, imgWidth, imgHeight);
        } catch (e) {
          // Skip invalid images
          console.log("Could not add moodboard image:", e);
        }

        col++;
        if (col >= 2) {
          col = 0;
          row++;
        }
      }

      yPos += (row + 1) * (imgHeight + 5) + 10;
    }
  }

  // ===== COMPARABLES PAGE =====
  if (data.comparables.length > 0) {
    pdf.addPage();
    yPos = margin;

    addSection("Comparable Projects");

    data.comparables.forEach((comp) => {
      addNewPageIfNeeded(25);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${comp.title}${comp.year ? ` (${comp.year})` : ""}`, margin, yPos);
      yPos += 7;
      if (comp.whySimilar) {
        addParagraph(comp.whySimilar, 10);
      }
      yPos += 3;
    });
  }

  // ===== TARGET AUDIENCE PAGE =====
  if (data.primaryDemographic || data.marketAnalysis) {
    pdf.addPage();
    yPos = margin;

    addSection("Target Audience");

    addLabel("Primary Demographic", data.primaryDemographic);
    addLabel("Secondary Audience", data.secondaryAudience);

    if (data.marketAnalysis) {
      yPos += 5;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Market Analysis", margin, yPos);
      yPos += 8;
      addParagraph(data.marketAnalysis);
    }
  }

  // ===== PRODUCTION PAGE =====
  if (data.budgetRange || data.shootingLocations || data.timeline) {
    pdf.addPage();
    yPos = margin;

    addSection("Production Details");

    if (data.budgetRange) {
      addLabel("Budget Range", budgetLabels[data.budgetRange] || data.budgetRange);
    }
    addLabel("Shooting Locations", data.shootingLocations);
    if (data.unionStatus) {
      addLabel("Union Status", data.unionStatus === "sag" ? "SAG-AFTRA" : data.unionStatus === "non_union" ? "Non-Union" : "TBD");
    }

    if (data.timeline) {
      yPos += 5;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Timeline", margin, yPos);
      yPos += 8;
      addParagraph(data.timeline);
    }
  }

  // ===== TEAM PAGE =====
  if (data.teamMembers.length > 0) {
    pdf.addPage();
    yPos = margin;

    addSection("Key Team");

    data.teamMembers.forEach((member) => {
      addNewPageIfNeeded(25);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(member.name, margin, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(217, 119, 6);
      pdf.text(` — ${member.role}`, margin + pdf.getTextWidth(member.name), yPos);
      pdf.setTextColor(0, 0, 0);
      yPos += 7;
      if (member.credits) {
        addParagraph(member.credits, 10);
      }
      yPos += 3;
    });
  }

  // ===== DISTRIBUTION PAGE =====
  if (data.targetPlatforms.length > 0 || data.distributionPlan) {
    pdf.addPage();
    yPos = margin;

    addSection("Distribution Strategy");

    if (data.targetPlatforms.length > 0) {
      addLabel("Target Platforms", data.targetPlatforms.join(", "));
    }

    if (data.marketingHighlights) {
      yPos += 5;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Marketing Highlights", margin, yPos);
      yPos += 8;
      addParagraph(data.marketingHighlights);
    }

    if (data.distributionPlan) {
      yPos += 5;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Distribution Plan", margin, yPos);
      yPos += 8;
      addParagraph(data.distributionPlan);
    }
  }

  // ===== CONTACT PAGE =====
  if (data.contactName || data.contactEmail || data.investmentAsk) {
    pdf.addPage();
    yPos = margin;

    addSection("Contact");

    if (data.investmentAsk) {
      pdf.setFillColor(255, 250, 240);
      pdf.roundedRect(margin, yPos, contentWidth, 30, 3, 3, "F");
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("What We're Seeking", margin + 5, yPos + 10);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      const askLines = pdf.splitTextToSize(data.investmentAsk, contentWidth - 10);
      pdf.text(askLines.slice(0, 2), margin + 5, yPos + 18);
      yPos += 40;
    }

    if (data.contactName) {
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(data.contactName, margin, yPos);
      yPos += 12;
    }

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");

    if (data.contactEmail) {
      pdf.text(`Email: ${data.contactEmail}`, margin, yPos);
      yPos += 7;
    }

    if (data.contactPhone) {
      pdf.text(`Phone: ${data.contactPhone}`, margin, yPos);
      yPos += 7;
    }

    if (data.website) {
      pdf.text(`Website: ${data.website}`, margin, yPos);
      yPos += 7;
    }
  }

  // Save the PDF
  const fileName = `${data.projectTitle || "Pitch-Deck"}-PitchDeck.pdf`.replace(/[^a-zA-Z0-9-]/g, "_");
  pdf.save(fileName);
};
