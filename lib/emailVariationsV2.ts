// Email Variation Types for V2 - Multi-type support
// Separated from server action to avoid "use server" export restriction

export type EmailType = 'application' | 'follow_up' | 'thank_you' | 'inquiry';

export interface EmailVariationV2 {
    id: string;
    name: string;
    description: string;
    icon: string;
    approach: string;
    bestFor: string;
    subject?: string;
    body?: string;
    isGenerating?: boolean;
    error?: string;
}

type VariationType = Omit<EmailVariationV2, 'subject' | 'body' | 'isGenerating' | 'error'>;

// ==========================================
// APPLICATION EMAIL VARIATIONS (Fresh Graduate)
// ==========================================
export const VARIATION_TYPES_APPLICATION: VariationType[] = [
    {
        id: 'passionate',
        name: 'Semangat & Antusias',
        description: 'Tunjukkan passion dan kemauan belajar',
        icon: '🔥',
        bestFor: 'Startup, agency, perusahaan kreatif',
        approach: `GAYA EMAIL: SEMANGAT & ANTUSIAS
- Buka dengan kalimat yang menunjukkan EXCITEMENT genuine
- Gunakan kata-kata energetic: "sangat tertarik", "antusias", "passionate"
- Tunjukkan kemauan belajar yang kuat
- Sampaikan alasan PERSONAL kenapa tertarik
- Gunakan tone friendly dan approachable
- JANGAN berlebihan atau terkesan desperate`
    },
    {
        id: 'academic',
        name: 'Akademik & Terstruktur',
        description: 'Highlight pendidikan dan organisasi',
        icon: '🎓',
        bestFor: 'Korporat, BUMN, bank',
        approach: `GAYA EMAIL: AKADEMIK & TERSTRUKTUR
- Buka dengan background akademik
- Sebutkan universitas, jurusan, IPK di awal
- Highlight organisasi kampus dan kepemimpinan
- Gunakan struktur rapi: perkenalan → kualifikasi → penutup
- Bahasa formal dan sopan
- Fokus transferable skills dari kuliah`
    },
    {
        id: 'skillbased',
        name: 'Skill & Siap Kerja',
        description: 'Fokus pada skill praktis',
        icon: '💪',
        bestFor: 'Posisi teknis, IT',
        approach: `GAYA EMAIL: SKILL & SIAP KERJA
- Langsung sebutkan skill yang relevan
- Highlight kursus, sertifikasi, bootcamp
- Sebutkan proyek praktis atau portfolio
- Kata action: "mampu", "menguasai"
- Tunjukkan SIAP BERKONTRIBUSI dari hari pertama
- Fokus pada HASIL dan kemampuan praktis`
    }
];

// ==========================================
// FOLLOW-UP EMAIL VARIATIONS
// ==========================================
export const VARIATION_TYPES_FOLLOWUP: VariationType[] = [
    {
        id: 'gentle',
        name: 'Gentle Reminder',
        description: 'Mengingatkan dengan sopan dan halus',
        icon: '🕊️',
        bestFor: 'Follow-up pertama, perusahaan formal',
        approach: `GAYA EMAIL: GENTLE REMINDER
- Buka dengan kalimat halus dan sopan
- Tunjukkan pengertian bahwa HRD sibuk
- Ingatkan dengan nada positif, bukan menuntut
- Sebutkan ulang posisi dan tanggal lamaran
- Ekspresikan tetap antusias menunggu
- Tutup dengan harapan kabar baik
- JANGAN terkesan memaksa atau tidak sabar`
    },
    {
        id: 'professional',
        name: 'Professional Push',
        description: 'Tegas tapi tetap profesional',
        icon: '💼',
        bestFor: 'Follow-up kedua, butuh respon cepat',
        approach: `GAYA EMAIL: PROFESSIONAL PUSH
- Langsung ke poin dengan profesional
- Sebutkan timeline yang jelas (sudah X minggu)
- Tanyakan update status dengan direct
- Tawarkan untuk melengkapi dokumen jika perlu
- Tunjukkan keseriusan dan komitmen
- Berikan call-to-action yang jelas
- Tetap sopan meski lebih assertive`
    },
    {
        id: 'friendly',
        name: 'Friendly Check-in',
        description: 'Santai dan bersahabat',
        icon: '👋',
        bestFor: 'Startup, perusahaan casual',
        approach: `GAYA EMAIL: FRIENDLY CHECK-IN
- Buka dengan tone ringan dan bersahabat
- "Halo, sekedar follow up..."
- Tunjukkan genuine interest, bukan formalitas
- Boleh sedikit conversational
- Tetap profesional meski friendly
- Akhiri dengan harapan bisa ngobrol lebih lanjut
- Cocok untuk startup atau company dengan culture casual`
    }
];

// ==========================================
// THANK YOU EMAIL VARIATIONS
// ==========================================
export const VARIATION_TYPES_THANKYOU: VariationType[] = [
    {
        id: 'formal',
        name: 'Formal & Sopan',
        description: 'Ucapan terima kasih resmi',
        icon: '🎩',
        bestFor: 'Interview dengan direksi, BUMN',
        approach: `GAYA EMAIL: FORMAL & SOPAN
- Buka dengan ucapan terima kasih yang formal
- Sebutkan nama interviewer dan posisi mereka
- Apresiasi waktu dan kesempatan interview
- Ulangi key points yang dibahas
- Konfirmasi ketertarikan pada posisi
- Tutup dengan harapan formal
- Bahasa baku Indonesia yang sopan`
    },
    {
        id: 'personal',
        name: 'Personal Touch',
        description: 'Hangat dan personal',
        icon: '💝',
        bestFor: 'Interview santai, startup',
        approach: `GAYA EMAIL: PERSONAL TOUCH
- Buka dengan ucapan terima kasih yang tulus
- Sebutkan momen SPESIFIK yang berkesan dari interview
- Connect dengan topik yang dibahas secara personal
- Tunjukkan genuine excitement
- Tambahkan insight atau follow-up dari diskusi
- Akhiri dengan nada hangat
- Buat mereka merasa diingat secara personal`
    },
    {
        id: 'brief',
        name: 'Brief & Warm',
        description: 'Singkat tapi bermakna',
        icon: '✨',
        bestFor: 'Setelah interview cepat',
        approach: `GAYA EMAIL: BRIEF & WARM
- Singkat, padat, tapi tetap hangat
- Langsung ucapkan terima kasih
- Sebutkan 1 highlight dari interview
- Konfirmasi antusiasme singkat
- Tidak lebih dari 3-4 kalimat
- Perfect untuk busy professionals
- Tetap meninggalkan kesan positif`
    }
];

// ==========================================
// INQUIRY EMAIL VARIATIONS
// ==========================================
export const VARIATION_TYPES_INQUIRY: VariationType[] = [
    {
        id: 'direct',
        name: 'Direct & Clear',
        description: 'Pertanyaan langsung dan jelas',
        icon: '🎯',
        bestFor: 'Perusahaan yang sudah diriset',
        approach: `GAYA EMAIL: DIRECT & CLEAR
- Langsung ke poin: tanya lowongan
- Sebutkan posisi/bidang yang diminati dengan spesifik
- Jelaskan singkat background relevan
- Lampirkan CV sebagai referensi
- Tanya langkah selanjutnya dengan jelas
- Tidak bertele-tele
- Profesional dan to the point`
    },
    {
        id: 'research',
        name: 'Research-Based',
        description: 'Tunjukkan sudah riset perusahaan',
        icon: '🔍',
        bestFor: 'Dream company, target spesifik',
        approach: `GAYA EMAIL: RESEARCH-BASED
- Tunjukkan sudah riset tentang perusahaan
- Sebutkan proyek/produk spesifik yang menarik
- Connect background kamu dengan kebutuhan mereka
- Tanya apakah ada posisi yang cocok
- Tunjukkan genuine interest, bukan mass email
- Lebih panjang tapi lebih impactful
- Cocok untuk dream company`
    },
    {
        id: 'enthusiastic',
        name: 'Enthusiastic Interest',
        description: 'Antusias dan penuh semangat',
        icon: '🌟',
        bestFor: 'Startup, industri kreatif',
        approach: `GAYA EMAIL: ENTHUSIASTIC INTEREST
- Buka dengan passion untuk industri/bidang
- Ekspresikan kenapa tertarik dengan perusahaan
- Ceritakan brief journey kamu di bidang ini
- Tanya apakah ada kesempatan bergabung
- Tunjukkan eagerness to contribute
- Energetic tapi tidak overwhelming
- Perfect untuk creative industries`
    }
];

// Helper function to get variations by email type
export function getVariationsByType(emailType: EmailType): VariationType[] {
    switch (emailType) {
        case 'application':
            return VARIATION_TYPES_APPLICATION;
        case 'follow_up':
            return VARIATION_TYPES_FOLLOWUP;
        case 'thank_you':
            return VARIATION_TYPES_THANKYOU;
        case 'inquiry':
            return VARIATION_TYPES_INQUIRY;
        default:
            return VARIATION_TYPES_APPLICATION;
    }
}

// For backward compatibility
export const VARIATION_TYPES_V2 = VARIATION_TYPES_APPLICATION;

