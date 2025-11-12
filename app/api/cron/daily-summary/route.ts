import { NextResponse } from "next/server";
import { sendDailyAdminSummary } from "@/lib/telegram";
import { getDailySummaryStats } from "@/lib/telegram-monitoring";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Daily Summary Cron Job
 * 
 * Setup di Vercel:
 * 1. Go to Project Settings > Cron Jobs
 * 2. Add new cron: 0 2 * * * (09:00 WIB = 02:00 UTC)
 * 3. Path: /api/cron/daily-summary
 * 
 * Atau test manual via:
 * curl -X POST https://your-domain.com/api/cron/daily-summary \
 *   -H "Authorization: Bearer YOUR_CRON_SECRET"
 */
export async function POST(req: Request) {
  try {
    // Security: Verify cron secret (recommended for production)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "your-secret-here";
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      console.warn("[Cron] Unauthorized access attempt to daily summary");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[Cron] Starting daily summary generation...");

    // Get stats
    const stats = await getDailySummaryStats();
    
    console.log("[Cron] Stats collected:", stats);

    // Send Telegram notification
    const sent = await sendDailyAdminSummary({
      ...stats,
      dashboardUrl: process.env.NEXT_PUBLIC_APP_URL + "/admin/dashboard"
    });

    if (!sent) {
      console.error("[Cron] Failed to send Telegram notification");
      return NextResponse.json(
        { error: "Failed to send notification" },
        { status: 500 }
      );
    }

    // Save to daily_summary_logs
    const supabase = await createClient();
    const { error: logError } = await supabase
      .from("daily_summary_logs")
      .insert({
        summary_date: new Date().toISOString().split("T")[0],
        total_users: stats.totalUsers,
        new_users: stats.newUsers,
        active_users_24h: stats.activeUsers24h,
        vip_basic: stats.vipBasic,
        vip_premium: stats.vipPremium,
        pending_applications: stats.pendingApplications,
        approved_applications: stats.approvedToday,
        rejected_applications: stats.rejectedToday,
        total_tool_usage: stats.totalToolUsage,
        cv_generated: stats.cvGenerated,
        cover_letters: stats.coverLetters,
        email_templates: stats.emailTemplates,
        telegram_sent: true,
        telegram_sent_at: new Date().toISOString()
      });

    if (logError) {
      console.error("[Cron] Failed to save summary log:", logError);
      // Continue anyway, notification already sent
    }

    console.log("[Cron] Daily summary sent successfully!");

    return NextResponse.json({
      success: true,
      message: "Daily summary sent successfully",
      stats
    });
  } catch (error: any) {
    console.error("[Cron] Error in daily summary:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint untuk manual testing via browser
 * Remove this in production atau protect dengan admin auth
 */
export async function GET(req: Request) {
  try {
    // Check if user is admin (optional security for testing)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Generate and send summary
    const stats = await getDailySummaryStats();
    const sent = await sendDailyAdminSummary({
      ...stats,
      dashboardUrl: process.env.NEXT_PUBLIC_APP_URL + "/admin/dashboard"
    });

    return NextResponse.json({
      success: sent,
      message: sent ? "Daily summary sent successfully" : "Failed to send summary",
      stats
    });
  } catch (error: any) {
    console.error("[Cron] Error in GET daily summary:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
