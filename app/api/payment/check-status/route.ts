import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const externalId = searchParams.get('external_id');

    if (!externalId) {
      return NextResponse.json(
        { error: 'external_id is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('external_id', externalId)
      .single();

    if (error || !payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      payment: {
        externalId: payment.external_id,
        status: payment.status,
        amount: payment.amount,
        planType: payment.plan_type,
        paidAt: payment.paid_at,
        expiredAt: payment.expired_at,
      },
    });

  } catch (error: any) {
    console.error('[Check Status] Error:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}
