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
}): Promise<boolean> {
  const message = `🔔 *Request Pendaftaran JobMate*

👤 Nama: ${data.fullName}
🆔 Username: ${data.username}
📧 Email: ${data.email}
📱 HP: ${data.whatsapp}
📊 Status: PENDING

🔗 ID: ${data.applicationId}`;

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
