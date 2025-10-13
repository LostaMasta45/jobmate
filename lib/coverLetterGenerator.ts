// Cover Letter Generator - Optimized for 1 Page A4
// Format Indonesia yang ATS-friendly dan concise

import { format } from "date-fns";
import { id } from "date-fns/locale";

export function generateCoverLetter(formData: any): string {
  const today = format(new Date(), "d MMMM yyyy", { locale: id });
  const city = formData.address ? formData.address.split(",")[0].trim() : "Jakarta";
  
  // Determine if fresh graduate
  const isFreshGrad = formData.experienceType === "fresh_graduate" || 
                      !formData.experiences || 
                      formData.experiences.length === 0;

  // Build content - proper order for Indonesia
  const sections = [
    generateHeader(city, today, formData),
    generateOpening(formData, isFreshGrad),
    generatePersonalDataInline(formData),
    generateEducationConcise(formData, isFreshGrad),
    generateExperienceConcise(formData, isFreshGrad),
    generateMotivationConcise(formData),
    generateOptionalStatements(formData),
    generateClosing(),
    generateSignature(formData),
  ];

  return sections.filter(s => s).join('\n\n');
}

function generateHeader(city: string, date: string, formData: any): string {
  const hrdName = formData.hrdName || "HRD Manager";
  
  // Lampiran count
  const attachmentCount = formData.includeAttachmentsList 
    ? (formData.attachments?.length || 0) + (formData.customAttachments?.filter((c: string) => c).length || 0)
    : 0;
  const lampiran = attachmentCount > 0 
    ? `${attachmentCount} (${numberToWords(attachmentCount)}) berkas` 
    : "1 (satu) berkas";

  return `${city}, ${date}

Lampiran : ${lampiran}
Perihal  : Lamaran Pekerjaan sebagai ${formData.position}

Kepada Yth.
${hrdName}
${formData.companyName}${formData.companyAddress ? `\n${formData.companyAddress}` : ''}`;
}

function generateOpening(formData: any, isFreshGrad: boolean): string {
  const source = getJobSourceText(formData.jobSource, formData.jobSourceCustom);
  
  return `Dengan hormat,

Saya bermaksud melamar posisi ${formData.position} di ${formData.companyName} yang saya ketahui melalui ${source}. ${isFreshGrad ? 'Sebagai fresh graduate, ' : ''}Saya yakin dapat memberikan kontribusi positif bagi perusahaan.`;
}

function generatePersonalDataInline(formData: any): string {
  const birthDate = formData.birthDate 
    ? format(new Date(formData.birthDate), "d MMMM yyyy", { locale: id })
    : "-";
  
  const status = formData.status === "menikah" ? "Menikah" : "Lajang";
  
  // Education text concise
  const eduText = getEducationTextShort(formData);

  return `Berikut data diri saya:

Nama: ${formData.fullName}
Tempat, Tanggal Lahir: ${formData.birthPlace}, ${birthDate}
Alamat: ${formData.address}
Telepon: ${formData.phone}
Email: ${formData.email}
Pendidikan: ${eduText}
Status: ${status}`;
}

function generateEducationConcise(formData: any, isFreshGrad: boolean): string {
  if (formData.degree === "tidak_sekolah") {
    return `Saya memiliki pengalaman belajar mandiri dan siap terus berkembang di dunia kerja.${formData.selfLearning ? ' ' + formData.selfLearning + '.' : ''}`;
  }

  const isCollege = ["d3", "s1", "s2"].includes(formData.degree);
  const isVocational = ["smk", "smka"].includes(formData.degree);
  
  let text = `Saya ${formData.graduationYear >= new Date().getFullYear() ? 'akan lulus' : 'lulus'} ${getDegreeText(formData.degree)}`;
  
  if (isCollege || isVocational) {
    text += ` jurusan ${formData.major}`;
  }
  
  text += ` dari ${formData.university}`;
  
  if (formData.graduationYear) {
    text += ` tahun ${formData.graduationYear}`;
  }
  
  // Add GPA if good
  if (formData.gpa && parseFloat(formData.gpa) >= 3.0) {
    text += ` dengan IPK ${formData.gpa}`;
  }
  
  text += '.';
  
  // Add activities if fresh grad and has them
  if (isFreshGrad && formData.activities) {
    text += ` Saya aktif dalam ${formData.activities}.`;
  }

  return text;
}

function generateExperienceConcise(formData: any, isFreshGrad: boolean): string {
  if (isFreshGrad) {
    // Fresh grad - focus on skills
    return `Saya menguasai keterampilan yang relevan dengan posisi ini serta memiliki kemampuan komunikasi, teamwork, dan problem solving yang baik. Saya siap belajar dan beradaptasi dengan cepat.`;
  } else {
    // Experienced
    if (formData.experiences && formData.experiences.length > 0) {
      const exp = formData.experiences[0];
      return `Saya memiliki pengalaman sebagai ${exp.position} di ${exp.company} selama ${exp.duration}, dengan tanggung jawab ${exp.responsibilities}. Pengalaman ini membekali saya dengan keahlian yang relevan untuk posisi ini.`;
    }
    return `Saya memiliki pengalaman kerja yang relevan dengan posisi yang dilamar.`;
  }
}

function generateMotivationConcise(formData: any): string {
  return `Saya tertarik bergabung dengan ${formData.companyName} karena reputasi perusahaan yang baik dan kesempatan untuk berkembang bersama tim profesional. Saya yakin dapat berkontribusi dan tumbuh bersama perusahaan.`;
}

function generateOptionalStatements(formData: any): string {
  const statements = [];
  
  if (formData.includeAvailability) {
    statements.push("bersedia ditempatkan di seluruh wilayah Indonesia");
  }
  
  if (formData.includeWillingStatement) {
    statements.push("bersedia bekerja dengan target dan di bawah tekanan");
  }
  
  if (formData.includeOvertimeStatement) {
    statements.push("bersedia bekerja lembur jika diperlukan");
  }
  
  if (formData.includeCommitmentStatement) {
    statements.push("siap memberikan kontribusi terbaik");
  }
  
  if (statements.length === 0) return '';
  
  return `Saya ${statements.join(', ')}.`;
}

function generateClosing(): string {
  return `Demikian surat lamaran ini saya buat. Besar harapan saya untuk diberikan kesempatan wawancara. Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.`;
}

function generateSignature(formData: any): string {
  return `Hormat saya,


${formData.fullName}`;
}

// Helper functions
function getEducationTextShort(formData: any): string {
  if (formData.degree === "tidak_sekolah") {
    return "Pendidikan Non-Formal";
  }
  
  const degreeText = getDegreeText(formData.degree);
  const isCollege = ["d3", "s1", "s2"].includes(formData.degree);
  const isVocational = ["smk", "smka"].includes(formData.degree);
  
  if (isCollege || isVocational) {
    return `${degreeText} ${formData.major || ''} - ${formData.university || ''}`.trim();
  }
  
  return `${degreeText} - ${formData.university || ''}`.trim();
}

function getDegreeText(degree: string): string {
  const degreeMap: Record<string, string> = {
    sd: "SD",
    smp: "SMP/MTs",
    sma: "SMA/MA",
    smk: "SMK",
    smka: "SMKA",
    d3: "D3",
    s1: "S1",
    s2: "S2",
    tidak_sekolah: "Pendidikan Non-Formal",
  };
  return degreeMap[degree] || degree;
}

function getJobSourceText(source: string, customSource?: string): string {
  const sourceMap: Record<string, string> = {
    jobstreet: "JobStreet",
    linkedin: "LinkedIn",
    glints: "Glints",
    kalibrr: "Kalibrr",
    website: "website resmi perusahaan",
    instagram: "Instagram",
    facebook: "Facebook",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    referensi: "referensi teman",
    koran: "koran/media",
    custom: customSource || "sumber terpercaya",
  };
  return sourceMap[source] || "sumber terpercaya";
}

function numberToWords(num: number): string {
  const words = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh"];
  if (num <= 10) return words[num];
  return num.toString();
}
