// Modern Cover Letter Generator with Template Support
// Generates styled HTML matching professional templates (like JagobikinCV)

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { TEMPLATE_VARIANTS } from "@/components/surat-lamaran/TemplateSelector";

export interface CoverLetterData {
  templateId: string;
  fullName: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  birthPlace?: string;
  birthDate?: string;
  status?: string;
  companyName: string;
  companyAddress?: string;
  hrdName?: string;
  jobSource?: string;
  degree?: string;
  major?: string;
  university?: string;
  gpa?: string;
  graduationYear?: string;
  experiences?: any[];
  skills?: string[];
  attachments?: string[];
  customAttachments?: string[];
  includeAttachmentsList?: boolean;
  includeAvailability?: boolean;
  includeWillingStatement?: boolean;
  includeOvertimeStatement?: boolean;
  activities?: string;
}

export function generateModernCoverLetter(data: CoverLetterData): string {
  const template = TEMPLATE_VARIANTS.find(t => t.id === data.templateId) || TEMPLATE_VARIANTS[0];
  
  const today = format(new Date(), "d MMMM yyyy", { locale: id });
  const city = data.address ? data.address.split(",")[0].trim() : "Jakarta";
  
  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Surat Lamaran - ${data.fullName}</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: ${template.fontFamily}, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000;
      background: white;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      background: white;
      position: relative;
      overflow: hidden;
    }
    
    /* Header Styles based on template */
    .header {
      position: relative;
      padding: 10mm 15mm 8mm 15mm;
      background: ${template.themeColor};
      color: white;
      display: flex;
      align-items: center;
      gap: 15px;
      min-height: 50mm;
    }
    
    .header-photo {
      width: 80px;
      height: 100px;
      background: ${template.accentColor};
      border: 3px solid white;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      color: ${template.themeColor};
      font-weight: bold;
    }
    
    .header-content {
      flex: 1;
    }
    
    .header-name {
      font-size: 20pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }
    
    .header-title {
      font-size: 12pt;
      font-weight: 500;
      opacity: 0.95;
      background: rgba(255,255,255,0.2);
      padding: 4px 12px;
      display: inline-block;
      margin-bottom: 8px;
    }
    
    .header-contact {
      font-size: 9pt;
      opacity: 0.9;
      line-height: 1.3;
    }
    
    /* Bottom stripe */
    .header-stripe {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 8mm;
      background: linear-gradient(180deg, ${template.themeColor} 0%, ${adjustColor(template.themeColor, -20)} 100%);
    }
    
    /* Content */
    .content {
      padding: 15mm 20mm 12mm 20mm;
    }
    
    .date-line {
      text-align: right;
      margin-bottom: 10px;
      font-size: 10pt;
    }
    
    .letter-info {
      margin-bottom: 12px;
      line-height: 1.2;
      font-size: 10pt;
    }
    
    .letter-info div {
      margin-bottom: 2px;
    }
    
    .recipient {
      margin-top: 12px;
      margin-bottom: 15px;
      font-size: 10pt;
      line-height: 1.3;
    }
    
    .opening {
      font-weight: bold;
      margin-bottom: 12px;
      font-size: 11pt;
    }
    
    .paragraph {
      text-align: left;
      margin-bottom: 10px;
      font-size: 10pt;
      line-height: 1.5;
      text-align: justify;
    }
    
    .data-section {
      margin: 12px 0;
      padding: 12px 15px;
      background: ${template.accentColor};
      border-left: 4px solid ${template.themeColor};
      border-radius: 0 3px 3px 0;
      font-size: 10pt;
    }
    
    .data-row {
      display: grid;
      grid-template-columns: 140px 15px 1fr;
      margin-bottom: 4px;
      line-height: 1.4;
      align-items: start;
    }
    
    .data-label {
      font-weight: 600;
      color: ${template.themeColor};
    }
    
    .data-separator {
      text-align: left;
      font-weight: 600;
      color: ${template.themeColor};
    }
    
    .data-value {
      color: #000;
    }
    
    .attachments {
      margin: 12px 0;
      font-size: 10pt;
    }
    
    .attachments ol {
      margin-left: 20px;
      margin-top: 5px;
    }
    
    .attachments li {
      margin-bottom: 2px;
    }
    
    .closing {
      margin-top: 15px;
    }
    
    .signature {
      margin-top: 40px;
      text-align: right;
      font-size: 10pt;
    }
    
    .signature-name {
      font-weight: bold;
      text-decoration: underline;
      margin-top: 5px;
    }
    
    /* Template specific adjustments */
    .template-${template.id} .header {
      ${template.id === 'T2' ? 'flex-direction: row-reverse;' : ''}
      ${template.id === 'T3' ? 'flex-direction: column; text-align: center;' : ''}
      ${template.id === 'T5' ? 'min-height: 60mm;' : ''}
    }
    
    .template-${template.id} .header-photo {
      ${template.id === 'T5' ? 'width: 80px; height: 80px; border-radius: 50%;' : ''}
    }
  </style>
</head>
<body>
  <div class="page template-${template.id}">
    <!-- Header -->
    <div class="header">
      <div class="header-photo">
        ${data.fullName.charAt(0).toUpperCase()}
      </div>
      <div class="header-content">
        <div class="header-name">${data.fullName}</div>
        <div class="header-title">${data.position.toUpperCase()}</div>
        <div class="header-contact">
          ${data.email} | ${data.phone}<br>
          ${data.address}
        </div>
      </div>
      <div class="header-stripe"></div>
    </div>
    
    <!-- Content -->
    <div class="content">
      <div class="date-line">
        ${city}, ${today}
      </div>
      
      <div class="letter-info">
        <div><strong>Lampiran</strong> : ${getAttachmentCount(data)} berkas</div>
        <div><strong>Perihal</strong> : Lamaran Pekerjaan sebagai ${data.position}</div>
      </div>
      
      <div class="recipient">
        <div>Kepada Yth.</div>
        <div><strong>${data.hrdName || 'HRD / Personalia'}</strong></div>
        <div><strong>${data.companyName}</strong></div>
        ${data.companyAddress ? `<div>${data.companyAddress}</div>` : '<div>Di Tempat</div>'}
      </div>
      
      <div class="opening">Dengan hormat,</div>
      
      <div class="paragraph">
        Sesuai dengan penawaran posisi pekerjaan yang sedang dibutuhkan diperusahaan yang bapak / ibu pimpin, dan sesuai dengan informasi yang saya dapatkan dari <strong>${data.jobSource || 'media informasi lowongan'}</strong>. Saya bermaksud untuk mengajukan diri untuk melamar kerja di perusahaan yang sedang bapak / ibu pimpin. Berikut ini data singkat saya :
      </div>
      
      <div class="data-section">
        <div class="data-row">
          <div class="data-label">Nama</div>
          <div class="data-separator">:</div>
          <div class="data-value">${data.fullName}</div>
        </div>
        <div class="data-row">
          <div class="data-label">Tempat & Tgl. Lahir</div>
          <div class="data-separator">:</div>
          <div class="data-value">${data.birthPlace || '-'}, ${data.birthDate ? format(new Date(data.birthDate), "d MMMM yyyy", { locale: id }) : '-'}</div>
        </div>
        <div class="data-row">
          <div class="data-label">Pendidikan Akhir</div>
          <div class="data-separator">:</div>
          <div class="data-value">${getEducationText(data)}</div>
        </div>
        <div class="data-row">
          <div class="data-label">Alamat</div>
          <div class="data-separator">:</div>
          <div class="data-value">${data.address}</div>
        </div>
        <div class="data-row">
          <div class="data-label">Status</div>
          <div class="data-separator">:</div>
          <div class="data-value">${data.status === 'menikah' ? 'Menikah' : 'Belum Menikah'}</div>
        </div>
        <div class="data-row">
          <div class="data-label">Email</div>
          <div class="data-separator">:</div>
          <div class="data-value">${data.email}</div>
        </div>
        <div class="data-row">
          <div class="data-label">No HP</div>
          <div class="data-separator">:</div>
          <div class="data-value">${data.phone}</div>
        </div>
      </div>
      
      ${generateExperienceSection(data)}
      
      <div class="paragraph">
        Saya menguasai keterampilan yang relevan dengan posisi ini${data.skills && data.skills.length > 0 ? ` seperti ${data.skills.join(', ')}` : ''} serta memiliki kemampuan komunikasi, teamwork, dan problem solving yang baik. Saya siap belajar dan beradaptasi dengan cepat.
      </div>
      
      <div class="paragraph">
        Saya tertarik bergabung dengan ${data.companyName} karena reputasi perusahaan yang baik dan kesempatan untuk berkembang bersama tim profesional. Saya yakin dapat berkontribusi dan tumbuh bersama perusahaan.
      </div>
      
      ${generateOptionalStatements(data)}
      
      ${generateAttachmentsList(data)}
      
      <div class="paragraph">
        Demikian surat lamaran ini saya buat. Besar harapan saya untuk diberikan kesempatan wawancara. Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.
      </div>
      
      <div class="signature">
        <div><strong>Hormat saya,</strong></div>
        <div class="signature-name">${data.fullName}</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  
  return html.trim();
}

function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}

function getEducationText(data: CoverLetterData): string {
  if (!data.degree || !data.major) return "-";
  
  const degreeMap: any = {
    "sma": "SMA/SMK",
    "d3": "D3",
    "s1": "S1",
    "s2": "S2",
    "s3": "S3"
  };
  
  const degreeText = degreeMap[data.degree] || data.degree.toUpperCase();
  return `${degreeText} ${data.major}${data.university ? ` - ${data.university}` : ''}`;
}

function getAttachmentCount(data: CoverLetterData): string {
  if (!data.includeAttachmentsList) return "1 (satu)";
  
  const count = (data.attachments?.length || 0) + (data.customAttachments?.filter(c => c).length || 0);
  if (count === 0) return "1 (satu)";
  
  const words = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh"];
  return `${count} (${words[count] || count})`;
}

function generateExperienceSection(data: CoverLetterData): string {
  const hasExp = data.experiences && data.experiences.length > 0;
  
  if (hasExp) {
    const exp = data.experiences![0];
    return `
      <div class="paragraph">
        Saya memiliki pengalaman kerja sebagai ${exp.position} di ${exp.company}${exp.duration ? ` selama ${exp.duration}` : ''}. ${exp.description || 'Saya telah mengembangkan kemampuan profesional yang relevan dengan posisi yang dilamar.'}
      </div>
    `;
  } else {
    return `
      <div class="paragraph">
        Saya lulus ${getEducationText(data)}${data.graduationYear ? ` tahun ${data.graduationYear}` : ''}${data.gpa ? ` dengan IPK ${data.gpa}` : ''}. ${data.activities ? data.activities : 'Saya aktif dalam kegiatan kampus dan organisasi.'}
      </div>
    `;
  }
}

function generateOptionalStatements(data: CoverLetterData): string {
  const statements = [];
  
  if (data.includeAvailability !== false) {
    statements.push("dapat bergabung secepatnya");
  }
  if (data.includeWillingStatement !== false) {
    statements.push("bersedia ditempatkan di seluruh wilayah Indonesia");
  }
  if (data.includeOvertimeStatement) {
    statements.push("bersedia bekerja dengan target dan di bawah tekanan");
  }
  
  if (statements.length === 0) return '';
  
  return `
    <div class="paragraph">
      Saya ${statements.join(', ')}.
    </div>
  `;
}

function generateAttachmentsList(data: CoverLetterData): string {
  if (!data.includeAttachmentsList) return '';
  
  const attachments = [
    ...(data.attachments || []),
    ...(data.customAttachments?.filter(c => c) || [])
  ];
  
  if (attachments.length === 0) return '';
  
  return `
    <div class="attachments">
      <div style="font-weight: 600; margin-bottom: 8px;">Surat Lamaran diatas saya buat dalam keadaan sehat, sebagai bahan pertimbangan tambahan, saya lampirkan :</div>
      <ol>
        ${attachments.map(att => `<li>${att}</li>`).join('\n        ')}
      </ol>
    </div>
  `;
}
