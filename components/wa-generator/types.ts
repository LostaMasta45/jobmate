/**
 * WA Generator V2 - Types
 */

export type WAMessageType =
    | 'application'
    | 'follow_up'
    | 'interview_confirmation'
    | 'thank_you'
    | 'status_inquiry'
    | 're_application'
    | 'referral';

// Experience levels for adaptive prompting
export type WAExperienceLevel =
    | 'fresh_graduate'
    | 'student'
    | 'career_changer'
    | 'first_job'
    | '1_2_years'
    | '3_5_years'
    | '5_plus_years';

// Strength options for fresh graduates
export type WAStrengthHighlight =
    | 'ipk_tinggi'
    | 'aktif_organisasi'
    | 'project_portfolio'
    | 'sertifikasi'
    | 'magang'
    | 'juara_kompetisi'
    | 'volunteer'
    | 'skill_autodidak';

// Why this company options
export type WAWhyCompanyReason =
    | 'tertarik_produk'
    | 'culture_cocok'
    | 'opportunity_belajar'
    | 'industry_diminati'
    | 'ada_kenalan'
    | 'other';

// Helper to get experience level labels
export const EXPERIENCE_LEVEL_LABELS: Record<WAExperienceLevel, string> = {
    fresh_graduate: '🎓 Fresh Graduate (baru lulus)',
    student: '📚 Masih Kuliah/Magang',
    career_changer: '🔄 Career Changer (pindah bidang)',
    first_job: '👶 First Job (pertama kerja)',
    '1_2_years': '💼 1-2 Tahun Pengalaman',
    '3_5_years': '🚀 3-5 Tahun Pengalaman',
    '5_plus_years': '⭐ 5+ Tahun Pengalaman',
};

// Helper to get strength labels
export const STRENGTH_LABELS: Record<WAStrengthHighlight, string> = {
    ipk_tinggi: 'IPK Tinggi (>3.5)',
    aktif_organisasi: 'Aktif Organisasi',
    project_portfolio: 'Project/Portfolio',
    sertifikasi: 'Sertifikasi',
    magang: 'Magang/Internship',
    juara_kompetisi: 'Juara Kompetisi',
    volunteer: 'Volunteer/Sosial',
    skill_autodidak: 'Skill Teknis Autodidak',
};

// Helper to get why company labels  
export const WHY_COMPANY_LABELS: Record<WAWhyCompanyReason, string> = {
    tertarik_produk: 'Tertarik dengan produk/layanan mereka',
    culture_cocok: 'Company culture yang cocok',
    opportunity_belajar: 'Opportunity untuk belajar/grow',
    industry_diminati: 'Industry yang diminati',
    ada_kenalan: 'Ada teman/kenalan di sana',
    other: 'Lainnya',
};

// Base form data shared across all message types
export interface WAFormDataBase {
    yourName: string;
    position: string;
    companyName: string;
    hrdName?: string;
    hrdPhone?: string;
    toneStyle: 'formal' | 'semi-formal' | 'friendly' | 'enthusiastic';
    personality: 'confident' | 'humble' | 'balanced';
    useEmoji: boolean;
    messageLength: 'short' | 'medium' | 'long';
    includeGreeting: boolean;
    includeCallToAction: boolean;
}

// Application form data (enhanced for adaptive prompting)
export interface WAApplicationFormData extends WAFormDataBase {
    // Experience info
    experienceLevel?: WAExperienceLevel;
    strengthHighlights?: WAStrengthHighlight[];

    // Job source
    jobSource?: string;
    referralName?: string;

    // Background
    currentRole?: string;
    yearsExperience?: number;
    topSkills?: string[];

    // Personalization
    whyCompanyReason?: WAWhyCompanyReason;
    whyCompanyDetail?: string;
    specificReason?: string; // legacy, maps from whyCompanyDetail
    recentAchievement?: string;

    // For fresh graduates
    relevantProject?: string;
    relevantOrganization?: string;

    attachmentMention: boolean;
}

// Follow-up form data
export interface WAFollowUpFormData extends WAFormDataBase {
    applicationDate?: string;
    previousInteraction?: string;
    newUpdate?: string;
}

// Interview confirmation form data
export interface WAConfirmationFormData extends WAFormDataBase {
    interviewDate?: string;
    interviewTime?: string;
    interviewLocation?: string;
    interviewType?: 'online' | 'offline';
    platformOrAddress?: string;
}

// Thank you form data
export interface WAThankYouFormData extends WAFormDataBase {
    interviewDate?: string;
    memorableMoment?: string;
    specificTakeaway?: string;
    continuedInterest?: string;
}

// Status inquiry form data
export interface WAStatusInquiryFormData extends WAFormDataBase {
    interviewDate?: string;
    previousInteraction?: string;
    daysWaiting?: number;
}

// Re-application form data
export interface WAReApplicationFormData extends WAFormDataBase {
    previousApplicationDate?: string;
    previousContext?: string;
    newSkills?: string[];
    newAchievements?: string;
    whyNow?: string;
}

// Referral form data
export interface WAReferralFormData extends WAFormDataBase {
    referrerName: string;
    referrerRelation?: string;
    referrerContext?: string;
    currentRole?: string;
    topSkills?: string[];
}

// Generated message result
export interface WAGeneratedMessage {
    content: string;
    wordCount: number;
    charCount: number;
}

// Stats for homepage
export interface WAStats {
    application: number;
    follow_up: number;
    interview_confirmation: number;
    thank_you: number;
    status_inquiry: number;
    re_application: number;
    referral: number;
    total: number;
}

