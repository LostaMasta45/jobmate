export interface CVData {
  name: string;
  email?: string;
  phone?: string;
  skills: string[];
  experiences: Experience[];
  education: Education[];
  certifications?: string[];
  career_gaps?: string[];
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  achievements: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface JobData {
  position: string;
  company: string;
  requirements: Requirement[];
  responsibilities: string[];
  qualifications?: Record<string, any>;
}

export interface Requirement {
  skill: string;
  category: 'required' | 'preferred';
  details?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'opening' | 'technical' | 'behavioral' | 'situational' | 'tricky' | 'closing';
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  tips: string[];
  // v3.3 simplified format (flat structure)
  basic_answer?: string;
  star_answer?: string;
  // Legacy format (for backward compatibility)
  answers?: {
    basic: string;
    better?: string;
    star?: {
      situation: string;
      task: string;
      action: string;
      result: string;
      full: string;
    };
  };
  red_flags?: string[];
}

export interface QuestionStats {
  opening: number;
  technical: number;
  behavioral: number;
  situational: number;
  tricky: number;
  closing: number;
  high_priority: number;
}

export interface InterviewPrepSession {
  id: string;
  user_id: string;
  cv_file_path?: string;
  cv_text?: string;
  job_poster_file_path?: string;
  job_poster_text?: string;
  cv_data: CVData;
  job_data: JobData;
  match_score: number;
  strengths: string[];
  gaps: string[];
  questions: InterviewQuestion[];
  question_stats: QuestionStats;
  high_priority_count: number;
  prepared_questions: string[];
  preparation_progress: number;
  last_prepared_at?: string;
  company_name: string;
  position: string;
  interview_date?: string;
  interview_type?: string;
  status: 'active' | 'completed' | 'archived';
  ai_model: string;
  generation_time_ms?: number;
  token_usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  created_at: string;
  updated_at: string;
}

export interface GenerateInterviewPrepParams {
  cvText: string;
  jobPosterText: string;
  cvFileName?: string;
  jobPosterFileName?: string;
}

export interface GenerateInterviewPrepResult {
  success: boolean;
  session?: InterviewPrepSession;
  error?: string;
}
