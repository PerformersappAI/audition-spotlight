import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CallSheetData, CallSheetScene, CallSheetCast, CallSheetCrew, CallSheetBackground, CallSheetBreak, CallSheetRequirement } from '@/hooks/useCallSheets';

// Helper to format time for display
const formatTime = (time: string | undefined): string => {
  if (!time) return '';
  // If already formatted (e.g., "07:00 AM"), return as is
  if (time.includes('AM') || time.includes('PM')) return time;
  // Convert HH:MM to 12-hour format
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Helper to draw section header with background
const drawSectionHeader = (doc: jsPDF, text: string, yPosition: number, pageWidth: number): number => {
  doc.setFillColor(200, 200, 200);
  doc.rect(14, yPosition - 5, pageWidth - 28, 8, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(14, yPosition - 5, pageWidth - 28, 8);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(text, 16, yPosition);
  
  return yPosition + 6;
};

export const exportCallSheetToPDF = (
  callSheet: CallSheetData,
  scenes: CallSheetScene[],
  cast: CallSheetCast[],
  crew: CallSheetCrew[],
  background: CallSheetBackground[],
  breaks: CallSheetBreak[] = [],
  requirements: CallSheetRequirement[] = []
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = 12;

  // ===== THREE-COLUMN HEADER =====
  const leftColWidth = 55;
  const centerColWidth = 80;
  const rightColWidth = 47;
  
  // Left Column - Director/Writer, Exec Producer(s)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  
  let leftY = yPosition;
  if (callSheet.director) {
    doc.text('Director:', margin, leftY);
    doc.setFont('helvetica', 'normal');
    doc.text(callSheet.director, margin + 18, leftY);
    leftY += 5;
  }
  
  doc.setFont('helvetica', 'bold');
  if (callSheet.executive_producers && callSheet.executive_producers.length > 0) {
    doc.text('Exec Producer(s):', margin, leftY);
    doc.setFont('helvetica', 'normal');
    const epText = callSheet.executive_producers.join(', ');
    const epLines = doc.splitTextToSize(epText, leftColWidth - 2);
    doc.text(epLines, margin, leftY + 4);
    leftY += 4 + (epLines.length * 4);
  }
  
  // Center Column - PRODUCTION title, CALLSHEET subtitle, DATE
  const centerX = margin + leftColWidth;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(callSheet.project_name.toUpperCase(), centerX + centerColWidth/2, yPosition, { align: 'center' });
  
  doc.setFontSize(11);
  const dayNum = callSheet.day_number ? ` DAY ${callSheet.day_number}` : '';
  doc.text(`CALLSHEET:${dayNum}`, centerX + centerColWidth/2, yPosition + 7, { align: 'center' });
  
  doc.setFontSize(10);
  const dateText = new Date(callSheet.shoot_date).toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).toUpperCase();
  doc.text(dateText, centerX + centerColWidth/2, yPosition + 13, { align: 'center' });
  
  // Right Column - Call Times
  const rightX = margin + leftColWidth + centerColWidth;
  let rightY = yPosition;
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  
  if (callSheet.lx_precall_time) {
    doc.text(`LX Precall: ${formatTime(callSheet.lx_precall_time)}`, rightX, rightY);
    rightY += 4;
  }
  
  // Unit Call - Large and Bold
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  const unitCallTime = callSheet.unit_call_time || callSheet.general_crew_call || 'TBD';
  doc.text(`Unit Call: ${formatTime(unitCallTime)}`, rightX, rightY + 2);
  rightY += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  
  if (callSheet.courtesy_breakfast_time) {
    doc.text(`Breakfast at Base: ${formatTime(callSheet.courtesy_breakfast_time)}`, rightX, rightY);
    rightY += 4;
  }
  
  if (callSheet.lunch_time) {
    doc.text(`Lunch: ${formatTime(callSheet.lunch_time)}`, rightX, rightY);
    rightY += 4;
  }
  
  const wrapTime = callSheet.wrap_time || 'TBD';
  doc.text(`Est. Wrap: ${formatTime(wrapTime)}`, rightX, rightY);
  
  yPosition = Math.max(leftY, rightY, yPosition + 18) + 4;
  
  // Draw horizontal line under header
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 4;
  
  // ===== KEY PERSONNEL TABLE =====
  yPosition = drawSectionHeader(doc, 'KEY PERSONNEL', yPosition, pageWidth);
  
  const keyPersonnel = [
    { role: 'Director', name: callSheet.director || '', phone: '', offSet: '' },
    { role: 'Production Manager', name: callSheet.line_producer || '', phone: '', offSet: '' },
    { role: '1st AD', name: callSheet.associate_director || '', phone: '', offSet: '' },
    { role: 'UPM', name: callSheet.upm || '', phone: '', offSet: '' },
  ];
  
  // Add crew members who might be key personnel
  const keyCrewRoles = ['Camera', 'DOP', 'Director of Photography', 'Production Coordinator', '2nd AD'];
  crew.forEach(member => {
    if (keyCrewRoles.some(role => member.title.toLowerCase().includes(role.toLowerCase()))) {
      keyPersonnel.push({ role: member.title, name: member.name, phone: member.phone || '', offSet: member.off_set || '' });
    }
  });

  autoTable(doc, {
    startY: yPosition,
    head: [['Role', 'Name', 'Mobile', 'Off Set']],
    body: keyPersonnel.slice(0, 8).map(p => [p.role, p.name, p.phone, p.offSet]),
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.2 },
    headStyles: { fillColor: [180, 180, 180], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 55 },
      2: { cellWidth: 40 },
      3: { cellWidth: 47 },
    },
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 4;
  
  // ===== WEATHER & SCHEDULE INFO ROW =====
  const weatherTemp = callSheet.high_temp ? `${callSheet.high_temp}°C` : '';
  const weatherInfo = [weatherTemp, callSheet.weather_description].filter(Boolean).join(' ');
  const sunInfo = [
    callSheet.sunrise_time ? `Sunrise: ${callSheet.sunrise_time}` : '',
    callSheet.sunset_time ? `Sunset: ${callSheet.sunset_time}` : ''
  ].filter(Boolean).join(' / ');
  
  autoTable(doc, {
    startY: yPosition,
    body: [[
      `Weather: ${weatherInfo || 'TBD'}`,
      sunInfo || 'Sun times TBD',
      `Schedule: ${callSheet.current_schedule || callSheet.schedule_color || 'White'}`,
      `Script: ${callSheet.current_script || callSheet.script_color || 'White'}`
    ]],
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.2 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 50 },
      2: { cellWidth: 42 },
      3: { cellWidth: 40 },
    },
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 2;
  
  // ===== LOCATION ROW =====
  const locationInfo = callSheet.shooting_location 
    ? `${callSheet.shooting_location}${callSheet.location_address ? ' - ' + callSheet.location_address : ''}`
    : 'TBD';
  const unitBaseInfo = callSheet.unit_base 
    ? `${callSheet.unit_base}${callSheet.unit_base_address ? ' - ' + callSheet.unit_base_address : ''}`
    : callSheet.basecamp || 'TBD';
  
  autoTable(doc, {
    startY: yPosition,
    body: [[
      `Location: ${locationInfo}`,
      `Unit Base: ${unitBaseInfo}`
    ]],
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.2 },
    columnStyles: {
      0: { cellWidth: 96 },
      1: { cellWidth: 86 },
    },
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 4;
  
  // ===== DAY SCHEDULE TABLE =====
  const dayHeader = callSheet.day_number 
    ? `DAY ${callSheet.day_number} - ${dateText}` 
    : dateText;
  yPosition = drawSectionHeader(doc, dayHeader, yPosition, pageWidth);
  
  // Build schedule data with breaks inserted
  const scheduleData: (string | { content: string; styles?: any })[][] = [];
  
  scenes.forEach((scene, index) => {
    scheduleData.push([
      scene.location || '',
      scene.scene_number,
      scene.int_ext || (scene.day_night?.includes('INT') ? 'INT' : scene.day_night?.includes('EXT') ? 'EXT' : ''),
      scene.set_description,
      scene.day_night?.replace('INT', '').replace('EXT', '').trim() || '',
      scene.start_time ? formatTime(scene.start_time) : '',
      scene.cast_ids?.join(', ') || '',
      scene.notes || ''
    ]);
    
    // Check if there's a break after this scene
    const breakAfter = breaks.find(b => b.after_scene_index === index);
    if (breakAfter) {
      const breakLabel = breakAfter.break_type === 'short_break' ? 'SHORT BREAK' 
        : breakAfter.break_type === 'lunch' ? 'LUNCH' 
        : 'DINNER';
      scheduleData.push([
        { content: breakLabel, styles: { fontStyle: 'bold', fillColor: [230, 230, 230] } },
        '', '', '', '', '', '', ''
      ]);
    }
  });

  autoTable(doc, {
    startY: yPosition,
    head: [['Location', 'Scene', 'Int/Ext', 'Synopsis', 'Day/Night', 'Est. Start', 'Cast', 'Notes']],
    body: scheduleData.length > 0 ? scheduleData : [['', '', '', 'No scenes scheduled', '', '', '', '']],
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.2 },
    headStyles: { fillColor: [180, 180, 180], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 7 },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 16 },
      2: { cellWidth: 16 },
      3: { cellWidth: 45 },
      4: { cellWidth: 18 },
      5: { cellWidth: 20 },
      6: { cellWidth: 20 },
      7: { cellWidth: 19 },
    },
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 4;
  
  // ===== ARTISTE / CAST TABLE =====
  yPosition = drawSectionHeader(doc, 'ARTISTE', yPosition, pageWidth);
  
  const castData = cast.map((member, idx) => [
    (idx + 1).toString(),
    member.actor_name,
    member.character_name,
    member.swf || member.status || '',
    member.pickup_time ? formatTime(member.pickup_time) : '',
    member.makeup_time ? formatTime(member.makeup_time) : '',
    member.costume_time ? formatTime(member.costume_time) : '',
    member.travel_time ? formatTime(member.travel_time) : '',
    member.on_set_time ? formatTime(member.on_set_time) : (member.call_time ? formatTime(member.call_time) : ''),
  ]);
  
  // Add empty rows to reach minimum of 7 rows
  while (castData.length < 7) {
    castData.push([String(castData.length + 1), '', '', '', '', '', '', '', '']);
  }

  autoTable(doc, {
    startY: yPosition,
    head: [['ID', 'Artiste', 'Character', 'SWF', 'P/UP', 'M-UP', 'Cost', 'Travel', 'On Set']],
    body: castData,
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.2 },
    headStyles: { fillColor: [180, 180, 180], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 7 },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 32 },
      2: { cellWidth: 32 },
      3: { cellWidth: 18 },
      4: { cellWidth: 18 },
      5: { cellWidth: 18 },
      6: { cellWidth: 18 },
      7: { cellWidth: 18 },
      8: { cellWidth: 18 },
    },
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 4;
  
  // ===== SUPPORTING ARTISTS SECTION =====
  if (background.length > 0) {
    const totalBG = background.reduce((sum, b) => sum + (b.quantity || 1), 0);
    yPosition = drawSectionHeader(doc, `SUPPORTING ARTISTS (TOTAL = ${totalBG})`, yPosition, pageWidth);
    
    const bgData = background.map(item => [
      `${item.quantity || 1}x ${item.description}`,
      item.call_time ? formatTime(item.call_time) : '',
      item.makeup_time ? formatTime(item.makeup_time) : '',
      item.costume_time ? formatTime(item.costume_time) : '',
      item.travel_time ? formatTime(item.travel_time) : '',
      item.on_set_time ? formatTime(item.on_set_time) : '',
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Description', 'Call', 'Make Up', 'Costume', 'Travel', 'On Set']],
      body: bgData,
      theme: 'grid',
      styles: { fontSize: 7, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.2 },
      headStyles: { fillColor: [180, 180, 180], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 7 },
      columnStyles: {
        0: { cellWidth: 72 },
        1: { cellWidth: 22 },
        2: { cellWidth: 22 },
        3: { cellWidth: 22 },
        4: { cellWidth: 22 },
        5: { cellWidth: 22 },
      },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 4;
  }
  
  // ===== REQUIREMENTS SECTION =====
  if (requirements.length > 0) {
    yPosition = drawSectionHeader(doc, 'REQUIREMENTS', yPosition, pageWidth);
    
    const reqData = requirements.map(r => [r.department, r.notes || '']);

    autoTable(doc, {
      startY: yPosition,
      body: reqData,
      theme: 'grid',
      styles: { fontSize: 7, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.2 },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold', fillColor: [245, 245, 245] },
        1: { cellWidth: 142 },
      },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 4;
  }
  
  // ===== CREW SECTION (New Page) =====
  if (crew.length > 0) {
    doc.addPage();
    yPosition = 15;
    
    yPosition = drawSectionHeader(doc, 'CREW', yPosition, pageWidth);
    
    // Group crew by department
    const departments: { [key: string]: typeof crew } = {};
    crew.forEach(member => {
      const dept = member.department || 'General';
      if (!departments[dept]) departments[dept] = [];
      departments[dept].push(member);
    });
    
    const crewData: string[][] = [];
    Object.entries(departments).forEach(([dept, members]) => {
      members.forEach((member, idx) => {
        crewData.push([
          idx === 0 ? dept : '',
          member.title,
          member.name,
          member.call_time ? formatTime(member.call_time) : ''
        ]);
      });
    });

    autoTable(doc, {
      startY: yPosition,
      head: [['Department', 'Title', 'Name', 'Call Time']],
      body: crewData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.2 },
      headStyles: { fillColor: [180, 180, 180], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold', fillColor: [250, 250, 250] },
        1: { cellWidth: 50 },
        2: { cellWidth: 55 },
        3: { cellWidth: 37 },
      },
    });
  }

  // Footer on all pages
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 8, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text('SAFETY FIRST | NO FORCED CALLS | NO SMOKING ON SET', pageWidth / 2, doc.internal.pageSize.height - 4, { align: 'center' });
  }

  // Save the PDF
  const fileName = `CallSheet_${callSheet.project_name.replace(/[^a-z0-9]/gi, '_')}_${callSheet.shoot_date}.pdf`;
  doc.save(fileName);
};