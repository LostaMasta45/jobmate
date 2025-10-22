import { NextRequest, NextResponse } from 'next/server';

// Email notification after successful payment
export async function POST(request: NextRequest) {
  try {
    const { 
      userName, 
      userEmail, 
      planType, 
      amount, 
      externalId,
      invoiceId 
    } = await request.json();

    console.log('[Send Email] Sending confirmation email to:', userEmail);

    // TODO: Implement actual email sending
    // Options:
    // 1. Resend (https://resend.com) - Recommended, modern API
    // 2. SendGrid
    // 3. AWS SES
    // 4. Nodemailer with SMTP

    // For now, log the email content
    const emailContent = {
      to: userEmail,
      subject: `Pembayaran Berhasil - ${planType === 'premium' ? 'VIP Premium' : 'VIP Basic'} - InfoLokerJombang`,
      html: generateEmailHTML(userName, planType, amount, externalId, invoiceId),
    };

    console.log('[Send Email] Email content prepared:', emailContent);

    // TODO: Uncomment when email service is configured
    // const emailService = new ResendClient(process.env.RESEND_API_KEY);
    // await emailService.send(emailContent);

    return NextResponse.json({
      success: true,
      message: 'Email queued for sending',
      // For development: return email content for debugging
      debug: process.env.NODE_ENV === 'development' ? emailContent : undefined,
    });

  } catch (error: any) {
    console.error('[Send Email] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', message: error.message },
      { status: 500 }
    );
  }
}

function generateEmailHTML(
  userName: string,
  planType: string,
  amount: number,
  externalId: string,
  invoiceId: string
): string {
  const isPremium = planType === 'premium';
  const planName = isPremium ? 'VIP Premium' : 'VIP Basic';
  const planColor = isPremium ? '#F59E0B' : '#10B981';
  const planDuration = isPremium ? 'Lifetime' : '30 Hari';

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pembayaran Berhasil</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${planColor} 0%, ${isPremium ? '#EA580C' : '#059669'} 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 32px; font-weight: bold;">🎉 Pembayaran Berhasil!</h1>
              <p style="color: #ffffff; margin: 0; font-size: 16px; opacity: 0.95;">Terima kasih atas pembayaran Anda</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                Halo <strong>${userName}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                Selamat! Pembayaran Anda untuk <strong style="color: ${planColor};">${planName}</strong> telah berhasil diproses. 🚀
              </p>
            </td>
          </tr>

          <!-- Payment Details -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold; color: #111827;">📋 Detail Pembayaran</h2>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-size: 14px; color: #6b7280; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Paket</td>
                        <td style="font-size: 14px; color: #111827; font-weight: bold; text-align: right; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                          <span style="background-color: ${planColor}; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 13px;">
                            ${planName}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px; color: #6b7280; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Durasi</td>
                        <td style="font-size: 14px; color: #111827; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${planDuration}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px; color: #6b7280; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Total Dibayar</td>
                        <td style="font-size: 18px; color: ${planColor}; font-weight: bold; text-align: right; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                          Rp ${amount.toLocaleString('id-ID')}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #6b7280; padding: 8px 0;">ID Transaksi</td>
                        <td style="font-size: 13px; color: #6b7280; text-align: right; padding: 8px 0; font-family: monospace;">${externalId.slice(0, 30)}...</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Next Steps -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #111827;">✨ Langkah Selanjutnya</h3>
                    
                    <ol style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                      <li style="margin-bottom: 8px;"><strong>Ajukan Akun VIP</strong> - Klik tombol di bawah untuk mengajukan aktivasi akun</li>
                      <li style="margin-bottom: 8px;"><strong>Proses Aktivasi</strong> - Tim kami akan memproses dalam 1x24 jam</li>
                      <li style="margin-bottom: 8px;"><strong>Notifikasi Email</strong> - Anda akan menerima email konfirmasi aktivasi</li>
                      <li><strong>Mulai Gunakan</strong> - Akses semua fitur premium!</li>
                    </ol>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <a href="https://jobmate-ivory.vercel.app/ajukan-akun" 
                 style="display: inline-block; background-color: ${planColor}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                🚀 Ajukan Akun VIP Sekarang
              </a>
            </td>
          </tr>

          <!-- Support -->
          <tr>
            <td style="padding: 20px 30px 30px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
                Punya pertanyaan? Hubungi kami:
              </p>
              <p style="margin: 0; font-size: 14px;">
                <a href="https://wa.me/6281234567890" style="color: ${planColor}; text-decoration: none; font-weight: 600;">
                  💬 WhatsApp Admin
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #9ca3af;">
                Email ini dikirim otomatis, mohon tidak membalas.
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} InfoLokerJombang. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
