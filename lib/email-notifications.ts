// lib/email-notifications.ts
import React from 'react';
import { resend, FROM_EMAIL } from './resend';
import { render } from '@react-email/render';
import { 
  AccountPendingEmail, 
  AccountPendingEmailText 
} from '@/emails/AccountPendingEmail';
import { 
  AccountApprovedEmail, 
  AccountApprovedEmailText 
} from '@/emails/AccountApprovedEmail';
import { 
  UpgradeVIPEmail, 
  UpgradeVIPEmailText 
} from '@/emails/UpgradeVIPEmail';

/**
 * Send email notification when user submits account application
 */
export async function sendAccountPendingEmail({
  userName,
  email,
  submittedAt = new Date().toISOString(),
}: {
  userName: string;
  email: string;
  submittedAt?: string;
}) {
  try {
    const emailHtml = await render(
      React.createElement(AccountPendingEmail, { userName, email, submittedAt })
    );
    
    const emailText = AccountPendingEmailText({ userName, email, submittedAt });

    console.log('[Email Debug] HTML type:', typeof emailHtml);
    console.log('[Email Debug] HTML length:', emailHtml?.length || 0);

    const { data, error} = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Status Pengajuan Akun Anda - Jobmate X infolokerjombang',
      html: String(emailHtml),
      text: emailText,
      tags: [
        { name: 'category', value: 'account-pending' },
      ],
    });

    if (error) {
      console.error('Failed to send account pending email:', error);
      return { success: false, error };
    }

    console.log('✅ Account pending email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending account pending email:', error);
    return { success: false, error };
  }
}

/**
 * Send email notification when admin approves user account
 */
export async function sendAccountApprovedEmail({
  userName,
  email,
  approvedAt = new Date().toISOString(),
  loginUrl = process.env.NEXT_PUBLIC_BASE_URL + '/sign-in',
}: {
  userName: string;
  email: string;
  approvedAt?: string;
  loginUrl?: string;
}) {
  try {
    const emailHtml = await render(
      React.createElement(AccountApprovedEmail, { userName, email, approvedAt, loginUrl })
    );
    
    const emailText = AccountApprovedEmailText({ userName, email, approvedAt, loginUrl });

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Akun Anda Telah Disetujui - Jobmate X infolokerjombang',
      html: String(emailHtml),
      text: emailText,
      tags: [
        { name: 'category', value: 'account-approved' },
      ],
    });

    if (error) {
      console.error('Failed to send account approved email:', error);
      return { success: false, error };
    }

    console.log('✅ Account approved email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending account approved email:', error);
    return { success: false, error };
  }
}

/**
 * Send email notification when admin upgrades user to VIP
 */
export async function sendUpgradeVIPEmail({
  userName,
  email,
  membershipType,
  upgradedAt = new Date().toISOString(),
  dashboardUrl = process.env.NEXT_PUBLIC_BASE_URL + '/dashboard',
}: {
  userName: string;
  email: string;
  membershipType: 'vip_basic' | 'vip_premium';
  upgradedAt?: string;
  dashboardUrl?: string;
}) {
  try {
    const membershipName = membershipType === 'vip_premium' ? 'VIP Premium' : 'VIP Basic';
    const emoji = membershipType === 'vip_premium' ? '👑' : '⭐';
    
    const emailHtml = await render(
      React.createElement(UpgradeVIPEmail, { userName, email, membershipType, upgradedAt, dashboardUrl })
    );
    
    const emailText = UpgradeVIPEmailText({ userName, email, membershipType, upgradedAt, dashboardUrl });

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Akun ${membershipName} Anda Aktif - Jobmate X infolokerjombang`,
      html: String(emailHtml),
      text: emailText,
      tags: [
        { name: 'category', value: 'vip-upgrade' },
        { name: 'membership', value: membershipType },
      ],
    });

    if (error) {
      console.error('Failed to send VIP upgrade email:', error);
      return { success: false, error };
    }

    console.log(`✅ VIP upgrade email sent successfully (${membershipName}):`, data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending VIP upgrade email:', error);
    return { success: false, error };
  }
}

/**
 * Send notification to admin via Telegram when new account is submitted
 */
export async function notifyAdminNewApplication({
  userName,
  email,
}: {
  userName: string;
  email: string;
}) {
  try {
    const message = `
🔔 <b>Pengajuan Akun Baru</b>

👤 Nama: ${userName}
📧 Email: ${email}
⏰ Waktu: ${new Date().toLocaleString('id-ID')}

Silakan review di dashboard admin.
    `.trim();

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) {
      console.warn('Telegram credentials not configured');
      return { success: false, error: 'Telegram not configured' };
    }

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_ADMIN_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      console.error('Failed to send Telegram notification:', data);
      return { success: false, error: data };
    }

    console.log('✅ Admin Telegram notification sent successfully');
    return { success: true, data };
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return { success: false, error };
  }
}

/**
 * Helper function to validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Helper function to get user display name
 */
export function getUserDisplayName(fullName?: string | null, email?: string): string {
  if (fullName && fullName.trim()) {
    return fullName.trim();
  }
  if (email) {
    return email.split('@')[0];
  }
  return 'User';
}
