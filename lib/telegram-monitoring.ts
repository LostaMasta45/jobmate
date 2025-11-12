/**
 * Telegram Bot Monitoring Utilities
 * Helper functions untuk tracking dan monitoring
 */

import { createClient } from "@/lib/supabase/server";
import { notifyToolUsage } from "@/lib/telegram";

/**
 * Log tool usage dan kirim notifikasi ke admin via Telegram
 * @param toolName Nama tool yang digunakan (misal: "CV ATS Generator", "Cover Letter")
 * @param documentTitle Judul dokumen yang di-generate (optional)
 * @param metadata Additional data (optional)
 */
export async function logToolUsageWithNotification(
  toolName: string,
  documentTitle?: string,
  metadata?: Record<string, any>
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.warn("[Monitoring] No user found, skipping tracking");
      return false;
    }

    // Get user profile dengan membership info
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, membership, membership_status")
      .eq("id", user.id)
      .single();

    if (!profile) {
      console.warn("[Monitoring] User profile not found");
      return false;
    }

    const membershipType = profile.membership || 'free';

    // Log to usage_logs table
    const { error: logError } = await supabase
      .from("usage_logs")
      .insert({
        user_id: user.id,
        tool_name: toolName,
        action: "generate",
        document_title: documentTitle,
        membership_type: membershipType,
        telegram_notified: false, // Will be updated after notification sent
        metadata: metadata || {}
      });

    if (logError) {
      console.error("[Monitoring] Failed to log usage:", logError);
      // Don't return false, continue with notification
    }

    // Get usage stats untuk hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: totalCount } = await supabase
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    const { count: sameToolCount } = await supabase
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("tool_name", toolName)
      .gte("created_at", today.toISOString());

    // Check quota (for free users)
    let quota = undefined;
    if (membershipType === 'free') {
      // Example: free users have 5 generates per day limit
      quota = { used: totalCount || 0, limit: 5 };
    }

    // Send Telegram notification to admin
    const notificationSent = await notifyToolUsage({
      userName: profile.full_name || "Unknown",
      userEmail: profile.email || "unknown@email.com",
      membershipType,
      toolName,
      documentTitle,
      usageCount: totalCount || 0,
      sameToolCount: sameToolCount || 0,
      quota
    });

    // Update telegram_notified flag if notification sent successfully
    if (notificationSent && !logError) {
      await supabase
        .from("usage_logs")
        .update({ telegram_notified: true })
        .eq("user_id", user.id)
        .eq("tool_name", toolName)
        .gte("created_at", today.toISOString())
        .order("created_at", { ascending: false })
        .limit(1);
    }

    return notificationSent;
  } catch (error) {
    console.error("[Monitoring] Error in logToolUsageWithNotification:", error);
    return false;
  }
}

/**
 * Get daily summary stats untuk admin report
 */
export async function getDailySummaryStats(date?: Date): Promise<any> {
  try {
    const supabase = await createClient();
    const targetDate = date || new Date();
    
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Total users
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // New users today
    const { count: newUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfDay.toISOString())
      .lte("created_at", endOfDay.toISOString());

    // Active users (24h) - users who used tools
    const { data: activeUsersData } = await supabase
      .from("usage_logs")
      .select("user_id")
      .gte("created_at", startOfDay.toISOString())
      .lte("created_at", endOfDay.toISOString());
    
    const activeUsers24h = new Set(activeUsersData?.map(log => log.user_id) || []).size;

    // VIP counts
    const { count: vipBasic } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("membership", "vip_basic")
      .eq("membership_status", "active");

    const { count: vipPremium } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("membership", "vip_premium")
      .eq("membership_status", "active");

    // Applications
    const { count: pendingApplications } = await supabase
      .from("account_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { count: approvedToday } = await supabase
      .from("account_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved")
      .gte("updated_at", startOfDay.toISOString())
      .lte("updated_at", endOfDay.toISOString());

    const { count: rejectedToday } = await supabase
      .from("account_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "rejected")
      .gte("updated_at", startOfDay.toISOString())
      .lte("updated_at", endOfDay.toISOString());

    // Tool usage
    const { count: totalToolUsage } = await supabase
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfDay.toISOString())
      .lte("created_at", endOfDay.toISOString());

    const { count: cvGenerated } = await supabase
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .ilike("tool_name", "%cv%")
      .gte("created_at", startOfDay.toISOString())
      .lte("created_at", endOfDay.toISOString());

    const { count: coverLetters } = await supabase
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .or("tool_name.ilike.%cover%,tool_name.ilike.%lamaran%")
      .gte("created_at", startOfDay.toISOString())
      .lte("created_at", endOfDay.toISOString());

    const { count: emailTemplates } = await supabase
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .or("tool_name.ilike.%email%,tool_name.ilike.%wa%,tool_name.ilike.%whatsapp%")
      .gte("created_at", startOfDay.toISOString())
      .lte("created_at", endOfDay.toISOString());

    return {
      date: targetDate.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      totalUsers: totalUsers || 0,
      newUsers: newUsers || 0,
      activeUsers24h: activeUsers24h || 0,
      vipBasic: vipBasic || 0,
      vipPremium: vipPremium || 0,
      pendingApplications: pendingApplications || 0,
      approvedToday: approvedToday || 0,
      rejectedToday: rejectedToday || 0,
      totalToolUsage: totalToolUsage || 0,
      cvGenerated: cvGenerated || 0,
      coverLetters: coverLetters || 0,
      emailTemplates: emailTemplates || 0,
      // Revenue bisa ditambah nanti dari payment logs
      // revenueToday: 0,
      // newSubscriptions: 0
    };
  } catch (error) {
    console.error("[Monitoring] Error getting daily summary stats:", error);
    throw error;
  }
}
