export async function sendTelegramMessage(
  chatId: string,
  message: string,
  botToken?: string
): Promise<boolean> {
  try {
    const token = botToken || process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.error("[Telegram] Bot token not configured");
      return false;
    }

    console.log("[Telegram] Sending message to chat:", chatId);
    console.log("[Telegram] Message preview:", message.substring(0, 100));

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
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
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("[Telegram] API Error:", result);
      return false;
    }

    console.log("[Telegram] Message sent successfully:", result);
    return true;
  } catch (error) {
    console.error("[Telegram] Failed to send message:", error);
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
