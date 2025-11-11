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

      // Here you can:
      // 1. Save to database
      // 2. Activate VIP membership
      // 3. Send confirmation email
      // 4. Update user status
      
      // Example: Save payment to database (uncomment if needed)
      /*
      const supabase = await createClient();
      const { error: dbError } = await supabase
        .from('test_payments')
        .insert({
          order_id: body.order_id,
          amount: body.amount,
          status: body.status,
          payment_method: body.payment_method,
          completed_at: body.completed_at,
          project: body.project,
        });

      if (dbError) {
        console.error('[Webhook] Database error:', dbError);
      }
      */

      // TODO: Implement your business logic here
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
