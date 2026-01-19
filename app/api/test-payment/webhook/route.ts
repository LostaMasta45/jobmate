import { NextRequest, NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/resend';

// Email template untuk payment confirmation (same as Midtrans/Xendit version)
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

// Pakasir.com Webhook Handler
// Docs: https://pakasir.com/p/docs (Section D: Webhook)
// Webhook akan menerima POST request dari Pakasir saat payment berhasil

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[Webhook] Received payment notification:', {
      order_id: body.order_id,
      amount: body.amount,
      status: body.status,
      payment_method: body.payment_method,
      completed_at: body.completed_at,
    });

    // Validate webhook data
    if (!body.order_id || !body.amount || !body.status) {
      console.error('[Webhook] Invalid webhook data');
      return NextResponse.json(
        { error: 'Invalid webhook data' },
        { status: 400 }
      );
    }

    // Check if payment is completed
    if (body.status === 'completed') {
      console.log('[Webhook] Payment COMPLETED:', body.order_id);

      // --- Payment Success Email Logic ---
      try {
        let metadata = body.metadata;

        // If metadata is missing in webhook payload, fetch from Transaction Detail API
        if (!metadata || !metadata.user_email) {
          console.log('[Webhook] Metadata missing, fetching transaction details...');
          const PAKASIR_API_KEY = 'teLlWce5MvY8y0YeTqolnZNRveRRRtll';
          const PAKASIR_PROJECT_SLUG = process.env.PAKASIR_PROJECT_SLUG || 'jobmate';

          const detailUrl = new URL('https://app.pakasir.com/api/transactiondetail');
          detailUrl.searchParams.set('project', PAKASIR_PROJECT_SLUG);
          detailUrl.searchParams.set('order_id', body.order_id);
          detailUrl.searchParams.set('amount', body.amount);
          detailUrl.searchParams.set('api_key', PAKASIR_API_KEY);

          const detailResponse = await fetch(detailUrl.toString());
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            metadata = detailData.transaction?.metadata;
          }
        }

        if (metadata && metadata.user_email) {
          console.log('[Webhook] Sending success email to:', metadata.user_email);

          const planType = metadata.plan_type || (body.amount > 20000 ? 'premium' : 'basic');
          const finalCustomerEmail = metadata.user_email;
          const finalCustomerName = metadata.user_name || 'User';
          const amount = body.amount;
          const transactionDate = body.completed_at || new Date().toISOString();

          // Use exact same logic as Midtrans webhook
          const emailHtml = PaymentSuccessEmail({
            userName: finalCustomerName,
            amount: amount,
            transactionDate: transactionDate,
            planType: planType,
          });

          await resend.emails.send({
            from: FROM_EMAIL,
            to: finalCustomerEmail,
            subject: `✅ Pembayaran ${planType === 'premium' ? 'VIP Premium' : 'VIP Basic'} Berhasil - JOBMATE`,
            html: emailHtml,
            tags: [
              { name: 'category', value: 'payment-confirmation' },
              { name: 'plan', value: planType },
              { name: 'gateway', value: 'pakasir-sandbox' },
            ],
          });

          console.log('[Webhook] ✅ Success email sent (Midtrans style)');
        } else {
          console.warn('[Webhook] ⚠️ Could not send email: User email not found in metadata');
        }

      } catch (emailError) {
        console.error('[Webhook] Failed to process success email:', emailError);
      }
      // -----------------------------------

      console.log('[Webhook] ✅ Payment processed successfully');
    } else {
      console.log('[Webhook] Payment status:', body.status);
    }

    // Always return 200 to acknowledge webhook
    return NextResponse.json({
      success: true,
      message: 'Webhook received'
    });

  } catch (error: any) {
    console.error('[Webhook] Error processing webhook:', error);

    // Still return 200 to prevent webhook retry spam
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}

// Health check endpoint
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'Webhook endpoint ready',
    timestamp: new Date().toISOString(),
  });
}
