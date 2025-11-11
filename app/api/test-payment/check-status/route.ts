import { NextRequest, NextResponse } from 'next/server';

// Pakasir.com Configuration
const PAKASIR_API_KEY = 'teLlWce5MvY8y0YeTqolnZNRveRRRtll';
const PAKASIR_PROJECT_SLUG = 'jobmate';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');
    const amount = searchParams.get('amount');

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Order ID and amount are required' },
        { status: 400 }
      );
    }

    console.log('[Check Status] Checking payment status:', { orderId, amount });

    // Call Pakasir Transaction Detail API
    // API: GET https://app.pakasir.com/api/transactiondetail
    const url = new URL('https://app.pakasir.com/api/transactiondetail');
    url.searchParams.set('project', PAKASIR_PROJECT_SLUG);
    url.searchParams.set('order_id', orderId);
    url.searchParams.set('amount', amount); // Required by Pakasir API
    url.searchParams.set('api_key', PAKASIR_API_KEY);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Check Status] Pakasir API error:', {
        status: response.status,
        error: errorText,
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to check payment status',
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[Check Status] Payment status:', {
      order_id: data.transaction?.order_id,
      status: data.transaction?.status,
    });

    return NextResponse.json({
      success: true,
      status: data.transaction?.status || 'pending',
      transaction: data.transaction,
    });

  } catch (error: any) {
    console.error('[Check Status] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check payment status',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
