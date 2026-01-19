import { NextRequest, NextResponse } from 'next/server';

// Pakasir.com Configuration
const PAKASIR_API_KEY = 'teLlWce5MvY8y0YeTqolnZNRveRRRtll';
const PAKASIR_PROJECT_SLUG = 'jobmate';

// Payment Simulation API
// Docs: https://pakasir.com/p/docs (Section C.4)
export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, customerEmail, customerName, planType } = await request.json();

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Order ID and amount are required' },
        { status: 400 }
      );
    }

    console.log('[Payment Simulation] Simulating payment:', {
      orderId,
      amount,
      customerEmail,
      customerName,
      planType,
      project: PAKASIR_PROJECT_SLUG,
    });

    // Call Pakasir Payment Simulation API
    const response = await fetch('https://app.pakasir.com/api/paymentsimulation', {
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Payment Simulation] Pakasir API error:', {
        status: response.status,
        error: errorText,
      });

      return NextResponse.json(
        {
          error: 'Failed to simulate payment',
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[Payment Simulation] Simulation successful:', data);

    // --- DIRECT EMAIL SENDING (Fallback jika webhook tidak terpanggil) ---
    if (customerEmail) {
      try {
        console.log('[Payment Simulation] Sending success email directly to:', customerEmail);

        // Use existing email notification function (same as production)
        const { sendUpgradeVIPEmail } = await import('@/lib/email-notifications');

        const membershipType = planType === 'premium' ? 'vip_premium' : 'vip_basic';

        await sendUpgradeVIPEmail({
          userName: customerName || 'User',
          email: customerEmail,
          membershipType: membershipType,
          upgradedAt: new Date().toISOString(),
        });

        console.log('[Payment Simulation] ✅ Success email sent directly');
      } catch (emailError) {
        console.error('[Payment Simulation] Failed to send email:', emailError);
      }
    } else {
      console.warn('[Payment Simulation] ⚠️ No customerEmail provided, skipping email');
    }
    // -------------------------------------------------------------------

    return NextResponse.json({
      success: true,
      message: 'Payment simulation successful',
      orderId: orderId,
      amount: amount,
      response: data,
      emailSent: !!customerEmail,
      note: 'Email sent directly. Webhook may also be triggered by Pakasir.',
    });

  } catch (error: any) {
    console.error('[Payment Simulation] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to simulate payment',
        message: error.message
      },
      { status: 500 }
    );
  }
}
