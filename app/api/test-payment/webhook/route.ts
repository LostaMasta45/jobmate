import { NextRequest, NextResponse } from 'next/server';

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

          // Use existing email notification function (same as production)
          const { sendUpgradeVIPEmail } = await import('@/lib/email-notifications');

          await sendUpgradeVIPEmail({
            userName: metadata.user_name || 'User',
            email: metadata.user_email,
            membershipType: metadata.plan_type === 'premium' ? 'vip_premium' : 'vip_basic',
            upgradedAt: body.completed_at || new Date().toISOString(),
          });

          console.log('[Webhook] ✅ Success email sent using sendUpgradeVIPEmail');
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
