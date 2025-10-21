// Follow-up System Types & Interfaces

export type ReminderType =
  | 'first_followup'
  | 'second_followup'
  | 'third_followup'
  | 'pre_interview'
  | 'post_interview_thankyou'
  | 'post_interview_followup'
  | 'offer_response'
  | 'custom';

export type ReminderStatus = 
  | 'pending'
  | 'due'
  | 'completed'
  | 'dismissed'
  | 'cancelled';

export type FollowUpChannel = 
  | 'email'
  | 'whatsapp'
  | 'linkedin'
  | 'phone';

export type FollowUpActionType =
  | 'reminder_created'
  | 'reminder_completed'
  | 'reminder_dismissed'
  | 'reminder_snoozed'
  | 'reminder_cancelled'
  | 'followup_sent'
  | 'response_received';

export interface FollowUpReminder {
  id: string;
  user_id: string;
  application_id: string;
  
  // Reminder Details
  reminder_type: ReminderType;
  scheduled_date: string; // Date string
  scheduled_time: string; // Time string
  
  // Status
  status: ReminderStatus;
  
  // Channel
  preferred_channel: FollowUpChannel;
  
  // Tracking
  completed_at?: string;
  completed_channel?: FollowUpChannel;
  dismissed_at?: string;
  dismissed_reason?: string;
  
  // Snooze
  snoozed_until?: string;
  snooze_count: number;
  
  // Content
  custom_message?: string;
  template_used?: string;
  notes?: string;
  
  // Metadata
  notification_sent: boolean;
  notification_sent_at?: string;
  auto_created: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface FollowUpReminderWithApplication extends FollowUpReminder {
  application: {
    id: string;
    company: string;
    position: string;
    status: string;
    created_at: string;
  };
}

export interface FollowUpTemplate {
  id: string;
  user_id?: string;
  
  name: string;
  description?: string;
  template_type: ReminderType | 'status_inquiry';
  channel: FollowUpChannel;
  
  subject_line?: string; // For email
  message_body: string;
  
  is_system: boolean;
  is_default: boolean;
  
  usage_count: number;
  last_used_at?: string;
  
  created_at: string;
  updated_at: string;
}

export interface FollowUpHistory {
  id: string;
  user_id: string;
  application_id: string;
  reminder_id?: string;
  
  action_type: FollowUpActionType;
  channel_used?: FollowUpChannel;
  message_sent?: string;
  
  got_response: boolean;
  response_time_days?: number;
  status_changed_to?: string;
  
  notes?: string;
  created_at: string;
}

export interface FollowUpAnalytics {
  user_id: string;
  total_completed: number;
  total_dismissed: number;
  total_cancelled: number;
  total_pending: number;
  
  got_response_count: number;
  avg_response_time_days: number;
  
  email_count: number;
  whatsapp_count: number;
  linkedin_count: number;
  
  first_followup_count: number;
  second_followup_count: number;
  third_followup_count: number;
}

// Template Variables
export interface TemplateVariables {
  company: string;
  position: string;
  applied_date: string;
  hrd_name: string;
  hrd_email?: string;
  hrd_phone?: string;
  your_name: string;
  your_email: string;
  your_phone: string;
  experience_years?: string;
  skills?: string;
  recent_achievement?: string;
  interviewer_name?: string;
  specific_topic_discussed?: string;
  relevant_skills?: string;
  specific_area_mentioned?: string;
}

// Action Payloads
export interface CreateReminderPayload {
  application_id: string;
  reminder_type: ReminderType;
  scheduled_date: string;
  scheduled_time?: string;
  preferred_channel?: FollowUpChannel;
  custom_message?: string;
  notes?: string;
}

export interface UpdateReminderPayload {
  status?: ReminderStatus;
  scheduled_date?: string;
  scheduled_time?: string;
  preferred_channel?: FollowUpChannel;
  custom_message?: string;
  notes?: string;
  snoozed_until?: string;
  completed_channel?: FollowUpChannel;
  dismissed_reason?: string;
}

export interface CompleteReminderPayload {
  reminder_id: string;
  channel_used: FollowUpChannel;
  message_sent?: string;
  notes?: string;
}

export interface SnoozeReminderPayload {
  reminder_id: string;
  snooze_days: number;
  reason?: string;
}

// Filter & Query Options
export interface FollowUpFilters {
  status?: ReminderStatus | ReminderStatus[];
  reminder_type?: ReminderType;
  scheduled_date_from?: string;
  scheduled_date_to?: string;
  application_id?: string;
}

export interface FollowUpStats {
  due_today: number;
  due_this_week: number;
  overdue: number;
  completed_this_month: number;
  response_rate: number; // percentage
  avg_response_time: number; // days
  most_effective_channel: FollowUpChannel;
  best_follow_up_day: string; // day of week
}

// UI Component Props
export interface FollowUpBadgeProps {
  application_id: string;
  count: number;
  status: ReminderStatus;
  next_due_date?: string;
}

export interface FollowUpCardProps {
  reminder: FollowUpReminderWithApplication;
  onComplete: (reminder_id: string, channel: FollowUpChannel) => void;
  onSnooze: (reminder_id: string, days: number) => void;
  onDismiss: (reminder_id: string, reason?: string) => void;
  onViewTemplate: (reminder_id: string) => void;
}

export interface TemplateEditorProps {
  template?: FollowUpTemplate;
  variables: TemplateVariables;
  onSave: (template: Partial<FollowUpTemplate>) => void;
  onCancel: () => void;
}

// Notification Payload
export interface FollowUpNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  reminder_id: string;
  application_id: string;
  action_url: string;
  created_at: string;
  read: boolean;
}

// Helper Types
export type ReminderTypeLabel = {
  [K in ReminderType]: {
    label: string;
    description: string;
    icon: string;
    defaultDays: number;
  };
};

export type ChannelConfig = {
  [K in FollowUpChannel]: {
    label: string;
    icon: string;
    color: string;
    supportsSubject: boolean;
  };
};
