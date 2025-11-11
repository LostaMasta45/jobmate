import { NextRequest, NextResponse } from 'next/server';

// Pakasir.com Configuration
const PAKASIR_API_KEY = 'teLlWce5MvY8y0YeTqolnZNRveRRRtll';

// Project SLUG dari Pakasir.com dashboard
// Dashboard: https://app.pakasir.com
const PAKASIR_PROJECT_SLUG = process.env.PAKASIR_PROJECT_SLUG || 'jobmate';

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
        name: 'Career VIP Basic (TEST)',
        amount: 10000,
        duration: '30 days',
      },
      premium: {
        name: 'Career VIP Premium (TEST)',
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
    const orderId = `jobmate-test-${plan}-${Date.now()}`;

    // Check if project slug is configured
    if (PAKASIR_PROJECT_SLUG === 'SLUG_BELUM_DIKONFIGURASI') {
      console.error('[TEST Payment] Pakasir.com project slug belum dikonfigurasi!');
      return NextResponse.json(
        { 
          error: 'Pakasir.com belum dikonfigurasi',
          message: 'Silakan set PAKASIR_PROJECT_SLUG di environment variable atau ubah di route.ts',
          instructions: {
            step1: 'Login ke https://app.pakasir.com',
            step2: 'Buat atau buka Proyek Anda',
            step3: 'Catat SLUG proyek (misal: depodomain)',
            step4: 'Tambahkan ke .env.local: PAKASIR_PROJECT_SLUG=your-slug',
            step5: 'Atau ubah langsung di app/api/test-payment/create-invoice/route.ts line 11',
            step6: 'Restart development server'
          },
          docs: 'https://pakasir.com/p/docs'
        },
        { status: 500 }
      );
    }

    console.log('[TEST Payment] Creating payment with Pakasir.com:', {
      plan,
      amount,
      email,
      orderId,
      slug: PAKASIR_PROJECT_SLUG,
    });

    // Pakasir.com Payment - Via API Method (Full Custom UI)
    // Docs: https://pakasir.com/p/docs (Section C: Integrasi Via API)
    // API: POST https://app.pakasir.com/api/transactioncreate/{method}
    
    try {
      // Call Pakasir Transaction Create API for QRIS
      const pakasirResponse = await fetch('https://app.pakasir.com/api/transactioncreate/qris', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: PAKASIR_PROJECT_SLUG,
          order_id: orderId,
          amount: amount,
          api_key: PAKASIR_API_KEY,
        }),
      });

      if (!pakasirResponse.ok) {
        const errorText = await pakasirResponse.text();
        console.error('[TEST Payment] Pakasir API error:', {
          status: pakasirResponse.status,
          error: errorText,
        });
        
        return NextResponse.json(
          { 
            error: 'Failed to create payment with Pakasir',
            details: errorText 
          },
          { status: pakasirResponse.status }
        );
      }

      const paymentData = await pakasirResponse.json();
      console.log('[TEST Payment] Payment created successfully:', {
        order_id: orderId,
        payment_method: paymentData.payment?.payment_method,
        total_payment: paymentData.payment?.total_payment,
      });

      // Store payment data for tracking
      console.log('[TEST Payment] Full payment data:', {
        order_id: orderId,
        user_email: email,
        user_name: fullName,
        user_whatsapp: whatsapp,
        amount: amount,
        plan: plan,
        payment_response: paymentData,
      });

      return NextResponse.json({
        success: true,
        payment: paymentData.payment,
        orderId: orderId,
        amount: amount,
        project: PAKASIR_PROJECT_SLUG,
        method: 'api',
        customerData: {
          email: email,
          fullName: fullName,
          whatsapp: whatsapp,
          plan: selectedPlan.name,
        },
      });

    } catch (error: any) {
      console.error('[TEST Payment] Error creating payment:', error);
      return NextResponse.json(
        { 
          error: 'Failed to create payment',
          message: error.message 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('[TEST Payment] General error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process payment',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check API connection
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'TEST Payment API Ready',
    gateway: 'Pakasir.com',
    apiKey: PAKASIR_API_KEY ? 'Configured' : 'Missing',
    timestamp: new Date().toISOString(),
    note: 'This is a test payment endpoint for development purposes only',
  });
}
