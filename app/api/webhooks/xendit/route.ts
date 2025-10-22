import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Verify Xendit webhook callback token
function verifyXenditToken(callbackToken: string): boolean {
  const webhookToken = process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN;
  
  if (!webhookToken) {
    console.warn('[Xendit Webhook] XENDIT_WEBHOOK_VERIFICATION_TOKEN not set');
    // In development, allow without verification for testing
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    return false;
  }

  // For Invoice webhooks, Xendit sends the verification token directly in x-callback-token header
  // Simply compare the tokens
  return callbackToken === webhookToken;
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Xendit Webhook] POST request received');

    // Get callback token from header
    const callbackToken = request.headers.get('x-callback-token') || '';

    console.log('[Xendit Webhook] Callback Token:', callbackToken ? 'Present' : 'Missing');

    // Verify callback token
    if (!verifyXenditToken(callbackToken)) {
      console.error('[Xendit Webhook] Invalid callback token');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody);
    console.log('[Xendit Webhook] Payload received:', JSON.stringify(payload, null, 2));

    const {
      id: invoiceId,
      external_id: externalId,
      status,
      paid_at,
      payment_method,
      payment_channel,
    } = payload;

    console.log('[Xendit Webhook] Processing:', {
      invoiceId,
      externalId,
      status,
    });

    // If no external_id, might be a test webhook
    if (!externalId) {
      console.log('[Xendit Webhook] Test webhook or missing external_id, returning success');
      return NextResponse.json({ success: true, message: 'Test webhook received' });
    }

    // Update payment in database
    const supabase = await createClient();

    if (status === 'PAID') {
      console.log('[Xendit Webhook] Payment successful, updating database...');

      // Extract plan type from external_id
      const planType = externalId.includes('premium') ? 'premium' : 'basic';
      const amount = planType === 'premium' ? 39000 : 10000;
      
      // Get customer info from payload
      const customerEmail = payload.payer_email || payload.customer?.email || 'unknown@example.com';
      const customerName = payload.customer?.given_names || payload.customer?.surname || 'Unknown User';
      const customerPhone = payload.customer?.mobile_number || payload.customer?.phone_number || '';

      console.log('[Xendit Webhook] Customer info:', { customerEmail, customerName, customerPhone });

      // Use UPSERT to handle both insert and update cases
      const { data, error } = await supabase
        .from('payments')
        .upsert({
          external_id: externalId,
          invoice_id: invoiceId,
          user_email: customerEmail,
          user_name: customerName,
          user_whatsapp: customerPhone,
          plan_type: planType,
          amount: amount,
          status: 'paid',
          paid_at: paid_at ? new Date(paid_at).toISOString() : new Date().toISOString(),
          payment_method: payment_method || payment_channel || 'unknown',
          invoice_url: payload.invoice_url || '',
          expired_at: new Date(Date.now() + (planType === 'premium' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'external_id',
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (error) {
        console.error('[Xendit Webhook] Database upsert error:', error);
        
        // Return 200 anyway so Xendit doesn't retry (payment already processed)
        return NextResponse.json({
          success: false,
          error: 'Database error',
          message: error.message,
        });
      }

      console.log('[Xendit Webhook] Payment upserted successfully:', data);

      // TODO: Additional actions on successful payment:
      // - Send confirmation email
      // - Send WhatsApp notification
      // - Trigger Telegram notification to admin
      // - Auto-approve account if enabled

      return NextResponse.json({
        success: true,
        message: 'Payment updated to PAID',
      });

    } else if (status === 'EXPIRED') {
      console.log('[Xendit Webhook] Invoice expired, updating database...');

      // Invoice expired
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'expired',
          updated_at: new Date().toISOString(),
        })
        .eq('external_id', externalId);

      if (error) {
        console.error('[Xendit Webhook] Database update error (expired):', error);
      }

      console.log('[Xendit Webhook] Payment marked as EXPIRED');

      return NextResponse.json({
        success: true,
        message: 'Payment marked as expired',
      });

    } else if (status === 'FAILED') {
      console.log('[Xendit Webhook] Payment failed, updating database...');

      // Payment failed
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('external_id', externalId);

      if (error) {
        console.error('[Xendit Webhook] Database update error (failed):', error);
      }

      console.log('[Xendit Webhook] Payment marked as FAILED');

      return NextResponse.json({
        success: true,
        message: 'Payment marked as failed',
      });
    } else {
      // Unknown status
      console.log('[Xendit Webhook] Unknown status:', status);
      
      return NextResponse.json({
        success: true,
        message: `Unknown status: ${status}`,
      });
    }

  } catch (error: any) {
    console.error('[Xendit Webhook] Error:', error);
    
    // Return 200 to prevent Xendit from retrying
    // But log the error for investigation
    return NextResponse.json({
      success: false,
      error: 'Webhook processing failed',
      message: error.message,
    });
  }
}

// Explicitly handle GET requests (for testing/health check)
export async function GET() {
  return NextResponse.json({
    message: 'Xendit webhook endpoint',
    method: 'POST only',
    status: 'active',
  });
}

// Reject other methods
export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
