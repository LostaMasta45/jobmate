// AI-powered Email Generator using OpenAI (via SumoPod)
// Phase 1: Complete AI Prompt Engineering Overhaul
import OpenAI from 'openai';

// Initialize OpenAI client with SumoPod base URL
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://ai.sumopod.com/v1',
});

// Email generation data interface
export interface EmailGenerationData {
  // Basic Info
  emailType: 'application' | 'follow_up' | 'thank_you' | 'inquiry';
  position: string;
  companyName: string;
  hrdName?: string;
  hrdTitle?: string;
  jobSource?: string;
  referralName?: string;
  hasAttachment: boolean;

  // Personal Info
  yourName: string;
  currentRole?: string;
  yearsExperience?: number;

  // Language
  language?: 'id' | 'en';

  // Tone & Style
  toneStyle: 'formal' | 'semi-formal' | 'casual' | 'creative';
  personality: 'confident' | 'humble' | 'enthusiastic' | 'balanced';
  lengthType: 'concise' | 'medium' | 'detailed';

  // Content
  highlightSkills?: string[];
  achievements?: string;
  includeWhyCompany: boolean;
  includeWhyYou: boolean;
  callToAction?: 'interview' | 'meeting' | 'discussion' | 'portfolio_review';

  // Phase 1 additions
  personalStory?: string;
  openingStyle?: 'achievement' | 'story' | 'connection' | 'question' | 'direct';

  // Phase 3 additions
  toneSettings?: {
    formality: number;
    confidence: number;
    enthusiasm: number;
  };
}

// ============================================================================
// PHASE 1A: IMPROVED SYSTEM PROMPTS WITH ANTI-AI RULES
// ============================================================================

const SYSTEM_PROMPT_ID = `Kamu adalah pembuat email lamaran kerja yang SEDERHANA dan JUJUR.

ATURAN UTAMA - SANGAT PENTING:

1. JANGAN PERNAH MENGARANG:
   - JANGAN buat-buat informasi tentang perusahaan
   - JANGAN buat-buat pencapaian atau angka yang tidak diberikan user
   - JANGAN mention "brand awareness", "kampanye", atau detail perusahaan yang tidak ada di input
   - Hanya gunakan informasi yang BENAR-BENAR diberikan oleh user
   
2. FORMAT EMAIL SEDERHANA:
   Paragraf 1: Salam + menyatakan minat melamar posisi X di perusahaan Y (1-2 kalimat)
   Paragraf 2: Perkenalan singkat + skill/pengalaman yang relevan JIKA ada (2-3 kalimat)
   Paragraf 3: Kesiapan untuk bergabung + lampiran CV (1-2 kalimat)
   Paragraf 4: Penutup sopan + harapan dapat kesempatan interview (1 kalimat)

3. CONTOH EMAIL YANG BENAR:

---
Yth. Bapak/Ibu HRD,

Saya Budi Santoso, bermaksud melamar posisi Admin di PT ABC. Saya fresh graduate dari jurusan Administrasi Bisnis, Universitas X.

Selama kuliah, saya aktif sebagai staff administrasi di organisasi kampus dan menguasai Microsoft Office. Saya teliti, terorganisir, dan siap belajar hal baru.

Bersama email ini saya lampirkan CV untuk bahan pertimbangan.

Terima kasih atas perhatian Bapak/Ibu. Saya berharap mendapat kesempatan untuk interview.

Hormat saya,
Budi Santoso
---

4. YANG HARUS DIHINDARI:
   - Kalimat panjang berbelit-belit
   - Bahasa yang terlalu formal/kaku
   - Pujian berlebihan pada perusahaan
   - Klaim yang tidak bisa dibuktikan
   - Kata-kata: "passionate", "proaktif", "team player", "fast learner"
   - Mengarang detail tentang perusahaan

5. TONE:
   - Sopan tapi tidak kaku
   - Singkat dan to the point
   - Jujur tentang kualifikasi
   - Percaya diri tapi tidak sombong`;

const SYSTEM_PROMPT_EN = `You are a seasoned HR Director with 15 + years across various industries(tech startups, corporations, finance) and a Career Coach who has helped 1000 + candidates land their dream jobs.

STRICT RULES - MUST FOLLOW:

1. FORBIDDEN OPENINGS(NEVER USE):
- "I am writing to express my interest..."
  - "I am applying for the position of..."
  - "I would like to apply for..."
  - "I am reaching out regarding..."
  - "I am excited to apply..."

2. COMPELLING OPENINGS(USE THESE):
- Hook with specific achievement / number
  - Brief relevant story(1 - 2 sentences)
    - Reference to company news / article
      - Bold value proposition statement
        - Personal connection to company / product

3. BANNED WORDS(AVOID):
- "passionate" / "passionate about"
  - "team player"
  - "hard worker"
  - "fast learner"
  - "detail-oriented"
  - "synergy"
  - "leverage"
  - "proactive"
  - "dynamic"

4. REPLACE WITH CONCRETE PROOF:
- Specific numbers and metrics(%, amounts, timeframes)
  - Short achievement stories
    - Measurable results and real impact
      - Specific project / situation examples

5. NATURAL PARAGRAPH STRUCTURE:
- Para 1: Compelling hook + who you are(2 - 3 sentences)
  - Para 2: Value proposition + concrete proof
    - Para 3: Why THIS company specifically(not generic)
      - Para 4: Warm and specific call - to - action

6. ANTI - AI DETECTION RULES:
- VARY sentence lengths(mix short punchy with longer ones)
- Use dashes for pauses-- like this
  - Parenthetical remarks are okay(like this one)
    - DON'T use "Furthermore", "Moreover", "Additionally" in sequence
      - DON'T make lists with perfect parallelism
        - Avoid over - enthusiasm("absolutely thrilled", "incredibly excited")
          - Honest admissions are good("I'm still learning X, but...")

7. TONE LIKE A PROFESSIONAL CONVERSATION:
- Imagine chatting with an HR at a coffee shop
  - Natural, not stiff, but respectful
    - Show personality without overdoing it`;

// ============================================================================
// PHASE 1B: FEW-SHOT EXAMPLES FOR DIFFERENT STYLES
// ============================================================================

const EXAMPLE_EMAILS = {
  application_id_formal: {
    context: 'Senior Software Engineer applying to Bank BCA, formal tone',
    email: `Yth.Bapak Rudi,

  Saat membaca tentang transformasi digital BCA yang berhasil meningkatkan transaksi mobile banking 300 % dalam setahun terakhir, saya langsung teringat pengalaman serupa yang pernah saya handle.Di bank sebelumnya, tim saya berhasil migrasi sistem core banking yang melayani 5 juta nasabah-- tanpa downtime.

    Selama 7 tahun di industri perbankan, fokus saya adalah sistem yang reliable dan scalable:
- Reduce incident rate dari 12 per bulan jadi 2 per bulan
  - Lead tim 6 engineer untuk modernisasi payment gateway
    - Implement security framework yang lolos audit OJK tanpa findings

Yang menarik perhatian saya tentang BCA bukan hanya scale - nya, tapi bagaimana BCA tetap bisa agile di tengah regulasi ketat.Saya lihat peluncuran fitur QRIS kemarin sangat smooth-- itu butuh koordinasi lintas tim yang solid.

Apakah Bapak ada waktu 20 menit untuk berdiskusi tentang bagaimana pengalaman saya di core banking bisa berkontribusi untuk roadmap digital BCA ?

  Hormat saya,
    Ahmad Pratama`
  },

  application_id_casual: {
    context: 'Frontend Developer applying to Tokopedia, casual/startup tone',
    email: `Hai Tim Tokopedia!

Jujur, waktu checkout di Tokopedia kemarin dan prosesnya cuma 8 detik, saya langsung curious siapa tim di balik ini.Kebetulan 3 bulan lalu saya nulis blog tentang "Optimasi Checkout Flow" -- dan sekarang ada kesempatan untuk contribute langsung ke tim yang saya admire.

Sedikit tentang journey saya:
- 2.5 tahun handle frontend di e - commerce lokal(traffic 2M users / bulan)
  - Obsessed sama performance-- portfolio saya load 0.9 detik di 3G
    - Pernah refactor checkout yang reduce abandonment dari 45 % ke 28 %
      - Contribute ke 2 open source project React yang cukup populer

Btw, saya notice Tokopedia baru release fitur "Beli Sekarang" yang skip cart.Smart move! Saya punya beberapa ide untuk enhance itu lebih jauh.

Boleh minta 15 menit untuk quick call ? Saya bisa share lebih detail tentang ide - ide improvement dan portfolio saya.

  Cheers,
  Budi Santoso`
  },

  application_id_semiformal: {
    context: 'Product Manager applying to Gojek, semi-formal tone',
    email: `Halo Bu Sarah,

  Minggu lalu saya baca interview Mas Nadiem di Tech in Asia tentang "super app fatigue" -- isu yang persis sedang saya riset untuk thesis PM.Menariknya, data yang saya kumpulkan menunjukkan user Indonesia justru prefer super app kalau onboarding - nya smooth.

Background saya mungkin agak unconventional untuk PM role.Saya mulai sebagai engineer, lalu 3 tahun terakhir pivot ke product:
- Grow MAU dari 50K ke 400K untuk fintech lending app
  - Launch 8 fitur dalam 6 bulan dengan tim 4 orang(lean tapi impactful)
    - Reduce churn 25 % lewat personalization yang saya design sendiri

Gojek menarik bukan cuma karena scale - nya-- tapi karena problem complexity - nya.Balancing antara driver, merchant, dan consumer dalam satu ecosystem itu challenging.Saya ingin contribute untuk solve puzzle itu.

Bu Sarah, apakah ada waktu untuk ngobrol 20 menit ? Saya bisa share deck tentang riset super app tadi kalau helpful.

Terima kasih banyak,
  Rina Wijaya`
  },

  application_en_professional: {
    context: 'Senior PM applying to Stripe, professional English tone',
    email: `Hi Michael,

  I noticed Stripe just launched in Indonesia last month.Perfect timing, because I've spent the last 4 years helping Indonesian fintech companies navigate exactly the kind of payment complexity you're about to tackle-- and I have some battle scars to share.

Quick context on my background:
- Grew monthly processed volume from $500K to $12M at my current company
  - Reduced payment failure rate from 15 % to 2.1 % (the 0.1 % still haunts me)
- Launched 5 new payment methods in 8 months, including the tricky QRIS integration

What excites me about Stripe isn't just the product -- though I've been a fanboy since 2017 when I first integrated Stripe for a side project.It's the chance to solve the "last mile" problem in Southeast Asia payments. A solution working in Singapore often completely fails in Jakarta -- I've learned this the hard way.

I have specific ideas about localizing Stripe's approach for Indonesian market quirks. Would love to share them over a 20-minute call.

Best,
  Andy Kusuma`
  },

  application_en_casual: {
    context: 'Designer applying to creative agency, casual English tone',
    email: `Hey Design Team!

I've been stalking your Dribbble for months (in a non-creepy way, promise). That Spotify campaign you did last quarter? I've referenced it in like 3 presentations trying to explain what "bold but not loud" means.

A bit about me: 4 years doing brand and product design, mostly for startups that needed to look legit on a shoestring budget.Some highlights:
- Rebranded a B2B SaaS-- they went from "what do you guys do?" to "oh you're THAT company" at conferences
  - Led design for an app launch that hit #2 on App Store(briefly, but still counts right ?)
    - Built a design system from scratch that's still standing 2 years later

I'm drawn to your agency because you seem to actually enjoy what you do. The behind-the-scenes on your Instagram looks like a place where weird ideas aren't immediately killed.

Coffee sometime ? I'd love to hear about your creative process -- and share my portfolio in person.

Cheers,
  Maya`
  },

  followup_id: {
    context: 'Follow-up email after 2 weeks, Indonesian',
    email: `Halo Pak Rudi,

  Dua minggu lalu saya mengirim lamaran untuk posisi Backend Engineer, dan saya ingin follow up sambil share update singkat.

Sejak mengirim lamaran, saya sudah:
- Complete sertifikasi AWS Solutions Architect(relevant dengan stack yang saya lihat di job desc)
  - Push 2 improvement ke open source project yang saya mention di CV

Saya tetap sangat tertarik dengan kesempatan ini.Apakah ada informasi tambahan yang bisa saya berikan untuk membantu proses review ?

  Terima kasih atas waktunya, Pak.

    Salam,
    Deni Saputra`
  },

  thankyou_id: {
    context: 'Thank you email after interview, Indonesian',
    email: `Halo Bu Maya,

  Terima kasih banyak untuk waktu dan diskusi hari ini.Percakapan tentang challenge scaling tim dari 5 ke 20 orang sangat insightful-- especially bagian tentang maintaining culture di tengah growth cepat.

Ada satu hal yang masih saya pikirkan sejak interview: problem komunikasi antar squad yang Ibu mention.Di tempat saya sekarang, kami solve ini dengan "demo day" mingguan yang singkat.Mungkin approach serupa bisa help ? Saya happy untuk share lebih detail kalau helpful.

Sekali lagi terima kasih.Saya semakin yakin bahwa ini adalah tim yang ingin saya join.

Salam hangat,
  Ratna`
  }
};

import {
  detectCompanyType,
  suggestToneForCompany,
  suggestGreeting,
  suggestClosing,
  CompanyType,
  INDONESIAN_ETIQUETTE
} from './indonesianEtiquette';

// ============================================================================
// PHASE 1C: INDUSTRY DETECTION & EXPERIENCE CATEGORIZATION
// ============================================================================

type IndustryType = CompanyType;
type ExperienceLevel = 'fresh_grad' | 'junior' | 'mid_level' | 'senior' | 'executive';

// Use the centralized logic from indonesianEtiquette.ts
function detectIndustryType(companyName: string): IndustryType {
  return detectCompanyType(companyName);
}

function categorizeExperience(years?: number): ExperienceLevel {
  if (!years || years === 0) return 'fresh_grad';
  if (years <= 2) return 'junior';
  if (years <= 5) return 'mid_level';
  if (years <= 10) return 'senior';
  return 'executive';
}

function getIndustryAdvice(industry: IndustryType, language: 'id' | 'en'): string {
  const advice: Record<IndustryType, { id: string; en: string }> = {
    startup: {
      id: `KONTEKS INDUSTRI STARTUP:
- Tone boleh lebih casual dan energetic
  - Fokus pada ownership, impact, dan growth mindset
    - Boleh tunjukkan personality dan passion
      - Hindari corporate speak yang kaku
        - Appreciate initiative dan side projects
          - Mention specific product / fitur yang kamu suka`,
      en: `STARTUP INDUSTRY CONTEXT:
- Tone can be more casual and energetic
  - Focus on ownership, impact, and growth mindset
    - Show personality and genuine interest
      - Avoid stiff corporate speak
        - Appreciate initiative and side projects
          - Mention specific products / features you like`
    },
    corporate: {
      id: `KONTEKS KORPORAT:
- Maintain professional tone tapi tidak kaku
  - Fokus pada reliability, track record, dan hasil terukur
    - Struktur lebih organized dengan bullet points
      - Tekankan teamwork dan leadership experience
        - Gunakan metrics dan achievement`,
      en: `CORPORATE CONTEXT:
- Maintain professional but not stiff tone
  - Focus on reliability, track record, measurable results
    - More organized structure with bullet points
      - Emphasize teamwork and leadership experience
        - Use metrics and achievements`
    },
    bank: {
      id: `KONTEKS PERBANKAN / FINANSIAL:
- Sangat formal dan conservative
  - Tekankan attention to detail dan compliance awareness
    - Highlight pengalaman dengan regulatory environment
      - Gunakan bahasa yang precise dan terukur
        - Hindari humor atau bahasa terlalu casual
          - Tekankan integritas dan trustworthiness`,
      en: `BANKING / FINANCE CONTEXT:
- Very formal and conservative tone
  - Emphasize attention to detail and compliance awareness
    - Highlight experience with regulatory environments
      - Use precise and measured language
        - Avoid humor or overly casual language
          - Emphasize integrity and trustworthiness`
    },
    government: {
      id: `KONTEKS PEMERINTAHAN / BUMN:
- Formal dan respectful
  - Tekankan dedikasi dan pengabdian
    - Highlight pengalaman dengan birokrasi atau large organization
      - Gunakan bahasa Indonesia yang baik dan benar
        - Mention kontribusi untuk Indonesia / masyarakat`,
      en: `GOVERNMENT / STATE - OWNED CONTEXT:
- Formal and respectful tone
  - Emphasize dedication and service
    - Highlight experience with bureaucracy or large organizations
      - Use proper formal language
        - Mention contribution to country / society`
    },
    agency: {
      id: `KONTEKS AGENCY / CREATIVE:
- Boleh lebih playful dan show creativity
  - Portfolio dan case studies sangat penting
    - Tunjukkan creative thinking dalam email itu sendiri
      - Mention specific campaign / work yang kamu admire
        - Personality is key`,
      en: `AGENCY / CREATIVE CONTEXT:
- Can be more playful and show creativity
  - Portfolio and case studies are crucial
    - Show creative thinking in the email itself
      - Mention specific campaigns / work you admire
        - Personality is key`
    },
    multinational: {
      id: `KONTEKS MULTINATIONAL:
- Semi - formal dengan sentuhan international
  - Gunakan English terms yang common di industri
    - Fokus pada global mindset dan adaptability
      - Highlight cross - cultural experience jika ada
        - Tekankan scalable thinking`,
      en: `MULTINATIONAL CONTEXT:
- Semi - formal with international touch
  - Use common industry English terms
    - Focus on global mindset and adaptability
      - Highlight cross - cultural experience if any
        - Emphasize scalable thinking`
    },
    unknown: {
      id: `Sesuaikan tone dengan style pilihan user.`,
      en: `Adjust tone based on user's style selection.`
    }
  };

  return advice[industry][language];
}

function getExperienceAdvice(level: ExperienceLevel, language: 'id' | 'en'): string {
  const advice: Record<ExperienceLevel, { id: string; en: string }> = {
    fresh_grad: {
      id: `FRESH GRADUATE APPROACH:
- Fokus pada potential, eagerness to learn, dan attitude
- Highlight projects, internship, organisasi, dan aktivitas kampus
- Tunjukkan genuine enthusiasm (tapi jangan berlebihan)
- Boleh mention kesediaan untuk belajar dan di-mentor
- Transferable skills dari pengalaman non-kerja itu valid
- Hindari over-promise tentang kemampuan`,
      en: `FRESH GRADUATE APPROACH:
- Focus on potential, eagerness to learn, and attitude
- Highlight projects, internships, organizations, campus activities
- Show genuine enthusiasm (but don't overdo it)
- Can mention willingness to learn and be mentored
- Transferable skills from non-work experience are valid
- Avoid over-promising about capabilities`
    },
    junior: {
      id: `JUNIOR LEVEL APPROACH:
- Balance antara achievements awal dan growth potential
- Highlight learning curve yang cepat
- Specific projects yang sudah di-handle sendiri
- Show initiative dan ownership
- Tunjukkan progression dari awal karir`,
      en: `JUNIOR LEVEL APPROACH:
- Balance between early achievements and growth potential
- Highlight fast learning curve
- Specific projects handled independently
- Show initiative and ownership
- Demonstrate career progression`
    },
    mid_level: {
      id: `MID-LEVEL APPROACH:
- Strong balance antara execution dan strategic thinking
- Specific impact numbers sangat penting
- Highlight team collaboration dan cross-functional work
- Tunjukkan progression dari IC ke more responsibility
- Leadership potential (bahkan tanpa title)`,
      en: `MID-LEVEL APPROACH:
- Strong balance between execution and strategic thinking
- Specific impact numbers are crucial
- Highlight team collaboration and cross-functional work
- Show progression from IC to more responsibility
- Leadership potential (even without title)`
    },
    senior: {
      id: `SENIOR LEVEL APPROACH:
- Lead dengan strategic thinking dan vision
- Fokus pada leadership, mentorship, dan team building
- Discuss business impact, bukan hanya technical
- Highlight cross-team influence
- Show thought leadership (blog, talks, contributions)`,
      en: `SENIOR LEVEL APPROACH:
- Lead with strategic thinking and vision
- Focus on leadership, mentorship, and team building
- Discuss business impact, not just technical
- Highlight cross-team influence
- Show thought leadership (blog, talks, contributions)`
    },
    executive: {
      id: `EXECUTIVE APPROACH:
- Big picture dan transformation stories
- P&L impact dan business metrics
- Industry influence dan network
- Vision alignment dengan perusahaan
- Culture building experience`,
      en: `EXECUTIVE APPROACH:
- Big picture and transformation stories
- P&L impact and business metrics
- Industry influence and network
- Vision alignment with company
- Culture building experience`
    }
  };

  return advice[level][language];
}

// ============================================================================
// PHASE 1D: CONTEXT-AWARE PROMPT BUILDER
// ============================================================================

function buildImprovedPrompt(data: EmailGenerationData): string {
  const language = data.language || 'id';
  const industry = detectIndustryType(data.companyName);
  const experienceLevel = categorizeExperience(data.yearsExperience);

  // Select appropriate example based on style and language
  const exampleKey = selectBestExample(data, language);
  const example = EXAMPLE_EMAILS[exampleKey as keyof typeof EXAMPLE_EMAILS];

  const emailTypeContext = language === 'id' ? {
    application: 'email lamaran kerja',
    follow_up: 'email follow-up lamaran',
    thank_you: 'email terima kasih setelah interview',
    inquiry: 'email inquiry peluang kerja'
  } : {
    application: 'job application email',
    follow_up: 'follow-up email',
    thank_you: 'thank you email after interview',
    inquiry: 'job inquiry email'
  };

  let prompt = language === 'id'
    ? `Buat ${emailTypeContext[data.emailType]} dalam BAHASA INDONESIA.`
    : `Write a ${emailTypeContext[data.emailType]} in ENGLISH.`;

  prompt += `

=== INFORMASI KANDIDAT ===
Nama: ${data.yourName}
Posisi yang dilamar: ${data.position}
Perusahaan: ${data.companyName}
${data.currentRole ? `Posisi saat ini: ${data.currentRole}` : 'Fresh graduate / Sedang mencari kerja'}
${data.yearsExperience ? `Pengalaman: ${data.yearsExperience} tahun` : ''}
${data.jobSource ? `Sumber lowongan: ${data.jobSource}` : ''}
${data.referralName ? `Direferensikan oleh: ${data.referralName}` : ''}
${data.hrdName ? `Penerima: ${data.hrdName}${data.hrdTitle ? ` (${data.hrdTitle})` : ''}` : ''}

=== STYLE REQUIREMENTS ===
Tone: ${data.toneStyle} (${getStyleDescription(data.toneStyle, language)})
Personality: ${data.personality} (${getPersonalityDescription(data.personality, language)})
Panjang: ${data.lengthType} (${getLengthGuidance(data.lengthType, language)})
${data.toneSettings ? `
=== FINE-TUNED TONE (1-10 scale) ===
- Formality Level: ${data.toneSettings.formality}/10 (${data.toneSettings.formality <= 3 ? 'very casual, like chatting with friend' : data.toneSettings.formality <= 6 ? 'balanced, professional but approachable' : 'very formal, traditional business style'})
- Confidence Level: ${data.toneSettings.confidence}/10 (${data.toneSettings.confidence <= 3 ? 'humble, modest, eager to learn' : data.toneSettings.confidence <= 6 ? 'balanced confidence' : 'bold, assertive, direct'})
- Enthusiasm Level: ${data.toneSettings.enthusiasm}/10 (${data.toneSettings.enthusiasm <= 3 ? 'calm, measured, understated' : data.toneSettings.enthusiasm <= 6 ? 'genuine interest' : 'excited, energetic, passionate'})
` : ''}
${getIndustryAdvice(industry, language)}

${getExperienceAdvice(experienceLevel, language)}

=== KONTEN YANG HARUS ADA ===`;

  if (data.highlightSkills && data.highlightSkills.length > 0) {
    prompt += `\n- Sebutkan skills ini secara NATURAL (jangan list panjang): ${data.highlightSkills.join(', ')}`;
  }

  if (data.achievements) {
    prompt += `\n- Weave in achievement ini: ${data.achievements}`;
  }

  if (data.personalStory) {
    prompt += `\n- Gunakan cerita personal ini sebagai hook atau bukti: ${data.personalStory}`;
  }

  if (data.includeWhyCompany) {
    prompt += `\n- Sebutkan bahwa tertarik dengan posisi di ${data.companyName} (JANGAN mengarang detail tentang perusahaan)`;
  }

  if (data.includeWhyYou) {
    prompt += `\n- Jelaskan kenapa kandidat cocok untuk posisi ini dengan BUKTI KONKRET`;
  }

  if (data.hasAttachment) {
    prompt += `\n- Mention bahwa CV/portfolio terlampir`;
  }

  if (data.callToAction) {
    const ctaMap = language === 'id' ? {
      interview: 'ajukan kesempatan interview dengan waktu spesifik',
      meeting: 'suggest meeting untuk diskusi lebih lanjut',
      discussion: 'buka pintu untuk diskusi lanjutan',
      portfolio_review: 'tawarkan untuk present portfolio/hasil kerja'
    } : {
      interview: 'request interview opportunity with specific timing',
      meeting: 'suggest a meeting to discuss further',
      discussion: 'open door for further discussion',
      portfolio_review: 'offer to present portfolio/work samples'
    };
    prompt += `\n- Call to action: ${ctaMap[data.callToAction]}`;
  }

  if (data.openingStyle) {
    const openingGuide = {
      achievement: 'Buka dengan pencapaian/angka yang impressive',
      story: 'Buka dengan cerita singkat yang engaging',
      connection: 'Buka dengan koneksi (referral, berita perusahaan, dll)',
      question: 'Buka dengan pertanyaan retoris yang thought-provoking',
      direct: 'Buka langsung to the point dengan confidence'
    };
    prompt += `\n- Opening style: ${openingGuide[data.openingStyle]}`;
  }

  prompt += `

=== CONTOH EMAIL YANG BAGUS ===
Context: ${example.context}

${example.email}

=== OUTPUT FORMAT ===
SUBJECT: Lamaran ${data.position} - ${data.yourName}

BODY:
[Isi email lengkap]

PENTING: 
- Return HANYA subject dan body, tanpa komentar tambahan
- Jangan copy contoh di atas, buat yang ORIGINAL berdasarkan info kandidat
- Pastikan email terasa NATURAL dan PERSONAL, seperti orang sungguhan menulis
- JANGAN research atau mention detail spesifik tentang perusahaan yang tidak ada di input
- Fokus pada kualifikasi dan motivasi pelamar saja
- Hindari frasa cliche AI seperti "Saya sangat antusias", "Dengan hormat, saya bermaksud"
- Tulis seperti profesional muda Indonesia yang sopan tapi tidak kaku`;

  return prompt;
}

function selectBestExample(data: EmailGenerationData, language: 'id' | 'en'): string {
  // Select example based on email type, language, and tone
  if (data.emailType === 'follow_up') {
    return 'followup_id';
  }

  if (data.emailType === 'thank_you') {
    return 'thankyou_id';
  }

  if (language === 'en') {
    if (data.toneStyle === 'casual' || data.toneStyle === 'creative') {
      return 'application_en_casual';
    }
    return 'application_en_professional';
  }

  // Indonesian
  if (data.toneStyle === 'formal') {
    return 'application_id_formal';
  }
  if (data.toneStyle === 'casual' || data.toneStyle === 'creative') {
    return 'application_id_casual';
  }
  return 'application_id_semiformal';
}

function getStyleDescription(style: string, language: 'id' | 'en'): string {
  const descriptions = {
    formal: {
      id: 'Sangat profesional dan tradisional, cocok untuk perbankan, pemerintahan, atau korporat besar',
      en: 'Very professional and traditional, suitable for banking, government, or large corporate'
    },
    'semi-formal': {
      id: 'Profesional tapi approachable, cocok untuk tech companies dan korporat modern',
      en: 'Professional yet approachable, suitable for tech companies and modern corporates'
    },
    casual: {
      id: 'Friendly dan conversational, cocok untuk startup dan industri kreatif',
      en: 'Friendly and conversational, suitable for startups and creative industries'
    },
    creative: {
      id: 'Unik dan expressive, cocok untuk agency desain dan posisi kreatif',
      en: 'Unique and expressive, suitable for design agencies and creative roles'
    }
  };
  return descriptions[style as keyof typeof descriptions]?.[language] || descriptions['semi-formal'][language];
}

function getLengthGuidance(length: string, language: 'id' | 'en'): string {
  const guidance = {
    concise: {
      id: '150-200 kata, 3-4 paragraf, singkat dan to the point',
      en: '150-200 words, 3-4 paragraphs, brief and to the point'
    },
    medium: {
      id: '200-300 kata, 4-5 paragraf, detail seimbang',
      en: '200-300 words, 4-5 paragraphs, balanced detail'
    },
    detailed: {
      id: '300-400 kata, 5-6 paragraf, comprehensive dengan contoh',
      en: '300-400 words, 5-6 paragraphs, comprehensive with examples'
    }
  };
  return guidance[length as keyof typeof guidance]?.[language] || guidance.medium[language];
}

function getPersonalityDescription(personality: string, language: 'id' | 'en'): string {
  const descriptions = {
    confident: {
      id: 'Assertive dan yakin tanpa arogan. Gunakan "Saya yakin...", "Saya berhasil..."',
      en: 'Assertive and self-assured without arrogance. Use "I am confident...", "I successfully..."'
    },
    humble: {
      id: 'Modest dan respectful. Gunakan "Saya berharap...", "Saya percaya bisa berkontribusi..."',
      en: 'Modest and respectful. Use "I would be honored...", "I believe I can contribute..."'
    },
    enthusiastic: {
      id: 'Excited dan passionate tapi tidak berlebihan. Tunjukkan genuine interest.',
      en: 'Excited and passionate but not over the top. Show genuine interest.'
    },
    balanced: {
      id: 'Professional tapi personable. Mix confidence dengan humility yang natural.',
      en: 'Professional yet personable. Natural mix of confidence and humility.'
    }
  };
  return descriptions[personality as keyof typeof descriptions]?.[language] || descriptions.balanced[language];
}

// ============================================================================
// POST-PROCESSING: HUMANIZE OUTPUT
// ============================================================================

function humanizeEmail(rawOutput: string, language: 'id' | 'en'): string {
  let processed = rawOutput;

  // AI phrase replacements
  const aiPhrases = language === 'id' ? [
    { pattern: /Saya menulis (surat |email )?ini untuk/gi, replacement: '' },
    { pattern: /Dengan hormat,?\s*saya (ingin |bermaksud )/gi, replacement: '' },
    { pattern: /Melalui (surat |email )?ini/gi, replacement: '' },
    { pattern: /Bersama ini saya/gi, replacement: 'Saya' },
    { pattern: /Furthermore,?\s*/gi, replacement: 'Selain itu, ' },
    { pattern: /Moreover,?\s*/gi, replacement: 'Juga, ' },
    { pattern: /Additionally,?\s*/gi, replacement: '' },
    { pattern: /In conclusion,?\s*/gi, replacement: '' },
    { pattern: /sangat sangat/gi, replacement: 'sangat' },
    { pattern: /luar biasa antusias/gi, replacement: 'antusias' },
  ] : [
    { pattern: /I am writing to express my interest/gi, replacement: '' },
    { pattern: /I am writing to apply/gi, replacement: '' },
    { pattern: /I would like to apply/gi, replacement: '' },
    { pattern: /I am reaching out/gi, replacement: '' },
    { pattern: /Furthermore,?\s*/gi, replacement: 'Also, ' },
    { pattern: /Moreover,?\s*/gi, replacement: '' },
    { pattern: /Additionally,?\s*/gi, replacement: '' },
    { pattern: /In conclusion,?\s*/gi, replacement: '' },
    { pattern: /I would be thrilled/gi, replacement: "I'd love" },
    { pattern: /I am extremely excited/gi, replacement: "I'm excited" },
    { pattern: /absolutely thrilled/gi, replacement: 'excited' },
    { pattern: /incredibly excited/gi, replacement: 'excited' },
    { pattern: /passionate about/gi, replacement: 'focused on' },
  ];

  aiPhrases.forEach(({ pattern, replacement }) => {
    processed = processed.replace(pattern, replacement);
  });

  // Clean up double spaces and line breaks
  processed = processed.replace(/  +/g, ' ');
  processed = processed.replace(/\n{3,}/g, '\n\n');

  // Ensure first letter after replacement is capitalized
  processed = processed.replace(/^\s+/, '');
  if (processed.length > 0) {
    processed = processed.charAt(0).toUpperCase() + processed.slice(1);
  }

  return processed.trim();
}

// ============================================================================
// MAIN GENERATION FUNCTIONS
// ============================================================================

export async function generateEmail(data: EmailGenerationData): Promise<{
  subject: string;
  body: string;
  error?: string;
}> {
  try {
    const language = data.language || 'id';
    const systemPrompt = language === 'id' ? SYSTEM_PROMPT_ID : SYSTEM_PROMPT_EN;
    const userPrompt = buildImprovedPrompt(data);

    console.log('Generating email with improved prompts...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.75, // Slightly higher for more natural variation
      max_tokens: 1200,
    });

    const generatedContent = completion.choices[0]?.message?.content || '';

    if (!generatedContent) {
      throw new Error('No content generated from AI');
    }

    // Parse and humanize the response
    let { subject, body } = parseEmailResponse(generatedContent, data);
    body = humanizeEmail(body, language);

    return { subject, body };
  } catch (error: any) {
    console.error('Error generating email:', error);
    return {
      subject: '',
      body: '',
      error: error.message || 'Failed to generate email'
    };
  }
}

function parseEmailResponse(response: string, data: EmailGenerationData): { subject: string; body: string } {
  // Extract subject line
  const subjectMatch = response.match(/SUBJECT:\s*(.+?)(?:\n|$)/i);
  let subject = subjectMatch ? subjectMatch[1].trim() : '';

  if (!subject) {
    subject = generateDefaultSubject(data);
  }

  // Extract body
  let body = response;
  body = body.replace(/SUBJECT:\s*.+?(?:\n|$)/i, '').trim();
  body = body.replace(/^BODY:\s*/i, '').trim();

  // Format body with proper structure
  body = formatEmailBody(body, data);

  return { subject, body };
}

function generateDefaultSubject(data: EmailGenerationData): string {
  const language = data.language || 'id';

  // Clean subject format: Position - Name (Company optional)
  if (language === 'id') {
    const typeSubjects = {
      application: `Lamaran ${data.position} - ${data.yourName}`,
      follow_up: `Follow Up Lamaran ${data.position} - ${data.yourName}`,
      thank_you: `Terima Kasih Interview ${data.position} - ${data.yourName}`,
      inquiry: `Inquiry ${data.position} - ${data.yourName}`
    };
    return typeSubjects[data.emailType];
  }

  const typeSubjects = {
    application: `Application: ${data.position} - ${data.yourName}`,
    follow_up: `Follow Up: ${data.position} - ${data.yourName}`,
    thank_you: `Thank You: ${data.position} Interview - ${data.yourName}`,
    inquiry: `Inquiry: ${data.position} - ${data.yourName}`
  };

  return typeSubjects[data.emailType];
}

function formatEmailBody(body: string, data: EmailGenerationData): string {
  const language = data.language || 'id';

  // Check for greeting
  const hasGreetingID = /^(Yth\.|Halo|Hai|Selamat|Dear|Yang terhormat)/i.test(body);
  const hasGreetingEN = /^(Dear|Hi|Hello|Good morning|Good afternoon|Hey)/i.test(body);

  if (language === 'id' && !hasGreetingID) {
    // Use the new etiquette logic for ID
    let etiquetteTone: 'formal' | 'semiformal' | 'casual' = 'semiformal';
    if (data.toneStyle === 'formal') etiquetteTone = 'formal';
    else if (data.toneStyle === 'casual' || data.toneStyle === 'creative') etiquetteTone = 'casual';

    const greeting = suggestGreeting(etiquetteTone, data.hrdName, data.hrdTitle);
    body = greeting + '\n\n' + body;
  } else if (language === 'en' && !hasGreetingEN) {
    const greeting = data.hrdName
      ? (data.toneStyle === 'casual' ? `Hi ${data.hrdName},` : `Dear ${data.hrdName},`)
      : 'Dear Hiring Manager,';
    body = greeting + '\n\n' + body;
  }

  // Check for sign-off
  const hasSignoffID = /(Hormat saya|Salam|Terima kasih|Best|Cheers)/i.test(body);
  const hasSignoffEN = /(Best regards|Sincerely|Best wishes|Warm regards|Kind regards|Cheers|Thanks|Best)/i.test(body);

  if (language === 'id' && !hasSignoffID) {
    // Use the new etiquette logic for ID
    let etiquetteTone: 'formal' | 'semiformal' | 'casual' = 'semiformal';
    if (data.toneStyle === 'formal') etiquetteTone = 'formal';
    else if (data.toneStyle === 'casual' || data.toneStyle === 'creative') etiquetteTone = 'casual';

    const signOff = suggestClosing(etiquetteTone);
    body += `\n\n${signOff}\n${data.yourName}`;
  } else if (language === 'en' && !hasSignoffEN) {
    const signOff = data.toneStyle === 'formal' ? 'Sincerely' :
      data.toneStyle === 'casual' ? 'Cheers' : 'Best regards';
    body += `\n\n${signOff},\n${data.yourName}`;
  }

  return body;
}

// Generate subject line only
export async function generateSubjectLine(data: Partial<EmailGenerationData>): Promise<string> {
  try {
    const language = data.language || 'id';

    const prompt = language === 'id'
      ? `Buat subject line email lamaran yang menarik dan spesifik.

Posisi: ${data.position}
Perusahaan: ${data.companyName}
Nama: ${data.yourName}
${data.referralName ? `Referral: ${data.referralName}` : ''}

Requirements:
- Maksimal 60 karakter
- Spesifik dan personal
- Jangan generic seperti "Lamaran Kerja" saja
- Boleh ada hook (angka, referral name, dll)

Return HANYA subject line, tanpa penjelasan.`
      : `Create a compelling and specific email subject line.

Position: ${data.position}
Company: ${data.companyName}
Name: ${data.yourName}
${data.referralName ? `Referral: ${data.referralName}` : ''}

Requirements:
- Maximum 60 characters
- Specific and personal
- Not generic like "Job Application"
- Can include hooks (numbers, referral name, etc)

Return ONLY the subject line, no explanation.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at writing compelling email subject lines that get opened.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 60,
    });

    return completion.choices[0]?.message?.content?.trim() || generateDefaultSubject(data as EmailGenerationData);
  } catch (error) {
    console.error('Error generating subject line:', error);
    return generateDefaultSubject(data as EmailGenerationData);
  }
}

// Generate multiple email variations
export async function generateEmailVariations(
  data: EmailGenerationData,
  count: number = 3
): Promise<Array<{ subject: string; body: string; variation: string; description: string }>> {
  const variations = [
    { personality: 'confident' as const, name: 'Confident & Direct', desc: 'Bold dan percaya diri' },
    { personality: 'balanced' as const, name: 'Balanced & Professional', desc: 'Seimbang dan profesional' },
    { personality: 'enthusiastic' as const, name: 'Enthusiastic & Warm', desc: 'Antusias dan hangat' }
  ];

  const results = [];

  for (let i = 0; i < Math.min(count, variations.length); i++) {
    const v = variations[i];
    const result = await generateEmail({ ...data, personality: v.personality });

    if (!result.error) {
      results.push({
        ...result,
        variation: v.name,
        description: v.desc
      });
    }
  }

  return results;
}
