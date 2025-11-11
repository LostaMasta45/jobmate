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
    // Get settings from database instead of env
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    
    const { data: settings, error } = await supabase
      .from("admin_settings")
      .select("telegram_bot_token, telegram_admin_chat_id")
      .eq("id", 1)
      .single();

    if (error || !settings) {
      console.error("[Telegram] Failed to get settings from database:", error);
      // Fallback to env
      const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      
      if (!adminChatId || !botToken) {
        console.error("[Telegram] Admin chat ID not configured in env or database");
        return false;
      }
      
      return await sendTelegramMessage(adminChatId, message, botToken);
    }

    if (!settings.telegram_admin_chat_id) {
      console.error("[Telegram] Admin chat ID not configured in database");
      return false;
    }

    console.log("[Telegram] Using settings from database");
    return await sendTelegramMessage(
      settings.telegram_admin_chat_id, 
      message, 
      settings.telegram_bot_token
    );
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
