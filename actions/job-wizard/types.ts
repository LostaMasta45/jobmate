export interface WizardProgress {
    id: string;
    user_id: string;
    started_at: string;
    current_day: number;
    self_assessment: SelfAssessment;
    profile_data: ProfileData;
    streak: number;
    last_active_at: string;
    status: 'active' | 'completed' | 'paused';
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface WizardDay {
    id: string;
    wizard_id: string;
    day_number: number;
    company_name: string;
    position: string;
    job_source: string;
    send_method: 'email' | 'whatsapp' | 'portal' | 'other';
    checklist: DayChecklist;
    follow_up_done: boolean;
    notes: string;
    completed: boolean;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface DayChecklist {
    target: boolean;
    surat_lamaran: boolean;
    email_wa: boolean;
    pdf_merge: boolean;
    kirim: boolean;
    tracker: boolean;
}

export interface ProfileData {
    full_name?: string;
    skills?: string[];
    experience?: string;
    education?: string;
    target_industry?: string;
}

export interface SelfAssessment {
    recommended_positions?: string[];
    strengths?: string[];
    gaps?: string[];
    summary?: string;
}

export type ChecklistKey = keyof DayChecklist;

export const CHECKLIST_STEPS: { key: ChecklistKey; label: string; description: string; toolHref?: string; icon: string }[] = [
    { key: 'target', label: 'Isi Target Perusahaan', description: 'Tentukan perusahaan dan posisi yang dilamar', icon: '🎯' },
    { key: 'surat_lamaran', label: 'Buat Surat Lamaran', description: 'Custom untuk perusahaan ini', toolHref: '/surat-lamaran-sederhana', icon: '✉️' },
    { key: 'email_wa', label: 'Generate Email / WA', description: 'Siapkan pesan untuk mengirim lamaran', icon: '📧' },
    { key: 'pdf_merge', label: 'Gabung PDF', description: 'CV + Surat Lamaran jadi 1 file', toolHref: '/tools/pdf-tools', icon: '📑' },
    { key: 'kirim', label: 'Kirim Lamaran', description: 'Kirim ke perusahaan target', icon: '🚀' },
    { key: 'tracker', label: 'Catat di Tracker', description: 'Log lamaran untuk follow-up nanti', toolHref: '/tools/tracker', icon: '📋' },
];

export const DEFAULT_CHECKLIST: DayChecklist = {
    target: false,
    surat_lamaran: false,
    email_wa: false,
    pdf_merge: false,
    kirim: false,
    tracker: false,
};
