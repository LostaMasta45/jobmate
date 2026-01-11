// lib/midtrans.ts - Midtrans Configuration
// Production credentials from Midtrans Dashboard

export const midtransConfig = {
    serverKey: process.env.MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
    merchantId: process.env.MIDTRANS_MERCHANT_ID || '',
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
};

// API Endpoints
export const MIDTRANS_SNAP_URL = midtransConfig.isProduction
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

export const MIDTRANS_API_URL = midtransConfig.isProduction
    ? 'https://api.midtrans.com/v2'
    : 'https://api.sandbox.midtrans.com/v2';

// Generate Basic Auth header
export function getMidtransAuthHeader(): string {
    const serverKey = midtransConfig.serverKey;
    if (!serverKey) {
        throw new Error('MIDTRANS_SERVER_KEY is not configured');
    }
    // Midtrans uses ServerKey as username and empty password
    return `Basic ${Buffer.from(serverKey + ':').toString('base64')}`;
}

// Verify Midtrans webhook signature
// signature_key = SHA512(order_id + status_code + gross_amount + ServerKey)
import crypto from 'crypto';

export function verifyMidtransSignature(
    orderId: string,
    statusCode: string,
    grossAmount: string,
    signatureKey: string
): boolean {
    const serverKey = midtransConfig.serverKey;
    if (!serverKey) {
        console.error('[Midtrans] Server key not configured');
        return false;
    }

    const payload = orderId + statusCode + grossAmount + serverKey;
    const calculatedSignature = crypto.createHash('sha512').update(payload).digest('hex');

    return calculatedSignature === signatureKey;
}

// Map Midtrans transaction status to our internal status
export function mapMidtransStatus(transactionStatus: string, fraudStatus?: string): string {
    // If fraud status is not accept, treat as failed
    if (fraudStatus && fraudStatus !== 'accept') {
        return 'failed';
    }

    switch (transactionStatus) {
        case 'capture':
        case 'settlement':
            return 'paid';
        case 'pending':
            return 'pending';
        case 'deny':
        case 'cancel':
        case 'failure':
            return 'failed';
        case 'expire':
            return 'expired';
        case 'refund':
        case 'partial_refund':
            return 'refunded';
        default:
            return 'pending';
    }
}
