
import { Resend } from 'resend';
import { PaymentSuccessEmail, PaymentSuccessEmailText } from '../emails/PaymentSuccessEmail';
import { render } from '@react-email/render';
import React from 'react';
import dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is missing in .env.local');
    process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.log('❌ Usage: npx tsx scripts/test-redesigned-email.tsx your@email.com');
        process.exit(1);
    }

    console.log('🧪 Sending REDESIGNED Payment Success Email...');
    console.log('To:', email);

    const emailProps = {
        userName: 'Test User',
        amount: 50000,
        transactionDate: new Date().toISOString(),
        planType: 'premium',
        dashboardUrl: 'https://jobmate.web.id/dashboard'
    };

    const emailHtml = await render(<PaymentSuccessEmail {...emailProps} />);
    const emailText = PaymentSuccessEmailText(emailProps);

    try {
        const result = await resend.emails.send({
            from: 'Jobmate x Infolokerjombang <admin@jobmate.web.id>',
            to: email,
            subject: '✅ [TEST] Pembayaran VIP Premium Berhasil - JOBMATE',
            html: emailHtml,
            text: emailText,
        });

        if (result.error) {
            console.log('❌ Error:', result.error);
        } else {
            console.log('✅ Email sent successfully!');
            console.log('ID:', result.data?.id);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main();
