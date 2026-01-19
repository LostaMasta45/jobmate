import { NextRequest, NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { PaymentSuccessEmail, PaymentSuccessEmailText } from '@/emails/PaymentSuccessEmail';
import { render } from '@react-email/render';

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

    // --- DIRECT EMAIL SENDING (Using new PaymentSuccessEmail template) ---
    if (customerEmail) {
      try {
        console.log('[Payment Simulation] Sending success email to:', customerEmail);

        const emailProps = {
          userName: customerName || 'User',
          amount: amount,
          transactionDate: new Date().toISOString(),
          planType: planType || 'basic',
          dashboardUrl: 'https://jobmate.web.id/ajukan-akun'
        };

        const emailHtml = await render(<PaymentSuccessEmail { ...emailProps } />);
        const emailText = PaymentSuccessEmailText(emailProps);

        await resend.emails.send({
          from: FROM_EMAIL,
          to: customerEmail,
          subject: `✅ Pembayaran ${planType === 'premium' ? 'VIP Premium' : 'VIP Basic'} Berhasil - JOBMATE`,
          html: emailHtml,
          text: emailText,
          tags: [
            { name: 'category', value: 'payment-confirmation' },
            { name: 'plan', value: planType || 'basic' },
            { name: 'gateway', value: 'pakasir-sandbox' },
          ],
        });

        console.log('[Payment Simulation] ✅ Payment success email sent (Redesigned)');
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
      note: 'Payment success email sent directly using Redesigned template.',
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
