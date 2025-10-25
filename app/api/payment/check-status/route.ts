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
    // Try to fetch by external_id first (most common)
    console.log('[Xendit Fetch] Fetching invoice by external_id:', invoiceIdOrExternalId);
    
    // Xendit API: Get invoices by external_id
    const listResponse = await fetch(`https://api.xendit.co/v2/invoices?external_id=${invoiceIdOrExternalId}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(xenditSecretKey + ':').toString('base64')}`,
      },
    });

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error('[Xendit Fetch] Failed to fetch invoices:', listResponse.status, errorText);
      return null;
    }

    const invoices = await listResponse.json();
    console.log('[Xendit Fetch] Found invoices:', invoices.length);
    
    if (invoices && invoices.length > 0) {
      // Return the most recent invoice
      const invoice = invoices[0];
      console.log('[Xendit Fetch] Invoice found:', invoice.id, 'Status:', invoice.status);
      return invoice;
    }

    console.error('[Xendit Fetch] No invoices found for external_id:', invoiceIdOrExternalId);
    return null;
  } catch (error) {
    console.error('[Xendit Fetch] Error:', error);
    return null;
  }
}

// Helper: Convert Xendit invoice to our payment format
function convertXenditToPayment(invoice: any) {
  const planType = invoice.external_id?.includes('premium') ? 'premium' : 'basic';
  const amount = planType === 'premium' ? 39000 : 10000;
  
  // Extract customer name (try multiple fields)
  let userName = 'Unknown User';
  if (invoice.customer) {
    // Try given_names first (this is what we send in create-invoice)
    const givenNames = invoice.customer.given_names || invoice.customer.given_name || '';
    const surname = invoice.customer.surname || invoice.customer.sur_name || '';
    userName = [givenNames, surname].filter(Boolean).join(' ').trim();
  }
  
  // If still no name, try customer_name or billing_address name
  if (!userName || userName === 'Unknown User') {
    userName = invoice.customer_name 
      || invoice.billing_address?.name 
      || invoice.customer?.name
      || 'Unknown User';
  }
  
  // Extract WhatsApp/phone number (try multiple fields)
  let userWhatsapp = '';
  if (invoice.customer) {
    userWhatsapp = invoice.customer.mobile_number 
      || invoice.customer.phone_number
      || invoice.customer.phone
      || invoice.customer.mobile
      || invoice.billing_address?.phone_number
      || '';
  }
  
  // Extract email
  const userEmail = invoice.payer_email 
    || invoice.customer?.email 
    || invoice.billing_address?.email
    || '';
  
  console.log('[convertXenditToPayment] Customer data:', {
    userName,
    userEmail,
    userWhatsapp,
    rawCustomer: invoice.customer,
  });
  
  return {
    externalId: invoice.external_id,
    invoiceId: invoice.id,
    status: invoice.status?.toLowerCase() === 'paid' ? 'paid' : 'pending',
    amount: invoice.amount || amount,
    planType: planType,
    paidAt: invoice.paid_at || null,
    expiredAt: invoice.expiry_date || null,
    createdAt: invoice.created || null,
    userName: userName,
    userEmail: userEmail,
    userWhatsapp: userWhatsapp,
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
      console.log('[Check Status] Customer data from DB:', {
        userName: payment.user_name,
        userEmail: payment.user_email,
        userWhatsapp: payment.user_whatsapp,
      });

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
        source: 'database',
      });
    }

    // Step 2: Not found in database, try to fetch from Xendit
    console.log('[Check Status] Payment not in database, fetching from Xendit...');
    
    const xenditInvoice = await fetchInvoiceFromXendit(externalId);
    
    if (!xenditInvoice) {
      console.error('[Check Status] Payment not found in database OR Xendit');
      console.error('[Check Status] External ID:', externalId);
      console.error('[Check Status] Database error:', error);
      
      // Check if Xendit credentials are set
      const hasXenditKey = !!process.env.XENDIT_SECRET_KEY;
      console.error('[Check Status] Xendit credentials configured:', hasXenditKey);
      
      return NextResponse.json(
        { 
          error: 'Payment not found',
          message: 'Invoice tidak ditemukan di database maupun Xendit. Kemungkinan invoice belum dibuat atau sudah expired.',
          externalId: externalId,
          debug: {
            checkedDatabase: true,
            databaseError: error?.message || 'Not found',
            checkedXendit: true,
            xenditConfigured: hasXenditKey,
          }
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
