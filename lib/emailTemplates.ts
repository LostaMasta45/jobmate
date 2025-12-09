// Indonesian Email Templates Database - Phase 3
// Pre-built templates that have proven to work well

export interface EmailTemplate {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  category: 'fresh_graduate' | 'experienced' | 'career_switch' | 'referral' | 'follow_up' | 'thank_you';
  tone: 'formal' | 'semi-formal' | 'casual';
  template: string;
  placeholders: string[];
  tips: string[];
}

export const INDONESIAN_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'fresh_grad_eager',
    name: 'Fresh Graduate - Eager to Learn',
    nameEn: 'Fresh Graduate - Eager to Learn',
    description: 'Untuk fresh grad yang belum punya banyak experience tapi punya semangat tinggi',
    descriptionEn: 'For fresh graduates with limited experience but high enthusiasm',
    category: 'fresh_graduate',
    tone: 'semi-formal',
    template: `Yth. [HR_NAME],

Saat melihat lowongan [POSITION] di [COMPANY], saya langsung merasa ini adalah kesempatan yang saya tunggu-tunggu. Sebagai fresh graduate [UNIVERSITY] jurusan [MAJOR], saya sudah tidak sabar untuk memulai karir profesional di bidang ini.

Meskipun baru lulus, saya sudah punya pengalaman praktis:
- [EXPERIENCE_1]
- [EXPERIENCE_2]
- [RELEVANT_ACTIVITY]

Yang membuat saya tertarik dengan [COMPANY] adalah [SPECIFIC_REASON]. Saya percaya culture [COMPANY] yang [CULTURE_ASPECT] sangat cocok dengan cara kerja saya.

Saya sangat eager untuk belajar dan berkontribusi. Apakah ada kesempatan untuk interview sehingga saya bisa menjelaskan lebih detail tentang potensi yang bisa saya bawa?

Terima kasih atas waktu dan pertimbangannya.

Hormat saya,
[YOUR_NAME]`,
    placeholders: ['HR_NAME', 'POSITION', 'COMPANY', 'UNIVERSITY', 'MAJOR', 'EXPERIENCE_1', 'EXPERIENCE_2', 'RELEVANT_ACTIVITY', 'SPECIFIC_REASON', 'CULTURE_ASPECT', 'YOUR_NAME'],
    tips: [
      'Highlight organisasi kampus dan project yang relevan',
      'Tunjukkan genuine enthusiasm tanpa berlebihan',
      'Focus pada learning mindset dan potential'
    ]
  },
  {
    id: 'experienced_impact',
    name: 'Experienced - Impact Driven',
    nameEn: 'Experienced Professional - Impact Driven',
    description: 'Untuk profesional berpengalaman yang ingin highlight achievement dan impact',
    descriptionEn: 'For experienced professionals who want to highlight achievements',
    category: 'experienced',
    tone: 'semi-formal',
    template: `Halo [HR_NAME],

[HOOK_SENTENCE_ABOUT_COMPANY_OR_INDUSTRY]

Selama [X_YEARS] tahun di [INDUSTRY], fokus saya adalah [CORE_EXPERTISE]. Beberapa highlight:
- [ACHIEVEMENT_1_WITH_NUMBERS]
- [ACHIEVEMENT_2_WITH_NUMBERS]
- [ACHIEVEMENT_3_WITH_NUMBERS]

Yang menarik dari [COMPANY] bukan hanya [OBVIOUS_REASON], tapi [SPECIFIC_INSIGHT]. [WHY_THIS_RESONATES_WITH_YOU].

Apakah [HR_NAME] ada waktu [SPECIFIC_TIME] minggu ini untuk ngobrol tentang bagaimana background saya bisa contribute ke [TEAM_OR_PROJECT]?

Terima kasih,
[YOUR_NAME]`,
    placeholders: ['HR_NAME', 'HOOK_SENTENCE_ABOUT_COMPANY_OR_INDUSTRY', 'X_YEARS', 'INDUSTRY', 'CORE_EXPERTISE', 'ACHIEVEMENT_1_WITH_NUMBERS', 'ACHIEVEMENT_2_WITH_NUMBERS', 'ACHIEVEMENT_3_WITH_NUMBERS', 'COMPANY', 'OBVIOUS_REASON', 'SPECIFIC_INSIGHT', 'WHY_THIS_RESONATES_WITH_YOU', 'SPECIFIC_TIME', 'TEAM_OR_PROJECT', 'YOUR_NAME'],
    tips: [
      'Selalu gunakan angka dan metrics spesifik',
      'Hook dengan insight tentang perusahaan/industri',
      'Be specific about the time ask'
    ]
  },
  {
    id: 'career_switcher',
    name: 'Career Switcher - Transferable Skills',
    nameEn: 'Career Switcher - Transferable Skills',
    description: 'Untuk yang pindah industri atau role, focus pada transferable skills',
    descriptionEn: 'For those switching industries/roles, focus on transferable skills',
    category: 'career_switch',
    tone: 'semi-formal',
    template: `Halo [HR_NAME],

Setelah [X_YEARS] tahun di [PREVIOUS_INDUSTRY], saya memutuskan untuk pivot ke [NEW_FIELD]. Bukan keputusan yang mudah, tapi setelah [LEARNING_JOURNEY], saya yakin ini adalah langkah yang tepat.

Pengalaman saya di [PREVIOUS_ROLE] sebenarnya sangat transferable:
- [TRANSFERABLE_SKILL_1]: [HOW_IT_APPLIES]
- [TRANSFERABLE_SKILL_2]: [HOW_IT_APPLIES]
- [TRANSFERABLE_SKILL_3]: [HOW_IT_APPLIES]

Untuk mempersiapkan transisi ini, saya sudah:
- [PREPARATION_1]
- [PREPARATION_2]

Saya tahu saya mungkin bukan kandidat "traditional" untuk posisi ini. Tapi justru itu yang saya yakini sebagai nilai tambah -- perspektif berbeda dan hunger to prove myself.

Boleh minta waktu 15 menit untuk discuss lebih lanjut?

Best,
[YOUR_NAME]`,
    placeholders: ['HR_NAME', 'X_YEARS', 'PREVIOUS_INDUSTRY', 'NEW_FIELD', 'LEARNING_JOURNEY', 'PREVIOUS_ROLE', 'TRANSFERABLE_SKILL_1', 'TRANSFERABLE_SKILL_2', 'TRANSFERABLE_SKILL_3', 'HOW_IT_APPLIES', 'PREPARATION_1', 'PREPARATION_2', 'YOUR_NAME'],
    tips: [
      'Acknowledge the transition openly',
      'Show concrete preparation steps',
      'Focus on unique perspective as advantage'
    ]
  },
  {
    id: 'referral_connection',
    name: 'Referral - Leverage Connection',
    nameEn: 'Referral - Leverage Connection',
    description: 'Ketika ada yang merekomendasikan, maksimalkan credibility dari referral',
    descriptionEn: 'When you have a referral, maximize the credibility',
    category: 'referral',
    tone: 'semi-formal',
    template: `Yth. [HR_NAME],

[REFERRAL_NAME] dari tim [DEPARTMENT] menyarankan saya untuk menghubungi Anda mengenai posisi [POSITION].

Saya sudah berbincang dengan [REFERRAL_NAME] tentang culture dan challenges di [COMPANY], dan semakin yakin bahwa skill set saya bisa berkontribusi, khususnya dalam hal:

- [RELEVANT_SKILL_1]: [BRIEF_PROOF]
- [RELEVANT_SKILL_2]: [BRIEF_PROOF]

[REFERRAL_NAME] specifically mention bahwa tim sedang [CHALLENGE_OR_GOAL]. Ini sangat menarik karena saya pernah [RELEVANT_EXPERIENCE].

Apakah ada waktu minggu ini untuk ngobrol lebih lanjut? [REFERRAL_NAME] bilang Anda biasanya available [TIME_SLOT].

Terima kasih,
[YOUR_NAME]

P.S. Saya attach CV dan portfolio untuk reference.`,
    placeholders: ['HR_NAME', 'REFERRAL_NAME', 'DEPARTMENT', 'POSITION', 'COMPANY', 'RELEVANT_SKILL_1', 'RELEVANT_SKILL_2', 'BRIEF_PROOF', 'CHALLENGE_OR_GOAL', 'RELEVANT_EXPERIENCE', 'TIME_SLOT', 'YOUR_NAME'],
    tips: [
      'Mention referral name in first sentence',
      'Show you did homework by referencing specific challenges',
      'Use referral to suggest specific availability'
    ]
  },
  {
    id: 'follow_up_polite',
    name: 'Follow Up - Polite Reminder',
    nameEn: 'Follow Up - Polite Reminder',
    description: 'Follow up yang sopan tanpa terkesan memaksa, dengan value add',
    descriptionEn: 'Polite follow-up without being pushy, with added value',
    category: 'follow_up',
    tone: 'formal',
    template: `Halo [HR_NAME],

[TIME_SINCE_LAST_EMAIL] lalu saya mengirim lamaran untuk posisi [POSITION], dan saya ingin follow up sambil share update singkat.

Sejak mengirim lamaran, saya sudah:
- [UPDATE_1]
- [UPDATE_2]

Saya tetap sangat tertarik dengan kesempatan ini karena [REITERATE_INTEREST].

Apakah ada informasi tambahan yang bisa saya berikan untuk membantu proses review? Saya juga happy untuk [OFFER_FLEXIBILITY].

Terima kasih atas waktunya, [HR_TITLE].

Salam,
[YOUR_NAME]`,
    placeholders: ['HR_NAME', 'TIME_SINCE_LAST_EMAIL', 'POSITION', 'UPDATE_1', 'UPDATE_2', 'REITERATE_INTEREST', 'OFFER_FLEXIBILITY', 'HR_TITLE', 'YOUR_NAME'],
    tips: [
      'Add value with genuine updates since last email',
      'Keep it short - max 150 words',
      'Offer to provide additional info or flexibility'
    ]
  },
  {
    id: 'thank_you_insightful',
    name: 'Thank You - Insightful Follow-up',
    nameEn: 'Thank You - Insightful Follow-up',
    description: 'Thank you email yang add value dengan referencing specific discussion points',
    descriptionEn: 'Thank you email that adds value by referencing specific discussion points',
    category: 'thank_you',
    tone: 'semi-formal',
    template: `Halo [INTERVIEWER_NAME],

Terima kasih banyak untuk waktu dan diskusi [TIME_OF_INTERVIEW]. Percakapan tentang [SPECIFIC_TOPIC_DISCUSSED] sangat insightful -- especially bagian tentang [SPECIFIC_POINT].

Ada satu hal yang masih saya pikirkan sejak interview: [CHALLENGE_MENTIONED]. Di tempat saya sekarang, kami solve ini dengan [YOUR_APPROACH]. Mungkin approach serupa bisa help? Saya happy untuk share lebih detail kalau helpful.

Sekali lagi terima kasih. [REITERATE_INTEREST_SPECIFIC].

Salam hangat,
[YOUR_NAME]`,
    placeholders: ['INTERVIEWER_NAME', 'TIME_OF_INTERVIEW', 'SPECIFIC_TOPIC_DISCUSSED', 'SPECIFIC_POINT', 'CHALLENGE_MENTIONED', 'YOUR_APPROACH', 'REITERATE_INTEREST_SPECIFIC', 'YOUR_NAME'],
    tips: [
      'Reference specific points from the interview',
      'Add value by offering insight on a problem discussed',
      'Keep it within 24 hours of interview'
    ]
  },
  {
    id: 'startup_casual',
    name: 'Startup Application - Casual & Personal',
    nameEn: 'Startup Application - Casual & Personal',
    description: 'Untuk startup yang appreciate personality dan ownership mindset',
    descriptionEn: 'For startups that appreciate personality and ownership mindset',
    category: 'experienced',
    tone: 'casual',
    template: `Hai Tim [COMPANY]!

[PERSONAL_HOOK_ABOUT_PRODUCT_OR_COMPANY]

Sedikit tentang saya:
- [EXPERIENCE_POINT_1]
- [EXPERIENCE_POINT_2]
- [FUN_FACT_OR_SIDE_PROJECT]

Btw, saya notice [SPECIFIC_OBSERVATION_ABOUT_PRODUCT]. [YOUR_IDEA_OR_OPINION].

Boleh minta [SPECIFIC_TIME] untuk quick call? [WHAT_YOU_WANT_TO_DISCUSS].

Cheers,
[YOUR_NAME]`,
    placeholders: ['COMPANY', 'PERSONAL_HOOK_ABOUT_PRODUCT_OR_COMPANY', 'EXPERIENCE_POINT_1', 'EXPERIENCE_POINT_2', 'FUN_FACT_OR_SIDE_PROJECT', 'SPECIFIC_OBSERVATION_ABOUT_PRODUCT', 'YOUR_IDEA_OR_OPINION', 'SPECIFIC_TIME', 'WHAT_YOU_WANT_TO_DISCUSS', 'YOUR_NAME'],
    tips: [
      'Show you actually use/know the product',
      'Be casual but still professional',
      'Include something that shows personality'
    ]
  },
  {
    id: 'banking_formal',
    name: 'Banking/Corporate - Ultra Formal',
    nameEn: 'Banking/Corporate - Ultra Formal',
    description: 'Untuk perbankan, BUMN, atau korporat traditional yang butuh formal tone',
    descriptionEn: 'For banking, state-owned, or traditional corporate requiring formal tone',
    category: 'experienced',
    tone: 'formal',
    template: `Yang terhormat Bapak/Ibu [HR_NAME],

Dengan hormat, saya [YOUR_NAME], [CURRENT_POSITION] dengan pengalaman [X_YEARS] tahun di bidang [FIELD]. Melalui surat ini, saya ingin menyampaikan ketertarikan saya terhadap posisi [POSITION] di [COMPANY].

Dalam perjalanan karir saya, saya telah berhasil:
- [ACHIEVEMENT_1]
- [ACHIEVEMENT_2]
- [ACHIEVEMENT_3]

Saya sangat mengapresiasi komitmen [COMPANY] dalam [COMPANY_VALUE_OR_INITIATIVE]. Hal ini sejalan dengan nilai-nilai profesional yang saya pegang, khususnya dalam hal [ALIGNMENT_POINT].

Besar harapan saya untuk dapat diberikan kesempatan interview guna membahas lebih lanjut bagaimana kontribusi saya dapat memberikan nilai tambah bagi [COMPANY].

Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.

Hormat saya,
[YOUR_NAME]
[PHONE_NUMBER]
[EMAIL]`,
    placeholders: ['HR_NAME', 'YOUR_NAME', 'CURRENT_POSITION', 'X_YEARS', 'FIELD', 'POSITION', 'COMPANY', 'ACHIEVEMENT_1', 'ACHIEVEMENT_2', 'ACHIEVEMENT_3', 'COMPANY_VALUE_OR_INITIATIVE', 'ALIGNMENT_POINT', 'PHONE_NUMBER', 'EMAIL'],
    tips: [
      'Use very formal Indonesian language',
      'Include contact information at the end',
      'Keep tone respectful and traditional'
    ]
  }
];

// Get template by ID
export function getTemplateById(id: string): EmailTemplate | undefined {
  return INDONESIAN_EMAIL_TEMPLATES.find(t => t.id === id);
}

// Get templates by category
export function getTemplatesByCategory(category: EmailTemplate['category']): EmailTemplate[] {
  return INDONESIAN_EMAIL_TEMPLATES.filter(t => t.category === category);
}

// Get templates by tone
export function getTemplatesByTone(tone: EmailTemplate['tone']): EmailTemplate[] {
  return INDONESIAN_EMAIL_TEMPLATES.filter(t => t.tone === tone);
}

// Suggest best template based on user input
export function suggestTemplate(params: {
  yearsExperience?: number;
  hasReferral: boolean;
  emailType: string;
  toneStyle: string;
  isCareerSwitch?: boolean;
}): EmailTemplate | undefined {
  const { yearsExperience, hasReferral, emailType, toneStyle, isCareerSwitch } = params;
  
  // If has referral, always suggest referral template
  if (hasReferral) {
    return getTemplateById('referral_connection');
  }
  
  // Follow up or thank you
  if (emailType === 'follow_up') {
    return getTemplateById('follow_up_polite');
  }
  if (emailType === 'thank_you') {
    return getTemplateById('thank_you_insightful');
  }
  
  // Career switch
  if (isCareerSwitch) {
    return getTemplateById('career_switcher');
  }
  
  // Fresh graduate
  if (!yearsExperience || yearsExperience === 0) {
    return getTemplateById('fresh_grad_eager');
  }
  
  // Experienced - by tone
  if (toneStyle === 'formal') {
    return getTemplateById('banking_formal');
  }
  if (toneStyle === 'casual' || toneStyle === 'creative') {
    return getTemplateById('startup_casual');
  }
  
  // Default experienced
  return getTemplateById('experienced_impact');
}

// Indonesian company database for context
export const INDONESIAN_COMPANIES_CONTEXT: Record<string, {
  industry: string;
  culture: string[];
  products: string[];
  suggestedTone: 'formal' | 'semi-formal' | 'casual';
}> = {
  'gojek': {
    industry: 'Tech/Startup',
    culture: ['ownership', 'move fast', 'customer obsessed', 'collaboration'],
    products: ['GoRide', 'GoCar', 'GoFood', 'GoPay', 'GoSend'],
    suggestedTone: 'casual'
  },
  'tokopedia': {
    industry: 'E-commerce/Tech',
    culture: ['customer first', 'growth mindset', 'build with purpose'],
    products: ['Marketplace', 'Digital Products', 'TokoMall'],
    suggestedTone: 'casual'
  },
  'shopee': {
    industry: 'E-commerce/Tech',
    culture: ['serve customers', 'run lean', 'stay humble'],
    products: ['Marketplace', 'ShopeePay', 'ShopeeFood'],
    suggestedTone: 'semi-formal'
  },
  'grab': {
    industry: 'Tech/Super App',
    culture: ['outserve', 'heart', 'honour', 'hunger'],
    products: ['GrabCar', 'GrabFood', 'GrabPay', 'GrabMart'],
    suggestedTone: 'semi-formal'
  },
  'traveloka': {
    industry: 'Travel Tech',
    culture: ['innovation', 'customer centricity', 'collaboration'],
    products: ['Flight', 'Hotel', 'Xperience', 'PayLater'],
    suggestedTone: 'semi-formal'
  },
  'bank bca': {
    industry: 'Banking',
    culture: ['integrity', 'customer focus', 'continuous improvement'],
    products: ['m-BCA', 'BCA mobile', 'Kartu Kredit'],
    suggestedTone: 'formal'
  },
  'bank mandiri': {
    industry: 'Banking',
    culture: ['trust', 'professionalism', 'customer service'],
    products: ['Livin by Mandiri', 'Mandiri Online'],
    suggestedTone: 'formal'
  },
  'telkom': {
    industry: 'Telecommunications/BUMN',
    culture: ['solid', 'speed', 'smart'],
    products: ['IndiHome', 'Telkomsel', 'digital solutions'],
    suggestedTone: 'formal'
  },
  'pertamina': {
    industry: 'Energy/BUMN',
    culture: ['clean', 'competitive', 'confident', 'customer focused', 'capable'],
    products: ['BBM', 'Pelumas', 'Non-BBM'],
    suggestedTone: 'formal'
  },
  'ruangguru': {
    industry: 'EdTech',
    culture: ['student first', 'growth', 'innovation'],
    products: ['Bimbel Online', 'Ruangbelajar', 'Skill Academy'],
    suggestedTone: 'casual'
  },
};

// Get company context
export function getCompanyContext(companyName: string): typeof INDONESIAN_COMPANIES_CONTEXT[string] | undefined {
  const normalizedName = companyName.toLowerCase();
  for (const [key, value] of Object.entries(INDONESIAN_COMPANIES_CONTEXT)) {
    if (normalizedName.includes(key)) {
      return value;
    }
  }
  return undefined;
}
