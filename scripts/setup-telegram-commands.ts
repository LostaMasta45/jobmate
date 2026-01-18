/**
 * Script untuk mengatur menu command di Telegram Bot
 * Jalankan sekali setelah deploy: npx ts-node scripts/setup-telegram-commands.ts
 */

// Load environment variables manually
import { config } from "dotenv";
config();

interface BotCommand {
    command: string;
    description: string;
}

const commands: BotCommand[] = [
    { command: "help", description: "📋 Tampilkan daftar command" },
    { command: "stats", description: "📊 Statistik hari ini" },
    { command: "pending", description: "⏳ Lihat aplikasi pending" },
    { command: "find", description: "🔎 Cari user" },
    { command: "info", description: "👤 Detail user" },
    { command: "vip", description: "⭐ Upgrade user ke VIP" },
    { command: "report", description: "📈 Generate laporan" },
    { command: "tools", description: "🛠️ Statistik tools" },
    { command: "health", description: "🏥 Cek status sistem" },
    { command: "jobs", description: "💼 Statistik lowongan" },
    { command: "payments", description: "💳 Transaksi payment" },
];

async function setupBotCommands() {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
        console.error("❌ TELEGRAM_BOT_TOKEN tidak ditemukan di environment variables!");
        console.log("\nPastikan file .env sudah ada dan berisi TELEGRAM_BOT_TOKEN");
        process.exit(1);
    }

    console.log("🤖 Setting up Telegram Bot Commands...\n");

    try {
        // Set commands untuk bot
        const response = await fetch(
            `https://api.telegram.org/bot${botToken}/setMyCommands`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ commands }),
            }
        );

        const result = await response.json();

        if (result.ok) {
            console.log("✅ Bot commands berhasil diatur!\n");
            console.log("📋 Daftar command yang terdaftar:");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            commands.forEach((cmd) => {
                console.log(`  /${cmd.command} - ${cmd.description}`);
            });
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            console.log("💡 Sekarang ketik '/' di chat bot untuk melihat menu command!");
        } else {
            console.error("❌ Gagal mengatur commands:", result);
        }

        // Get current commands untuk verifikasi
        const verifyResponse = await fetch(
            `https://api.telegram.org/bot${botToken}/getMyCommands`
        );
        const verifyResult = await verifyResponse.json();

        if (verifyResult.ok) {
            console.log("\n✅ Verifikasi: Commands saat ini di bot:");
            verifyResult.result.forEach((cmd: BotCommand) => {
                console.log(`   /${cmd.command} - ${cmd.description}`);
            });
        }

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

// Run the script
setupBotCommands();
