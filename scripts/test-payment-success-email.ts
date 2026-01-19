// scripts/test-payment-success-email.ts
// Test script untuk mengirim email Payment Success (sama seperti Midtrans webhook)

import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load env
dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

// Template SAMA PERSIS dengan Midtrans webhook
const PaymentSuccessEmail = ({ userName, amount, transactionDate, planType }: any) => `
  <html>
    <body style="font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #10B981; color: white; padding: 20px; text-align: center;">
          <h1>✓ Pembayaran Berhasil!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p>Halo ${userName},</p>
          <p>Pembayaran Anda telah berhasil diproses.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Detail Pembayaran</h2>
            <p><strong>Jumlah:</strong> IDR ${amount.toLocaleString('id-ID')}</p>
            <p><strong>Tanggal:</strong> ${new Date(transactionDate).toLocaleString('id-ID')}</p>
            <p style="color: #10B981; font-weight: bold;">Status: PAID ✓</p>
          </div>
          <p>Terima kasih atas pembayaran Anda!</p>
          <p><strong>Akses VIP Anda telah diaktifkan!</strong></p>
        </div>
      </div>
    </body>
  </html>
`;

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.log('❌ Usage: npx tsx scripts/test-payment-success-email.ts your@email.com');
        process.exit(1);
    }

    console.log('🧪 Sending Payment Success Email...\n');
    console.log('To:', email);

    const emailHtml = PaymentSuccessEmail({
        userName: 'Test User',
        amount: 39000,
        transactionDate: new Date().toISOString(),
        planType: 'premium',
    });

    try {
        const result = await resend.emails.send({
            from: 'Jobmate x Infolokerjombang <admin@jobmate.web.id>',
            to: email,
            subject: '✅ Pembayaran VIP Premium Berhasil - JOBMATE',
            html: emailHtml,
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
