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
