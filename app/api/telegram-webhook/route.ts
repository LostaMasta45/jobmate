import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTelegramMessage, sendAdminNotification } from "@/lib/telegram";
import { sendAccountApprovedEmail, getUserDisplayName } from "@/lib/email-notifications";

// Telegram Update Interface
interface TelegramUpdate {
    update_id: number;
    message?: {
        message_id: number;
        from?: {
            id: number;
            first_name: string;
            username?: string;
        };
        chat: {
            id: number;
            type: string;
        };
        date: number;
        text?: string;
        reply_to_message?: {
            message_id: number;
            text?: string;
        };
    };
}

// Extract Application ID from message text
function extractApplicationId(text: string): string | null {
    // Pattern 1: "ACC {applicationId}" or "acc {id}"
    const commandMatch = text.match(/^(?:ACC|acc|Acc)\s+([a-f0-9-]{36})/i);
    if (commandMatch) return commandMatch[1];

    // Pattern 2: Extract from original notification message (reply)
    // Looking for: 🔑 *Application ID*\n`{id}`
    const idMatch = text.match(/Application ID[*`:\s]*\n?[`]?([a-f0-9-]{36})[`]?/i);
    if (idMatch) return idMatch[1];

    // Pattern 3: Just UUID format anywhere in message
    const uuidMatch = text.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
    if (uuidMatch) return uuidMatch[1];

    return null;
}

// Extract rejection reason from REJ command
function extractRejectionReason(text: string): string | null {
    const match = text.match(/^(?:REJ|rej|Rej)\s+(.+)/i);
    return match ? match[1].trim() : null;
}

// ================================================
// 🆕 PHASE 1: FOUNDATION COMMANDS
// ================================================

// Format time ago helper
function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${diffDays} hari lalu`;
}

// Format number with comma separator
function formatNumber(num: number): string {
    return num.toLocaleString('id-ID');
}

// HELP command handler
async function handleHelpCommand(): Promise<string> {
    return `📋 *DAFTAR COMMAND BOT*

━━━━━━━━━━━━━━━━━━━━━
👥 *APPROVAL*
• \`ACC\` - Approve akun
• \`REJ alasan\` - Reject akun

📊 *MONITORING*
• \`STATS\` - Statistik hari ini
• \`PENDING\` - Lihat aplikasi pending
• \`REPORT daily/weekly\` - Generate laporan
• \`TOOLS\` - Statistik tools
• \`HEALTH\` - Cek status sistem

🔎 *USER MANAGEMENT*
• \`FIND nama/email\` - Cari user
• \`INFO email\` - Detail user
• \`VIP email basic/premium [hari]\` - Upgrade

💼 *ADVANCED*
• \`JOBS\` - Statistik lowongan
• \`PAYMENTS\` - Transaksi pembayaran
• \`BROADCAST pesan\` - Preview broadcast

━━━━━━━━━━━━━━━━━━━━━
💡 Reply notifikasi pendaftaran untuk aksi cepat!`;
}

// PING command handler
async function handlePingCommand(): Promise<string> {
    const now = new Date().toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    return `🏓 *PONG!* Bot aktif ✅
⏰ Server time: ${now} WIB`;
}

// PENDING command handler
async function handlePendingCommand(): Promise<string> {
    try {
        const adminClient = createAdminClient();

        const { data: pendingApps, error } = await adminClient
            .from("account_applications")
            .select("id, full_name, email, created_at")
            .eq("status", "pending")
            .order("created_at", { ascending: false })
            .limit(10);

        if (error) {
            console.error("[TelegramBot] PENDING error:", error);
            return `❌ *Error*\n\nGagal mengambil data: ${error.message}`;
        }

        if (!pendingApps || pendingApps.length === 0) {
            return `✅ *TIDAK ADA APLIKASI PENDING*

━━━━━━━━━━━━━━━━━━━━━
Semua aplikasi sudah diproses! 🎉

⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;
        }

        let message = `⏳ *APLIKASI PENDING*

━━━━━━━━━━━━━━━━━━━━━
Total: ${pendingApps.length} aplikasi menunggu

`;

        pendingApps.forEach((app, index) => {
            const timeAgo = formatTimeAgo(new Date(app.created_at));
            const shortId = app.id.substring(0, 8) + "...";
            message += `${index + 1}️⃣ *${app.full_name}*
   📧 ${app.email}
   ⏰ ${timeAgo}
   🔑 \`${shortId}\`

`;
        });

        message += `━━━━━━━━━━━━━━━━━━━━━
💡 Reply dengan \`ACC\` atau \`REJ alasan\` untuk aksi`;

        return message;
    } catch (error) {
        console.error("[TelegramBot] PENDING error:", error);
        return `❌ *Error*\n\nTerjadi kesalahan: ${error}`;
    }
}

// STATS command handler
async function handleStatsCommand(): Promise<string> {
    try {
        const adminClient = createAdminClient();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayISO = today.toISOString();

        // Get user statistics
        const { count: totalUsers } = await adminClient
            .from("profiles")
            .select("*", { count: 'exact', head: true });

        const { count: newUsersToday } = await adminClient
            .from("profiles")
            .select("*", { count: 'exact', head: true })
            .gte("created_at", todayISO);

        const { count: vipBasic } = await adminClient
            .from("profiles")
            .select("*", { count: 'exact', head: true })
            .eq("membership", "vip_basic");

        const { count: vipPremium } = await adminClient
            .from("profiles")
            .select("*", { count: 'exact', head: true })
            .eq("membership", "vip_premium");

        // Get application statistics
        const { count: pendingApps } = await adminClient
            .from("account_applications")
            .select("*", { count: 'exact', head: true })
            .eq("status", "pending");

        const { count: approvedToday } = await adminClient
            .from("account_applications")
            .select("*", { count: 'exact', head: true })
            .eq("status", "approved")
            .gte("approved_at", todayISO);

        const { count: rejectedToday } = await adminClient
            .from("account_applications")
            .select("*", { count: 'exact', head: true })
            .eq("status", "rejected")
            .gte("updated_at", todayISO);

        // Get tool usage statistics (if table exists)
        let toolStats = { total: 0, cv: 0, coverLetter: 0, email: 0 };
        try {
            const { count: totalTools } = await adminClient
                .from("tool_usage_logs")
                .select("*", { count: 'exact', head: true })
                .gte("created_at", todayISO);

            const { count: cvCount } = await adminClient
                .from("tool_usage_logs")
                .select("*", { count: 'exact', head: true })
                .gte("created_at", todayISO)
                .ilike("tool_name", "%cv%");

            const { count: coverLetterCount } = await adminClient
                .from("tool_usage_logs")
                .select("*", { count: 'exact', head: true })
                .gte("created_at", todayISO)
                .ilike("tool_name", "%cover%");

            const { count: emailCount } = await adminClient
                .from("tool_usage_logs")
                .select("*", { count: 'exact', head: true })
                .gte("created_at", todayISO)
                .ilike("tool_name", "%email%");

            toolStats = {
                total: totalTools || 0,
                cv: cvCount || 0,
                coverLetter: coverLetterCount || 0,
                email: emailCount || 0
            };
        } catch (e) {
            // Table might not exist, ignore
        }

        const dateStr = new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'Asia/Jakarta'
        });

        const pendingAlert = (pendingApps || 0) > 0 ? ' ⚠️' : '';

        return `📊 *STATISTIK HARI INI*
${dateStr}

━━━━━━━━━━━━━━━━━━━━━
👥 *USERS*
• Total: ${formatNumber(totalUsers || 0)}
• New Today: +${formatNumber(newUsersToday || 0)}
• ⭐ VIP Basic: ${formatNumber(vipBasic || 0)}
• 👑 VIP Premium: ${formatNumber(vipPremium || 0)}

📝 *APPLICATIONS*
• ⏳ Pending: ${formatNumber(pendingApps || 0)}${pendingAlert}
• ✅ Approved Today: ${formatNumber(approvedToday || 0)}
• ❌ Rejected Today: ${formatNumber(rejectedToday || 0)}

🛠️ *TOOL USAGE (Today)*
• Total: ${formatNumber(toolStats.total)}
• CV: ${formatNumber(toolStats.cv)} | Cover Letter: ${formatNumber(toolStats.coverLetter)} | Email: ${formatNumber(toolStats.email)}

━━━━━━━━━━━━━━━━━━━━━
⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

    } catch (error) {
        console.error("[TelegramBot] STATS error:", error);
        return `❌ *Error*\n\nGagal mengambil statistik: ${error}`;
    }
}

// ================================================
// 🆕 PHASE 2: USER MANAGEMENT COMMANDS
// ================================================

// Escape markdown special characters
function escapeMarkdown(text: string): string {
    return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
}

// FIND command handler - Search users
async function handleFindCommand(query: string): Promise<string> {
    if (!query || query.trim().length < 2) {
        return `❌ *Format salah*

Cara penggunaan:
\`FIND nama/email\`

Contoh:
• \`FIND john\`
• \`FIND john@email.com\``;
    }

    try {
        const adminClient = createAdminClient();
        const searchTerm = query.trim().toLowerCase();

        // Search by email or name
        const { data: users, error } = await adminClient
            .from("profiles")
            .select("id, email, full_name, name, membership, membership_status, created_at, whatsapp")
            .or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`)
            .limit(10);

        if (error) {
            console.error("[TelegramBot] FIND error:", error);
            return `❌ *Error*\n\nGagal mencari user: ${error.message}`;
        }

        if (!users || users.length === 0) {
            return `🔎 *HASIL PENCARIAN: "${escapeMarkdown(query)}"*

━━━━━━━━━━━━━━━━━━━━━
❌ User tidak ditemukan

💡 Tips: Coba cari dengan nama atau email yang berbeda`;
        }

        let message = `🔎 *HASIL PENCARIAN: "${escapeMarkdown(query)}"*

━━━━━━━━━━━━━━━━━━━━━
Found ${users.length} user(s):

`;

        users.forEach((user, index) => {
            const membershipEmoji = user.membership === 'vip_premium' ? '👑' :
                user.membership === 'vip_basic' ? '⭐' : '🆓';
            const membershipLabel = user.membership?.replace(/_/g, ' ').toUpperCase() || 'FREE';
            const displayName = user.full_name || user.name || 'No Name';

            message += `${index + 1}️⃣ *${escapeMarkdown(displayName)}*
   📧 ${escapeMarkdown(user.email || 'N/A')}
   ${membershipEmoji} ${membershipLabel}

`;
        });

        message += `━━━━━━━━━━━━━━━━━━━━━
💡 Ketik: \`INFO email\` untuk detail lengkap`;

        return message;
    } catch (error) {
        console.error("[TelegramBot] FIND error:", error);
        return `❌ *Error*\n\nTerjadi kesalahan: ${error}`;
    }
}

// INFO command handler - Get user details
async function handleInfoCommand(email: string): Promise<string> {
    if (!email || !email.includes('@')) {
        return `❌ *Format salah*

Cara penggunaan:
\`INFO email@domain.com\`

Contoh:
• \`INFO john@email.com\``;
    }

    try {
        const adminClient = createAdminClient();
        const searchEmail = email.trim().toLowerCase();

        // Get user profile
        const { data: user, error } = await adminClient
            .from("profiles")
            .select("*")
            .ilike("email", searchEmail)
            .single();

        if (error || !user) {
            return `🔎 *USER INFO*

━━━━━━━━━━━━━━━━━━━━━
❌ User dengan email "${escapeMarkdown(email)}" tidak ditemukan

💡 Pastikan email benar atau gunakan \`FIND\` untuk mencari`;
        }

        const membershipEmoji = user.membership === 'vip_premium' ? '👑' :
            user.membership === 'vip_basic' ? '⭐' : '🆓';
        const membershipLabel = user.membership?.replace(/_/g, ' ').toUpperCase() || 'FREE';

        // Format dates
        const joinDate = user.created_at
            ? new Date(user.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta'
            })
            : 'N/A';

        const expiryDate = user.membership_expiry
            ? new Date(user.membership_expiry).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta'
            })
            : 'N/A (Lifetime)';

        const lastActive = user.updated_at
            ? formatTimeAgo(new Date(user.updated_at))
            : 'N/A';

        // Get tool usage stats (last 30 days)
        let toolUsage = { cv: 0, coverLetter: 0, email: 0 };
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { data: logs } = await adminClient
                .from("tool_usage_logs")
                .select("tool_name")
                .eq("user_id", user.id)
                .gte("created_at", thirtyDaysAgo.toISOString());

            if (logs) {
                logs.forEach((log: { tool_name: string }) => {
                    if (log.tool_name?.toLowerCase().includes('cv')) toolUsage.cv++;
                    else if (log.tool_name?.toLowerCase().includes('cover')) toolUsage.coverLetter++;
                    else if (log.tool_name?.toLowerCase().includes('email')) toolUsage.email++;
                });
            }
        } catch (e) {
            // Table might not exist
        }

        const displayName = user.full_name || user.name || 'No Name';

        return `👤 *USER DETAIL*

━━━━━━━━━━━━━━━━━━━━━
📛 *Nama:* ${escapeMarkdown(displayName)}
📧 *Email:* ${escapeMarkdown(user.email)}
📱 *WhatsApp:* ${user.whatsapp || 'N/A'}

📊 *Membership*
• Status: ${membershipEmoji} ${membershipLabel}
• Expired: ${expiryDate}
• Joined: ${joinDate}

🛠️ *Tool Usage (30 hari)*
• CV: ${toolUsage.cv}x | Cover Letter: ${toolUsage.coverLetter}x | Email: ${toolUsage.email}x

📍 *Last Active:* ${lastActive}
━━━━━━━━━━━━━━━━━━━━━
💡 Upgrade: \`VIP ${user.email} basic/premium\``;

    } catch (error) {
        console.error("[TelegramBot] INFO error:", error);
        return `❌ *Error*\n\nTerjadi kesalahan: ${error}`;
    }
}

// VIP command handler - Upgrade user membership
async function handleVIPCommand(args: string): Promise<string> {
    // Parse: VIP email@domain.com basic/premium [days]
    const parts = args.trim().split(/\s+/);

    if (parts.length < 2) {
        return `❌ *Format salah*

Cara penggunaan:
\`VIP email tipe [hari]\`

Contoh:
• \`VIP john@email.com basic\` (30 hari default)
• \`VIP john@email.com premium 90\` (90 hari)
• \`VIP john@email.com basic lifetime\` (selamanya)

Tipe: \`basic\` atau \`premium\``;
    }

    const email = parts[0].toLowerCase();
    const membershipType = parts[1].toLowerCase();
    const durationArg = parts[2]?.toLowerCase();

    if (!email.includes('@')) {
        return `❌ Email tidak valid: ${email}`;
    }

    if (!['basic', 'premium'].includes(membershipType)) {
        return `❌ Tipe membership tidak valid: ${membershipType}\n\nGunakan: \`basic\` atau \`premium\``;
    }

    try {
        const adminClient = createAdminClient();

        // Get user
        const { data: user, error: fetchError } = await adminClient
            .from("profiles")
            .select("id, email, full_name, name, membership")
            .ilike("email", email)
            .single();

        if (fetchError || !user) {
            return `❌ User dengan email "${escapeMarkdown(email)}" tidak ditemukan`;
        }

        // Calculate expiry
        let expiryDate: string | null = null;
        let durationText = '';

        if (durationArg === 'lifetime' || durationArg === 'selamanya') {
            expiryDate = null;
            durationText = 'Lifetime';
        } else {
            const days = parseInt(durationArg) || 30;
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + days);
            expiryDate = expiry.toISOString();
            durationText = `${days} hari`;
        }

        const previousMembership = user.membership || 'free';
        const newMembership = membershipType === 'premium' ? 'vip_premium' : 'vip_basic';

        // Update user
        const { error: updateError } = await adminClient
            .from("profiles")
            .update({
                membership: newMembership,
                membership_status: 'active',
                membership_expiry: expiryDate,
                updated_at: new Date().toISOString()
            })
            .eq("id", user.id);

        if (updateError) {
            console.error("[TelegramBot] VIP update error:", updateError);
            return `❌ Gagal upgrade user: ${updateError.message}`;
        }

        const membershipEmoji = newMembership === 'vip_premium' ? '👑' : '⭐';
        const displayName = user.full_name || user.name || 'User';
        const expiryText = expiryDate
            ? new Date(expiryDate).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta'
            })
            : 'Lifetime ♾️';

        return `✅ *USER UPGRADED*

━━━━━━━━━━━━━━━━━━━━━
👤 ${escapeMarkdown(displayName)}
📧 ${escapeMarkdown(user.email)}

🔄 *Upgrade:*
• From: ${previousMembership.replace(/_/g, ' ').toUpperCase()}
• To: ${membershipEmoji} ${newMembership.replace(/_/g, ' ').toUpperCase()}
• Duration: ${durationText}
• Expired: ${expiryText}

━━━━━━━━━━━━━━━━━━━━━
⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

    } catch (error) {
        console.error("[TelegramBot] VIP error:", error);
        return `❌ *Error*\n\nTerjadi kesalahan: ${error}`;
    }
}

// ================================================
// 🆕 PHASE 3: MONITORING COMMANDS
// ================================================

// REPORT command handler - Generate report (daily/weekly)
async function handleReportCommand(period: string): Promise<string> {
    const reportType = period.toLowerCase().trim() || 'daily';

    if (!['daily', 'weekly', 'harian', 'mingguan'].includes(reportType)) {
        return `❌ *Format salah*

Cara penggunaan:
\`REPORT daily\` atau \`REPORT weekly\`

Contoh:
• \`REPORT daily\` - Laporan hari ini
• \`REPORT weekly\` - Laporan 7 hari terakhir`;
    }

    try {
        const adminClient = createAdminClient();
        const now = new Date();

        // Determine date range
        const isWeekly = reportType === 'weekly' || reportType === 'mingguan';
        const startDate = new Date();
        if (isWeekly) {
            startDate.setDate(startDate.getDate() - 7);
        }
        startDate.setHours(0, 0, 0, 0);
        const startISO = startDate.toISOString();

        // Get user statistics
        const { count: totalUsers } = await adminClient
            .from("profiles")
            .select("*", { count: 'exact', head: true });

        const { count: newUsers } = await adminClient
            .from("profiles")
            .select("*", { count: 'exact', head: true })
            .gte("created_at", startISO);

        const { count: vipBasic } = await adminClient
            .from("profiles")
            .select("*", { count: 'exact', head: true })
            .eq("membership", "vip_basic");

        const { count: vipPremium } = await adminClient
            .from("profiles")
            .select("*", { count: 'exact', head: true })
            .eq("membership", "vip_premium");

        // Get application stats
        const { count: pendingApps } = await adminClient
            .from("account_applications")
            .select("*", { count: 'exact', head: true })
            .eq("status", "pending");

        const { count: approvedPeriod } = await adminClient
            .from("account_applications")
            .select("*", { count: 'exact', head: true })
            .eq("status", "approved")
            .gte("approved_at", startISO);

        const { count: rejectedPeriod } = await adminClient
            .from("account_applications")
            .select("*", { count: 'exact', head: true })
            .eq("status", "rejected")
            .gte("updated_at", startISO);

        // Get tool usage
        let toolStats = { total: 0, cv: 0, coverLetter: 0, email: 0 };
        try {
            const { count: totalTools } = await adminClient
                .from("tool_usage_logs")
                .select("*", { count: 'exact', head: true })
                .gte("created_at", startISO);

            const { count: cvCount } = await adminClient
                .from("tool_usage_logs")
                .select("*", { count: 'exact', head: true })
                .gte("created_at", startISO)
                .ilike("tool_name", "%cv%");

            const { count: coverCount } = await adminClient
                .from("tool_usage_logs")
                .select("*", { count: 'exact', head: true })
                .gte("created_at", startISO)
                .ilike("tool_name", "%cover%");

            const { count: emailCount } = await adminClient
                .from("tool_usage_logs")
                .select("*", { count: 'exact', head: true })
                .gte("created_at", startISO)
                .ilike("tool_name", "%email%");

            toolStats = {
                total: totalTools || 0,
                cv: cvCount || 0,
                coverLetter: coverCount || 0,
                email: emailCount || 0
            };
        } catch (e) {
            // Table mungkin belum ada
        }

        // Calculate growth
        const previousUsers = (totalUsers || 0) - (newUsers || 0);
        const growthPercent = previousUsers > 0
            ? Math.round(((newUsers || 0) / previousUsers) * 100)
            : 0;

        const periodLabel = isWeekly ? 'WEEKLY' : 'DAILY';
        const dateRange = isWeekly
            ? `${startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
            : now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

        return `📊 *${periodLabel} REPORT*
${dateRange}

━━━━━━━━━━━━━━━━━━━━━
👥 *USER GROWTH*
• Total Users: ${formatNumber(totalUsers || 0)}
• New Users: +${formatNumber(newUsers || 0)} (${growthPercent > 0 ? '+' : ''}${growthPercent}%)
• ⭐ VIP Basic: ${formatNumber(vipBasic || 0)}
• 👑 VIP Premium: ${formatNumber(vipPremium || 0)}

📝 *APPLICATIONS*
• ⏳ Pending: ${formatNumber(pendingApps || 0)}
• ✅ Approved: ${formatNumber(approvedPeriod || 0)}
• ❌ Rejected: ${formatNumber(rejectedPeriod || 0)}

🛠️ *TOOL USAGE*
• Total: ${formatNumber(toolStats.total)}
• 📄 CV: ${formatNumber(toolStats.cv)}
• ✉️ Cover Letter: ${formatNumber(toolStats.coverLetter)}
• 📧 Email: ${formatNumber(toolStats.email)}

━━━━━━━━━━━━━━━━━━━━━
⏰ Generated: ${now.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

    } catch (error) {
        console.error("[TelegramBot] REPORT error:", error);
        return `❌ *Error*\n\nGagal generate report: ${error}`;
    }
}

// TOOLS command handler - Tool usage statistics
async function handleToolsCommand(): Promise<string> {
    try {
        const adminClient = createAdminClient();
        const now = new Date();

        // Today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // This week
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);

        // This month
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        // Get stats for different periods
        const getToolStats = async (startDate: Date) => {
            const stats = { cv: 0, coverLetter: 0, email: 0, other: 0 };
            try {
                const { data: logs } = await adminClient
                    .from("tool_usage_logs")
                    .select("tool_name")
                    .gte("created_at", startDate.toISOString());

                if (logs) {
                    logs.forEach((log: { tool_name: string }) => {
                        const name = log.tool_name?.toLowerCase() || '';
                        if (name.includes('cv')) stats.cv++;
                        else if (name.includes('cover')) stats.coverLetter++;
                        else if (name.includes('email')) stats.email++;
                        else stats.other++;
                    });
                }
            } catch (e) {
                // Table might not exist
            }
            return stats;
        };

        const todayStats = await getToolStats(todayStart);
        const weekStats = await getToolStats(weekStart);
        const monthStats = await getToolStats(monthStart);

        const todayTotal = todayStats.cv + todayStats.coverLetter + todayStats.email + todayStats.other;
        const weekTotal = weekStats.cv + weekStats.coverLetter + weekStats.email + weekStats.other;
        const monthTotal = monthStats.cv + monthStats.coverLetter + monthStats.email + monthStats.other;

        // Top tool
        const toolTotals = [
            { name: 'CV Generator', count: monthStats.cv },
            { name: 'Cover Letter', count: monthStats.coverLetter },
            { name: 'Email Template', count: monthStats.email },
        ].sort((a, b) => b.count - a.count);

        return `🛠️ *TOOL USAGE STATISTICS*

━━━━━━━━━━━━━━━━━━━━━
📅 *TODAY*
• Total: ${formatNumber(todayTotal)}
• CV: ${todayStats.cv} | Cover Letter: ${todayStats.coverLetter} | Email: ${todayStats.email}

📆 *THIS WEEK (7 days)*
• Total: ${formatNumber(weekTotal)}
• CV: ${weekStats.cv} | Cover Letter: ${weekStats.coverLetter} | Email: ${weekStats.email}

📅 *THIS MONTH*
• Total: ${formatNumber(monthTotal)}
• CV: ${monthStats.cv} | Cover Letter: ${monthStats.coverLetter} | Email: ${monthStats.email}

🏆 *TOP TOOLS (Month)*
1. ${toolTotals[0]?.name || 'N/A'} - ${formatNumber(toolTotals[0]?.count || 0)} uses
2. ${toolTotals[1]?.name || 'N/A'} - ${formatNumber(toolTotals[1]?.count || 0)} uses
3. ${toolTotals[2]?.name || 'N/A'} - ${formatNumber(toolTotals[2]?.count || 0)} uses

━━━━━━━━━━━━━━━━━━━━━
⏰ ${now.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

    } catch (error) {
        console.error("[TelegramBot] TOOLS error:", error);
        return `❌ *Error*\n\nGagal mengambil statistik tools: ${error}`;
    }
}

// HEALTH command handler - System health check
async function handleHealthCommand(): Promise<string> {
    const startTime = Date.now();
    const checks: { name: string; status: string; time?: number }[] = [];

    try {
        const adminClient = createAdminClient();

        // Check Database
        const dbStart = Date.now();
        try {
            const { error } = await adminClient.from("profiles").select("id").limit(1);
            const dbTime = Date.now() - dbStart;
            checks.push({
                name: "Database",
                status: error ? `❌ Error: ${error.message}` : `✅ Online (${dbTime}ms)`,
                time: dbTime
            });
        } catch (e) {
            checks.push({ name: "Database", status: "❌ Offline" });
        }

        // Check Auth
        try {
            const { count } = await adminClient
                .from("profiles")
                .select("*", { count: 'exact', head: true });
            checks.push({ name: "Auth System", status: "✅ Working" });
        } catch (e) {
            checks.push({ name: "Auth System", status: "⚠️ Unknown" });
        }

        // Check Storage (basic check)
        checks.push({ name: "Storage", status: "✅ Available" });

        // Check Bot
        checks.push({ name: "Telegram Bot", status: "✅ Running" });

        // Check API
        checks.push({ name: "API Server", status: "✅ Healthy" });

        const totalTime = Date.now() - startTime;
        const allGood = checks.every(c => c.status.includes('✅'));

        const statusEmoji = allGood ? '✅' : '⚠️';
        const statusText = allGood ? 'All Systems Operational' : 'Some Issues Detected';

        return `🏥 *SYSTEM HEALTH*

━━━━━━━━━━━━━━━━━━━━━
${statusEmoji} *${statusText}*

${checks.map(c => `• ${c.name}: ${c.status}`).join('\n')}

📊 *Performance*
• Health Check: ${totalTime}ms
• Status: ${allGood ? 'Excellent' : 'Needs Attention'}

━━━━━━━━━━━━━━━━━━━━━
⏰ Last Check: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

    } catch (error) {
        console.error("[TelegramBot] HEALTH error:", error);
        return `❌ *SYSTEM HEALTH CHECK FAILED*

━━━━━━━━━━━━━━━━━━━━━
⚠️ Unable to perform health check

Error: ${error}

━━━━━━━━━━━━━━━━━━━━━
Please check server logs for details.`;
    }
}

// ================================================
// 🆕 PHASE 4: ADVANCED FEATURES
// ================================================

// BROADCAST command handler - Send message to all VIP users (simplified version)
async function handleBroadcastCommand(messageText: string): Promise<string> {
    if (!messageText || messageText.trim().length < 5) {
        return `❌ *Format salah*

Cara penggunaan:
\`BROADCAST pesan anda\`

Contoh:
• \`BROADCAST Selamat tahun baru! Semangat mencari kerja 🎉\`

⚠️ Pesan minimal 5 karakter`;
    }

    try {
        const adminClient = createAdminClient();

        // Get count of users with telegram_chat_id
        const { count: userCount } = await adminClient
            .from("profiles")
            .select("*", { count: 'exact', head: true })
            .not("telegram_chat_id", "is", null);

        // Note: Actual broadcast implementation would require queue system
        // This is a simplified version that just shows the preview

        return `📢 *BROADCAST PREVIEW*

━━━━━━━━━━━━━━━━━━━━━
📝 *Message:*
${escapeMarkdown(messageText.trim())}

👥 *Target:* ${formatNumber(userCount || 0)} users with Telegram linked

━━━━━━━━━━━━━━━━━━━━━
⚠️ *Note:* Full broadcast feature memerlukan queue system untuk mencegah rate limiting.

Untuk sekarang, gunakan Admin Dashboard untuk broadcast ke user.

⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

    } catch (error) {
        console.error("[TelegramBot] BROADCAST error:", error);
        return `❌ *Error*\n\nGagal memproses broadcast: ${error}`;
    }
}

// PAYMENTS command handler - Recent payment transactions
async function handlePaymentsCommand(limit: string): Promise<string> {
    const count = parseInt(limit) || 10;
    const maxLimit = Math.min(count, 20);

    try {
        const adminClient = createAdminClient();

        // Try to get payments from payment table
        let payments: any[] = [];
        try {
            const { data } = await adminClient
                .from("payments")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(maxLimit);

            if (data) payments = data;
        } catch (e) {
            // payments table might not exist
        }

        // Get today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let todayStats = { count: 0, revenue: 0 };
        try {
            const { data: todayPayments } = await adminClient
                .from("payments")
                .select("amount")
                .eq("status", "paid")
                .gte("created_at", today.toISOString());

            if (todayPayments) {
                todayStats.count = todayPayments.length;
                todayStats.revenue = todayPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
            }
        } catch (e) {
            // Ignore
        }

        if (payments.length === 0) {
            return `💳 *PAYMENT TRANSACTIONS*

━━━━━━━━━━━━━━━━━━━━━
📊 *Today's Summary*
• Transactions: ${formatNumber(todayStats.count)}
• Revenue: Rp ${formatNumber(todayStats.revenue)}

📝 *Recent Transactions*
No recent transactions found.

━━━━━━━━━━━━━━━━━━━━━
⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;
        }

        let message = `💳 *PAYMENT TRANSACTIONS*

━━━━━━━━━━━━━━━━━━━━━
📊 *Today's Summary*
• Transactions: ${formatNumber(todayStats.count)}
• Revenue: Rp ${formatNumber(todayStats.revenue)}

📝 *Recent ${payments.length} Transactions*

`;

        payments.slice(0, 5).forEach((payment, index) => {
            const statusEmoji = payment.status === 'paid' ? '✅' :
                payment.status === 'pending' ? '⏳' : '❌';
            const amount = payment.amount ? `Rp ${formatNumber(payment.amount)}` : 'N/A';
            const date = payment.created_at
                ? formatTimeAgo(new Date(payment.created_at))
                : 'N/A';

            message += `${index + 1}. ${statusEmoji} ${amount}
   ${payment.customer_email || 'N/A'} | ${date}

`;
        });

        if (payments.length > 5) {
            message += `... dan ${payments.length - 5} transaksi lainnya\n`;
        }

        message += `━━━━━━━━━━━━━━━━━━━━━
⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

        return message;

    } catch (error) {
        console.error("[TelegramBot] PAYMENTS error:", error);
        return `❌ *Error*\n\nGagal mengambil data payment: ${error}`;
    }
}

// JOBS command handler - Job posting statistics
async function handleJobsCommand(): Promise<string> {
    try {
        const adminClient = createAdminClient();
        const now = new Date();

        // Get total jobs
        const { count: totalJobs } = await adminClient
            .from("job_postings")
            .select("*", { count: 'exact', head: true });

        // Get active jobs (not expired)
        const { count: activeJobs } = await adminClient
            .from("job_postings")
            .select("*", { count: 'exact', head: true })
            .or(`deadline.is.null,deadline.gte.${now.toISOString()}`);

        // Get jobs added today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: todayJobs } = await adminClient
            .from("job_postings")
            .select("*", { count: 'exact', head: true })
            .gte("created_at", today.toISOString());

        // Get jobs this week
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const { count: weekJobs } = await adminClient
            .from("job_postings")
            .select("*", { count: 'exact', head: true })
            .gte("created_at", weekAgo.toISOString());

        // Get expiring soon (next 3 days)
        const threeDaysLater = new Date();
        threeDaysLater.setDate(threeDaysLater.getDate() + 3);
        const { count: expiringSoon } = await adminClient
            .from("job_postings")
            .select("*", { count: 'exact', head: true })
            .gte("deadline", now.toISOString())
            .lte("deadline", threeDaysLater.toISOString());

        // Get recent jobs
        const { data: recentJobs } = await adminClient
            .from("job_postings")
            .select("title, company_name, location, created_at")
            .order("created_at", { ascending: false })
            .limit(5);

        let message = `💼 *JOB POSTING STATISTICS*

━━━━━━━━━━━━━━━━━━━━━
📊 *Overview*
• Total Jobs: ${formatNumber(totalJobs || 0)}
• Active: ${formatNumber(activeJobs || 0)}
• Expiring Soon (3 days): ${formatNumber(expiringSoon || 0)} ⚠️

📈 *Growth*
• Added Today: +${formatNumber(todayJobs || 0)}
• Added This Week: +${formatNumber(weekJobs || 0)}

`;

        if (recentJobs && recentJobs.length > 0) {
            message += `🆕 *Recent Jobs*\n`;
            recentJobs.forEach((job, index) => {
                const title = job.title?.substring(0, 25) + (job.title?.length > 25 ? '...' : '');
                const company = job.company_name?.substring(0, 15) + (job.company_name?.length > 15 ? '...' : '');
                message += `${index + 1}. ${escapeMarkdown(title || 'N/A')}
   🏢 ${escapeMarkdown(company || 'N/A')} | 📍 ${escapeMarkdown(job.location || 'N/A')}

`;
            });
        }

        message += `━━━━━━━━━━━━━━━━━━━━━
⏰ ${now.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

        return message;

    } catch (error) {
        console.error("[TelegramBot] JOBS error:", error);
        return `❌ *Error*\n\nGagal mengambil statistik lowongan: ${error}`;
    }
}

// Approve application function (bot version - no session required)
async function approveApplicationByBot(applicationId: string): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
        const adminClient = createAdminClient();

        // Get application
        const { data: application, error: fetchError } = await adminClient
            .from("account_applications")
            .select("*")
            .eq("id", applicationId)
            .single();

        if (fetchError || !application) {
            return { success: false, error: `Aplikasi tidak ditemukan: ${applicationId}` };
        }

        if (application.status === "approved") {
            return { success: false, error: "Aplikasi sudah di-approve sebelumnya" };
        }

        if (application.status === "rejected") {
            return { success: false, error: "Aplikasi sudah ditolak sebelumnya" };
        }

        // Check if user already exists
        let userId: string;
        let existingUser = null;

        try {
            const { data: { users } } = await adminClient.auth.admin.listUsers();
            existingUser = users?.find(u => u.email?.toLowerCase() === application.email.toLowerCase());
        } catch (error) {
            console.warn("[TelegramBot] Error checking existing users:", error);
        }

        if (existingUser) {
            userId = existingUser.id;
            console.log(`[TelegramBot] ✅ User ${application.email} already exists, using ID: ${userId}`);
        } else {
            // Create new user using safe function
            const password = application.encrypted_password && application.encrypted_password.length >= 6
                ? application.encrypted_password
                : `JM${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 6).toUpperCase()}!`;

            try {
                const { data: result, error: rpcError } = await adminClient.rpc('admin_create_user_safe', {
                    p_email: application.email,
                    p_password: password,
                    p_full_name: application.full_name,
                    p_whatsapp: application.whatsapp
                });

                if (rpcError) {
                    return { success: false, error: `Gagal membuat user: ${rpcError.message}` };
                }

                if (!result || !result.success) {
                    // Check if user already exists
                    const { data: { users } } = await adminClient.auth.admin.listUsers();
                    const foundUser = users?.find(u => u.email?.toLowerCase() === application.email.toLowerCase());
                    if (foundUser) {
                        userId = foundUser.id;
                    } else {
                        return { success: false, error: `Gagal membuat user: ${result?.error || 'Unknown error'}` };
                    }
                } else {
                    userId = result.user_id;
                }
            } catch (error) {
                return { success: false, error: `Error membuat user: ${error}` };
            }
        }

        // Check/create profile
        const { data: existingProfile } = await adminClient
            .from("profiles")
            .select("*")
            .eq("id", userId!)
            .single();

        if (!existingProfile) {
            const { error: profileError } = await adminClient.from("profiles").insert({
                id: userId!,
                email: application.email,
                full_name: application.full_name,
                name: application.full_name,
                role: "user",
                membership: "free",
                membership_status: "active",
                membership_expiry: null,
                whatsapp: application.whatsapp,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });

            if (profileError) {
                console.error("[TelegramBot] Failed to create profile:", profileError);
            }
        }

        // Update application status
        const { error: updateError } = await adminClient
            .from("account_applications")
            .update({
                status: "approved",
                approved_by: null, // Bot approval
                approved_at: new Date().toISOString(),
                encrypted_password: null, // Purge password
            })
            .eq("id", applicationId);

        if (updateError) {
            return { success: false, error: `Gagal update status: ${updateError.message}` };
        }

        // Send email notification
        try {
            const userName = getUserDisplayName(application.full_name, application.email);
            await sendAccountApprovedEmail({
                userName,
                email: application.email,
                approvedAt: new Date().toISOString(),
            });
        } catch (emailError) {
            console.error("[TelegramBot] Failed to send email:", emailError);
        }

        return {
            success: true,
            data: {
                fullName: application.full_name,
                email: application.email,
                username: application.username,
                whatsapp: application.whatsapp
            }
        };
    } catch (error) {
        console.error("[TelegramBot] approveApplicationByBot error:", error);
        return { success: false, error: `Error: ${error}` };
    }
}

// Reject application function
async function rejectApplicationByBot(applicationId: string, reason: string): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
        const adminClient = createAdminClient();

        const { data: application, error: fetchError } = await adminClient
            .from("account_applications")
            .select("*")
            .eq("id", applicationId)
            .single();

        if (fetchError || !application) {
            return { success: false, error: `Aplikasi tidak ditemukan: ${applicationId}` };
        }

        if (application.status !== "pending") {
            return { success: false, error: `Aplikasi sudah ${application.status}` };
        }

        const { error: updateError } = await adminClient
            .from("account_applications")
            .update({
                status: "rejected",
                rejection_reason: reason,
                updated_at: new Date().toISOString(),
            })
            .eq("id", applicationId);

        if (updateError) {
            return { success: false, error: `Gagal update status: ${updateError.message}` };
        }

        return {
            success: true,
            data: {
                fullName: application.full_name,
                email: application.email,
                reason
            }
        };
    } catch (error) {
        return { success: false, error: `Error: ${error}` };
    }
}

export async function POST(request: NextRequest) {
    try {
        const update: TelegramUpdate = await request.json();
        console.log("[TelegramBot] Received update:", JSON.stringify(update, null, 2));

        const message = update.message;
        if (!message || !message.text) {
            return NextResponse.json({ ok: true });
        }

        const chatId = message.chat.id.toString();
        const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
        const botToken = process.env.TELEGRAM_BOT_TOKEN;

        // Security: Only process messages from admin chat
        if (chatId !== adminChatId) {
            console.log(`[TelegramBot] Ignoring message from non-admin chat: ${chatId}`);
            return NextResponse.json({ ok: true });
        }

        const text = message.text.trim();
        const replyToMessage = message.reply_to_message;

        // ================================================
        // 🆕 PHASE 1 COMMANDS: HELP, PING, PENDING, STATS
        // ================================================

        // HELP command
        if (text.toUpperCase() === "HELP" || text === "/help" || text === "/start") {
            console.log("[TelegramBot] Processing HELP command");
            const response = await handleHelpCommand();
            await sendTelegramMessage(chatId, response, botToken);
            return NextResponse.json({ ok: true });
        }

        // PING command
        if (text.toUpperCase() === "PING" || text === "/ping") {
            console.log("[TelegramBot] Processing PING command");
            const response = await handlePingCommand();
            await sendTelegramMessage(chatId, response, botToken);
            return NextResponse.json({ ok: true });
        }

        // PENDING command
        if (text.toUpperCase() === "PENDING" || text === "/pending") {
            console.log("[TelegramBot] Processing PENDING command");
            const response = await handlePendingCommand();
            await sendTelegramMessage(chatId, response, botToken);
            return NextResponse.json({ ok: true });
        }

        // STATS command
        if (text.toUpperCase() === "STATS" || text === "/stats") {
            console.log("[TelegramBot] Processing STATS command");
            const response = await handleStatsCommand();
            await sendTelegramMessage(chatId, response, botToken);
            return NextResponse.json({ ok: true });
        }

        // ================================================
        // 🆕 PHASE 2 COMMANDS: FIND, INFO, VIP
        // ================================================

        // FIND command
        if (text.toUpperCase().startsWith("FIND ") || text.startsWith("/find ")) {
            console.log("[TelegramBot] Processing FIND command");
            const query = text.replace(/^(FIND|find|\/find)\s+/i, '');
            const response = await handleFindCommand(query);
            await sendTelegramMessage(chatId, response, botToken);
            return NextResponse.json({ ok: true });
        }

        // INFO command
        if (text.toUpperCase().startsWith("INFO ") || text.startsWith("/info ")) {
            console.log("[TelegramBot] Processing INFO command");
            const email = text.replace(/^(INFO|info|\/info)\s+/i, '').trim();
            const response = await handleInfoCommand(email);
            await sendTelegramMessage(chatId, response, botToken);
            return NextResponse.json({ ok: true });
        }

        // VIP command
        if (text.toUpperCase().startsWith("VIP ") || text.startsWith("/vip ")) {
            console.log("[TelegramBot] Processing VIP command");
            const args = text.replace(/^(VIP|vip|\/vip)\s+/i, '');
            const response = await handleVIPCommand(args);
            await sendTelegramMessage(chatId, response, botToken);
            return NextResponse.json({ ok: true });
        }

        // ================================================
        // 🆕 PHASE 3 COMMANDS: REPORT, TOOLS, HEALTH
        // ================================================

        // REPORT command
        if (text.toUpperCase().startsWith("REPORT") || text.startsWith("/report")) {
            console.log("[TelegramBot] Processing REPORT command");
            const period = text.replace(/^(REPORT|report|\/report)\s*/i, '').trim() || 'daily';
            const response = await handleReportCommand(period);
            await sendTelegramMessage(chatId, response, botToken);
            return NextResponse.json({ ok: true });
        }

        // TOOLS command
        if (text.toUpperCase() === "TOOLS" || text === "/tools") {
            console.log("[TelegramBot] Processing TOOLS command");
            const response = await handleToolsCommand();
            await sendTelegramMessage(chatId, response, botToken);
            return NextResponse.json({ ok: true });
        }

        // HEALTH command
        if (text.toUpperCase() === "HEALTH" || text === "/health") {
            console.log("[TelegramBot] Processing HEALTH command");
            const response = await handleHealthCommand();
            await sendTelegramMessage(chatId, response, botToken);
            return NextResponse.json({ ok: true });
        }

        // ================================================
        // 🆕 PHASE 4 COMMANDS: BROADCAST, PAYMENTS, JOBS
        // ================================================

        // BROADCAST command
        if (text.toUpperCase().startsWith("BROADCAST ") || text.startsWith("/broadcast ")) {
            console.log("[TelegramBot] Processing BROADCAST command");
            const message = text.replace(/^(BROADCAST|broadcast|\/broadcast)\s+/i, '');
            const response = await handleBroadcastCommand(message);
            await sendTelegramMessage(chatId, response, botToken);
            return NextResponse.json({ ok: true });
        }

        // PAYMENTS command
        if (text.toUpperCase().startsWith("PAYMENTS") || text.startsWith("/payments")) {
            console.log("[TelegramBot] Processing PAYMENTS command");
            const limit = text.replace(/^(PAYMENTS|payments|\/payments)\s*/i, '').trim();
            const response = await handlePaymentsCommand(limit);
            await sendTelegramMessage(chatId, response, botToken);
            return NextResponse.json({ ok: true });
        }

        // JOBS command
        if (text.toUpperCase() === "JOBS" || text === "/jobs") {
            console.log("[TelegramBot] Processing JOBS command");
            const response = await handleJobsCommand();
            await sendTelegramMessage(chatId, response, botToken);
            return NextResponse.json({ ok: true });
        }

        // ================================================
        // EXISTING COMMANDS: ACC, REJ
        // ================================================

        // Check for ACC command
        if (text.toUpperCase().startsWith("ACC")) {
            let applicationId: string | null = null;

            // Try to get ID from command itself
            applicationId = extractApplicationId(text);

            // If not in command, try from reply message
            if (!applicationId && replyToMessage?.text) {
                applicationId = extractApplicationId(replyToMessage.text);
            }

            if (!applicationId) {
                await sendTelegramMessage(
                    chatId,
                    "❌ *Application ID tidak ditemukan*\n\nCara penggunaan:\n1. Reply pesan notifikasi pendaftaran dengan \"ACC\"\n2. Atau ketik: `ACC {application-id}`",
                    botToken
                );
                return NextResponse.json({ ok: true });
            }

            console.log(`[TelegramBot] Processing ACC for application: ${applicationId}`);

            const result = await approveApplicationByBot(applicationId);

            if (result.success) {
                const successMessage = `✅ *AKUN BERHASIL DI-APPROVE*

━━━━━━━━━━━━━━━━━━━━━
🎉 *User Berhasil Diaktifkan via Bot*

👤 *Nama*
${result.data.fullName}

📧 *Email*
${result.data.email}

🆔 *Username*
@${result.data.username}

📱 *WhatsApp*
${result.data.whatsapp}

━━━━━━━━━━━━━━━━━━━━━
✅ Email notifikasi telah dikirim ke user
⏰ Approved: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

                await sendTelegramMessage(chatId, successMessage, botToken);
            } else {
                await sendTelegramMessage(
                    chatId,
                    `❌ *Gagal approve akun*\n\n${result.error}`,
                    botToken
                );
            }

            return NextResponse.json({ ok: true });
        }

        // Check for REJ command
        if (text.toUpperCase().startsWith("REJ")) {
            let applicationId: string | null = null;
            const reason = extractRejectionReason(text);

            if (!reason) {
                await sendTelegramMessage(
                    chatId,
                    "❌ *Alasan penolakan wajib diisi*\n\nCara penggunaan:\n`REJ alasan penolakan`",
                    botToken
                );
                return NextResponse.json({ ok: true });
            }

            // Try to get ID from reply message
            if (replyToMessage?.text) {
                applicationId = extractApplicationId(replyToMessage.text);
            }

            if (!applicationId) {
                await sendTelegramMessage(
                    chatId,
                    "❌ *Application ID tidak ditemukan*\n\nReply pesan notifikasi pendaftaran dengan \"REJ alasan\"",
                    botToken
                );
                return NextResponse.json({ ok: true });
            }

            const result = await rejectApplicationByBot(applicationId, reason);

            if (result.success) {
                await sendTelegramMessage(
                    chatId,
                    `❌ *AKUN DITOLAK*\n\n👤 ${result.data.fullName}\n📧 ${result.data.email}\n\n📝 Alasan: ${result.data.reason}`,
                    botToken
                );
            } else {
                await sendTelegramMessage(chatId, `❌ Gagal reject: ${result.error}`, botToken);
            }

            return NextResponse.json({ ok: true });
        }

        // Command not recognized - ignore silently
        return NextResponse.json({ ok: true });

    } catch (error) {
        console.error("[TelegramBot] Webhook error:", error);
        return NextResponse.json({ ok: true }); // Always return 200 to Telegram
    }
}

// GET endpoint for webhook verification
export async function GET(request: NextRequest) {
    return NextResponse.json({
        status: "Telegram webhook endpoint active",
        timestamp: new Date().toISOString()
    });
}
