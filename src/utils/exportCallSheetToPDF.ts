import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CallSheetData, CallSheetScene, CallSheetCast, CallSheetCrew } from '@/hooks/useCallSheets';

export const exportCallSheetToPDF = (
  callSheet: CallSheetData,
  scenes: CallSheetScene[],
  cast: CallSheetCast[],
  crew: CallSheetCrew[]
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 15;

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('CALL SHEET', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.text(callSheet.project_name, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(callSheet.production_company, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 8;
  doc.setFont('helvetica', 'bold');
  doc.text(`${new Date(callSheet.shoot_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, yPosition, { align: 'center' });
  
  if (callSheet.day_number) {
    yPosition += 5;
    doc.text(callSheet.day_number, pageWidth / 2, yPosition, { align: 'center' });
  }

  yPosition += 10;
  doc.line(14, yPosition, pageWidth - 14, yPosition);
  yPosition += 8;

  // Call Times Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CALL TIMES', 14, yPosition);
  yPosition += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const callTimesData = [
    ['General Crew Call', callSheet.general_crew_call || 'TBD', 'Shooting Call', callSheet.shooting_call || 'TBD'],
    ['Courtesy Breakfast', callSheet.courtesy_breakfast_time || 'N/A', 'Lunch', callSheet.lunch_time || 'TBD'],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: callTimesData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 30 },
      2: { fontStyle: 'bold', cellWidth: 35 },
      3: { cellWidth: 30 },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 8;

  // Key Personnel
  if (callSheet.director || callSheet.line_producer || callSheet.upm) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('KEY PERSONNEL', 14, yPosition);
    yPosition += 6;

    const personnelData = [];
    if (callSheet.director) personnelData.push(['Director', callSheet.director]);
    if (callSheet.line_producer) personnelData.push(['Line Producer', callSheet.line_producer]);
    if (callSheet.upm) personnelData.push(['UPM', callSheet.upm]);

    autoTable(doc, {
      startY: yPosition,
      body: personnelData,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 8;
  }

  // Location & Weather
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('LOCATION & WEATHER', 14, yPosition);
  yPosition += 6;

  const locationData = [];
  if (callSheet.shooting_location) locationData.push(['Location', callSheet.shooting_location]);
  if (callSheet.location_address) locationData.push(['Address', callSheet.location_address]);
  if (callSheet.basecamp) locationData.push(['Basecamp', callSheet.basecamp]);
  if (callSheet.crew_parking) locationData.push(['Crew Parking', callSheet.crew_parking]);
  if (callSheet.nearest_hospital) locationData.push(['Nearest Hospital', callSheet.nearest_hospital]);
  if (callSheet.weather_description) locationData.push(['Weather', `${callSheet.weather_description} High: ${callSheet.high_temp} Low: ${callSheet.low_temp}`]);

  autoTable(doc, {
    startY: yPosition,
    body: locationData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Scenes
  if (scenes.length > 0) {
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 15;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('SCENES', 14, yPosition);
    yPosition += 3;

    const scenesData = scenes.map(scene => [
      scene.scene_number,
      scene.pages || '',
      scene.set_description,
      scene.day_night || '',
      scene.cast_ids?.join(', ') || '',
      scene.notes || '',
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Scene', 'Pages', 'Set & Description', 'D/N', 'Cast', 'Notes']],
      body: scenesData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 15 },
        2: { cellWidth: 60 },
        3: { cellWidth: 15 },
        4: { cellWidth: 25 },
        5: { cellWidth: 50 },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Cast
  if (cast.length > 0) {
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 15;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('CAST', 14, yPosition);
    yPosition += 3;

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
      head: [['ID', 'Character', 'Actor', 'Status', 'Pickup', 'Call', 'Set Ready', 'Notes']],
      body: castData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 20 },
        4: { cellWidth: 22 },
        5: { cellWidth: 22 },
        6: { cellWidth: 25 },
        7: { cellWidth: 20 },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Crew (new page)
  if (crew.length > 0) {
    doc.addPage();
    yPosition = 15;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('CREW', 14, yPosition);
    yPosition += 3;

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
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 50 },
        2: { cellWidth: 55 },
        3: { cellWidth: 35 },
      },
    });
  }

  // Footer on all pages
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    doc.text(`SAFETY FIRST | NO FORCED CALLS | NO SMOKING ON SET`, pageWidth / 2, doc.internal.pageSize.height - 6, { align: 'center' });
  }

  // Save the PDF
  const fileName = `CallSheet_${callSheet.project_name.replace(/[^a-z0-9]/gi, '_')}_${callSheet.shoot_date}.pdf`;
  doc.save(fileName);
};