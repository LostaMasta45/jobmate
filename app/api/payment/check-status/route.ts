import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    const supabase = await createClient();
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('external_id', externalId)
      .single();

    if (error) {
      console.error('[Check Status] Database error:', error);
      return NextResponse.json(
        { error: 'Payment not found', details: error.message },
        { status: 404 }
      );
    }

    if (!payment) {
      console.error('[Check Status] Payment not found for external_id:', externalId);
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    console.log('[Check Status] Payment found:', payment.external_id, 'Status:', payment.status);

    return NextResponse.json({
      success: true,
      payment: {
        externalId: payment.external_id,
        status: payment.status,
        amount: payment.amount,
        planType: payment.plan_type,
        paidAt: payment.paid_at,
        expiredAt: payment.expired_at,
        userName: payment.user_name,
        userEmail: payment.user_email,
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
