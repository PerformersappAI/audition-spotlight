import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CallSheetData, CallSheetScene, CallSheetCast, CallSheetCrew, CallSheetBackground } from '@/hooks/useCallSheets';

// Helper to draw section header with background
const drawSectionHeader = (doc: jsPDF, text: string, yPosition: number, pageWidth: number): number => {
  // Draw light gray background bar
  doc.setFillColor(230, 230, 230);
  doc.rect(14, yPosition - 5, pageWidth - 28, 8, 'F');
  
  // Draw section title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(text, 16, yPosition);
  
  return yPosition + 6;
};

export const exportCallSheetToPDF = (
  callSheet: CallSheetData,
  scenes: CallSheetScene[],
  cast: CallSheetCast[],
  crew: CallSheetCrew[],
  background: CallSheetBackground[]
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 15;

  // Header - Title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('CALL SHEET', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(14);
  doc.text(callSheet.project_name.toUpperCase(), pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(callSheet.production_company, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  
  // Date and Day Number in a bordered box
  const dateText = new Date(callSheet.shoot_date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Parse day_number for "Day X of Y" format
  let dayDisplay = '';
  if (callSheet.day_number) {
    // Check if already in "Day X of Y" format
    if (callSheet.day_number.toLowerCase().includes('of')) {
      dayDisplay = callSheet.day_number;
    } else if (callSheet.total_days) {
      dayDisplay = `Day ${callSheet.day_number} of ${callSheet.total_days}`;
    } else {
      dayDisplay = `Day ${callSheet.day_number}`;
    }
  }
  
  // Draw date box
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(14, yPosition - 4, pageWidth - 28, dayDisplay ? 14 : 10);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(dateText, pageWidth / 2, yPosition + 2, { align: 'center' });
  
  if (dayDisplay) {
    yPosition += 6;
    doc.setFontSize(10);
    doc.text(dayDisplay, pageWidth / 2, yPosition + 2, { align: 'center' });
    yPosition += 12;
  } else {
    yPosition += 10;
  }

  yPosition += 6;

  // Call Times Section
  yPosition = drawSectionHeader(doc, 'CALL TIMES', yPosition, pageWidth);

  const callTimesData = [
    ['General Crew Call', callSheet.general_crew_call || 'TBD', 'Shooting Call', callSheet.shooting_call || 'TBD'],
    ['Courtesy Breakfast', callSheet.courtesy_breakfast_time || 'N/A', 'Lunch', callSheet.lunch_time || 'TBD'],
    ['Wrap (Est.)', callSheet.wrap_time || 'TBD', '', ''],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: callTimesData,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3, lineColor: [0, 0, 0], lineWidth: 0.1 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40, fillColor: [245, 245, 245] },
      1: { cellWidth: 35 },
      2: { fontStyle: 'bold', cellWidth: 40, fillColor: [245, 245, 245] },
      3: { cellWidth: 35 },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 8;

  // Key Personnel Section
  if (callSheet.director || callSheet.line_producer || callSheet.upm || callSheet.associate_director) {
    yPosition = drawSectionHeader(doc, 'KEY PERSONNEL', yPosition, pageWidth);

    const personnelData: string[][] = [];
    
    // Row 1: Director and Associate Director
    const row1 = ['Director', callSheet.director || '', 'Associate Director', callSheet.associate_director || ''];
    personnelData.push(row1);
    
    // Row 2: Line Producer and UPM
    const row2 = ['Line Producer', callSheet.line_producer || '', 'UPM', callSheet.upm || ''];
    personnelData.push(row2);
    
    // Executive Producers
    if (callSheet.executive_producers && callSheet.executive_producers.length > 0) {
      personnelData.push(['Executive Producers', callSheet.executive_producers.join(', '), '', '']);
    }
    
    // Producers
    if (callSheet.producers && callSheet.producers.length > 0) {
      personnelData.push(['Producers', callSheet.producers.join(', '), '', '']);
    }

    autoTable(doc, {
      startY: yPosition,
      body: personnelData,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3, lineColor: [0, 0, 0], lineWidth: 0.1 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40, fillColor: [245, 245, 245] },
        1: { cellWidth: 55 },
        2: { fontStyle: 'bold', cellWidth: 40, fillColor: [245, 245, 245] },
        3: { cellWidth: 50 },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 8;
  }

  // Location & Weather Section
  yPosition = drawSectionHeader(doc, 'LOCATION & WEATHER', yPosition, pageWidth);

  const locationData: string[][] = [];
  
  // Location info
  if (callSheet.shooting_location) {
    locationData.push(['Location', callSheet.shooting_location, '', '']);
  }
  if (callSheet.location_address) {
    locationData.push(['Address', callSheet.location_address, '', '']);
  }
  
  // Basecamp and Parking
  locationData.push([
    'Basecamp', callSheet.basecamp || 'TBD',
    'Crew Parking', callSheet.crew_parking || 'TBD'
  ]);
  
  // Hospital info
  if (callSheet.nearest_hospital) {
    locationData.push([
      'Nearest Hospital', callSheet.nearest_hospital,
      'Hospital Address', callSheet.hospital_address || ''
    ]);
  }
  
  // Weather and Sun Times
  const weatherInfo = callSheet.weather_description 
    ? `${callSheet.weather_description}${callSheet.high_temp ? ` | High: ${callSheet.high_temp}` : ''}${callSheet.low_temp ? ` | Low: ${callSheet.low_temp}` : ''}`
    : 'TBD';
  
  const sunTimes = [
    callSheet.sunrise_time ? `Sunrise: ${callSheet.sunrise_time}` : '',
    callSheet.sunset_time ? `Sunset: ${callSheet.sunset_time}` : ''
  ].filter(Boolean).join(' | ') || '';
  
  locationData.push(['Weather', weatherInfo, 'Sun Times', sunTimes]);

  autoTable(doc, {
    startY: yPosition,
    body: locationData,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3, lineColor: [0, 0, 0], lineWidth: 0.1 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 35, fillColor: [245, 245, 245] },
      1: { cellWidth: 60 },
      2: { fontStyle: 'bold', cellWidth: 35, fillColor: [245, 245, 245] },
      3: { cellWidth: 55 },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Scenes Section
  if (scenes.length > 0) {
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 15;
    }

    yPosition = drawSectionHeader(doc, 'SCENES', yPosition, pageWidth);

    const scenesData = scenes.map(scene => [
      scene.scene_number,
      scene.pages || '',
      scene.set_description,
      scene.day_night || '',
      scene.location || '',
      scene.cast_ids?.join(', ') || '',
      scene.notes || '',
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Scene', 'Pages', 'Set & Description', 'D/N', 'Location', 'Cast', 'Notes']],
      body: scenesData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.1 },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 18 },
        1: { cellWidth: 15 },
        2: { cellWidth: 45 },
        3: { cellWidth: 12 },
        4: { cellWidth: 35 },
        5: { cellWidth: 25 },
        6: { cellWidth: 35 },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Cast Section
  if (cast.length > 0) {
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 15;
    }

    yPosition = drawSectionHeader(doc, 'CAST', yPosition, pageWidth);

    const castData = cast.map(member => [
      member.cast_id || '',
      member.character_name,
      member.actor_name,
      member.status || '',
      member.pickup_time || '',
      member.call_time || '',
      member.set_ready_time || '',
      member.special_instructions || '',
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['#', 'Character', 'Actor', 'Status', 'Pickup', 'Call', 'Set Ready', 'Notes']],
      body: castData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.1 },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 18 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 22 },
        7: { cellWidth: 33 },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Crew Section (new page for cleaner layout)
  if (crew.length > 0) {
    doc.addPage();
    yPosition = 15;

    yPosition = drawSectionHeader(doc, 'CREW', yPosition, pageWidth);

    // Group crew by department
    const crewByDept: { [key: string]: typeof crew } = {};
    crew.forEach(member => {
      if (!crewByDept[member.department]) {
        crewByDept[member.department] = [];
      }
      crewByDept[member.department].push(member);
    });

    const crewData = crew.map(member => [
      member.department,
      member.title,
      member.name,
      member.call_time || '',
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Department', 'Title', 'Name', 'Call Time']],
      body: crewData,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3, lineColor: [0, 0, 0], lineWidth: 0.1 },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 45, fillColor: [250, 250, 250] },
        1: { cellWidth: 50 },
        2: { cellWidth: 55 },
        3: { cellWidth: 35 },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Background Actors Section
  if (background.length > 0) {
    if (yPosition > 220 || crew.length === 0) {
      doc.addPage();
      yPosition = 15;
    }

    yPosition = drawSectionHeader(doc, 'BACKGROUND / EXTRAS', yPosition, pageWidth);

    const backgroundData = background.map(item => [
      item.quantity?.toString() || '',
      item.description,
      item.call_time || '',
      item.notes || '',
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Qty', 'Description', 'Call Time', 'Notes']],
      body: backgroundData,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3, lineColor: [0, 0, 0], lineWidth: 0.1 },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 75 },
        2: { cellWidth: 30 },
        3: { cellWidth: 60 },
      },
    });
  }

  // Footer on all pages
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text('SAFETY FIRST | NO FORCED CALLS | NO SMOKING ON SET', pageWidth / 2, doc.internal.pageSize.height - 6, { align: 'center' });
  }

  // Save the PDF
  const fileName = `CallSheet_${callSheet.project_name.replace(/[^a-z0-9]/gi, '_')}_${callSheet.shoot_date}.pdf`;
  doc.save(fileName);
};
