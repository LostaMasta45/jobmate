// Cover Letter Generator - Format Indonesia
// Template hardcoded untuk MVP, nanti bisa integrate dengan AI

import { format } from "date-fns";
import { id } from "date-fns/locale";

export function generateCoverLetter(formData: any): string {
  const today = format(new Date(), "d MMMM yyyy", { locale: id });
  const city = formData.address ? formData.address.split(",")[0] : "Jakarta";
  
  // Format tanggal lahir
  const birthDateFormatted = formData.birthDate 
    ? format(new Date(formData.birthDate), "d MMMM yyyy", { locale: id })
    : "-";

  // Determine template based on experience type
  const isFreshGrad = formData.experienceType === "fresh_graduate";
  
  // Generate content sections
  const header = generateHeader(city, today, formData);
  const attachmentsList = generateAttachmentsList(formData);
  const opening = generateOpening(formData, isFreshGrad);
  const personalData = generatePersonalData(formData, birthDateFormatted);
  const education = generateEducation(formData, isFreshGrad);
  const experience = isFreshGrad 
    ? generateFreshGradExperience(formData) 
    : generateExperiencedBackground(formData);
  const motivation = generateMotivation(formData);
  const optionalStatements = generateOptionalStatements(formData);
  const closing = generateClosing();
  const signature = generateSignature(formData);

  return `
    ${header}
    ${attachmentsList}
    ${opening}
    ${personalData}
    ${education}
    ${experience}
    ${motivation}
    ${optionalStatements}
    ${closing}
    ${signature}
  `;
}

function generateHeader(city: string, date: string, formData: any): string {
  // Count attachments if included
  const attachmentCount = formData.includeAttachmentsList 
    ? (formData.attachments?.length || 0) + (formData.customAttachments?.filter((c: string) => c).length || 0)
    : 0;
  const lampiran = attachmentCount > 0 ? `${attachmentCount} (${numberToWords(attachmentCount)}) berkas` : "1 (satu) berkas";
  const hrdName = formData.hrdName || "HRD Manager";
  
  return `
    <div style="text-align: right; margin-bottom: 40px;">
      ${city}, ${date}
    </div>
    
    <div style="margin-bottom: 10px;">
      <table style="border: none;">
        <tr>
          <td style="width: 100px; padding: 0;">Lampiran</td>
          <td style="padding: 0;">: ${lampiran}</td>
        </tr>
        <tr>
          <td style="padding: 0;">Perihal</td>
          <td style="padding: 0;">: <strong>Lamaran Pekerjaan sebagai ${formData.position}</strong></td>
        </tr>
      </table>
    </div>
    
    <div style="margin-bottom: 30px; margin-top: 20px;">
      <p style="margin: 0;">Kepada Yth.</p>
      <p style="margin: 0;">${hrdName} ${formData.companyName}</p>
      ${formData.companyAddress ? `<p style="margin: 0;">${formData.companyAddress}</p>` : ''}
    </div>
    
    <p><strong>Dengan hormat,</strong></p>
  `;
}

function generateOpening(formData: any, isFreshGrad: boolean): string {
  const source = getJobSourceText(formData.jobSource, formData.jobSourceCustom);
  const educationContext = formData.degree === "tidak_sekolah" 
    ? "pengalaman dan keahlian yang saya miliki"
    : formData.major 
      ? `latar belakang ${formData.major}`
      : `latar belakang pendidikan ${getDegreeText(formData.degree)}`;
  
  if (isFreshGrad) {
    return `
      <p style="text-align: justify;">
        Saya yang bertanda tangan di bawah ini bermaksud mengajukan lamaran pekerjaan 
        untuk posisi <strong>${formData.position}</strong> di <strong>${formData.companyName}</strong> 
        yang saya ketahui melalui ${source}. Sebagai fresh graduate dengan ${educationContext}, 
        saya sangat tertarik untuk bergabung dan berkontribusi di perusahaan yang Bapak/Ibu pimpin.
      </p>
    `;
  } else {
    const expCount = formData.experiences?.length > 0 
      ? getYearsFromDuration(formData.experiences[0].duration)
      : "beberapa";
    return `
      <p style="text-align: justify;">
        Saya yang bertanda tangan di bawah ini bermaksud mengajukan lamaran pekerjaan 
        untuk posisi <strong>${formData.position}</strong> di <strong>${formData.companyName}</strong>. 
        Dengan pengalaman ${expCount} tahun di bidang terkait, saya yakin dapat memberikan 
        kontribusi positif bagi perkembangan perusahaan.
      </p>
    `;
  }
}

function generatePersonalData(formData: any, birthDateFormatted: string): string {
  const statusText = formData.status === "menikah" ? "Menikah" : "Lajang";
  
  // Format education line based on degree
  let educationText = '';
  if (formData.degree === "tidak_sekolah") {
    educationText = formData.selfLearning || "Pendidikan Non-Formal";
  } else if (["sd", "smp", "sma"].includes(formData.degree)) {
    educationText = `${getDegreeText(formData.degree)} ${formData.university || ''}`;
  } else if (["smk", "smka"].includes(formData.degree)) {
    // SMK/SMKA with major
    const majorText = formData.major ? ` jurusan ${formData.major}` : '';
    educationText = `${getDegreeText(formData.degree)}${majorText}, ${formData.university || ''}`;
  } else {
    // D3, S1, S2
    educationText = `${getDegreeText(formData.degree)} ${formData.major || ''}, ${formData.university || ''}`;
  }
  
  return `
    <p style="text-align: justify;">Adapun data diri saya sebagai berikut:</p>
    
    <div style="margin-left: 20px;">
      <table style="border: none; line-height: 1.8;">
        <tr>
          <td style="width: 200px; padding: 2px 0;">Nama</td>
          <td style="padding: 2px 0;">: ${formData.fullName}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;">Tempat, Tanggal Lahir</td>
          <td style="padding: 2px 0;">: ${formData.birthPlace}, ${birthDateFormatted}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;">Alamat</td>
          <td style="padding: 2px 0;">: ${formData.address}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;">No. Telepon</td>
          <td style="padding: 2px 0;">: ${formData.phone}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;">Email</td>
          <td style="padding: 2px 0;">: ${formData.email}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;">Pendidikan Terakhir</td>
          <td style="padding: 2px 0;">: ${educationText}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;">Status</td>
          <td style="padding: 2px 0;">: ${statusText}</td>
        </tr>
      </table>
    </div>
  `;
}

function generateEducation(formData: any, isFreshGrad: boolean): string {
  if (formData.degree === "tidak_sekolah") {
    return `
      <p style="text-align: justify;">
        Meskipun saya tidak menempuh pendidikan formal, saya memiliki pengalaman belajar dan 
        mengembangkan keahlian secara otodidak. ${formData.selfLearning ? `Saya telah ${formData.selfLearning.toLowerCase()} yang relevan dengan pekerjaan ini.` : ''}
        Saya memiliki semangat belajar yang tinggi dan siap untuk terus mengembangkan diri.
      </p>
    `;
  }
  
  const gpaText = formData.gpa && parseFloat(formData.gpa) >= 3.0 
    ? ` dengan IPK ${formData.gpa}` 
    : '';
  
  const isCollege = ["d3", "s1", "s2"].includes(formData.degree);
  const isVocational = ["smk", "smka"].includes(formData.degree);
  const periodText = isCollege ? "perkuliahan" : "sekolah";
  
  if (isFreshGrad) {
    const activitiesText = formData.activities 
      ? ` Selama masa ${periodText}, saya aktif dalam ${formData.activities} yang mengasah kemampuan saya dalam teamwork, leadership, dan komunikasi.`
      : '';
    
    if (isCollege) {
      return `
        <p style="text-align: justify;">
          Saya telah menyelesaikan pendidikan ${getDegreeText(formData.degree)} di 
          ${formData.university} jurusan ${formData.major}${gpaText} pada tahun ${formData.graduationYear}.${activitiesText}
        </p>
      `;
    } else if (isVocational) {
      // SMK/SMKA with vocational focus
      const majorText = formData.major ? ` jurusan ${formData.major}` : '';
      return `
        <p style="text-align: justify;">
          Saya telah menyelesaikan pendidikan ${getDegreeText(formData.degree)} di 
          ${formData.university}${majorText} pada tahun ${formData.graduationYear}.${activitiesText} 
          Pendidikan kejuruan ini telah membekali saya dengan keterampilan praktis yang siap diterapkan 
          di dunia kerja.
        </p>
      `;
    } else {
      // SD, SMP, SMA
      const majorText = formData.major ? ` jurusan ${formData.major}` : '';
      return `
        <p style="text-align: justify;">
          Saya telah menyelesaikan pendidikan ${getDegreeText(formData.degree)} di 
          ${formData.university}${majorText} pada tahun ${formData.graduationYear}.${activitiesText}
        </p>
      `;
    }
  } else {
    if (isCollege) {
      return `
        <p style="text-align: justify;">
          Saya merupakan lulusan ${getDegreeText(formData.degree)} jurusan ${formData.major} 
          dari ${formData.university}. Pendidikan formal ini memberikan saya foundation yang 
          kuat dalam bidang yang relevan dengan posisi yang dilamar.
        </p>
      `;
    } else {
      return `
        <p style="text-align: justify;">
          Saya merupakan lulusan ${getDegreeText(formData.degree)} dari ${formData.university}. 
          Latar belakang pendidikan ini telah membekali saya dengan pengetahuan dasar yang baik 
          dan kemampuan untuk terus belajar dan berkembang di dunia kerja.
        </p>
      `;
    }
  }
}

function generateFreshGradExperience(formData: any): string {
  return `
    <p style="text-align: justify;">
      Meskipun saya belum memiliki pengalaman kerja full-time, saya memiliki kemauan kuat 
      untuk belajar dan berkembang. Saya menguasai berbagai soft skills seperti komunikasi, 
      teamwork, problem solving, dan adaptabilitas yang saya yakini akan sangat berguna 
      untuk posisi ini.
    </p>
  `;
}

function generateExperiencedBackground(formData: any): string {
  if (!formData.experiences || formData.experiences.length === 0) {
    return '';
  }
  
  const mainExp = formData.experiences[0];
  return `
    <p style="text-align: justify;">
      Saya memiliki pengalaman kerja di ${mainExp.company} sebagai ${mainExp.position} 
      selama ${mainExp.duration}, dengan tanggung jawab meliputi ${mainExp.responsibilities}. 
      Pengalaman ini telah membekali saya dengan keahlian dan kompetensi yang sangat 
      relevan dengan posisi yang Bapak/Ibu butuhkan.
    </p>
  `;
}

function generateMotivation(formData: any): string {
  return `
    <p style="text-align: justify;">
      Saya sangat tertarik untuk bergabung dengan ${formData.companyName} karena reputasi 
      perusahaan yang solid dan kesempatan untuk berkembang bersama tim profesional. 
      Saya yakin dengan kemampuan, dedikasi, dan semangat yang saya miliki, saya dapat 
      berkontribusi positif dan tumbuh bersama perusahaan.
    </p>
  `;
}

function generateOptionalStatements(formData: any): string {
  const statements = [];
  
  if (formData.includeAvailability) {
    statements.push("Saya bersedia ditempatkan di seluruh wilayah Indonesia");
  }
  
  if (formData.includeWillingStatement) {
    statements.push("Saya bersedia bekerja dengan target dan di bawah tekanan");
  }
  
  if (formData.includeOvertimeStatement) {
    statements.push("Saya bersedia bekerja lembur jika diperlukan");
  }
  
  if (formData.includeCommitmentStatement) {
    statements.push("Saya siap memberikan kontribusi terbaik untuk kemajuan perusahaan");
  }
  
  if (statements.length === 0) return '';
  
  return `
    <p style="text-align: justify;">
      ${statements.join('. ')}${statements.length > 0 ? '.' : ''}
    </p>
  `;
}

function generateClosing(): string {
  return `
    <p style="text-align: justify;">
      Demikian surat lamaran ini saya buat dengan sebenar-benarnya. Besar harapan saya 
      untuk dapat diberikan kesempatan interview sehingga saya dapat menjelaskan lebih 
      detail mengenai potensi dan kompetensi yang saya miliki. Atas perhatian dan 
      kesempatan yang diberikan, saya ucapkan terima kasih.
    </p>
  `;
}

function generateSignature(formData: any): string {
  return `
    <div style="margin-top: 40px;">
      <p><strong>Hormat saya,</strong></p>
      <div style="margin-top: 60px; margin-bottom: 10px;">
        <p><strong>${formData.fullName}</strong></p>
      </div>
    </div>
  `;
}

// Helper functions
function generateAttachmentsList(formData: any): string {
  if (!formData.includeAttachmentsList) return '';
  
  const attachments = formData.attachments || [];
  const customAttachments = (formData.customAttachments || []).filter((c: string) => c.trim());
  
  if (attachments.length === 0 && customAttachments.length === 0) return '';
  
  const attachmentLabels: Record<string, string> = {
    cv: "CV / Daftar Riwayat Hidup",
    ktp: "Fotocopy KTP",
    ijazah: "Fotocopy Ijazah",
    transkrip: "Fotocopy Transkrip Nilai",
    photo: "Pas Foto terbaru",
    skck: "SKCK (Surat Keterangan Catatan Kepolisian)",
    kesehatan: "Surat Keterangan Sehat",
    sertifikat: "Sertifikat / Piagam Penghargaan",
    portfolio: "Portfolio / Hasil Karya",
  };
  
  const allAttachments = [
    ...attachments.map((a: string) => attachmentLabels[a] || a),
    ...customAttachments
  ];
  
  return `
    <p style="text-align: justify; margin-top: 15px;">Berikut saya lampirkan:</p>
    <div style="margin-left: 20px;">
      <ol style="line-height: 1.8;">
        ${allAttachments.map(a => `<li>${a}</li>`).join('\n        ')}
      </ol>
    </div>
  `;
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
    koran: "koran/media massa",
    custom: customSource || "sumber terpercaya",
  };
  return sourceMap[source] || "sumber terpercaya";
}

function getDegreeText(degree: string): string {
  const degreeMap: Record<string, string> = {
    sd: "SD",
    smp: "SMP/MTs",
    sma: "SMA/MA",
    smk: "SMK",
    smka: "SMKA",
    d3: "Diploma (D3)",
    s1: "Sarjana (S1)",
    s2: "Magister (S2)",
    tidak_sekolah: "Pendidikan Non-Formal",
  };
  return degreeMap[degree] || degree;
}

function numberToWords(num: number): string {
  const words = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh"];
  return words[num] || num.toString();
}

function getYearsFromDuration(duration: string): string {
  // Simple extraction, e.g., "4 tahun" from input
  const match = duration.match(/(\d+)\s*tahun/i);
  return match ? match[1] : "beberapa";
}
