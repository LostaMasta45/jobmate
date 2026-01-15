/**
 * 🔗 SETUP TELEGRAM WEBHOOK
 * 
 * Script untuk mendaftarkan webhook URL ke Telegram Bot API
 * 
 * Usage:
 * npx tsx scripts/setup-telegram-webhook.ts
 * 
 * Untuk hapus webhook:
 * npx tsx scripts/setup-telegram-webhook.ts --delete
 */

import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
function loadEnv() {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        content.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim();
                if (!process.env[key.trim()]) {
                    process.env[key.trim()] = value;
                }
            }
        });
    }
}

loadEnv();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const APP_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://jobmate.web.id';
const WEBHOOK_URL = `${APP_URL}/api/telegram-webhook`;

async function setWebhook() {
    console.log('🔗 Setting up Telegram Webhook...');
    console.log(`📍 Webhook URL: ${WEBHOOK_URL}`);

    if (!BOT_TOKEN) {
        console.error('❌ TELEGRAM_BOT_TOKEN not found in environment');
        process.exit(1);
    }

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: WEBHOOK_URL,
                allowed_updates: ['message'],
            }),
        });

        const result = await response.json();

        if (result.ok) {
            console.log('✅ Webhook set successfully!');
            console.log(`📩 Bot will now receive messages at: ${WEBHOOK_URL}`);
        } else {
            console.error('❌ Failed to set webhook:', result.description);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

async function deleteWebhook() {
    console.log('🗑️ Deleting Telegram Webhook...');

    if (!BOT_TOKEN) {
        console.error('❌ TELEGRAM_BOT_TOKEN not found in environment');
        process.exit(1);
    }

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`;

    try {
        const response = await fetch(url, { method: 'POST' });
        const result = await response.json();

        if (result.ok) {
            console.log('✅ Webhook deleted successfully!');
        } else {
            console.error('❌ Failed to delete webhook:', result.description);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

async function getWebhookInfo() {
    console.log('ℹ️ Getting Webhook Info...');

    if (!BOT_TOKEN) {
        console.error('❌ TELEGRAM_BOT_TOKEN not found in environment');
        process.exit(1);
    }

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`;

    try {
        const response = await fetch(url);
        const result = await response.json();

        if (result.ok) {
            console.log('\n📊 Current Webhook Info:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`URL: ${result.result.url || '(not set)'}`);
            console.log(`Pending updates: ${result.result.pending_update_count || 0}`);
            console.log(`Last error: ${result.result.last_error_message || '(none)'}`);
            console.log(`Allowed updates: ${result.result.allowed_updates?.join(', ') || '(all)'}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        } else {
            console.error('❌ Failed to get webhook info:', result.description);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Main
async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--delete')) {
        await deleteWebhook();
    } else if (args.includes('--info')) {
        await getWebhookInfo();
    } else {
        await setWebhook();
        console.log('\n');
        await getWebhookInfo();
    }
}

main().catch(console.error);
