"use server";

import { createClient } from "@/lib/supabase/server";
import { 
  FollowUpReminder, 
  FollowUpReminderWithApplication,
  FollowUpFilters,
  FollowUpStats 
} from "@/types/followup";

/**
 * Get all follow-up reminders for current user with optional filters
 */
export async function getFollowUpReminders(filters?: FollowUpFilters) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("[getFollowUpReminders] Auth error:", authError);
      return { error: "Unauthorized" };
    }

    console.log(`[getFollowUpReminders] User: ${user.email}, Filters:`, filters);

    let query = supabase
      .from("follow_up_reminders")
      .select(`
        *,
        application:applications (
          id,
          company,
          position,
          status,
          created_at
        )
      `)
      .eq("user_id", user.id)
      .order("scheduled_date", { ascending: true });

    // Apply filters only if provided
    if (filters) {
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query = query.in("status", filters.status);
        } else {
          query = query.eq("status", filters.status);
        }
      }

      if (filters.reminder_type) {
        query = query.eq("reminder_type", filters.reminder_type);
      }

      if (filters.scheduled_date_from) {
        query = query.gte("scheduled_date", filters.scheduled_date_from);
      }

      if (filters.scheduled_date_to) {
        query = query.lte("scheduled_date", filters.scheduled_date_to);
      }

      if (filters.application_id) {
        query = query.eq("application_id", filters.application_id);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("[getFollowUpReminders] Query error:", error);
      return { error: error.message };
    }

    console.log(`[getFollowUpReminders] Fetched ${data?.length || 0} reminders`);

    return { data: data as FollowUpReminderWithApplication[] };
  } catch (error: any) {
    console.error("[getFollowUpReminders] Fatal error:", error);
    return { error: error.message || "Failed to fetch reminders" };
  }
}

/**
 * Get follow-ups due today
 */
export async function getFollowUpsDueToday() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    return await getFollowUpReminders({
      status: ['pending', 'due'],
      scheduled_date_to: today
    });
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Get follow-ups for specific application
 */
export async function getApplicationFollowUps(application_id: string) {
  try {
    return await getFollowUpReminders({
      application_id,
      status: ['pending', 'due', 'completed']
    });
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Get follow-up statistics for current user
 */
export async function getFollowUpStats() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("[getFollowUpStats] Auth error:", authError);
      return { error: "Unauthorized" };
    }

    console.log("[getFollowUpStats] Fetching stats for user:", user.email);

    // Get all reminders for calculations
    const { data: reminders, error: remindersError } = await supabase
      .from("follow_up_reminders")
      .select("*")
      .eq("user_id", user.id);

    if (remindersError) {
      console.error("[getFollowUpStats] Reminders error:", remindersError);
      return { error: remindersError.message };
    }

    console.log("[getFollowUpStats] Found reminders:", reminders?.length || 0);

    // Get history for response rate (optional - table might not exist yet)
    const { data: history, error: historyError } = await supabase
      .from("follow_up_history")
      .select("*")
      .eq("user_id", user.id)
      .eq("action_type", "followup_sent");

    // Don't fail if history table doesn't exist - just use empty array
    if (historyError) {
      console.warn("[getFollowUpStats] History table error (might not exist):", historyError.message);
    }
    
    const historyData = history || [];

    const today = new Date().toISOString().split('T')[0];
    const oneWeekLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const due_today = reminders?.filter(r => 
      r.status === 'pending' && r.scheduled_date === today
    ).length || 0;
    
    const due_this_week = reminders?.filter(r => 
      r.status === 'pending' && r.scheduled_date >= today && r.scheduled_date <= oneWeekLater
    ).length || 0;
    
    const overdue = reminders?.filter(r => 
      r.status === 'pending' && r.scheduled_date < today
    ).length || 0;
    
    const completed_this_month = reminders?.filter(r => {
      if (!r.completed_at) return false;
      const completedDate = new Date(r.completed_at);
      const now = new Date();
      return r.status === 'completed' &&
             completedDate.getMonth() === now.getMonth() &&
             completedDate.getFullYear() === now.getFullYear();
    }).length || 0;

    const stats: FollowUpStats = {
      due_today,
      due_this_week,
      overdue,
      completed_this_month,
      response_rate: historyData && historyData.length > 0
        ? (historyData.filter(h => h.got_response).length / historyData.length) * 100
        : 0,
      avg_response_time: historyData && historyData.length > 0
        ? historyData
            .filter(h => h.response_time_days)
            .reduce((sum, h) => sum + (h.response_time_days || 0), 0) / 
          historyData.filter(h => h.response_time_days).length
        : 0,
      most_effective_channel: getMostEffectiveChannel(historyData),
      best_follow_up_day: getBestFollowUpDay(historyData)
    };

    console.log("[getFollowUpStats] Calculated stats:", stats);

    return { data: stats };
  } catch (error: any) {
    console.error("[getFollowUpStats] Fatal error:", error);
    return { error: error.message };
  }
}

// Helper functions
function getMostEffectiveChannel(history: any[]): 'email' | 'whatsapp' | 'linkedin' | 'phone' {
  const channelResponses: Record<string, number> = {};
  
  history.forEach(h => {
    if (h.got_response && h.channel_used) {
      channelResponses[h.channel_used] = (channelResponses[h.channel_used] || 0) + 1;
    }
  });
  
  const sortedChannels = Object.entries(channelResponses)
    .sort(([,a], [,b]) => b - a);
  
  return (sortedChannels[0]?.[0] as any) || 'email';
}

function getBestFollowUpDay(history: any[]): string {
  const dayResponses: Record<string, number> = {};
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  history.forEach(h => {
    if (h.got_response && h.created_at) {
      const day = days[new Date(h.created_at).getDay()];
      dayResponses[day] = (dayResponses[day] || 0) + 1;
    }
  });
  
  const sortedDays = Object.entries(dayResponses)
    .sort(([,a], [,b]) => b - a);
  
  return sortedDays[0]?.[0] || 'Wednesday';
}

/**
 * Get count of pending follow-ups for dashboard badge
 */
export async function getPendingFollowUpCount() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const today = new Date().toISOString().split('T')[0];

    const { count, error } = await supabase
      .from("follow_up_reminders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "pending")
      .lte("scheduled_date", today);

    if (error) {
      return { error: error.message };
    }

    return { data: count || 0 };
  } catch (error: any) {
    return { error: error.message };
  }
}
