"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  CreateReminderPayload,
  UpdateReminderPayload,
  CompleteReminderPayload,
  SnoozeReminderPayload,
  FollowUpChannel
} from "@/types/followup";

/**
 * Create a new follow-up reminder
 */
export async function createFollowUpReminder(payload: CreateReminderPayload) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const { data: reminder, error } = await supabase
      .from("follow_up_reminders")
      .insert({
        user_id: user.id,
        application_id: payload.application_id,
        reminder_type: payload.reminder_type,
        scheduled_date: payload.scheduled_date,
        scheduled_time: payload.scheduled_time || '09:00:00',
        preferred_channel: payload.preferred_channel || 'email',
        custom_message: payload.custom_message,
        notes: payload.notes,
        auto_created: false
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating follow-up reminder:", error);
      return { error: error.message };
    }

    // Log to history
    await supabase.from("follow_up_history").insert({
      user_id: user.id,
      application_id: payload.application_id,
      reminder_id: reminder.id,
      action_type: 'reminder_created'
    });

    revalidatePath("/tools/tracker");
    return { data: reminder };
  } catch (error: any) {
    console.error("Error in createFollowUpReminder:", error);
    return { error: error.message || "Failed to create reminder" };
  }
}

/**
 * Update follow-up reminder
 */
export async function updateFollowUpReminder(
  reminder_id: string,
  payload: UpdateReminderPayload
) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const { data: reminder, error } = await supabase
      .from("follow_up_reminders")
      .update(payload)
      .eq("id", reminder_id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating follow-up reminder:", error);
      return { error: error.message };
    }

    revalidatePath("/tools/tracker");
    return { data: reminder };
  } catch (error: any) {
    console.error("Error in updateFollowUpReminder:", error);
    return { error: error.message || "Failed to update reminder" };
  }
}

/**
 * Complete follow-up reminder (mark as done)
 */
export async function completeFollowUpReminder(payload: CompleteReminderPayload) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    // Get reminder first
    const { data: reminder, error: getError } = await supabase
      .from("follow_up_reminders")
      .select("*, application:applications(*)")
      .eq("id", payload.reminder_id)
      .eq("user_id", user.id)
      .single();

    if (getError || !reminder) {
      return { error: "Reminder not found" };
    }

    // Update reminder status
    const { data: updated, error: updateError } = await supabase
      .from("follow_up_reminders")
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        completed_channel: payload.channel_used
      })
      .eq("id", payload.reminder_id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      return { error: updateError.message };
    }

    // Update application followup_count
    await supabase
      .from("applications")
      .update({
        followup_count: (reminder.application as any).followup_count + 1,
        last_followup_date: new Date().toISOString().split('T')[0]
      })
      .eq("id", reminder.application_id);

    // Log to history
    await supabase.from("follow_up_history").insert({
      user_id: user.id,
      application_id: reminder.application_id,
      reminder_id: payload.reminder_id,
      action_type: 'followup_sent',
      channel_used: payload.channel_used,
      message_sent: payload.message_sent,
      notes: payload.notes
    });

    revalidatePath("/tools/tracker");
    return { data: updated };
  } catch (error: any) {
    console.error("Error in completeFollowUpReminder:", error);
    return { error: error.message || "Failed to complete reminder" };
  }
}

/**
 * Snooze follow-up reminder
 */
export async function snoozeFollowUpReminder(payload: SnoozeReminderPayload) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    // Get current reminder
    const { data: reminder, error: getError } = await supabase
      .from("follow_up_reminders")
      .select("*")
      .eq("id", payload.reminder_id)
      .eq("user_id", user.id)
      .single();

    if (getError || !reminder) {
      return { error: "Reminder not found" };
    }

    const snoozeDate = new Date();
    snoozeDate.setDate(snoozeDate.getDate() + payload.snooze_days);

    const { data: updated, error: updateError } = await supabase
      .from("follow_up_reminders")
      .update({
        status: 'dismissed',
        snoozed_until: snoozeDate.toISOString().split('T')[0],
        snooze_count: reminder.snooze_count + 1,
        dismissed_at: new Date().toISOString(),
        dismissed_reason: payload.reason || `Snoozed for ${payload.snooze_days} days`
      })
      .eq("id", payload.reminder_id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      return { error: updateError.message };
    }

    // Log to history
    await supabase.from("follow_up_history").insert({
      user_id: user.id,
      application_id: reminder.application_id,
      reminder_id: payload.reminder_id,
      action_type: 'reminder_snoozed',
      notes: `Snoozed until ${snoozeDate.toISOString().split('T')[0]}`
    });

    revalidatePath("/tools/tracker");
    return { data: updated };
  } catch (error: any) {
    console.error("Error in snoozeFollowUpReminder:", error);
    return { error: error.message || "Failed to snooze reminder" };
  }
}

/**
 * Dismiss follow-up reminder (permanently)
 */
export async function dismissFollowUpReminder(reminder_id: string, reason?: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    // Get reminder
    const { data: reminder, error: getError } = await supabase
      .from("follow_up_reminders")
      .select("*")
      .eq("id", reminder_id)
      .eq("user_id", user.id)
      .single();

    if (getError || !reminder) {
      return { error: "Reminder not found" };
    }

    const { data: updated, error: updateError } = await supabase
      .from("follow_up_reminders")
      .update({
        status: 'dismissed',
        dismissed_at: new Date().toISOString(),
        dismissed_reason: reason || 'Dismissed by user'
      })
      .eq("id", reminder_id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      return { error: updateError.message };
    }

    // Log to history
    await supabase.from("follow_up_history").insert({
      user_id: user.id,
      application_id: reminder.application_id,
      reminder_id: reminder_id,
      action_type: 'reminder_dismissed',
      notes: reason
    });

    revalidatePath("/tools/tracker");
    return { data: updated };
  } catch (error: any) {
    console.error("Error in dismissFollowUpReminder:", error);
    return { error: error.message || "Failed to dismiss reminder" };
  }
}

/**
 * Delete follow-up reminder
 */
export async function deleteFollowUpReminder(reminder_id: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("follow_up_reminders")
      .delete()
      .eq("id", reminder_id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting follow-up reminder:", error);
      return { error: error.message };
    }

    revalidatePath("/tools/tracker");
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteFollowUpReminder:", error);
    return { error: error.message || "Failed to delete reminder" };
  }
}

/**
 * Mark response received for a follow-up
 */
export async function markFollowUpResponseReceived(
  reminder_id: string,
  status_changed_to?: string
) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    // Get reminder
    const { data: reminder, error: getError } = await supabase
      .from("follow_up_reminders")
      .select("*")
      .eq("id", reminder_id)
      .eq("user_id", user.id)
      .single();

    if (getError || !reminder) {
      return { error: "Reminder not found" };
    }

    // Calculate response time
    const completedDate = new Date(reminder.completed_at || Date.now());
    const scheduledDate = new Date(reminder.scheduled_date);
    const responseDays = Math.floor(
      (completedDate.getTime() - scheduledDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Update application
    await supabase
      .from("applications")
      .update({
        followup_response_received: true
      })
      .eq("id", reminder.application_id);

    // Log to history
    await supabase.from("follow_up_history").insert({
      user_id: user.id,
      application_id: reminder.application_id,
      reminder_id: reminder_id,
      action_type: 'response_received',
      got_response: true,
      response_time_days: responseDays,
      status_changed_to: status_changed_to
    });

    revalidatePath("/tools/tracker");
    return { success: true };
  } catch (error: any) {
    console.error("Error in markFollowUpResponseReceived:", error);
    return { error: error.message || "Failed to mark response" };
  }
}
