import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: "audition" | "festival" | "deadline" | "meeting";
  location?: string;
  description?: string;
  status?: string;
}

const getEventTypeColor = (type: string): [number, number, number] => {
  switch (type) {
    case "audition": return [59, 130, 246]; // blue-500
    case "festival": return [168, 85, 247]; // purple-500
    case "deadline": return [239, 68, 68]; // red-500
    case "meeting": return [34, 197, 94]; // green-500
    default: return [107, 114, 128]; // gray-500
  }
};

export const exportCalendarToPDF = (events: CalendarEvent[], selectedMonth?: Date) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const currentDate = new Date();
  const monthToUse = selectedMonth || currentDate;
  
  // Header
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Production Calendar', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${format(currentDate, 'MMMM d, yyyy')}`, pageWidth - 20, 25, { align: 'right' });
  doc.text(`Month: ${format(monthToUse, 'MMMM yyyy')}`, pageWidth - 20, 32, { align: 'right' });
  
  // Stats summary
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Event Summary', 20, 55);
  
  const auditionCount = events.filter(e => e.type === 'audition').length;
  const festivalCount = events.filter(e => e.type === 'festival').length;
  const deadlineCount = events.filter(e => e.type === 'deadline').length;
  const meetingCount = events.filter(e => e.type === 'meeting').length;
  
  const statsStartY = 65;
  const statsBoxWidth = 40;
  const statsBoxHeight = 20;
  const statsGap = 5;
  
  // Auditions box
  doc.setFillColor(59, 130, 246);
  doc.roundedRect(20, statsStartY, statsBoxWidth, statsBoxHeight, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(auditionCount.toString(), 40, statsStartY + 10, { align: 'center' });
  doc.setFontSize(8);
  doc.text('Auditions', 40, statsStartY + 16, { align: 'center' });
  
  // Festivals box
  doc.setFillColor(168, 85, 247);
  doc.roundedRect(20 + statsBoxWidth + statsGap, statsStartY, statsBoxWidth, statsBoxHeight, 3, 3, 'F');
  doc.text(festivalCount.toString(), 40 + statsBoxWidth + statsGap, statsStartY + 10, { align: 'center' });
  doc.setFontSize(8);
  doc.text('Festivals', 40 + statsBoxWidth + statsGap, statsStartY + 16, { align: 'center' });
  
  // Deadlines box
  doc.setFillColor(239, 68, 68);
  doc.roundedRect(20 + (statsBoxWidth + statsGap) * 2, statsStartY, statsBoxWidth, statsBoxHeight, 3, 3, 'F');
  doc.setFontSize(16);
  doc.text(deadlineCount.toString(), 40 + (statsBoxWidth + statsGap) * 2, statsStartY + 10, { align: 'center' });
  doc.setFontSize(8);
  doc.text('Deadlines', 40 + (statsBoxWidth + statsGap) * 2, statsStartY + 16, { align: 'center' });
  
  // Meetings box
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(20 + (statsBoxWidth + statsGap) * 3, statsStartY, statsBoxWidth, statsBoxHeight, 3, 3, 'F');
  doc.setFontSize(16);
  doc.text(meetingCount.toString(), 40 + (statsBoxWidth + statsGap) * 3, statsStartY + 10, { align: 'center' });
  doc.setFontSize(8);
  doc.text('Meetings', 40 + (statsBoxWidth + statsGap) * 3, statsStartY + 16, { align: 'center' });
  
  // Events table
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('All Events', 20, 100);
  
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const tableData = sortedEvents.map(event => [
    format(event.date, 'MMM d, yyyy'),
    event.type.charAt(0).toUpperCase() + event.type.slice(1),
    event.title,
    event.location || '-',
    event.status || '-'
  ]);
  
  autoTable(doc, {
    startY: 105,
    head: [['Date', 'Type', 'Title', 'Location', 'Status']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 25 },
      2: { cellWidth: 50 },
      3: { cellWidth: 45 },
      4: { cellWidth: 25 }
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 1) {
        const type = data.cell.raw?.toString().toLowerCase();
        if (type) {
          const color = getEventTypeColor(type);
          data.cell.styles.textColor = color;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
    margin: { left: 20, right: 20 }
  });
  
  // Upcoming events section
  const upcomingEvents = sortedEvents
    .filter(e => e.date >= currentDate)
    .slice(0, 5);
  
  if (upcomingEvents.length > 0) {
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    
    if (finalY < 240) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Upcoming Events', 20, finalY + 15);
      
      autoTable(doc, {
        startY: finalY + 20,
        head: [['Date', 'Event', 'Location']],
        body: upcomingEvents.map(e => [
          format(e.date, 'MMM d, yyyy'),
          e.title,
          e.location || '-'
        ]),
        theme: 'grid',
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255]
        },
        margin: { left: 20, right: 20 }
      });
    }
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount} | Production Calendar | Generated by Filmmaker AI`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  const fileName = `production-calendar-${format(currentDate, 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
  
  return fileName;
};
