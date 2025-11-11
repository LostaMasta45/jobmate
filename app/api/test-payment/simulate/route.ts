import { NextRequest, NextResponse } from 'next/server';

// Pakasir.com Configuration
const PAKASIR_API_KEY = 'teLlWce5MvY8y0YeTqolnZNRveRRRtll';
const PAKASIR_PROJECT_SLUG = 'jobmate';

// Payment Simulation API
// Docs: https://pakasir.com/p/docs (Section C.4)
export async function POST(request: NextRequest) {
  try {
    const { orderId, amount } = await request.json();

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Order ID and amount are required' },
        { status: 400 }
      );
    }

    console.log('[Payment Simulation] Simulating payment:', {
      orderId,
      amount,
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

    // Pakasir will trigger webhook after simulation
    // The payment status will change to "completed"
    // Auto-check in payment page will detect this and redirect to success

    return NextResponse.json({
      success: true,
      message: 'Payment simulation successful',
      orderId: orderId,
      amount: amount,
      response: data,
      note: 'Webhook will be triggered by Pakasir. Check payment page for auto-redirect.',
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
