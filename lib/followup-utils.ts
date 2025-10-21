import { ReminderType, FollowUpChannel, ReminderTypeLabel, ChannelConfig, TemplateVariables } from "@/types/followup";

/**
 * Reminder Type Configuration
 */
export const REMINDER_TYPE_CONFIG: ReminderTypeLabel = {
  first_followup: {
    label: "First Follow-up",
    description: "3 days after applying",
    icon: "📧",
    defaultDays: 3
  },
  second_followup: {
    label: "Second Follow-up",
    description: "1 week after applying",
    icon: "🔄",
    defaultDays: 7
  },
  third_followup: {
    label: "Final Follow-up",
    description: "2 weeks after applying",
    icon: "📨",
    defaultDays: 14
  },
  pre_interview: {
    label: "Pre-Interview Reminder",
    description: "Day before interview",
    icon: "📋",
    defaultDays: -1
  },
  post_interview_thankyou: {
    label: "Thank You Note",
    description: "After interview",
    icon: "🙏",
    defaultDays: 0
  },
  post_interview_followup: {
    label: "Post-Interview Follow-up",
    description: "3 days after interview",
    icon: "✉️",
    defaultDays: 3
  },
  offer_response: {
    label: "Offer Response",
    description: "Deadline to respond to offer",
    icon: "💼",
    defaultDays: 5
  },
  custom: {
    label: "Custom Reminder",
    description: "User-defined",
    icon: "⭐",
    defaultDays: 1
  }
};

/**
 * Channel Configuration
 */
export const CHANNEL_CONFIG: ChannelConfig = {
  email: {
    label: "Email",
    icon: "📧",
    color: "blue",
    supportsSubject: true
  },
  whatsapp: {
    label: "WhatsApp",
    icon: "💬",
    color: "green",
    supportsSubject: false
  },
  linkedin: {
    label: "LinkedIn",
    icon: "🔗",
    color: "indigo",
    supportsSubject: false
  },
  phone: {
    label: "Phone Call",
    icon: "📞",
    color: "purple",
    supportsSubject: false
  }
};

/**
 * Format date for display
 */
export function formatFollowUpDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time parts for comparison
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return "Today";
  } else if (date.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  } else if (date.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  // Format: "Jan 15" or "Jan 15, 2024" if not current year
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric"
  };
  
  if (date.getFullYear() !== today.getFullYear()) {
    options.year = "numeric";
  }

  return date.toLocaleDateString("en-US", options);
}

/**
 * Get relative time string
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    if (absDays === 0) return "Today";
    if (absDays === 1) return "1 day overdue";
    return `${absDays} days overdue`;
  } else if (diffDays === 0) {
    return "Due today";
  } else if (diffDays === 1) {
    return "Due tomorrow";
  } else if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  } else {
    return `Due in ${Math.floor(diffDays / 7)} weeks`;
  }
}

/**
 * Check if reminder is overdue
 */
export function isOverdue(scheduledDate: string): boolean {
  const date = new Date(scheduledDate);
  const today = new Date();
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Check if reminder is due today
 */
export function isDueToday(scheduledDate: string): boolean {
  const date = new Date(scheduledDate);
  const today = new Date();
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return date.getTime() === today.getTime();
}

/**
 * Calculate next follow-up date
 */
export function calculateNextFollowUpDate(
  baseDate: Date,
  reminderType: ReminderType
): Date {
  const config = REMINDER_TYPE_CONFIG[reminderType];
  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + config.defaultDays);
  
  // Skip weekends
  const dayOfWeek = nextDate.getDay();
  if (dayOfWeek === 0) { // Sunday -> Monday
    nextDate.setDate(nextDate.getDate() + 1);
  } else if (dayOfWeek === 6) { // Saturday -> Monday
    nextDate.setDate(nextDate.getDate() + 2);
  }
  
  return nextDate;
}

/**
 * Get status badge color
 */
export function getStatusBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    due: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    dismissed: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
  };
  return colors[status] || colors.pending;
}

/**
 * Get channel badge color
 */
export function getChannelBadgeColor(channel: FollowUpChannel): string {
  const config = CHANNEL_CONFIG[channel];
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    green: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
  };
  return colors[config.color] || colors.blue;
}

/**
 * Format response rate percentage
 */
export function formatResponseRate(rate: number): string {
  return `${Math.round(rate)}%`;
}

/**
 * Format average response time
 */
export function formatAvgResponseTime(days: number): string {
  if (days < 1) return "< 1 day";
  if (days === 1) return "1 day";
  if (days < 7) return `${Math.round(days)} days`;
  const weeks = Math.round(days / 7);
  return weeks === 1 ? "1 week" : `${weeks} weeks`;
}

/**
 * Get priority level based on due date
 */
export function getReminderPriority(scheduledDate: string): "high" | "medium" | "low" {
  const date = new Date(scheduledDate);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "high"; // Overdue
  if (diffDays === 0) return "high"; // Due today
  if (diffDays <= 2) return "medium"; // Due in 1-2 days
  return "low"; // Due later
}

/**
 * Generate WhatsApp link with pre-filled message
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  // Remove non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Generate mailto link
 */
export function generateMailtoLink(email: string, subject: string, body: string): string {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
}

/**
 * Generate LinkedIn message URL
 */
export function generateLinkedInMessageUrl(profileUrl?: string): string {
  if (profileUrl) {
    return `${profileUrl}/detail/contact-info/`;
  }
  return "https://www.linkedin.com/messaging/";
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format
 */
export function isValidPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}

/**
 * Get snooze options
 */
export const SNOOZE_OPTIONS = [
  { label: "2 days", days: 2 },
  { label: "3 days", days: 3 },
  { label: "1 week", days: 7 },
  { label: "2 weeks", days: 14 }
];

/**
 * Get best time recommendations
 */
export const BEST_TIME_RECOMMENDATIONS = {
  email: "9-11 AM on Tuesday-Thursday",
  whatsapp: "10 AM - 4 PM on weekdays",
  linkedin: "8-10 AM or 5-7 PM on weekdays",
  phone: "10 AM - 12 PM or 2-4 PM on weekdays"
};

/**
 * Replace template variables with actual values
 */
export function fillTemplateVariables(template: string, variables: Partial<TemplateVariables>): string {
  let filled = template;
  
  const replacements: Record<string, string> = {
    '{company}': variables.company || '[Company Name]',
    '{position}': variables.position || '[Position]',
    '{applied_date}': variables.applied_date || '[Date]',
    '{hrd_name}': variables.hrd_name || '[HRD Name]',
    '{your_name}': variables.your_name || '[Your Name]',
    '{your_email}': variables.your_email || '[Your Email]',
    '{your_phone}': variables.your_phone || '[Your Phone]',
    '{experience_years}': variables.experience_years || '[X]',
    '{skills}': variables.skills || '[Your Skills]',
    '{recent_achievement}': variables.recent_achievement || '[Recent Achievement]',
    '{interviewer_name}': variables.interviewer_name || '[Interviewer Name]',
    '{specific_topic_discussed}': variables.specific_topic_discussed || '[Topic]',
    '{relevant_skills}': variables.relevant_skills || '[Skills]',
    '{specific_area_mentioned}': variables.specific_area_mentioned || '[Area]',
  };

  Object.entries(replacements).forEach(([key, value]) => {
    filled = filled.replace(new RegExp(key, 'g'), value);
  });

  return filled;
}
