import jsPDF from 'jspdf';

interface ContractData {
  date: string;
  producerName: string;
  investorName: string;
  filmTitle: string;
  investmentAmount: string;
  fundsUsedFor: string;
  recoupmentPercentage: string;
  creditTitle: string;
  creditPlacement: string;
  producerSignatory: string;
  companyLogo?: string;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return "[Date]";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const formatCurrency = (amount: string): string => {
  if (!amount) return "[Amount]";
  const num = parseFloat(amount.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return amount;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};

export const exportContractToPDF = (data: ContractData, printOnly: boolean = false): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Add company logo if provided
  if (data.companyLogo) {
    try {
      const logoWidth = 50;
      const logoHeight = 15;
      const logoX = (pageWidth - logoWidth) / 2;
      doc.addImage(data.companyLogo, 'AUTO', logoX, yPosition, logoWidth, logoHeight);
      yPosition += logoHeight + 8;
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
    }
  }

  const addText = (text: string, fontSize: number, isBold: boolean = false, align: 'left' | 'center' = 'left') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    const lines = doc.splitTextToSize(text, contentWidth);
    
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin - 10) {
        doc.addPage();
        yPosition = margin;
      }
      
      if (align === 'center') {
        doc.text(line, pageWidth / 2, yPosition, { align: 'center' });
      } else {
        doc.text(line, margin, yPosition);
      }
      yPosition += fontSize * 0.4;
    });
    
    yPosition += 2;
  };

  const addSection = (title: string, content: string) => {
    addText(title, 12, true);
    addText(content, 11);
    yPosition += 3;
  };

  const addListItem = (text: string, indent: number = 0) => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const bulletX = margin + indent;
    const textX = bulletX + 5;
    const lines = doc.splitTextToSize(text, contentWidth - indent - 5);
    
    doc.text('•', bulletX, yPosition);
    lines.forEach((line: string, index: number) => {
      if (yPosition > pageHeight - margin - 10) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, textX, yPosition);
      yPosition += 5;
    });
  };

  // Title
  addText('FILM INVESTMENT AGREEMENT', 18, true, 'center');
  yPosition += 8;

  // Intro paragraph
  addText(`This Agreement is entered into on this ${formatDate(data.date)}, by and between:`, 11);
  yPosition += 2;
  addText(`${data.producerName || "[Your Production Company Name]"} ("Producer") and`, 11, true);
  addText(`${data.investorName || "[Investor Name/Entity]"} ("Investor").`, 11, true);
  yPosition += 6;

  // Section 1
  addSection('1. The Project', 
    `The Investor agrees to provide capital for the production of the motion picture currently titled "${data.filmTitle || "[Film Title]"}" (the "Project").`
  );

  // Section 2
  addSection('2. Investment Amount',
    `The Investor agrees to provide a total investment of ${formatCurrency(data.investmentAmount)} (the "Investment"). These funds shall be used specifically for ${data.fundsUsedFor} of the Project.`
  );

  // Section 3
  addText('3. Recoupment (Getting Paid Back)', 12, true);
  addText('The "Gross Receipts" (money earned from the film) shall be distributed in the following order of priority:', 11);
  yPosition += 2;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const recoupItems = [
    `Expenses: Payment of sales agent fees, guild residuals, and distribution expenses.`,
    `Investor Recoupment: 100% of remaining funds go to the Investor(s) until they have recovered ${data.recoupmentPercentage || "120"}% of their initial Investment.`,
    `Net Profits: Once the Investor has recouped ${data.recoupmentPercentage || "120"}%, the remaining "Net Profits" are typically split 50/50 between the "Investor Pool" and the "Producer Pool."`
  ];

  recoupItems.forEach((item, index) => {
    const numX = margin;
    const textX = margin + 8;
    const lines = doc.splitTextToSize(item, contentWidth - 8);
    
    doc.text(`${index + 1}.`, numX, yPosition);
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin - 10) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, textX, yPosition);
      yPosition += 5;
    });
    yPosition += 1;
  });
  yPosition += 4;

  // Section 4
  addText('4. Credit', 12, true);
  addText('Provided that the Investment is paid in full, the Investor shall receive the following on-screen credit:', 11);
  yPosition += 2;
  addListItem(`Credit Title: ${data.creditTitle}`);
  addListItem(`Placement: ${data.creditPlacement}`);
  yPosition += 4;

  // Section 5
  addText('5. Rights and Control', 12, true);
  addListItem('Creative Control: The Producer retains all creative control over the Project, including casting, editing, and distribution decisions.');
  addListItem('Ownership: The Investor acknowledges that this investment does not grant them ownership of the Intellectual Property (IP) or the copyright of the film.');
  yPosition += 4;

  // Section 6
  addSection('6. Risk Disclosure',
    'The Investor acknowledges that motion picture investments are highly speculative. There is no guarantee that the Project will be completed, distributed, or that any Investment will be recouped.'
  );

  // Section 7 - Signatures
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }

  addText('7. Signatures', 12, true);
  yPosition += 10;

  // Producer signature line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Producer: _________________________', margin, yPosition);
  doc.text('Date: __________', pageWidth - margin - 40, yPosition);
  yPosition += 6;
  doc.setFontSize(9);
  doc.text(`(Authorized Signatory for ${data.producerName || "[Company Name]"})`, margin, yPosition);
  yPosition += 15;

  // Investor signature line
  doc.setFontSize(11);
  doc.text('Investor: _________________________', margin, yPosition);
  doc.text('Date: __________', pageWidth - margin - 40, yPosition);

  // Footer
  yPosition = pageHeight - 15;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('This document is a template for educational purposes only. Consult a qualified attorney before use.', pageWidth / 2, yPosition, { align: 'center' });
  doc.text(`Generated by Filmmaker Genius`, pageWidth / 2, yPosition + 4, { align: 'center' });

  if (printOnly) {
    // Open in new window for printing
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(pdfUrl);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  } else {
    // Download the PDF
    const filename = `Investment_Agreement_${data.filmTitle?.replace(/[^a-zA-Z0-9]/g, '_') || 'Contract'}.pdf`;
    doc.save(filename);
  }
};
