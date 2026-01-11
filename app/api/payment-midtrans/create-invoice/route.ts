import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendInvoiceEmail } from '@/lib/send-invoice-email';
import { MIDTRANS_SNAP_URL, getMidtransAuthHeader, midtransConfig } from '@/lib/midtrans';

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

        // Plan configuration (same as Xendit version)
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
        // Use same external_id format for database compatibility
        const orderId = `jobmate-${plan}-${Date.now()}`;

        // Check Midtrans configuration
        if (!midtransConfig.serverKey) {
            console.error('[Midtrans Create Invoice] MIDTRANS_SERVER_KEY not set');
            return NextResponse.json(
                { error: 'Payment gateway not configured' },
                { status: 500 }
            );
        }

        console.log('[Midtrans Create Invoice] Creating transaction:', {
            plan,
            amount,
            email,
            orderId,
        });

        // Create Snap transaction token via Midtrans
        const midtransResponse = await fetch(MIDTRANS_SNAP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': getMidtransAuthHeader(),
            },
            body: JSON.stringify({
                transaction_details: {
                    order_id: orderId,
                    gross_amount: amount,
                },
                credit_card: {
                    secure: true,
                },
                customer_details: {
                    first_name: fullName,
                    email: email,
                    phone: whatsapp,
                },
                item_details: [
                    {
                        id: plan,
                        name: selectedPlan.name,
                        price: amount,
                        quantity: 1,
                        category: 'Membership',
                    },
                ],
                // Optional: Set custom expiry (24 hours)
                expiry: {
                    unit: 'hours',
                    duration: 24,
                },
                // Callback URLs
                callbacks: {
                    finish: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jobmate.web.id'}/payment-midtrans/success?order_id=${orderId}`,
                },
            }),
        });

        if (!midtransResponse.ok) {
            const errorData = await midtransResponse.json();
            console.error('[Midtrans Create Invoice] API error:', errorData);
            return NextResponse.json(
                { error: 'Failed to create transaction', details: errorData },
                { status: midtransResponse.status }
            );
        }

        const snapResponse = await midtransResponse.json();
        console.log('[Midtrans Create Invoice] Snap token created:', snapResponse.token);

        // Save payment to database with UPSERT (same format as Xendit for compatibility)
        const supabase = await createClient();

        // Calculate expiry date (24 hours from now)
        const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        console.log('[Midtrans Create Invoice] Saving to database:', {
            external_id: orderId,
            user_email: email,
            user_name: fullName,
            user_whatsapp: whatsapp,
            plan_type: plan,
            amount: amount,
        });

        const { data: paymentData, error: dbError } = await supabase
            .from('payments')
            .upsert({
                external_id: orderId, // Using same field name for compatibility
                user_email: email,
                user_name: fullName,
                user_whatsapp: whatsapp,
                plan_type: plan,
                amount: amount,
                status: 'pending',
                invoice_id: snapResponse.token, // Store snap token as invoice_id
                invoice_url: snapResponse.redirect_url, // Midtrans redirect URL
                expired_at: expiryDate,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                payment_gateway: 'midtrans', // NEW: Track which gateway
            }, {
                onConflict: 'external_id',
                ignoreDuplicates: false,
            })
            .select()
            .single();

        if (dbError) {
            console.error('[Midtrans Create Invoice] Database UPSERT error:', dbError);
            console.error('[Midtrans Create Invoice] CRITICAL: Payment created in Midtrans but not in database!');
            console.error('[Midtrans Create Invoice] Order ID:', orderId);
            // Still return success - webhook will handle the save
        } else {
            console.log('[Midtrans Create Invoice] Payment saved to database successfully');
            console.log('[Midtrans Create Invoice] Saved data:', {
                external_id: paymentData?.external_id,
                user_name: paymentData?.user_name,
                user_email: paymentData?.user_email,
                user_whatsapp: paymentData?.user_whatsapp,
            });
        }

        // Send invoice email (same as Xendit version)
        try {
            console.log('[Midtrans Create Invoice] Sending invoice email to:', email);

            const emailResult = await sendInvoiceEmail({
                toEmail: email,
                userName: fullName || email.split('@')[0],
                invoiceUrl: snapResponse.redirect_url,
                amount: amount,
                currency: 'IDR',
                expiryDate: expiryDate,
                description: `${selectedPlan.name} - InfoLokerJombang`,
            });

            if (emailResult.success) {
                console.log('[Midtrans Create Invoice] Invoice email sent successfully');
            } else {
                console.error('[Midtrans Create Invoice] Failed to send invoice email:', emailResult.error);
            }
        } catch (emailError) {
            console.error('[Midtrans Create Invoice] Error sending invoice email:', emailError);
        }

        // Return response in same format as Xendit for frontend compatibility
        return NextResponse.json({
            success: true,
            invoiceUrl: snapResponse.redirect_url, // Same field name as Xendit
            externalId: orderId, // Same field name as Xendit
            invoiceId: snapResponse.token, // Snap token
            amount: amount,
            expiryDate: expiryDate,
            emailSent: true,
            // Additional Midtrans-specific fields
            snapToken: snapResponse.token,
            paymentGateway: 'midtrans',
        });

    } catch (error: any) {
        console.error('[Midtrans Create Invoice] Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to create invoice',
                message: error.message
            },
            { status: 500 }
        );
    }
}
