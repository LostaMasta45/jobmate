import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { plan, email, fullName, whatsapp } = await request.json();

    // Validate input
    if (!plan || !email || !fullName || !whatsapp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Plan configuration
    const planConfig: Record<string, { name: string; amount: number; duration: string }> = {
      basic: {
        name: 'Career VIP Basic',
        amount: 10000,
        duration: '30 days',
      },
      premium: {
        name: 'Career VIP Premium',
        amount: 39000,
        duration: 'lifetime',
      },
    };

    const selectedPlan = planConfig[plan];
    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    const amount = selectedPlan.amount;
    const externalId = `jobmate-${plan}-${Date.now()}`;

    // Xendit API configuration
    const xenditSecretKey = process.env.XENDIT_SECRET_KEY;
    if (!xenditSecretKey) {
      console.error('[Create Invoice] XENDIT_SECRET_KEY not set');
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    console.log('[Create Invoice] Creating invoice:', {
      plan,
      amount,
      email,
      externalId,
    });

    // Create invoice in Xendit
    const xenditResponse = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(xenditSecretKey + ':').toString('base64')}`,
      },
      body: JSON.stringify({
        external_id: externalId,
        amount: amount,
        payer_email: email,
        description: `${selectedPlan.name} - InfoLokerJombang`,
        invoice_duration: 86400, // 24 hours
        success_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jobmate.web.id'}/payment/success?external_id=${externalId}`,
        failure_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jobmate.web.id'}/payment/failed?external_id=${externalId}`,
        currency: 'IDR',
        items: [
          {
            name: selectedPlan.name,
            quantity: 1,
            price: amount,
            category: 'Membership',
          },
        ],
        customer: {
          given_names: fullName,
          email: email,
          mobile_number: whatsapp,
        },
      }),
    });

    if (!xenditResponse.ok) {
      const errorData = await xenditResponse.json();
      console.error('[Create Invoice] Xendit API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create invoice', details: errorData },
        { status: xenditResponse.status }
      );
    }

    const invoice = await xenditResponse.json();
    console.log('[Create Invoice] Invoice created:', invoice.id);

    // Save payment to database
    const supabase = await createClient();
    const { error: dbError } = await supabase.from('payments').insert({
      external_id: externalId,
      user_email: email,
      user_name: fullName,
      user_whatsapp: whatsapp,
      plan_type: plan,
      amount: amount,
      status: 'pending',
      invoice_id: invoice.id,
      invoice_url: invoice.invoice_url,
      expired_at: invoice.expiry_date,
    });

    if (dbError) {
      console.error('[Create Invoice] Database error:', dbError);
      // Invoice already created in Xendit, but failed to save to DB
      // User can still pay, we'll handle via webhook
    }

    return NextResponse.json({
      success: true,
      invoiceUrl: invoice.invoice_url,
      externalId: externalId,
      invoiceId: invoice.id,
      amount: amount,
      expiryDate: invoice.expiry_date,
    });

  } catch (error: any) {
    console.error('[Create Invoice] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create invoice',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
