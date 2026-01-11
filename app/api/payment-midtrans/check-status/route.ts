import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MIDTRANS_API_URL, getMidtransAuthHeader, mapMidtransStatus, midtransConfig } from '@/lib/midtrans';

// Helper: Fetch transaction status from Midtrans API
async function fetchTransactionFromMidtrans(orderId: string) {
    if (!midtransConfig.serverKey) {
        console.error('[Midtrans Fetch] MIDTRANS_SERVER_KEY not set');
        return null;
    }

    try {
        console.log('[Midtrans Fetch] Fetching transaction status for order_id:', orderId);

        // Midtrans API: Get transaction status by order_id
        const response = await fetch(`${MIDTRANS_API_URL}/${orderId}/status`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': getMidtransAuthHeader(),
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Midtrans Fetch] Failed to fetch transaction:', response.status, errorText);
            return null;
        }

        const transaction = await response.json();
        console.log('[Midtrans Fetch] Transaction found:', transaction.order_id, 'Status:', transaction.transaction_status);
        return transaction;
    } catch (error) {
        console.error('[Midtrans Fetch] Error:', error);
        return null;
    }
}

// Helper: Convert Midtrans transaction to our payment format (same as Xendit format)
function convertMidtransToPayment(transaction: any) {
    const planType = transaction.order_id?.includes('premium') ? 'premium' : 'basic';
    const amount = parseInt(transaction.gross_amount) || (planType === 'premium' ? 39000 : 10000);

    // Extract customer name from Midtrans response
    let userName = '';
    if (transaction.customer_details) {
        const firstName = transaction.customer_details.first_name || '';
        const lastName = transaction.customer_details.last_name || '';
        userName = [firstName, lastName].filter(Boolean).join(' ').trim() || 'Unknown User';
    }

    // Extract phone number
    const userWhatsapp = transaction.customer_details?.phone || '';

    // Extract email
    const userEmail = transaction.customer_details?.email || '';

    console.log('[convertMidtransToPayment] Extracted customer data:', {
        userName,
        userEmail,
        userWhatsapp,
    });

    // Map Midtrans status to our internal status
    const status = mapMidtransStatus(transaction.transaction_status, transaction.fraud_status);

    return {
        externalId: transaction.order_id,
        invoiceId: transaction.transaction_id || transaction.order_id,
        status: status,
        amount: amount,
        planType: planType,
        paidAt: transaction.settlement_time || transaction.transaction_time || null,
        expiredAt: null, // Midtrans doesn't return expiry in status endpoint
        createdAt: transaction.transaction_time || null,
        userName: userName,
        userEmail: userEmail,
        userWhatsapp: userWhatsapp,
        paymentMethod: transaction.payment_type || null,
        invoiceUrl: '', // Not available in status response
    };
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        // Support both external_id (Xendit format) and order_id (Midtrans format)
        const orderId = searchParams.get('external_id') || searchParams.get('order_id');

        console.log('[Midtrans Check Status] Request received for order_id:', orderId);

        if (!orderId) {
            console.error('[Midtrans Check Status] No order_id provided');
            return NextResponse.json(
                { error: 'order_id or external_id is required' },
                { status: 400 }
            );
        }

        // Step 1: Try to fetch from database first
        const supabase = await createClient();
        const { data: payment, error } = await supabase
            .from('payments')
            .select('*')
            .eq('external_id', orderId)
            .single();

        // If found in database, return it
        if (payment && !error) {
            console.log('[Midtrans Check Status] Payment found in database:', payment.external_id, 'Status:', payment.status);
            console.log('[Midtrans Check Status] Customer data from DB:', {
                userName: payment.user_name,
                userEmail: payment.user_email,
                userWhatsapp: payment.user_whatsapp,
            });

            // Return in same format as Xendit for compatibility
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
                paymentGateway: payment.payment_gateway || 'midtrans',
            });
        }

        // Step 2: Not found in database, try to fetch from Midtrans
        console.log('[Midtrans Check Status] Payment not in database, fetching from Midtrans...');

        const midtransTransaction = await fetchTransactionFromMidtrans(orderId);

        if (!midtransTransaction) {
            console.error('[Midtrans Check Status] Payment not found in database OR Midtrans');
            console.error('[Midtrans Check Status] Order ID:', orderId);
            console.error('[Midtrans Check Status] Database error:', error);

            const hasMidtransKey = !!midtransConfig.serverKey;
            console.error('[Midtrans Check Status] Midtrans credentials configured:', hasMidtransKey);

            return NextResponse.json(
                {
                    error: 'Payment not found',
                    message: 'Invoice tidak ditemukan di database maupun Midtrans. Kemungkinan invoice belum dibuat atau sudah expired.',
                    externalId: orderId,
                    debug: {
                        checkedDatabase: true,
                        databaseError: error?.message || 'Not found',
                        checkedMidtrans: true,
                        midtransConfigured: hasMidtransKey,
                    }
                },
                { status: 404 }
            );
        }

        // Step 3: Found in Midtrans, save to database for future requests
        console.log('[Midtrans Check Status] Found in Midtrans, saving to database...');

        const paymentData = convertMidtransToPayment(midtransTransaction);

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
                payment_gateway: 'midtrans',
            }, {
                onConflict: 'external_id',
                ignoreDuplicates: false,
            })
            .select()
            .single();

        if (saveError) {
            console.error('[Midtrans Check Status] Failed to save to database:', saveError);
        } else {
            console.log('[Midtrans Check Status] Payment saved to database from Midtrans');
        }

        // Return data from Midtrans
        return NextResponse.json({
            success: true,
            payment: paymentData,
            source: 'midtrans',
            paymentGateway: 'midtrans',
        });

    } catch (error: any) {
        console.error('[Midtrans Check Status] Error:', error);
        return NextResponse.json(
            { error: 'Failed to check payment status', message: error.message },
            { status: 500 }
        );
    }
}
