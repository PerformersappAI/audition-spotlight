import jsPDF from 'jspdf';

interface Role {
  role_name: string;
  role_type: string;
  age_range: string;
  gender_presentation: string;
  open_ethnicity: boolean;
  skills: string;
  description: string;
  work_dates: string;
  rate: string;
  sides_link: string;
}

interface AuditionData {
  project_name: string;
  project_type: string;
  union_status: string;
  production_company: string;
  director_cd: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  logline: string;
  synopsis: string;
  shoot_city: string;
  shoot_country: string;
  work_dates: string;
  audition_window: string;
  callback_dates: string;
  self_tape_deadline: string;
  location_type: string;
  travel_lodging: string;
  travel_details: string;
  compensation_type: string;
  compensation_rate: string;
  usage_terms: string;
  agent_fee_included: boolean;
  conflicts: string;
  has_nudity: boolean;
  has_intimacy: boolean;
  has_violence: boolean;
  safety_details: string;
  has_minors: boolean;
  slate_link: string;
  reel_link: string;
  additional_materials: string;
  posting_targets: string[];
  visibility: string;
}

export const exportAuditionToPDF = (auditionData: AuditionData, roles: Role[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = 20;

  // Helper function to add text with wrapping
  const addText = (text: string, fontSize = 11, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, contentWidth);
    
    lines.forEach((line: string) => {
      if (yPos > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, margin, yPos);
      yPos += fontSize * 0.5;
    });
    yPos += 3;
  };

  const addSection = (title: string, content: string) => {
    if (content) {
      addText(title, 12, true);
      addText(content);
      yPos += 2;
    }
  };

  // Title
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('AUDITION NOTICE', margin, 18);
  doc.setTextColor(0, 0, 0);
  yPos = 40;

  // Project Information
  addText('PROJECT INFORMATION', 14, true);
  addSection('Project Name:', auditionData.project_name);
  addSection('Project Type:', auditionData.project_type);
  addSection('Union Status:', auditionData.union_status);
  addSection('Production Company:', auditionData.production_company);
  addSection('Director/CD:', auditionData.director_cd);
  yPos += 5;

  // Story
  if (auditionData.logline || auditionData.synopsis) {
    addText('STORY', 14, true);
    addSection('Logline:', auditionData.logline);
    addSection('Synopsis:', auditionData.synopsis);
    yPos += 5;
  }

  // Dates & Location
  addText('DATES & LOCATION', 14, true);
  addSection('Shoot City:', auditionData.shoot_city);
  addSection('Shoot Country:', auditionData.shoot_country);
  addSection('Shoot Dates:', auditionData.work_dates);
  addSection('Audition Window:', auditionData.audition_window);
  addSection('Callback Dates:', auditionData.callback_dates);
  addSection('Self-Tape Deadline:', auditionData.self_tape_deadline);
  addSection('Location Type:', auditionData.location_type);
  yPos += 5;

  // Compensation
  addText('COMPENSATION', 14, true);
  addSection('Type:', auditionData.compensation_type);
  addSection('Rate:', auditionData.compensation_rate);
  addSection('Usage Terms:', auditionData.usage_terms);
  if (auditionData.agent_fee_included) addText('✓ Agent fee included');
  yPos += 5;

  // Travel
  if (auditionData.travel_lodging || auditionData.travel_details) {
    addText('TRAVEL', 14, true);
    addSection('Lodging:', auditionData.travel_lodging);
    addSection('Details:', auditionData.travel_details);
    yPos += 5;
  }

  // Safety & Content
  if (auditionData.has_nudity || auditionData.has_intimacy || auditionData.has_violence || auditionData.has_minors) {
    addText('CONTENT WARNINGS', 14, true);
    if (auditionData.has_nudity) addText('⚠ Contains nudity');
    if (auditionData.has_intimacy) addText('⚠ Contains intimacy scenes');
    if (auditionData.has_violence) addText('⚠ Contains violence');
    if (auditionData.has_minors) addText('⚠ Involves minors');
    addSection('Safety Details:', auditionData.safety_details);
    yPos += 5;
  }

  // Roles
  if (roles.length > 0) {
    addText('ROLES', 14, true);
    roles.forEach((role, index) => {
      if (yPos > doc.internal.pageSize.getHeight() - 60) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos - 3, contentWidth, 8, 'F');
      addText(`ROLE ${index + 1}: ${role.role_name}`, 12, true);
      
      addSection('Type:', role.role_type);
      addSection('Age Range:', role.age_range);
      addSection('Gender:', role.gender_presentation);
      if (role.open_ethnicity) addText('✓ Open ethnicity');
      addSection('Skills:', role.skills);
      addSection('Description:', role.description);
      addSection('Work Dates:', role.work_dates);
      addSection('Rate:', role.rate);
      addSection('Sides Link:', role.sides_link);
      yPos += 8;
    });
  }

  // Submission Requirements
  addText('SUBMISSION REQUIREMENTS', 14, true);
  addSection('Headshot:', auditionData.slate_link ? 'Required' : 'Not specified');
  addSection('Reel Link:', auditionData.reel_link);
  addSection('Additional Materials:', auditionData.additional_materials);
  yPos += 5;

  // Contact
  addText('CONTACT INFORMATION', 14, true);
  addSection('Email:', auditionData.contact_email);
  addSection('Phone:', auditionData.contact_phone);
  addSection('Website:', auditionData.website);

  // Footer
  const fileName = `${auditionData.project_name.replace(/[^a-z0-9]/gi, '_')}_Audition_Notice.pdf`;
  doc.save(fileName);
};
