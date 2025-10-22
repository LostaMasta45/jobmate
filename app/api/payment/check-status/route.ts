import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Helper: Fetch invoice from Xendit API
async function fetchInvoiceFromXendit(invoiceIdOrExternalId: string) {
  const xenditSecretKey = process.env.XENDIT_SECRET_KEY;
  if (!xenditSecretKey) {
    console.error('[Xendit Fetch] XENDIT_SECRET_KEY not set');
    return null;
  }

  try {
    // Try to fetch by invoice ID
    console.log('[Xendit Fetch] Fetching invoice:', invoiceIdOrExternalId);
    
    const response = await fetch(`https://api.xendit.co/v2/invoices/${invoiceIdOrExternalId}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(xenditSecretKey + ':').toString('base64')}`,
      },
    });

    if (!response.ok) {
      console.error('[Xendit Fetch] Failed to fetch invoice:', response.status);
      return null;
    }

    const invoice = await response.json();
    console.log('[Xendit Fetch] Invoice found:', invoice.id, 'Status:', invoice.status);
    return invoice;
  } catch (error) {
    console.error('[Xendit Fetch] Error:', error);
    return null;
  }
}

// Helper: Convert Xendit invoice to our payment format
function convertXenditToPayment(invoice: any) {
  const planType = invoice.external_id?.includes('premium') ? 'premium' : 'basic';
  const amount = planType === 'premium' ? 39000 : 10000;
  
  return {
    externalId: invoice.external_id,
    invoiceId: invoice.id,
    status: invoice.status?.toLowerCase() === 'paid' ? 'paid' : 'pending',
    amount: invoice.amount || amount,
    planType: planType,
    paidAt: invoice.paid_at || null,
    expiredAt: invoice.expiry_date || null,
    createdAt: invoice.created || null,
    userName: invoice.customer?.given_names || invoice.customer?.surname || 'Unknown',
    userEmail: invoice.payer_email || invoice.customer?.email || '',
    userWhatsapp: invoice.customer?.mobile_number || invoice.customer?.phone_number || '',
    paymentMethod: invoice.payment_method || invoice.payment_channel || null,
    invoiceUrl: invoice.invoice_url || '',
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const externalId = searchParams.get('external_id');

    console.log('[Check Status] Request received for external_id:', externalId);

    if (!externalId) {
      console.error('[Check Status] No external_id provided');
      return NextResponse.json(
        { error: 'external_id is required' },
        { status: 400 }
      );
    }

    // Step 1: Try to fetch from database
    const supabase = await createClient();
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('external_id', externalId)
      .single();

    // If found in database, return it
    if (payment && !error) {
      console.log('[Check Status] Payment found in database:', payment.external_id, 'Status:', payment.status);

      return NextResponse.json({
        success: true,
        payment: {
          externalId: payment.external_id,
          invoiceId: payment.invoice_id,
          status: payment.status,
          amount: payment.amount,
          planType: payment.plan_type,
          paidAt: payment.paid_at,
          expiredAt: payment.expired_at,
          createdAt: payment.created_at,
          userName: payment.user_name,
          userEmail: payment.user_email,
          userWhatsapp: payment.user_whatsapp,
          paymentMethod: payment.payment_method,
          invoiceUrl: payment.invoice_url,
        },
      });
    }

    // Step 2: Not found in database, try to fetch from Xendit
    console.log('[Check Status] Payment not in database, fetching from Xendit...');
    
    const xenditInvoice = await fetchInvoiceFromXendit(externalId);
    
    if (!xenditInvoice) {
      console.error('[Check Status] Payment not found in database OR Xendit');
      return NextResponse.json(
        { 
          error: 'Payment not found',
          message: 'Invoice tidak ditemukan di database maupun Xendit. Kemungkinan invoice belum dibuat atau sudah expired.',
          externalId: externalId,
        },
        { status: 404 }
      );
    }

    // Step 3: Found in Xendit, save to database for future requests
    console.log('[Check Status] Found in Xendit, saving to database...');
    
    const paymentData = convertXenditToPayment(xenditInvoice);
    
    const { data: savedPayment, error: saveError } = await supabase
      .from('payments')
      .upsert({
        external_id: paymentData.externalId,
        invoice_id: paymentData.invoiceId,
        user_email: paymentData.userEmail,
        user_name: paymentData.userName,
        user_whatsapp: paymentData.userWhatsapp,
        plan_type: paymentData.planType,
        amount: paymentData.amount,
        status: paymentData.status,
        paid_at: paymentData.paidAt,
        invoice_url: paymentData.invoiceUrl,
        expired_at: paymentData.expiredAt,
        payment_method: paymentData.paymentMethod,
        created_at: paymentData.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'external_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (saveError) {
      console.error('[Check Status] Failed to save to database:', saveError);
      // Still return data from Xendit even if save fails
    } else {
      console.log('[Check Status] Payment saved to database from Xendit');
    }

    // Return data from Xendit
    return NextResponse.json({
      success: true,
      payment: paymentData,
      source: 'xendit', // Indicate this came from Xendit API
    });

  } catch (error: any) {
    console.error('[Check Status] Error:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status', message: error.message },
      { status: 500 }
    );
  }
}
