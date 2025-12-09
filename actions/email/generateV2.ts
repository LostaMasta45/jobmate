"use server";

import OpenAI from "openai";
import { logToolUsageWithNotification } from "@/lib/telegram-monitoring";

// OpenAI client using Sumapod
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
    baseURL: process.env.OPENAI_BASE_URL || "https://api.sumapod.com/v1",
});

// Types - must match EmailWizardV2
interface JobPosterAnalysis {
    companyName?: string;
    position?: string;
    requirements?: string[];
    qualifications?: string[];
    benefits?: string[];
    deadline?: string;
    location?: string;
    salary?: string;
    rawDescription?: string;
}

interface EmailFormDataV2 {
    fullName: string;
    position: string;
    companyName: string;
    hrdName: string;
    jobSource: string;
    phoneNumber: string;
    reasonForInterest: string;
    availability: string;
    experienceLevel: 'fresh_graduate' | 'experienced' | 'no_experience';
    educationType: 'sma_smk' | 'd3' | 's1_s2';
    schoolName: string;
    schoolMajor: string;
    major: string;
    university: string;
    ipk: string;
    organizationExp: string;
    achievements: string;
    projectThesis: string;
    courses: string;
    softSkills: string;
    relevantHobby: string;
    informalExperience: string;
    lastPosition: string;
    lastCompany: string;
    yearsExperience: string;
    workAchievements: string;
    skills: string;
    attachments: string[];
    emailTone: 'formal' | 'semi_formal' | 'casual';
    emailLength: 'short' | 'medium' | 'long';
    closingGreeting: 'hormat_saya' | 'salam_hangat' | 'terima_kasih';
    jobPosterAnalysis: JobPosterAnalysis | null;
}

// Map job source to Indonesian
const JOB_SOURCE_LABELS: Record<string, string> = {
    linkedin: "LinkedIn",
    jobstreet: "JobStreet",
    glints: "Glints",
    indeed: "Indeed",
    kalibrr: "Kalibrr",
    website: "website perusahaan",
    referral: "rekomendasi kenalan",
    instagram: "Instagram",
    tiktok: "TikTok",
    career_fair: "career fair",
    other: "website lowongan kerja",
};

// Map availability to Indonesian
const AVAILABILITY_LABELS: Record<string, string> = {
    immediately: "segera",
    "1_week": "1 minggu",
    "2_weeks": "2 minggu",
    "1_month": "1 bulan",
    negotiable: "bisa dinegosiasi",
};

// Map tone to description
const TONE_DESCRIPTIONS: Record<string, string> = {
    formal: "sangat formal dan sopan, menggunakan bahasa baku Indonesia",
    semi_formal: "semi-formal dan profesional, sopan tapi tidak kaku",
    casual: "santai dan friendly, tapi tetap sopan dan menghormati",
};

// Map length to paragraph count
const LENGTH_DESCRIPTIONS: Record<string, string> = {
    short: "singkat, maksimal 3-4 paragraf pendek",
    medium: "sedang, sekitar 4-5 paragraf",
    long: "lengkap, 5-6 paragraf dengan detail yang cukup",
};

// Map closing greeting
const CLOSING_GREETINGS: Record<string, string> = {
    hormat_saya: "Hormat saya",
    salam_hangat: "Salam hangat",
    terima_kasih: "Terima kasih",
};

// Map attachment labels
const ATTACHMENT_LABELS: Record<string, string> = {
    cv: "CV/Resume",
    cover_letter: "Surat Lamaran",
    ijazah: "Ijazah/Transkrip Nilai",
    certificate: "Sertifikat",
    portfolio: "Portfolio",
    photo: "Pas Foto",
    other: "dokumen pendukung lainnya",
};

// Build attachment string
function getAttachmentString(attachments: string[]): string {
    if (!attachments || attachments.length === 0) {
        return "CV";
    }

    const labels = attachments.map(id => ATTACHMENT_LABELS[id] || id);

    if (labels.length === 1) {
        return labels[0];
    } else if (labels.length === 2) {
        return `${labels[0]} dan ${labels[1]}`;
    } else {
        const last = labels.pop();
        return `${labels.join(', ')}, dan ${last}`;
    }
}

// Build education info string
function getEducationInfo(data: EmailFormDataV2): string {
    if (data.educationType === 'sma_smk') {
        let edu = `- Pendidikan: Lulusan ${data.schoolName}`;
        if (data.schoolMajor) {
            edu += ` jurusan ${data.schoolMajor}`;
        }
        return edu;
    } else {
        const level = data.educationType === 'd3' ? 'D3/D4' : 'S1/S2';
        let edu = `- Pendidikan: Lulusan ${level} ${data.major} dari ${data.university}`;
        if (data.ipk) {
            edu += ` dengan IPK ${data.ipk}`;
        }
        return edu;
    }
}

// Build common info section
function getCommonInfo(data: EmailFormDataV2): string {
    const jobSourceLabel = JOB_SOURCE_LABELS[data.jobSource] || data.jobSource;
    const hrdAddress = data.hrdName ? data.hrdName : "Bapak/Ibu HRD";
    const toneDesc = TONE_DESCRIPTIONS[data.emailTone] || TONE_DESCRIPTIONS.semi_formal;
    const lengthDesc = LENGTH_DESCRIPTIONS[data.emailLength] || LENGTH_DESCRIPTIONS.medium;
    const closingGreeting = CLOSING_GREETINGS[data.closingGreeting] || CLOSING_GREETINGS.hormat_saya;
    const attachmentString = getAttachmentString(data.attachments);

    let info = `INFORMASI DASAR:
- Nama: ${data.fullName}
- Posisi yang dilamar: ${data.position}
- Perusahaan: ${data.companyName}
- Nama HRD: ${hrdAddress}
- Sumber info lowongan: ${jobSourceLabel}`;

    if (data.phoneNumber) {
        info += `\n- Nomor HP/WA: ${data.phoneNumber}`;
    }
    if (data.availability) {
        info += `\n- Ketersediaan mulai kerja: ${AVAILABILITY_LABELS[data.availability] || data.availability}`;
    }
    if (data.reasonForInterest) {
        info += `\n- Alasan tertarik dengan posisi ini: ${data.reasonForInterest}`;
    }

    info += `\n\nBERKAS YANG DILAMPIRKAN:
- ${attachmentString}

GAYA EMAIL:
- Tone: ${toneDesc}
- Panjang: ${lengthDesc}
- Salam penutup: ${closingGreeting}`;

    return info;
}

// Build job requirements info from poster analysis
function getJobRequirementsInfo(data: EmailFormDataV2): string {
    if (!data.jobPosterAnalysis) return '';

    const analysis = data.jobPosterAnalysis;
    let info = '\nINFORMASI LOWONGAN (dari poster yang diupload):';

    if (analysis.requirements && analysis.requirements.length > 0) {
        info += `\n- Requirements yang dicari: ${analysis.requirements.join(', ')}`;
    }
    if (analysis.qualifications && analysis.qualifications.length > 0) {
        info += `\n- Kualifikasi: ${analysis.qualifications.join(', ')}`;
    }
    if (analysis.location) {
        info += `\n- Lokasi: ${analysis.location}`;
    }
    if (analysis.rawDescription) {
        info += `\n- Deskripsi: ${analysis.rawDescription.substring(0, 500)}${analysis.rawDescription.length > 500 ? '...' : ''}`;
    }

    info += '\n\n⚠️ PENTING: Sesuaikan email dengan requirements di atas! Jika pelamar memiliki skill yang match, highlight dengan natural.';

    return info;
}

// Simple, natural prompt for email generation
function buildPrompt(data: EmailFormDataV2): string {
    const commonInfo = getCommonInfo(data);
    const attachmentString = getAttachmentString(data.attachments);
    const closingGreeting = CLOSING_GREETINGS[data.closingGreeting] || CLOSING_GREETINGS.hormat_saya;
    const jobRequirementsInfo = getJobRequirementsInfo(data);

    if (data.experienceLevel === 'fresh_graduate') {
        const educationInfo = getEducationInfo(data);

        let profileInfo = `PROFIL PELAMAR:
- Status: Fresh Graduate
${educationInfo}`;

        if (data.organizationExp) {
            profileInfo += `\n- Pengalaman organisasi/magang: ${data.organizationExp}`;
        }
        if (data.achievements) {
            profileInfo += `\n- Prestasi/penghargaan: ${data.achievements}`;
        }
        if (data.projectThesis) {
            profileInfo += `\n- Proyek/tugas akhir: ${data.projectThesis}`;
        }
        if (data.courses) {
            profileInfo += `\n- Kursus/sertifikasi: ${data.courses}`;
        }
        if (data.softSkills) {
            profileInfo += `\n- Soft skills: ${data.softSkills}`;
        }
        if (data.relevantHobby) {
            profileInfo += `\n- Hobi relevan: ${data.relevantHobby}`;
        }

        return `Buatkan email lamaran kerja dalam Bahasa Indonesia yang natural dan sopan.

${commonInfo}

${profileInfo}${jobRequirementsInfo}

ATURAN PENTING:
1. JANGAN mengarang informasi yang tidak diberikan
2. Tulis email yang NATURAL seperti orang Indonesia sungguhan menulis
3. Ikuti panjang email sesuai preferensi yang diminta
4. Ikuti tone/gaya bahasa sesuai preferensi
5. Sebutkan sumber info lowongan di awal email
6. Jika ada alasan tertarik, masukkan dengan natural ke dalam email
7. Jika ada nomor HP, cantumkan di akhir email sebagai kontak
8. Jika ada ketersediaan, sebutkan kapan bisa mulai kerja
9. Highlight prestasi, proyek, kursus, dan skill yang RELEVAN dengan requirements jika ada
10. Jika ada info lowongan dari poster, sesuaikan email agar match dengan requirements
11. Sebutkan berkas lampiran dengan kalimat seperti "Bersama email ini saya lampirkan ${attachmentString}" atau variasi natural lainnya
12. Gunakan salam penutup "${closingGreeting}" di akhir email
13. Akhiri dengan harapan untuk interview

FORMAT OUTPUT (hanya ini, tanpa tambahan):
SUBJECT: [subject line: Lamaran ${data.position} - ${data.fullName}]

BODY:
[isi email lengkap]`;
    } else if (data.experienceLevel === 'no_experience') {
        let profileInfo = `PROFIL PELAMAR:
- Status: Belum punya pengalaman kerja formal`;

        if (data.schoolName) {
            profileInfo += `\n- Pendidikan terakhir: ${data.schoolName}`;
        }
        if (data.skills) {
            profileInfo += `\n- Skill/kemampuan: ${data.skills}`;
        }
        if (data.informalExperience) {
            profileInfo += `\n- Pengalaman informal: ${data.informalExperience}`;
        }
        if (data.courses) {
            profileInfo += `\n- Kursus/pelatihan: ${data.courses}`;
        }
        if (data.organizationExp) {
            profileInfo += `\n- Motivasi/kelebihan: ${data.organizationExp}`;
        }

        return `Buatkan email lamaran kerja dalam Bahasa Indonesia yang natural, sopan, dan penuh semangat.

${commonInfo}

${profileInfo}${jobRequirementsInfo}

ATURAN PENTING:
1. JANGAN mengarang informasi yang tidak diberikan
2. Tulis email yang NATURAL dan menunjukkan semangat belajar
3. Ikuti panjang email sesuai preferensi yang diminta
4. Ikuti tone/gaya bahasa sesuai preferensi
5. Fokus pada kemauan belajar, kegigihan, dan potensi berkembang
6. Jangan terdengar desperate, tapi tunjukkan antusiasme genuine
7. Sebutkan sumber info lowongan di awal email
8. Jika ada alasan tertarik, masukkan dengan natural
9. Jika ada pengalaman informal (bantu usaha keluarga, volunteer, dll), highlight sebagai bukti tanggung jawab
10. Jika ada info lowongan dari poster, sesuaikan email agar match dengan requirements
11. Jika ada nomor HP, cantumkan di akhir email
12. Jika ada ketersediaan, sebutkan kapan bisa mulai kerja
13. Sebutkan berkas lampiran dengan kalimat seperti "Bersama email ini saya lampirkan ${attachmentString}" atau variasi natural lainnya
14. Gunakan salam penutup "${closingGreeting}" di akhir email
15. Akhiri dengan harapan untuk interview

FORMAT OUTPUT (hanya ini, tanpa tambahan):
SUBJECT: [subject line: Lamaran ${data.position} - ${data.fullName}]

BODY:
[isi email lengkap]`;
    } else {
        // Experienced
        let profileInfo = `PROFIL PELAMAR:
- Status: Berpengalaman
- Posisi terakhir: ${data.lastPosition}`;

        if (data.lastCompany) {
            profileInfo += ` di ${data.lastCompany}`;
        }
        profileInfo += `\n- Lama pengalaman: ${data.yearsExperience}`;

        if (data.workAchievements) {
            profileInfo += `\n- Pencapaian di pekerjaan terakhir: ${data.workAchievements}`;
        }
        if (data.skills) {
            profileInfo += `\n- Skill utama: ${data.skills}`;
        }

        return `Buatkan email lamaran kerja dalam Bahasa Indonesia yang natural dan profesional.

${commonInfo}

${profileInfo}${jobRequirementsInfo}

ATURAN PENTING:
1. JANGAN mengarang informasi yang tidak diberikan
2. Tulis email yang NATURAL dan profesional
3. Ikuti panjang email sesuai preferensi yang diminta
4. Ikuti tone/gaya bahasa sesuai preferensi
5. Jangan menggunakan bahasa template AI yang berlebihan
6. Sebutkan sumber info lowongan di awal email
7. Jika ada alasan tertarik, masukkan dengan natural
8. Highlight pengalaman dan pencapaian yang RELEVAN dengan requirements
9. Jika ada info lowongan dari poster, sesuaikan email agar match dengan requirements
10. Jika ada nomor HP, cantumkan di akhir email
11. Jika ada ketersediaan, sebutkan kapan bisa mulai kerja
12. Sebutkan berkas lampiran dengan kalimat seperti "Bersama email ini saya lampirkan ${attachmentString}" atau variasi natural lainnya
13. Gunakan salam penutup "${closingGreeting}" di akhir email
14. Akhiri dengan harapan untuk interview

FORMAT OUTPUT (hanya ini, tanpa tambahan):
SUBJECT: [subject line: Lamaran ${data.position} - ${data.fullName}]

BODY:
[isi email lengkap]`;
    }
}

// Parse OpenAI response
function parseResponse(response: string): { subject: string; body: string } {
    const lines = response.trim().split('\n');
    let subject = '';
    let body = '';
    let inBody = false;

    for (const line of lines) {
        if (line.startsWith('SUBJECT:')) {
            subject = line.replace('SUBJECT:', '').trim();
        } else if (line.startsWith('BODY:')) {
            inBody = true;
        } else if (inBody) {
            body += line + '\n';
        }
    }

    // Fallback if parsing fails
    if (!subject) {
        subject = `Lamaran Kerja`;
    }
    if (!body) {
        body = response;
    }

    return { subject: subject.trim(), body: body.trim() };
}

export async function generateEmailV2(data: EmailFormDataV2) {
    try {
        console.log("[EmailV2] Generating email for:", data.fullName, data.position, data.companyName);

        const prompt = buildPrompt(data);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `Kamu adalah asisten yang membantu menulis email lamaran kerja dalam Bahasa Indonesia. 
                    
Panduan menulis email:
        - Tulis email yang natural, sopan, dan langsung ke poin
            - Jangan menggunakan bahasa yang berlebihan atau template AI
                - Tulis seperti orang Indonesia sungguhan menulis email
                    - Sesuaikan gaya bahasa dengan tone yang diminta(formal / semi - formal / casual)
                        - Sesuaikan panjang email dengan preferensi yang diminta
                            - Jika ada informasi tambahan seperti alasan tertarik, nomor HP, atau ketersediaan, integrasikan dengan natural ke dalam email
                                - Sebutkan berkas lampiran dengan kalimat yang natural seperti "Bersama email ini saya lampirkan..." atau "Sebagai bahan pertimbangan, saya sertakan..."
                                    - Jangan mengarang informasi yang tidak diberikan`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1500,
        });

        const responseText = completion.choices[0]?.message?.content || '';
        const { subject, body } = parseResponse(responseText);

        // Log to Telegram (async, don't block)
        logToolUsageWithNotification(
            "Email Generator V2",
            `${data.experienceLevel} - ${data.position} @${data.companyName} `,
            {
                name: data.fullName,
                experienceLevel: data.experienceLevel,
                educationType: data.educationType,
                position: data.position,
                company: data.companyName,
                source: data.jobSource,
                tone: data.emailTone,
                length: data.emailLength,
                attachments: data.attachments?.join(', ') || 'cv'
            }
        ).catch((err) => console.warn("[Telegram] Failed to notify:", err));

        console.log("[EmailV2] Successfully generated email");
        return { subject, body };

    } catch (error: any) {
        console.error("[EmailV2] Error generating email:", error);
        return { error: error.message || "Gagal generate email. Silakan coba lagi." };
    }
}
