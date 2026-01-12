export async function sendTelegramMessage(
  chatId: string,
  message: string,
  botToken?: string,
  retries: number = 2
): Promise<boolean> {
  try {
    const token = botToken || process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.error("[Telegram] Bot token not configured");
      return false;
    }

    // Validate message length (Telegram limit: 4096 chars)
    if (message.length > 4096) {
      console.warn("[Telegram] Message too long, truncating...");
      message = message.substring(0, 4090) + "...";
    }

    console.log("[Telegram] Sending message to chat:", chatId);
    console.log("[Telegram] Message length:", message.length);
    console.log("[Telegram] Message preview:", message.substring(0, 150));

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    // Attempt with retry logic
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown",
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Try to parse response
        let result;
        try {
          result = await response.json();
        } catch (jsonError) {
          console.error("[Telegram] Failed to parse response JSON:", jsonError);
          result = { error: "Invalid JSON response" };
        }

        if (!response.ok) {
          console.error(`[Telegram] API Error (attempt ${attempt + 1}/${retries + 1}):`, result);

          // Retry on server errors (5xx)
          if (response.status >= 500 && attempt < retries) {
            console.log(`[Telegram] Retrying in ${(attempt + 1) * 1000}ms...`);
            await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 1000));
            continue;
          }

          return false;
        }

        console.log("[Telegram] Message sent successfully");
        return true;
      } catch (fetchError: any) {
        console.error(`[Telegram] Fetch error (attempt ${attempt + 1}/${retries + 1}):`, fetchError.message);

        // Retry on network errors
        if (attempt < retries) {
          console.log(`[Telegram] Retrying in ${(attempt + 1) * 1000}ms...`);
          await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 1000));
          continue;
        }

        throw fetchError;
      }
    }

    return false;
  } catch (error: any) {
    console.error("[Telegram] Failed to send message after retries:", error.message || error);
    return false;
  }
}

export async function sendTelegramPhoto(
  chatId: string,
  photoUrl: string,
  caption?: string,
  botToken?: string
): Promise<boolean> {
  try {
    const token = botToken || process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.error("[Telegram] Bot token not configured");
      return false;
    }

    console.log("[Telegram] Sending photo to chat:", chatId);
    console.log("[Telegram] Photo URL:", photoUrl);

    const url = `https://api.telegram.org/bot${token}/sendPhoto`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        photo: photoUrl,
        caption: caption || "",
        parse_mode: "Markdown",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("[Telegram] Photo send error:", result);
      return false;
    }

    console.log("[Telegram] Photo sent successfully");
    return true;
  } catch (error) {
    console.error("[Telegram] Failed to send photo:", error);
    return false;
  }
}

export async function sendAdminNotification(message: string): Promise<boolean> {
  try {
    // Try to get from database (only works in Next.js request context)
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();

      const { data: settings, error } = await supabase
        .from("admin_settings")
        .select("telegram_bot_token, telegram_admin_chat_id")
        .eq("id", 1)
        .single();

      if (!error && settings && settings.telegram_admin_chat_id) {
        console.log("[Telegram] Using settings from database");
        return await sendTelegramMessage(
          settings.telegram_admin_chat_id,
          message,
          settings.telegram_bot_token
        );
      }
    } catch (dbError) {
      // Ignore database errors (happens in standalone scripts)
      console.log("[Telegram] Database unavailable, using environment variables");
    }

    // Fallback to env (works everywhere)
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!adminChatId || !botToken) {
      console.error("[Telegram] Admin chat ID not configured in env or database");
      return false;
    }

    return await sendTelegramMessage(adminChatId, message, botToken);
  } catch (error) {
    console.error("[Telegram] sendAdminNotification error:", error);
    return false;
  }
}

export async function notifyNewApplication(data: {
  fullName: string;
  username: string;
  email: string;
  whatsapp: string;
  applicationId: string;
  proofPhotoUrl?: string;
}): Promise<boolean> {
  const message = `🔔 *PENDAFTARAN AKUN BARU*

━━━━━━━━━━━━━━━━━━━━━
👤 *Nama Lengkap*
${data.fullName}

🆔 *Username*
@${data.username}

📧 *Email*
${data.email}

📱 *WhatsApp*
${data.whatsapp}

📊 *Status*
⏳ PENDING - Menunggu Approval

🔑 *Application ID*
\`${data.applicationId}\`

━━━━━━━━━━━━━━━━━━━━━
⚡ *Action Required:*
Segera review dan approve/reject aplikasi ini di Admin Dashboard

⏰ Submitted: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

  // Send photo first if available
  if (data.proofPhotoUrl) {
    try {
      const photoCaption = `📸 *BUKTI PEMBAYARAN*\n\n👤 ${data.fullName}\n📧 ${data.email}\n🆔 ${data.applicationId}`;
      await sendTelegramPhoto(
        process.env.TELEGRAM_ADMIN_CHAT_ID || "",
        data.proofPhotoUrl,
        photoCaption
      );
      console.log("[Telegram] Proof photo sent successfully");
    } catch (error) {
      console.error("[Telegram] Failed to send proof photo:", error);
    }
  }

  // Then send detailed message
  return await sendAdminNotification(message);
}

export async function notifyApplicationApproved(
  chatId: string,
  fullName: string
): Promise<boolean> {
  const message = `✅ *Pengajuan Akun Disetujui*

Halo ${fullName},

Selamat! Pengajuan akun JobMate Anda telah disetujui.

Silakan login ke aplikasi menggunakan email dan password yang Anda daftarkan:
🔗 ${process.env.NEXT_PUBLIC_APP_URL || "https://jobmate.app"}/auth/sign-in

Terima kasih telah bergabung dengan JobMate! 🎉`;

  return await sendTelegramMessage(chatId, message);
}

export async function notifyApplicationRejected(
  chatId: string,
  fullName: string,
  reason: string
): Promise<boolean> {
  const message = `❌ *Pengajuan Akun Ditolak*

Halo ${fullName},

Mohon maaf, pengajuan akun JobMate Anda tidak dapat disetujui.

Alasan: ${reason}

Anda dapat mengajukan kembali setelah memenuhi persyaratan yang disebutkan di atas.

Terima kasih atas pengertiannya.`;

  return await sendTelegramMessage(chatId, message);
}

export async function notifyAdminAccountApproved(data: {
  fullName: string;
  email: string;
  username: string;
  whatsapp: string;
  approvedBy: string;
  applicationId: string;
}): Promise<boolean> {
  const message = `✅ *AKUN TELAH DIAPPROVE*

━━━━━━━━━━━━━━━━━━━━━
🎉 *User Berhasil Diaktifkan*

👤 *Nama*
${data.fullName}

🆔 *Username*
@${data.username}

📧 *Email*
${data.email}

📱 *WhatsApp*
${data.whatsapp}

━━━━━━━━━━━━━━━━━━━━━
👨‍💼 *Approved By*
${data.approvedBy}

🔑 *Application ID*
\`${data.applicationId}\`

✉️ *Email Notifikasi*
Email approval otomatis telah dikirim ke user

⏰ Approved: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━`;

  return await sendAdminNotification(message);
}

export async function notifyAdminAccountRejected(data: {
  fullName: string;
  email: string;
  reason: string;
  rejectedBy: string;
  applicationId: string;
}): Promise<boolean> {
  const message = `❌ *AKUN DITOLAK*

━━━━━━━━━━━━━━━━━━━━━
🚫 *Aplikasi Rejected*

👤 *Nama*
${data.fullName}

📧 *Email*
${data.email}

📝 *Alasan Penolakan*
${data.reason}

━━━━━━━━━━━━━━━━━━━━━
👨‍💼 *Rejected By*
${data.rejectedBy}

🔑 *Application ID*
\`${data.applicationId}\`

⏰ Rejected: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━`;

  return await sendAdminNotification(message);
}

export async function notifyAdminVIPUpgrade(data: {
  fullName: string;
  email: string;
  membershipType: 'vip_basic' | 'vip_premium';
  previousMembership: string;
  membershipExpiry: string | null;
  upgradedBy: string;
}): Promise<boolean> {
  const membershipEmoji = data.membershipType === 'vip_premium' ? '👑' : '⭐';
  const membershipLabel = data.membershipType === 'vip_premium' ? 'VIP PREMIUM' : 'VIP BASIC';
  const expiryText = data.membershipExpiry
    ? `📅 Expired: ${new Date(data.membershipExpiry).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`
    : '♾️ Lifetime Access';

  const message = `${membershipEmoji} *UPGRADE KE ${membershipLabel}*

━━━━━━━━━━━━━━━━━━━━━
🎉 *User Berhasil Di-Upgrade*

👤 *Nama*
${data.fullName}

📧 *Email*
${data.email}

━━━━━━━━━━━━━━━━━━━━━
📊 *Membership Status*

🔄 *Previous:* ${data.previousMembership.toUpperCase()}
✨ *Current:* ${membershipLabel}

${expiryText}

━━━━━━━━━━━━━━━━━━━━━
👨‍💼 *Upgraded By*
${data.upgradedBy}

✉️ *Email Notifikasi*
Email upgrade otomatis telah dikirim ke user

⏰ Upgraded: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━`;

  return await sendAdminNotification(message);
}

export async function notifyAdminAccountDeleted(data: {
  fullName: string;
  email: string;
  whatsapp: string;
  status: string;
  reason?: string;
  deletedBy: string;
  applicationId: string;
}): Promise<boolean> {
  const reasonText = data.reason ? `\n\n📝 *Alasan*\n${data.reason}` : '';

  const message = `🗑️ *APLIKASI DIHAPUS*

━━━━━━━━━━━━━━━━━━━━━
⚠️ *Account Application Deleted*

👤 *Nama*
${data.fullName}

📧 *Email*
${data.email}

📱 *WhatsApp*
${data.whatsapp}

📊 *Status Sebelumnya*
${data.status.toUpperCase()}${reasonText}

━━━━━━━━━━━━━━━━━━━━━
👨‍💼 *Deleted By*
${data.deletedBy}

🔑 *Application ID*
\`${data.applicationId}\`

⏰ Deleted: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━`;

  return await sendAdminNotification(message);
}

// ================================================
// 🆕 OPTION B: SIMPLIFIED MONITORING FEATURES
// ================================================

/**
 * Tool Usage Tracking
 * Notifies admin when user uses a tool
 */
export async function notifyToolUsage(data: {
  userName: string;
  userEmail: string;
  membershipType: string;
  toolName: string;
  documentTitle?: string;
  usageCount: number;
  sameToolCount: number;
  quota?: { used: number; limit: number };
}): Promise<boolean> {
  try {
    // Get membership emoji
    const membershipEmoji =
      data.membershipType === 'vip_premium' ? '👑' :
        data.membershipType === 'vip_basic' ? '⭐' :
          '🆓';

    // Format quota info
    let quotaText = '';
    if (data.quota) {
      quotaText = `\n📊 *Quota:* ${data.quota.used}/${data.quota.limit}`;
    } else {
      quotaText = '\n♾️ *Quota:* Unlimited';
    }

    // Warning if high usage
    let warningText = '';
    if (data.sameToolCount >= 20) {
      warningText = '\n\n⚠️ *HIGH USAGE ALERT* - User menggunakan tool yang sama >20x hari ini';
    }

    // Escape special characters for Telegram Markdown
    const escapeMarkdown = (text: string) => {
      return text.replace(/[_*\[\]()~`>#+\-=|{}.!]/g, '\\$&');
    };

    const message = `🛠️ *TOOL USED*

━━━━━━━━━━━━━━━━━━━━━
👤 *User*
${escapeMarkdown(data.userName)}
📧 ${escapeMarkdown(data.userEmail)}
${membershipEmoji} ${data.membershipType.toUpperCase().replace(/_/g, ' ')}

🔧 *Tool*
${escapeMarkdown(data.toolName)}

${data.documentTitle ? `📄 *Document*\n"${escapeMarkdown(data.documentTitle)}"\n` : ''}
📈 *Usage Today*
• Total tools: ${data.usageCount}x
• Same tool: ${data.sameToolCount}x${quotaText}${warningText}

⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━`;

    return await sendAdminNotification(message);
  } catch (error) {
    console.error('[Telegram] Failed to send tool usage notification:', error);
    return false;
  }
}

/**
 * Daily Admin Summary
 * Comprehensive daily report sent every morning
 */
export async function sendDailyAdminSummary(stats: {
  date: string;
  totalUsers: number;
  newUsers: number;
  activeUsers24h: number;
  vipBasic: number;
  vipPremium: number;
  pendingApplications: number;
  approvedToday: number;
  rejectedToday: number;
  totalToolUsage: number;
  cvGenerated: number;
  coverLetters: number;
  emailTemplates: number;
  revenueToday?: number;
  newSubscriptions?: number;
  dashboardUrl?: string;
}): Promise<boolean> {
  try {
    // Format numbers with commas
    const fmt = (num: number) => num.toLocaleString('id-ID');

    // Pending applications alert
    const pendingAlert = stats.pendingApplications > 0
      ? ` ⚠️`
      : '';

    // Growth indicators
    const newUsersIndicator = stats.newUsers > 0 ? ` (+${stats.newUsers})` : '';
    const subscriptionsIndicator = stats.newSubscriptions ? ` (+${stats.newSubscriptions})` : '';

    // Revenue section (optional)
    let revenueSection = '';
    if (stats.revenueToday !== undefined) {
      revenueSection = `
💰 *REVENUE*
• New Subscriptions: ${fmt(stats.newSubscriptions || 0)}${subscriptionsIndicator}
• Total Revenue: Rp ${fmt(stats.revenueToday)}
`;
    }

    // Dashboard link
    const dashboardLink = stats.dashboardUrl || process.env.NEXT_PUBLIC_APP_URL + '/admin/dashboard';

    const message = `📊 *DAILY ADMIN SUMMARY*
${stats.date}

━━━━━━━━━━━━━━━━━━━━━
👥 *USERS*
• Total Users: ${fmt(stats.totalUsers)}${newUsersIndicator}
• Active (24h): ${fmt(stats.activeUsers24h)}
• VIP Basic: ${fmt(stats.vipBasic)}
• VIP Premium: ${fmt(stats.vipPremium)}

📝 *APPLICATIONS*
• ⏳ Pending: ${fmt(stats.pendingApplications)}${pendingAlert}
• ✅ Approved Today: ${fmt(stats.approvedToday)}
• ❌ Rejected Today: ${fmt(stats.rejectedToday)}

🛠️ *TOOL USAGE (24h)*
• Total: ${fmt(stats.totalToolUsage)}
• CV Generated: ${fmt(stats.cvGenerated)}
• Cover Letters: ${fmt(stats.coverLetters)}
• Email Templates: ${fmt(stats.emailTemplates)}
${revenueSection}
━━━━━━━━━━━━━━━━━━━━━
🔗 [Admin Dashboard](${dashboardLink})

⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

    const success = await sendAdminNotification(message);

    if (success) {
      console.log('[Telegram] Daily summary sent successfully');
    }

    return success;
  } catch (error) {
    console.error('[Telegram] Failed to send daily summary:', error);
    return false;
  }
}

/**
 * System Error Alert (Bonus - optional)
 * Simple error notification for critical issues
 */
export async function notifySystemError(data: {
  errorType: string;
  errorMessage: string;
  location?: string;
  affectedUser?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}): Promise<boolean> {
  try {
    const severityEmoji = {
      'CRITICAL': '🔴',
      'HIGH': '🟠',
      'MEDIUM': '🟡',
      'LOW': '🟢'
    }[data.severity || 'MEDIUM'];

    const message = `🚨 *SYSTEM ERROR*

━━━━━━━━━━━━━━━━━━━━━
${severityEmoji} *Severity:* ${data.severity || 'MEDIUM'}

⚠️ *Error Type*
${data.errorType}

📝 *Message*
${data.errorMessage}

${data.location ? `📍 *Location*\n${data.location}\n` : ''}
${data.affectedUser ? `👤 *Affected User*\n${data.affectedUser}\n` : ''}
⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━`;

    return await sendAdminNotification(message);
  } catch (error) {
    console.error('[Telegram] Failed to send error notification:', error);
    return false;
  }
}

/**
 * New Job Posting Alert
 * Notifikasi menarik saat admin menambahkan lowongan baru
 */
export async function notifyNewJobPosting(data: {
  jobTitle: string;
  companyName: string;
  location: string;
  jobType?: string;
  categories?: string[];
  salary?: string;
  deadline?: string;
  posterUrl?: string;
  viewUrl: string;
  addedBy: string;
}): Promise<boolean> {
  try {
    // Escape special characters for Telegram Markdown
    const escapeMarkdown = (text: string) => {
      return text.replace(/[_*\[\]()~`>#+\-=|{}.!]/g, '\\$&');
    };

    // Format salary
    const salaryText = data.salary
      ? `\n💰 *Gaji:* ${escapeMarkdown(data.salary)}`
      : '';

    // Format deadline with countdown
    let deadlineText = '';
    if (data.deadline) {
      try {
        const deadlineDate = new Date(data.deadline);
        const today = new Date();
        const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
          const urgencyEmoji = diffDays <= 3 ? '🔥' : diffDays <= 7 ? '⏰' : '📅';
          deadlineText = `\n${urgencyEmoji} *Deadline:* ${diffDays} hari lagi (${deadlineDate.toLocaleDateString('id-ID')})`;
        }
      } catch (e) {
        // Ignore date parsing errors
      }
    }

    // Format categories (max 3)
    let categoriesText = '';
    if (data.categories && data.categories.length > 0) {
      const displayCategories = data.categories.slice(0, 3);
      const categoryTags = displayCategories.map(cat => `#${cat.replace(/\s+/g, '')}`).join(' ');
      const moreText = data.categories.length > 3 ? ` +${data.categories.length - 3}` : '';
      categoriesText = `\n🏷️ ${categoryTags}${moreText}`;
    }

    // Job type emoji
    const jobTypeEmoji = data.jobType?.toLowerCase().includes('remote')
      ? '🏠'
      : data.jobType?.toLowerCase().includes('hybrid')
        ? '🔄'
        : '🏢';

    const jobTypeText = data.jobType
      ? `\n${jobTypeEmoji} *Tipe:* ${escapeMarkdown(data.jobType)}`
      : '';

    // Main message
    const message = `🚀 *LOWONGAN BARU DIPUBLIKASIKAN!*

━━━━━━━━━━━━━━━━━━━━━
💼 *${escapeMarkdown(data.jobTitle)}*

🏢 *Perusahaan*
${escapeMarkdown(data.companyName)}

📍 *Lokasi*
${escapeMarkdown(data.location)}${jobTypeText}${salaryText}${deadlineText}${categoriesText}

━━━━━━━━━━━━━━━━━━━━━
👀 *[Lihat Detail Lowongan](${data.viewUrl})*

👨‍💼 *Ditambahkan oleh:* ${escapeMarkdown(data.addedBy)}
⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}

━━━━━━━━━━━━━━━━━━━━━
✨ *Tips Sukses Melamar:*
• Baca deskripsi dengan teliti
• Siapkan CV & portfolio terbaik
• Kirim lamaran sebelum deadline
• Follow up jika perlu

💪 Semangat mencari kerja!`;

    // Send poster photo first if available
    if (data.posterUrl) {
      try {
        const caption = `🚀 *LOWONGAN BARU!*\n\n💼 ${escapeMarkdown(data.jobTitle)}\n🏢 ${escapeMarkdown(data.companyName)}\n📍 ${escapeMarkdown(data.location)}\n\n[Lihat Detail](${data.viewUrl})`;

        await sendTelegramPhoto(
          process.env.TELEGRAM_ADMIN_CHAT_ID || "",
          data.posterUrl,
          caption
        );
        console.log("[Telegram] Job poster sent successfully");

        // Wait a bit before sending detailed message
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("[Telegram] Failed to send job poster:", error);
      }
    }

    // Send detailed message
    const success = await sendAdminNotification(message);

    if (success) {
      console.log('[Telegram] New job notification sent successfully');
    }

    return success;
  } catch (error) {
    console.error('[Telegram] Failed to send new job notification:', error);
    return false;
  }
}

/**
 * Batch Jobs Posting Summary
 * Notifikasi ringkasan saat admin upload multiple lowongan sekaligus
 */
export async function notifyBatchJobsPosted(data: {
  totalJobs: number;
  successCount: number;
  failedCount: number;
  newCompanies: number;
  topJobs: Array<{ title: string; company: string; location: string }>;
  addedBy: string;
  dashboardUrl?: string;
}): Promise<boolean> {
  try {
    // Simple markdown escape - only escape critical characters
    const cleanText = (text: string) => {
      return text
        .replace(/[_*[\]()~`>#+=|{}.!]/g, '') // Remove special chars instead of escaping
        .trim();
    };

    // Success rate indicator
    const successRate = Math.round((data.successCount / data.totalJobs) * 100);
    const successEmoji = successRate === 100 ? '🎉' : successRate >= 80 ? '✅' : '⚠️';

    // Format top jobs (max 5, simplified)
    const topJobsList = data.topJobs.slice(0, 5).map((job, index) =>
      `${index + 1}. ${cleanText(job.title)}\n   🏢 ${cleanText(job.company)} | 📍 ${cleanText(job.location)}`
    ).join('\n\n');

    const moreJobsText = data.topJobs.length > 5
      ? `\n... dan ${data.topJobs.length - 5} lowongan lainnya`
      : '';

    // Dashboard link
    const dashboardLink = data.dashboardUrl || process.env.NEXT_PUBLIC_APP_URL + '/admin/vip-loker';

    // Build message without complex markdown
    let message = `📦 *BATCH UPLOAD LOWONGAN*\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `${successEmoji} *Upload Summary*\n\n`;
    message += `📊 Total Processed: ${data.totalJobs}\n`;
    message += `✅ Berhasil: ${data.successCount}\n`;

    if (data.failedCount > 0) {
      message += `❌ Gagal: ${data.failedCount}\n`;
    }

    message += `🏢 Perusahaan Baru: ${data.newCompanies}\n`;
    message += `📈 Success Rate: ${successRate}%\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🌟 *Lowongan Terbaru:*\n\n`;
    message += topJobsList;
    message += moreJobsText;
    message += `\n\n━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🔗 Lihat Dashboard: ${dashboardLink}\n\n`;
    message += `👨‍💼 Uploaded by: ${cleanText(data.addedBy)}\n`;
    message += `⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;

    if (data.successCount > 0) {
      message += `🎊 Lowongan siap dilihat member VIP!`;
    }

    console.log('[Telegram] Batch notification message prepared, length:', message.length);

    const success = await sendAdminNotification(message);

    if (success) {
      console.log('[Telegram] Batch jobs summary sent successfully');
    }

    return success;
  } catch (error) {
    console.error('[Telegram] Failed to send batch jobs summary:', error);
    return false;
  }
}

/**
 * Payment Success Notification
 * Notifikasi ke admin saat ada pembayaran berhasil
 */
export async function notifyPaymentSuccess(data: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  planType: 'basic' | 'premium';
  amount: number;
  paymentMethod: string;
  paymentGateway: 'midtrans' | 'xendit';
  orderId: string;
}): Promise<boolean> {
  try {
    const planEmoji = data.planType === 'premium' ? '👑' : '⭐';
    const planLabel = data.planType === 'premium' ? 'VIP PREMIUM' : 'VIP BASIC';
    const gatewayLabel = data.paymentGateway === 'midtrans' ? 'Midtrans' : 'Xendit';

    // Format amount
    const formattedAmount = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(data.amount);

    // Phone info if available
    const phoneText = data.customerPhone
      ? `\n📱 ${data.customerPhone}`
      : '';

    const message = `💳 *PEMBAYARAN BERHASIL!*

━━━━━━━━━━━━━━━━━━━━━
${planEmoji} *${planLabel}*
💰 *Amount:* ${formattedAmount}

👤 *Customer*
📧 ${data.customerEmail}${phoneText}
🔤 ${data.customerName}

💳 *Payment Details*
• Method: ${data.paymentMethod.toUpperCase()}
• Gateway: ${gatewayLabel}
• Order ID: \`${data.orderId}\`

━━━━━━━━━━━━━━━━━━━━━
⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}

🎉 User siap menggunakan fitur VIP!`;

    const success = await sendAdminNotification(message);

    if (success) {
      console.log('[Telegram] Payment success notification sent');
    }

    return success;
  } catch (error) {
    console.error('[Telegram] Failed to send payment success notification:', error);
    return false;
  }
}

/**
 * New Invoice Created Notification
 * Notifikasi saat invoice baru dibuat dan menunggu pembayaran
 */
export async function notifyNewInvoice(data: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  planType: 'basic' | 'premium';
  amount: number;
  invoiceUrl: string;
  orderId: string;
  paymentGateway: 'midtrans' | 'xendit';
  expiresAt?: string;
}): Promise<boolean> {
  try {
    const planEmoji = data.planType === 'premium' ? '👑' : '⭐';
    const planLabel = data.planType === 'premium' ? 'VIP PREMIUM' : 'VIP BASIC';
    const gatewayLabel = data.paymentGateway === 'midtrans' ? 'Midtrans' : 'Xendit';

    // Format amount
    const formattedAmount = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(data.amount);

    // Expiry info
    let expiryText = '';
    if (data.expiresAt) {
      const expiryDate = new Date(data.expiresAt);
      expiryText = `\n⏰ *Expires:* ${expiryDate.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;
    }

    // Phone info
    const phoneText = data.customerPhone
      ? `\n📱 ${data.customerPhone}`
      : '';

    const message = `📝 *INVOICE BARU DIBUAT*

━━━━━━━━━━━━━━━━━━━━━
${planEmoji} *${planLabel}*
💰 *Amount:* ${formattedAmount}
📊 *Status:* ⏳ PENDING

👤 *Customer*
📧 ${data.customerEmail}${phoneText}
🔤 ${data.customerName}

💳 *Invoice Details*
• Gateway: ${gatewayLabel}
• Order ID: \`${data.orderId}\`${expiryText}

🔗 [Lihat Invoice](${data.invoiceUrl})

━━━━━━━━━━━━━━━━━━━━━
⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}

⏳ Menunggu pembayaran dari customer...`;

    const success = await sendAdminNotification(message);

    if (success) {
      console.log('[Telegram] New invoice notification sent');
    }

    return success;
  } catch (error) {
    console.error('[Telegram] Failed to send new invoice notification:', error);
    return false;
  }
}

/**
 * Payment Expired Notification
 * Notifikasi saat invoice expired/kadaluarsa
 */
export async function notifyPaymentExpired(data: {
  customerName: string;
  customerEmail: string;
  planType: 'basic' | 'premium';
  amount: number;
  orderId: string;
  paymentGateway: 'midtrans' | 'xendit';
}): Promise<boolean> {
  try {
    const planLabel = data.planType === 'premium' ? 'VIP PREMIUM' : 'VIP BASIC';
    const gatewayLabel = data.paymentGateway === 'midtrans' ? 'Midtrans' : 'Xendit';

    // Format amount
    const formattedAmount = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(data.amount);

    const message = `⏰ *INVOICE EXPIRED*

━━━━━━━━━━━━━━━━━━━━━
🕐 *${planLabel}*
💰 *Amount:* ${formattedAmount}
📊 *Status:* ❌ EXPIRED

👤 *Customer*
📧 ${data.customerEmail}
🔤 ${data.customerName}

💳 *Payment Details*
• Gateway: ${gatewayLabel}
• Order ID: \`${data.orderId}\`

━━━━━━━━━━━━━━━━━━━━━
⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}

💡 Customer dapat membuat invoice baru jika masih berminat`;

    const success = await sendAdminNotification(message);

    if (success) {
      console.log('[Telegram] Payment expired notification sent');
    }

    return success;
  } catch (error) {
    console.error('[Telegram] Failed to send payment expired notification:', error);
    return false;
  }
}

/**
 * Payment Failed Notification
 * Notifikasi saat pembayaran gagal
 */
export async function notifyPaymentFailed(data: {
  customerName: string;
  customerEmail: string;
  planType: 'basic' | 'premium';
  amount: number;
  orderId: string;
  paymentGateway: 'midtrans' | 'xendit';
  failureReason?: string;
}): Promise<boolean> {
  try {
    const planLabel = data.planType === 'premium' ? 'VIP PREMIUM' : 'VIP BASIC';
    const gatewayLabel = data.paymentGateway === 'midtrans' ? 'Midtrans' : 'Xendit';

    // Format amount
    const formattedAmount = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(data.amount);

    // Failure reason if available
    const reasonText = data.failureReason
      ? `\n📝 *Reason:* ${data.failureReason}`
      : '';

    const message = `❌ *PEMBAYARAN GAGAL*

━━━━━━━━━━━━━━━━━━━━━
🚫 *${planLabel}*
💰 *Amount:* ${formattedAmount}
📊 *Status:* ❌ FAILED${reasonText}

👤 *Customer*
📧 ${data.customerEmail}
🔤 ${data.customerName}

💳 *Payment Details*
• Gateway: ${gatewayLabel}
• Order ID: \`${data.orderId}\`

━━━━━━━━━━━━━━━━━━━━━
⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}

⚠️ Customer mungkin perlu bantuan atau retry`;

    const success = await sendAdminNotification(message);

    if (success) {
      console.log('[Telegram] Payment failed notification sent');
    }

    return success;
  } catch (error) {
    console.error('[Telegram] Failed to send payment failed notification:', error);
    return false;
  }
}

/**
 * Weekly Admin Summary
 * Laporan mingguan komprehensif, dikirim setiap Senin pagi
 */
export async function sendWeeklyAdminSummary(stats: {
  weekStart: string;
  weekEnd: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  vipBasic: number;
  vipPremium: number;
  // Applications
  newApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  // Tool usage
  totalToolUsage: number;
  cvGenerated: number;
  coverLetters: number;
  emailTemplates: number;
  // Revenue
  totalRevenue?: number;
  totalOrders?: number;
  // Comparison with last week
  userGrowthPercent?: number;
  revenueGrowthPercent?: number;
  // Jobs
  newJobs?: number;
  dashboardUrl?: string;
}): Promise<boolean> {
  try {
    const fmt = (num: number) => num.toLocaleString('id-ID');

    // Growth indicators
    const userGrowth = stats.userGrowthPercent !== undefined
      ? (stats.userGrowthPercent >= 0 ? `📈 +${stats.userGrowthPercent}%` : `📉 ${stats.userGrowthPercent}%`)
      : '';

    const revenueGrowth = stats.revenueGrowthPercent !== undefined
      ? (stats.revenueGrowthPercent >= 0 ? `📈 +${stats.revenueGrowthPercent}%` : `📉 ${stats.revenueGrowthPercent}%`)
      : '';

    // Pending alert
    const pendingAlert = stats.pendingApplications > 0 ? ' ⚠️' : '';

    // Revenue section
    let revenueSection = '';
    if (stats.totalRevenue !== undefined) {
      const formattedRevenue = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(stats.totalRevenue);

      revenueSection = `
💰 *REVENUE*
• Total: ${formattedRevenue} ${revenueGrowth}
• Orders: ${fmt(stats.totalOrders || 0)}
`;
    }

    // Jobs section
    let jobsSection = '';
    if (stats.newJobs !== undefined && stats.newJobs > 0) {
      jobsSection = `
💼 *LOWONGAN*
• New Jobs: ${fmt(stats.newJobs)}
`;
    }

    const dashboardLink = stats.dashboardUrl || process.env.NEXT_PUBLIC_APP_URL + '/admin/dashboard';

    const message = `📈 *WEEKLY ADMIN SUMMARY*
${stats.weekStart} - ${stats.weekEnd}

━━━━━━━━━━━━━━━━━━━━━
👥 *USERS*
• Total Users: ${fmt(stats.totalUsers)} ${userGrowth}
• New Users: ${fmt(stats.newUsers)}
• Active Users: ${fmt(stats.activeUsers)}
• VIP Basic: ${fmt(stats.vipBasic)}
• VIP Premium: ${fmt(stats.vipPremium)}

📝 *APPLICATIONS*
• New: ${fmt(stats.newApplications)}
• ✅ Approved: ${fmt(stats.approvedApplications)}
• ❌ Rejected: ${fmt(stats.rejectedApplications)}
• ⏳ Pending: ${fmt(stats.pendingApplications)}${pendingAlert}

🛠️ *TOOL USAGE*
• Total: ${fmt(stats.totalToolUsage)}
• CV Generated: ${fmt(stats.cvGenerated)}
• Cover Letters: ${fmt(stats.coverLetters)}
• Email Templates: ${fmt(stats.emailTemplates)}
${revenueSection}${jobsSection}
━━━━━━━━━━━━━━━━━━━━━
🔗 [Admin Dashboard](${dashboardLink})

⏰ Generated: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

    const success = await sendAdminNotification(message);

    if (success) {
      console.log('[Telegram] Weekly summary sent successfully');
    }

    return success;
  } catch (error) {
    console.error('[Telegram] Failed to send weekly summary:', error);
    return false;
  }
}
