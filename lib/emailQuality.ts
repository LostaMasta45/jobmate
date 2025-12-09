// Email Quality Scoring System - Phase 2
// Analyzes email content and provides actionable feedback

export interface EmailQualityScore {
  overall: number; // 0-100
  breakdown: {
    personalization: number;
    clarity: number;
    engagement: number;
    professionalism: number;
    callToAction: number;
  };
  suggestions: string[];
  warnings: string[];
  strengths: string[];
}

export interface EmailContext {
  companyName: string;
  position: string;
  yourName: string;
  toneStyle: string;
  emailType: string;
  hasSkills: boolean;
  hasAchievements: boolean;
}

// Generic/AI-sounding phrases to detect
const GENERIC_PHRASES_ID = [
  'saya menulis untuk',
  'dengan hormat saya bermaksud',
  'melalui surat ini',
  'bersama ini saya',
  'perkenalkan nama saya',
  'dengan ini saya mengajukan',
  'saya sangat tertarik',
  'saya sangat antusias',
  'pekerja keras',
  'cepat belajar',
  'team player',
  'detail oriented',
];

const GENERIC_PHRASES_EN = [
  'i am writing to express',
  'i am writing to apply',
  'i would like to apply',
  'i am reaching out',
  'i am excited to apply',
  'passionate about',
  'team player',
  'hard worker',
  'fast learner',
  'detail-oriented',
  'results-driven',
  'self-motivated',
];

// AI transition words that sound robotic
const AI_TRANSITIONS = [
  'furthermore',
  'moreover',
  'additionally',
  'in conclusion',
  'consequently',
  'thus',
  'hence',
  'therefore',
  'subsequently',
];

// Strong action verbs (good to have)
const STRONG_VERBS_ID = [
  'meningkatkan', 'mengembangkan', 'memimpin', 'menciptakan', 'mengoptimasi',
  'mengurangi', 'meluncurkan', 'mengelola', 'membangun', 'menghasilkan',
  'berhasil', 'achieve', 'lead', 'grow', 'reduce', 'launch', 'build',
];

const STRONG_VERBS_EN = [
  'increased', 'developed', 'led', 'created', 'optimized', 'reduced',
  'launched', 'managed', 'built', 'generated', 'achieved', 'delivered',
  'transformed', 'spearheaded', 'pioneered', 'streamlined',
];

// Detect language from email content
function detectLanguage(email: string): 'id' | 'en' {
  const idIndicators = ['saya', 'dengan', 'untuk', 'yang', 'ini', 'terima kasih', 'hormat'];
  const enIndicators = ['i am', 'the', 'with', 'for', 'this', 'thank you', 'regards'];
  
  const lowerEmail = email.toLowerCase();
  let idScore = 0;
  let enScore = 0;
  
  idIndicators.forEach(word => {
    if (lowerEmail.includes(word)) idScore++;
  });
  
  enIndicators.forEach(word => {
    if (lowerEmail.includes(word)) enScore++;
  });
  
  return idScore >= enScore ? 'id' : 'en';
}

// Main analysis function
export function analyzeEmailQuality(email: string, context: EmailContext): EmailQualityScore {
  const suggestions: string[] = [];
  const warnings: string[] = [];
  const strengths: string[] = [];
  
  const language = detectLanguage(email);
  const lowerEmail = email.toLowerCase();
  const words = email.split(/\s+/);
  const wordCount = words.length;
  const sentences = email.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let score = 100;
  
  // =========================================================================
  // 1. PERSONALIZATION SCORE (0-100)
  // =========================================================================
  let personalizationScore = 50; // Base score
  
  // Check if company name is mentioned
  if (email.toLowerCase().includes(context.companyName.toLowerCase())) {
    personalizationScore += 20;
    strengths.push('Menyebut nama perusahaan');
  } else {
    personalizationScore -= 20;
    warnings.push('Tidak menyebut nama perusahaan - email terasa generic');
  }
  
  // Check if position is mentioned
  if (email.toLowerCase().includes(context.position.toLowerCase())) {
    personalizationScore += 15;
  } else {
    personalizationScore -= 10;
    suggestions.push('Sebutkan posisi yang dilamar secara spesifik');
  }
  
  // Check for specific numbers/metrics
  const hasNumbers = /\d+%|\$\d+|\d+ tahun|\d+ bulan|\d+ orang|\d+x|\d+ juta|\d+ ribu/i.test(email);
  if (hasNumbers) {
    personalizationScore += 15;
    strengths.push('Menggunakan angka/metrics spesifik');
  } else {
    suggestions.push('Tambahkan angka/metrics untuk lebih credible (contoh: "meningkatkan 30%")');
  }
  
  personalizationScore = Math.max(0, Math.min(100, personalizationScore));
  
  // =========================================================================
  // 2. CLARITY SCORE (0-100)
  // =========================================================================
  let clarityScore = 70; // Base score
  
  // Check word count
  if (wordCount < 80) {
    clarityScore -= 15;
    suggestions.push('Email terlalu pendek - tambah detail relevan');
  } else if (wordCount > 400) {
    clarityScore -= 10;
    suggestions.push('Email terlalu panjang - pertimbangkan mempersingkat');
  } else if (wordCount >= 150 && wordCount <= 300) {
    clarityScore += 10;
    strengths.push('Panjang email ideal (150-300 kata)');
  }
  
  // Check paragraph structure
  const paragraphs = email.split(/\n\n+/).filter(p => p.trim().length > 0);
  if (paragraphs.length >= 3 && paragraphs.length <= 6) {
    clarityScore += 10;
  } else if (paragraphs.length < 3) {
    suggestions.push('Pisahkan menjadi beberapa paragraf untuk readability');
  }
  
  // Check for very long sentences (>40 words)
  const longSentences = sentences.filter(s => s.split(/\s+/).length > 40);
  if (longSentences.length > 0) {
    clarityScore -= 10;
    suggestions.push('Ada kalimat yang terlalu panjang - pecah menjadi beberapa kalimat');
  }
  
  clarityScore = Math.max(0, Math.min(100, clarityScore));
  
  // =========================================================================
  // 3. ENGAGEMENT SCORE (0-100)
  // =========================================================================
  let engagementScore = 50; // Base score
  
  // Check for strong opening (not generic)
  const genericPhrases = language === 'id' ? GENERIC_PHRASES_ID : GENERIC_PHRASES_EN;
  let genericCount = 0;
  genericPhrases.forEach(phrase => {
    if (lowerEmail.includes(phrase)) {
      genericCount++;
    }
  });
  
  if (genericCount === 0) {
    engagementScore += 25;
    strengths.push('Tidak menggunakan frasa klise/generic');
  } else if (genericCount >= 2) {
    engagementScore -= 20;
    warnings.push(`Ditemukan ${genericCount} frasa klise - ganti dengan yang lebih original`);
  } else {
    engagementScore -= 10;
    suggestions.push('Kurangi frasa generic seperti "passionate about" atau "team player"');
  }
  
  // Check for strong verbs
  const strongVerbs = language === 'id' ? STRONG_VERBS_ID : STRONG_VERBS_EN;
  let strongVerbCount = 0;
  strongVerbs.forEach(verb => {
    if (lowerEmail.includes(verb)) strongVerbCount++;
  });
  
  if (strongVerbCount >= 3) {
    engagementScore += 15;
    strengths.push('Menggunakan kata kerja aktif yang kuat');
  } else if (strongVerbCount === 0) {
    suggestions.push('Gunakan kata kerja aktif seperti "meningkatkan", "memimpin", "membangun"');
  }
  
  // Check for AI transition words
  let aiTransitionCount = 0;
  AI_TRANSITIONS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = email.match(regex);
    if (matches) aiTransitionCount += matches.length;
  });
  
  if (aiTransitionCount >= 3) {
    engagementScore -= 15;
    warnings.push('Terlalu banyak kata transisi formal (Furthermore, Moreover) - terasa seperti AI');
  } else if (aiTransitionCount === 0) {
    engagementScore += 10;
  }
  
  engagementScore = Math.max(0, Math.min(100, engagementScore));
  
  // =========================================================================
  // 4. PROFESSIONALISM SCORE (0-100)
  // =========================================================================
  let professionalismScore = 70; // Base score
  
  // Check for greeting
  const hasGreeting = /^(yth\.|halo|hai|dear|hi|hello|selamat)/i.test(email.trim());
  if (hasGreeting) {
    professionalismScore += 10;
  } else {
    warnings.push('Email tidak memiliki salam pembuka');
  }
  
  // Check for sign-off
  const hasSignoff = /(hormat saya|salam|terima kasih|best regards|sincerely|cheers|best)/i.test(email);
  if (hasSignoff) {
    professionalismScore += 10;
  } else {
    warnings.push('Email tidak memiliki salam penutup');
  }
  
  // Check for name at the end
  if (email.toLowerCase().includes(context.yourName.toLowerCase())) {
    professionalismScore += 10;
  }
  
  professionalismScore = Math.max(0, Math.min(100, professionalismScore));
  
  // =========================================================================
  // 5. CALL-TO-ACTION SCORE (0-100)
  // =========================================================================
  let ctaScore = 50; // Base score
  
  const ctaKeywords = [
    'interview', 'wawancara', 'call', 'meeting', 'discuss', 'diskusi',
    'chat', 'ngobrol', 'hubungi', 'contact', 'waktu', 'time', 'available',
    'tersedia', 'kesempatan', 'opportunity', 'bertemu', 'meet'
  ];
  
  let ctaCount = 0;
  ctaKeywords.forEach(kw => {
    if (lowerEmail.includes(kw)) ctaCount++;
  });
  
  if (ctaCount >= 2) {
    ctaScore = 100;
    strengths.push('Call-to-action yang jelas');
  } else if (ctaCount === 1) {
    ctaScore = 75;
  } else {
    ctaScore = 30;
    warnings.push('Tidak ada call-to-action yang jelas - tambahkan ajakan untuk interview/meeting');
  }
  
  // =========================================================================
  // CALCULATE OVERALL SCORE
  // =========================================================================
  const weights = {
    personalization: 0.25,
    clarity: 0.20,
    engagement: 0.25,
    professionalism: 0.15,
    callToAction: 0.15,
  };
  
  const overallScore = Math.round(
    personalizationScore * weights.personalization +
    clarityScore * weights.clarity +
    engagementScore * weights.engagement +
    professionalismScore * weights.professionalism +
    ctaScore * weights.callToAction
  );
  
  // =========================================================================
  // ADDITIONAL SUGGESTIONS BASED ON EMAIL TYPE
  // =========================================================================
  if (context.emailType === 'follow_up') {
    if (!lowerEmail.includes('follow') && !lowerEmail.includes('tindak lanjut') && !lowerEmail.includes('menanyakan')) {
      suggestions.push('Untuk follow-up, jelaskan kapan kamu mengirim lamaran sebelumnya');
    }
  }
  
  if (context.emailType === 'thank_you') {
    if (!lowerEmail.includes('terima kasih') && !lowerEmail.includes('thank')) {
      suggestions.push('Untuk thank you email, pastikan ucapan terima kasih ada di awal');
    }
  }
  
  // Sort suggestions by importance (warnings first)
  return {
    overall: overallScore,
    breakdown: {
      personalization: personalizationScore,
      clarity: clarityScore,
      engagement: engagementScore,
      professionalism: professionalismScore,
      callToAction: ctaScore,
    },
    suggestions: suggestions.slice(0, 5), // Max 5 suggestions
    warnings: warnings.slice(0, 3), // Max 3 warnings
    strengths: strengths.slice(0, 4), // Max 4 strengths
  };
}

// Get score color class
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-600';
}

// Get score badge variant
export function getScoreBadgeVariant(score: number): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (score >= 80) return 'default';
  if (score >= 60) return 'secondary';
  return 'destructive';
}

// Get score label
export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Great';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 50) return 'Needs Work';
  return 'Poor';
}
