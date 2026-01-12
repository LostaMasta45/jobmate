import { NextResponse } from "next/server";
import { sendWeeklyAdminSummary } from "@/lib/telegram";
import { getWeeklySummaryStats } from "@/lib/telegram-monitoring";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Weekly Summary Cron Job
 * 
 * Setup di Vercel:
 * 1. Go to Project Settings > Cron Jobs
 * 2. Add new cron: 0 2 * * 1 (Senin 09:00 WIB = 02:00 UTC)
 * 3. Path: /api/cron/weekly-summary
 * 
 * Atau test manual via:
 * curl -X POST https://your-domain.com/api/cron/weekly-summary \
 *   -H "Authorization: Bearer YOUR_CRON_SECRET"
 */
export async function POST(req: Request) {
    try {
        // Security: Verify cron secret (recommended for production)
        const authHeader = req.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET || "your-secret-here";

        if (authHeader !== `Bearer ${cronSecret}`) {
            console.warn("[Cron] Unauthorized access attempt to weekly summary");
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        console.log("[Cron] Starting weekly summary generation...");

        // Get weekly stats
        const stats = await getWeeklySummaryStats();

        console.log("[Cron] Weekly stats collected:", stats);

        // Send Telegram notification
        const sent = await sendWeeklyAdminSummary({
            ...stats,
            dashboardUrl: process.env.NEXT_PUBLIC_APP_URL + "/admin/dashboard"
        });

        if (!sent) {
            console.error("[Cron] Failed to send weekly Telegram notification");
            return NextResponse.json(
                { error: "Failed to send notification" },
                { status: 500 }
            );
        }

        // Save to weekly_summary_logs (optional - create table if needed)
        try {
            const supabase = await createClient();
            const { error: logError } = await supabase
                .from("weekly_summary_logs")
                .insert({
                    week_start: stats.weekStart,
                    week_end: stats.weekEnd,
                    total_users: stats.totalUsers,
                    new_users: stats.newUsers,
                    active_users: stats.activeUsers,
                    vip_basic: stats.vipBasic,
                    vip_premium: stats.vipPremium,
                    new_applications: stats.newApplications,
                    approved_applications: stats.approvedApplications,
                    rejected_applications: stats.rejectedApplications,
                    pending_applications: stats.pendingApplications,
                    total_tool_usage: stats.totalToolUsage,
                    cv_generated: stats.cvGenerated,
                    cover_letters: stats.coverLetters,
                    email_templates: stats.emailTemplates,
                    total_revenue: stats.totalRevenue,
                    total_orders: stats.totalOrders,
                    new_jobs: stats.newJobs,
                    telegram_sent: true,
                    telegram_sent_at: new Date().toISOString()
                });

            if (logError) {
                console.error("[Cron] Failed to save weekly summary log:", logError);
                // Continue anyway, notification already sent
            }
        } catch (dbError) {
            console.warn("[Cron] Weekly summary logs table might not exist:", dbError);
            // Continue - table is optional
        }

        console.log("[Cron] Weekly summary sent successfully!");

        return NextResponse.json({
            success: true,
            message: "Weekly summary sent successfully",
            stats
        });
    } catch (error: any) {
        console.error("[Cron] Error in weekly summary:", error);

        // Try to send error notification
        try {
            const { notifySystemError } = await import("@/lib/telegram");
            await notifySystemError({
                errorType: "Weekly Cron Job Error",
                errorMessage: error?.message || "Unknown error",
                location: "/api/cron/weekly-summary",
                severity: "MEDIUM",
            });
        } catch (telegramError) {
            console.error("[Cron] Failed to send error notification:", telegramError);
        }

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
 * Requires admin authentication
 */
export async function GET(req: Request) {
    try {
        // Check if user is admin
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

        // Generate and send weekly summary
        const stats = await getWeeklySummaryStats();
        const sent = await sendWeeklyAdminSummary({
            ...stats,
            dashboardUrl: process.env.NEXT_PUBLIC_APP_URL + "/admin/dashboard"
        });

        return NextResponse.json({
            success: sent,
            message: sent ? "Weekly summary sent successfully" : "Failed to send summary",
            stats
        });
    } catch (error: any) {
        console.error("[Cron] Error in GET weekly summary:", error);
        return NextResponse.json(
            { error: error?.message || "Internal server error" },
            { status: 500 }
        );
    }
}
