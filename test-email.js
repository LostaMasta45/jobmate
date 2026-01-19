// test-email.js - Script untuk test email payment success
const { Resend } = require('resend');

const resend = new Resend('re_KVGKy3aw_BakX1jMcqNGP21tJ2m34r84K');

const PaymentSuccessEmail = (userName, amount, transactionDate) => `
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

async function sendTestEmail() {
  console.log('Sending test email to updatesumobito@gmail.com...');
  
  const emailHtml = PaymentSuccessEmail('Test User', 39000, new Date().toISOString());

  const result = await resend.emails.send({
    from: 'Jobmate x Infolokerjombang <admin@jobmate.web.id>',
    to: 'updatesumobito@gmail.com',
    subject: '✅ Pembayaran VIP Premium Berhasil - JOBMATE (TEST)',
    html: emailHtml,
  });

  console.log('Email sent:', result);
}

sendTestEmail().catch(console.error);
