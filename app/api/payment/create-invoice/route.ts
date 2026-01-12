import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendInvoiceEmail } from '@/lib/send-invoice-email';

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

    // Save payment to database with UPSERT (ensure always succeeds)
    const supabase = await createClient();

    console.log('[Create Invoice] Saving to database:', {
      external_id: externalId,
      user_email: email,
      user_name: fullName,
      user_whatsapp: whatsapp,
      plan_type: plan,
      amount: amount,
    });

    const { data: paymentData, error: dbError } = await supabase
      .from('payments')
      .upsert({
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'external_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (dbError) {
      console.error('[Create Invoice] Database UPSERT error:', dbError);
      console.error('[Create Invoice] CRITICAL: Payment created in Xendit but not in database!');
      console.error('[Create Invoice] External ID:', externalId);
      console.error('[Create Invoice] Invoice ID:', invoice.id);
      // Still return success - webhook will handle the save
      // But this is logged as CRITICAL for monitoring
    } else {
      console.log('[Create Invoice] Payment saved to database successfully');
      console.log('[Create Invoice] Saved data:', {
        external_id: paymentData?.external_id,
        user_name: paymentData?.user_name,
        user_email: paymentData?.user_email,
        user_whatsapp: paymentData?.user_whatsapp,
      });
    }

    // Send invoice email
    try {
      console.log('[Create Invoice] Sending invoice email to:', email);

      const emailResult = await sendInvoiceEmail({
        toEmail: email,
        userName: fullName || email.split('@')[0],
        invoiceUrl: invoice.invoice_url,
        amount: amount,
        currency: 'IDR',
        expiryDate: invoice.expiry_date,
        description: `${selectedPlan.name} - InfoLokerJombang`,
      });

      if (emailResult.success) {
        console.log('[Create Invoice] Invoice email sent successfully');
      } else {
        console.error('[Create Invoice] Failed to send invoice email:', emailResult.error);
        // Don't fail the request, email is optional
      }
    } catch (emailError) {
      console.error('[Create Invoice] Error sending invoice email:', emailError);
      // Don't fail the request
    }

    // Send Telegram notification for new invoice
    try {
      const { notifyNewInvoice } = await import('@/lib/telegram');
      await notifyNewInvoice({
        customerName: fullName,
        customerEmail: email,
        customerPhone: whatsapp,
        planType: plan as 'basic' | 'premium',
        amount: amount,
        invoiceUrl: invoice.invoice_url,
        orderId: externalId,
        paymentGateway: 'xendit',
        expiresAt: invoice.expiry_date,
      });
      console.log('[Create Invoice] Telegram notification sent');
    } catch (telegramError) {
      console.error('[Create Invoice] Error sending Telegram notification:', telegramError);
    }

    return NextResponse.json({
      success: true,
      invoiceUrl: invoice.invoice_url,
      externalId: externalId,
      invoiceId: invoice.id,
      amount: amount,
      expiryDate: invoice.expiry_date,
      emailSent: true,
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
