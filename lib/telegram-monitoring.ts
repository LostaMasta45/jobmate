/**
 * Telegram Bot Monitoring Utilities
 * Helper functions untuk tracking dan monitoring
 * 
 * NOTE: This file uses server-only imports (next/headers via supabase/server)
 * Only import this in Server Components or API routes
 */
"use server";

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

/**
 * Get weekly summary stats untuk admin report
 * Aggregasi data selama 7 hari terakhir
 */
export async function getWeeklySummaryStats(): Promise<any> {
  try {
    const supabase = await createClient();

    // Calculate week range (last 7 days)
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    // Previous week for comparison
    const prevWeekEnd = new Date(startDate);
    prevWeekEnd.setMilliseconds(-1);

    const prevWeekStart = new Date(prevWeekEnd);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    prevWeekStart.setHours(0, 0, 0, 0);

    // Format date strings
    const weekStart = startDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    const weekEnd = endDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    // Total users
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // New users this week
    const { count: newUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    // New users previous week (for comparison)
    const { count: prevWeekNewUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", prevWeekStart.toISOString())
      .lte("created_at", prevWeekEnd.toISOString());

    // Calculate user growth percentage
    const userGrowthPercent = prevWeekNewUsers && prevWeekNewUsers > 0
      ? Math.round(((newUsers || 0) - prevWeekNewUsers) / prevWeekNewUsers * 100)
      : 0;

    // Active users this week
    const { data: activeUsersData } = await supabase
      .from("usage_logs")
      .select("user_id")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    const activeUsers = new Set(activeUsersData?.map(log => log.user_id) || []).size;

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

    // Applications this week
    const { count: newApplications } = await supabase
      .from("account_applications")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    const { count: approvedApplications } = await supabase
      .from("account_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved")
      .gte("updated_at", startDate.toISOString())
      .lte("updated_at", endDate.toISOString());

    const { count: rejectedApplications } = await supabase
      .from("account_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "rejected")
      .gte("updated_at", startDate.toISOString())
      .lte("updated_at", endDate.toISOString());

    const { count: pendingApplications } = await supabase
      .from("account_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    // Tool usage this week
    const { count: totalToolUsage } = await supabase
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    const { count: cvGenerated } = await supabase
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .ilike("tool_name", "%cv%")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    const { count: coverLetters } = await supabase
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .or("tool_name.ilike.%cover%,tool_name.ilike.%lamaran%")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    const { count: emailTemplates } = await supabase
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .or("tool_name.ilike.%email%,tool_name.ilike.%wa%,tool_name.ilike.%whatsapp%")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    // Revenue this week (from payments table)
    const { data: revenueData } = await supabase
      .from("payments")
      .select("amount")
      .eq("status", "paid")
      .gte("paid_at", startDate.toISOString())
      .lte("paid_at", endDate.toISOString());

    const totalRevenue = revenueData?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    const totalOrders = revenueData?.length || 0;

    // Previous week revenue for comparison
    const { data: prevRevenueData } = await supabase
      .from("payments")
      .select("amount")
      .eq("status", "paid")
      .gte("paid_at", prevWeekStart.toISOString())
      .lte("paid_at", prevWeekEnd.toISOString());

    const prevWeekRevenue = prevRevenueData?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    const revenueGrowthPercent = prevWeekRevenue > 0
      ? Math.round((totalRevenue - prevWeekRevenue) / prevWeekRevenue * 100)
      : 0;

    // New jobs this week
    const { count: newJobs } = await supabase
      .from("vip_loker")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    return {
      weekStart,
      weekEnd,
      totalUsers: totalUsers || 0,
      newUsers: newUsers || 0,
      activeUsers: activeUsers || 0,
      vipBasic: vipBasic || 0,
      vipPremium: vipPremium || 0,
      newApplications: newApplications || 0,
      approvedApplications: approvedApplications || 0,
      rejectedApplications: rejectedApplications || 0,
      pendingApplications: pendingApplications || 0,
      totalToolUsage: totalToolUsage || 0,
      cvGenerated: cvGenerated || 0,
      coverLetters: coverLetters || 0,
      emailTemplates: emailTemplates || 0,
      totalRevenue,
      totalOrders,
      userGrowthPercent,
      revenueGrowthPercent,
      newJobs: newJobs || 0,
    };
  } catch (error) {
    console.error("[Monitoring] Error getting weekly summary stats:", error);
    throw error;
  }
}
