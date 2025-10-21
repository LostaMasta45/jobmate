import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// Verify Xendit webhook signature
function verifyXenditSignature(payload: string, signature: string): boolean {
  const webhookToken = process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN;
  
  if (!webhookToken) {
    console.warn('[Xendit Webhook] XENDIT_WEBHOOK_VERIFICATION_TOKEN not set');
    // In development, allow without verification for testing
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    return false;
  }

  const computedSignature = crypto
    .createHmac('sha256', webhookToken)
    .update(payload)
    .digest('hex');

  return computedSignature === signature;
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Xendit Webhook] POST request received');

    // Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-callback-token') || '';

    console.log('[Xendit Webhook] Signature:', signature ? 'Present' : 'Missing');

    // Verify signature
    if (!verifyXenditSignature(rawBody, signature)) {
      console.error('[Xendit Webhook] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
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

      // Payment successful
      const { data, error } = await supabase
        .from('payments')
        .update({
          status: 'paid',
          paid_at: paid_at ? new Date(paid_at).toISOString() : new Date().toISOString(),
          payment_method: payment_method || payment_channel || 'unknown',
          updated_at: new Date().toISOString(),
        })
        .eq('external_id', externalId)
        .select()
        .single();

      if (error) {
        console.error('[Xendit Webhook] Database update error:', error);
        
        // Return 200 anyway so Xendit doesn't retry (payment already processed)
        return NextResponse.json({
          success: false,
          error: 'Database error',
          message: error.message,
        });
      }

      console.log('[Xendit Webhook] Payment updated successfully:', data);

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
