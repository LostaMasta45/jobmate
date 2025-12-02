"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SaveWAMessageData {
  // Message Details
  messageType: string;
  content: string;
  
  // Context
  position: string;
  companyName: string;
  hrdName?: string;
  hrdTitle?: string;
  hrdPhone?: string;
  jobSource?: string;
  referralName?: string;
  previousInteraction?: string;
  
  // Your Info
  currentRole?: string;
  yearsExperience?: number;
  topSkills?: string[];
  specificReason?: string;
  recentAchievement?: string;
  availability?: string;
  
  // Metadata
  toneStyle?: string;
  personality?: string;
  messageLength?: string;
  useEmoji?: boolean;
  
  // Preferences
  includeGreeting?: boolean;
  includeIntro?: boolean;
  includeCallToAction?: boolean;
  attachmentMention?: boolean;
  
  // Analytics
  wordCount?: number;
  charCount?: number;
  
  // Usage
  templateId?: string;
  applicationId?: string;
  
  // Status
  status?: string;
  notes?: string;
  aiModel?: string;
}

export async function saveWAMessage(data: SaveWAMessageData) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "Unauthorized: Please login first" };
    }

    // Insert WA message
    const { data: message, error: insertError } = await supabase
      .from("wa_messages")
      .insert({
        user_id: user.id,
        message_type: data.messageType,
        content: data.content,
        position: data.position,
        company_name: data.companyName,
        hrd_name: data.hrdName,
        hrd_title: data.hrdTitle,
        hrd_phone: data.hrdPhone,
        job_source: data.jobSource,
        referral_name: data.referralName,
        previous_interaction: data.previousInteraction,
        applicant_current_role: data.currentRole,
        years_experience: data.yearsExperience,
        top_skills: data.topSkills,
        specific_reason: data.specificReason,
        recent_achievement: data.recentAchievement,
        availability: data.availability,
        tone_style: data.toneStyle || 'semi-formal',
        personality: data.personality || 'balanced',
        message_length: data.messageLength || 'medium',
        use_emoji: data.useEmoji || false,
        include_greeting: data.includeGreeting !== false,
        include_intro: data.includeIntro !== false,
        include_call_to_action: data.includeCallToAction !== false,
        attachment_mention: data.attachmentMention || false,
        word_count: data.wordCount,
        char_count: data.charCount,
        template_id: data.templateId,
        application_id: data.applicationId,
        status: data.status || 'draft',
        notes: data.notes,
        ai_model: data.aiModel || 'gpt-4o-mini',
        generation_count: 1,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error saving WA message:", insertError);
      return { error: insertError.message };
    }

    // 🆕 MONITORING: Log tool usage and send Telegram notification
    try {
      const { logToolUsageWithNotification } = await import("@/lib/telegram-monitoring");
      await logToolUsageWithNotification(
        "WhatsApp Generator",
        `${data.position} at ${data.companyName}`,
        { messageType: data.messageType, toneStyle: data.toneStyle }
      );
    } catch (monitorError) {
      console.error("[Monitoring] Failed to log WA generator usage:", monitorError);
    }

    revalidatePath("/tools/wa-generator");
    revalidatePath("/tools/wa-generator/history");
    
    return { data: message };
  } catch (error: any) {
    console.error("Error in saveWAMessage:", error);
    return { error: error.message || "Failed to save WhatsApp message" };
  }
}

export async function updateWAMessage(id: string, updates: Partial<SaveWAMessageData>) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    // Update message
    const { data: message, error: updateError } = await supabase
      .from("wa_messages")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user owns this message
      .select()
      .single();

    if (updateError) {
      console.error("Error updating WA message:", updateError);
      return { error: updateError.message };
    }

    revalidatePath("/tools/wa-generator");
    revalidatePath("/tools/wa-generator/history");
    
    return { data: message };
  } catch (error: any) {
    console.error("Error in updateWAMessage:", error);
    return { error: error.message || "Failed to update message" };
  }
}

export async function incrementCopyCount(id: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Unauthorized" };

    const { error } = await supabase.rpc('increment_wa_copy_count', { message_id: id });

    if (error) {
      // If RPC doesn't exist, fallback to manual increment
      const { data: message } = await supabase
        .from("wa_messages")
        .select('times_copied')
        .eq('id', id)
        .single();

      if (message) {
        await supabase
          .from("wa_messages")
          .update({ times_copied: (message.times_copied || 0) + 1 })
          .eq('id', id);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error incrementing copy count:", error);
    return { error: error.message };
  }
}

export async function markAsSent(id: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Unauthorized" };

    const { error } = await supabase
      .from("wa_messages")
      .update({
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/tools/wa-generator/history");
    return { success: true };
  } catch (error: any) {
    console.error("Error marking as sent:", error);
    return { error: error.message };
  }
}
