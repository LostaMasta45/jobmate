export type ApplicationStatus =
  | "pending"
  | "approved"
  | "rejected";

export type JobApplicationStatus =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Hired"
  | "Rejected";

export type UserRole = "user" | "admin";

export type InterviewType = "phone" | "video" | "onsite" | "other";

export type TemplateType = "cover_letter" | "email" | "wa_message";

export interface AccountApplication {
  id: string;
  full_name: string;
  username: string;
  email: string;
  whatsapp: string;
  proof_path: string;
  status: ApplicationStatus;
  rejection_reason?: string;
  encrypted_password?: string;
  telegram_chat_id?: string;
  telegram_link_code?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminSettings {
  id: number;
  telegram_bot_token?: string;
  telegram_admin_chat_id?: string;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  company: string;
  position: string;
  status: JobApplicationStatus;
  salary?: number;
  contact?: string;
  source?: string;
  apply_date: string;
  notes?: string;
  poster_path?: string;
  next_action_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  content: ResumeContent;
  ats_score?: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResumeContent {
  personal?: {
    name: string;
    email: string;
    phone: string;
    location?: string;
    summary?: string;
  };
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    start_date: string;
    end_date?: string;
    gpa?: string;
  }>;
  experience?: Array<{
    company: string;
    position: string;
    start_date: string;
    end_date?: string;
    description: string;
    achievements?: string[];
  }>;
  skills?: string[];
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies?: string[];
    link?: string;
  }>;
}

export interface Template {
  id: string;
  user_id: string;
  type: TemplateType;
  title: string;
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  action: string;
  input_files: string[];
  output_path?: string;
  status: string;
  created_at: string;
}

export interface Interview {
  id: string;
  application_id: string;
  scheduled_at: string;
  type: InterviewType;
  notes?: string;
  result?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total: number;
  in_progress: number;
  accepted: number;
  rejected: number;
}

export interface PipelineSnapshot {
  Applied: number;
  Screening: number;
  Interview: number;
  Offer: number;
  Hired: number;
  Rejected: number;
}

export interface UpcomingItem {
  type: "interview" | "followup";
  date: string;
  company: string;
  role: string;
  link?: string;
}
