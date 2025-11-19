// emails/InvoiceEmail.tsx
import React from 'react';

interface InvoiceEmailProps {
  userName: string;
  invoiceUrl: string;
  amount: number;
  currency: string;
  expiryDate: string;
  description: string;
  toEmail?: string;
}

export const InvoiceEmail: React.FC<InvoiceEmailProps> = ({
  userName,
  invoiceUrl,
  amount,
  currency,
  expiryDate,
  description,
}) => {
  // Calculate time remaining
  const now = new Date();
  const expiry = new Date(expiryDate);
  const hoursRemaining = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));
  const isUrgent = hoursRemaining < 6;
  
  // Generate invoice ID from timestamp
  const invoiceId = `INV-${new Date().getTime().toString().slice(-9)}`;
  
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>{`
          :root {
            color-scheme: light dark;
            supported-color-schemes: light dark;
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
            line-height: 1.6; 
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            padding: 20px;
            min-height: 100vh;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
            animation: slideUp 0.6s ease-out;
          }
          
          /* Dark Mode Support */
          @media (prefers-color-scheme: dark) {
            body {
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
            }
            .container {
              background: #0f172a;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
            }
            .content {
              background: #0f172a !important;
            }
            .greeting, .invoice-value, .invoice-id {
              color: #f1f5f9 !important;
            }
            .intro-text, .invoice-label {
              color: #cbd5e1 !important;
            }
            .invoice-card {
              background: linear-gradient(135deg, #1e293b 0%, #334155 100%) !important;
              border-color: #475569 !important;
            }
            .payment-methods {
              background: #1e293b !important;
            }
            .payment-badge {
              background: #0f172a !important;
              border-color: #475569 !important;
              color: #f1f5f9 !important;
            }
            .footer {
              background: #1e293b !important;
            }
            .footer-brand, .footer-text {
              color: #f1f5f9 !important;
            }
            .footer-text {
              color: #cbd5e1 !important;
            }
            .countdown-section {
              background: ${isUrgent ? '#7f1d1d' : '#1e3a8a'} !important;
              border-color: ${isUrgent ? '#991b1b' : '#1e40af'} !important;
            }
            .countdown-label {
              color: ${isUrgent ? '#fca5a5' : '#93c5fd'} !important;
            }
            .countdown-time {
              color: ${isUrgent ? '#ef4444' : '#3b82f6'} !important;
            }
            .progress-bar-bg {
              background: ${isUrgent ? '#991b1b' : '#1e40af'} !important;
            }
            .trust-badge {
              background: #064e3b !important;
              border-color: #059669 !important;
            }
            .trust-badge-text {
              color: #6ee7b7 !important;
            }
            .warning-box {
              background: #78350f !important;
              border-color: #a16207 !important;
            }
            .warning-text {
              color: #fde047 !important;
            }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 4px 12px rgba(85, 71, 208, 0.4); }
            50% { box-shadow: 0 4px 20px rgba(85, 71, 208, 0.6), 0 0 30px rgba(85, 71, 208, 0.3); }
          }
          
          @keyframes progressFill {
            from { width: 0%; }
            to { width: ${Math.max(10, Math.min(100, (hoursRemaining / 24) * 100))}%; }
          }
          
          /* Header dengan gradient dan logo */
          .header { 
            background: linear-gradient(135deg, #5547d0 0%, #3977d3 50%, #00acc7 100%);
            color: white; 
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: float 6s ease-in-out infinite;
          }
          .logo { 
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 12px;
            letter-spacing: 2px;
            position: relative;
            z-index: 1;
            display: inline-block;
            text-shadow: 0 2px 10px rgba(0,0,0,0.2);
          }
          .header-subtitle {
            font-size: 16px;
            opacity: 0.95;
            font-weight: 500;
            position: relative;
            z-index: 1;
          }
          
          /* Content area */
          .content { 
            padding: 40px 30px;
          }
          
          .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #111827;
          }
          
          .intro-text {
            color: #6b7280;
            margin-bottom: 30px;
            font-size: 15px;
          }
          
          /* Invoice card */
          .invoice-card {
            background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            animation: slideUp 0.6s ease-out 0.2s both;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }
          
          .invoice-id {
            font-size: 13px;
            color: #6b7280;
            font-weight: 600;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 2px solid #e5e7eb;
          }
          
          .invoice-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          
          .invoice-label {
            color: #6b7280;
            font-size: 14px;
          }
          
          .invoice-value {
            color: #111827;
            font-weight: 600;
            font-size: 14px;
          }
          
          /* Amount box dengan gradient */
          .amount-box {
            background: linear-gradient(135deg, #5547d0 0%, #3977d3 100%);
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            margin: 24px 0;
            box-shadow: 0 4px 12px rgba(85, 71, 208, 0.3);
            animation: slideUp 0.6s ease-out 0.3s both, glow 2s ease-in-out infinite;
            position: relative;
            overflow: hidden;
          }
          .amount-box::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
            animation: shimmer 3s infinite;
          }
          
          .amount-label {
            color: rgba(255, 255, 255, 0.9);
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .amount-value {
            color: white;
            font-size: 40px;
            font-weight: bold;
            letter-spacing: -1px;
            position: relative;
            z-index: 1;
            animation: pulse 2s ease-in-out infinite;
          }
          
          /* Progress bar countdown */
          .countdown-section {
            background: ${isUrgent ? '#fef2f2' : '#f0f9ff'};
            border: 2px solid ${isUrgent ? '#fecaca' : '#bfdbfe'};
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
            animation: slideUp 0.6s ease-out 0.4s both${isUrgent ? ', pulse 1.5s ease-in-out infinite' : ''};
          }
          
          .countdown-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }
          
          .countdown-label {
            color: ${isUrgent ? '#991b1b' : '#1e40af'};
            font-size: 14px;
            font-weight: 600;
          }
          
          .countdown-time {
            color: ${isUrgent ? '#dc2626' : '#2563eb'};
            font-size: 16px;
            font-weight: bold;
          }
          
          .progress-bar-bg {
            background: ${isUrgent ? '#fee2e2' : '#dbeafe'};
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
          }
          
          .progress-bar-fill {
            background: ${isUrgent ? 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)' : 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)'};
            height: 100%;
            width: ${Math.max(10, Math.min(100, (hoursRemaining / 24) * 100))}%;
            animation: progressFill 1s ease-out 0.5s both;
            box-shadow: 0 0 10px ${isUrgent ? 'rgba(220, 38, 38, 0.5)' : 'rgba(37, 99, 235, 0.5)'};
          }
          
          /* CTA Button */
          .cta-section {
            text-align: center;
            margin: 32px 0;
            animation: slideUp 0.6s ease-out 0.5s both;
          }
          
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #5547d0 0%, #3977d3 100%);
            color: white;
            padding: 16px 48px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(85, 71, 208, 0.4);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            position: relative;
            overflow: hidden;
            animation: pulse 2s ease-in-out infinite;
          }
          
          .cta-button::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);
            animation: shimmer 2.5s infinite;
          }
          
          .cta-button:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 8px 20px rgba(85, 71, 208, 0.6);
          }
          
          .secondary-link {
            display: block;
            margin-top: 16px;
            color: #6b7280;
            font-size: 14px;
            text-decoration: none;
          }
          
          /* Payment methods */
          .payment-methods {
            background: #f9fafb;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
            animation: slideUp 0.6s ease-out 0.6s both;
          }
          
          .payment-methods-title {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 12px;
          }
          
          .payment-icons {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }
          
          .payment-badge {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 8px 16px;
            font-size: 12px;
            font-weight: 600;
            color: #374151;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .payment-badge:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          
          /* Trust badge */
          .trust-badge {
            text-align: center;
            padding: 16px;
            background: #ecfdf5;
            border: 1px solid #a7f3d0;
            border-radius: 8px;
            margin: 24px 0;
            animation: slideUp 0.6s ease-out 0.7s both;
          }
          
          .trust-badge-text {
            color: #065f46;
            font-size: 13px;
            font-weight: 600;
          }
          
          .trust-icon {
            font-size: 18px;
            margin-right: 4px;
          }
          
          /* Warning box */
          .warning-box {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
            animation: slideUp 0.6s ease-out 0.8s both;
          }
          
          .warning-text {
            color: #92400e;
            font-size: 13px;
            line-height: 1.6;
          }
          
          /* Footer */
          .footer { 
            background: #f9fafb;
            padding: 30px;
            text-align: center;
          }
          
          .footer-brand {
            font-weight: 600;
            color: #111827;
            margin-bottom: 8px;
            font-size: 14px;
          }
          
          .footer-text {
            color: #6b7280;
            font-size: 13px;
            margin: 4px 0;
          }
          
          .footer-link {
            color: #3977d3;
            text-decoration: none;
          }
          
          /* Responsive Mobile */
          @media only screen and (max-width: 600px) {
            body { 
              padding: 10px !important; 
            }
            .container {
              border-radius: 16px !important;
              width: 100% !important;
              max-width: 100% !important;
            }
            .header { 
              padding: 30px 20px !important; 
            }
            .logo {
              font-size: 24px !important;
              letter-spacing: 1px !important;
            }
            .header-subtitle {
              font-size: 14px !important;
            }
            .content { 
              padding: 24px 16px !important; 
            }
            .greeting {
              font-size: 16px !important;
            }
            .intro-text {
              font-size: 14px !important;
            }
            .invoice-card {
              padding: 20px !important;
              margin-bottom: 20px !important;
            }
            .invoice-id {
              font-size: 12px !important;
            }
            .invoice-label, .invoice-value {
              font-size: 13px !important;
            }
            .amount-box {
              padding: 20px !important;
              margin: 20px 0 !important;
            }
            .amount-label {
              font-size: 12px !important;
            }
            .amount-value { 
              font-size: 36px !important;
              letter-spacing: -0.5px !important;
            }
            .countdown-section {
              padding: 16px !important;
              margin: 20px 0 !important;
            }
            .countdown-label, .countdown-time {
              font-size: 13px !important;
            }
            .cta-button { 
              padding: 16px 40px !important;
              font-size: 15px !important;
              width: 100% !important;
              display: block !important;
              text-align: center !important;
              box-sizing: border-box !important;
            }
            .secondary-link {
              font-size: 13px !important;
              margin-top: 12px !important;
            }
            .payment-methods {
              padding: 16px !important;
              margin: 20px 0 !important;
            }
            .payment-methods-title {
              font-size: 13px !important;
              margin-bottom: 10px !important;
            }
            .payment-badge {
              font-size: 11px !important;
              padding: 6px 12px !important;
            }
            .trust-badge, .warning-box {
              padding: 14px !important;
              margin: 20px 0 !important;
            }
            .trust-badge-text, .warning-text {
              font-size: 12px !important;
              line-height: 1.5 !important;
            }
            .footer {
              padding: 24px 16px !important;
            }
            .footer-brand {
              font-size: 13px !important;
            }
            .footer-text {
              font-size: 12px !important;
            }
          }
          
          /* Extra Small Devices */
          @media only screen and (max-width: 400px) {
            .logo {
              font-size: 20px !important;
            }
            .amount-value {
              font-size: 32px !important;
            }
            .payment-icons {
              gap: 8px !important;
            }
            .payment-badge {
              font-size: 10px !important;
              padding: 5px 10px !important;
            }
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          {/* Header dengan logo */}
          <div className="header">
            <div className="logo">JOBMATE</div>
            <div className="header-subtitle">Invoice Pembayaran</div>
          </div>
          
          <div className="content">
            {/* Greeting */}
            <div className="greeting">Halo {userName},</div>
            <div className="intro-text">
              Terima kasih telah memilih layanan kami. Berikut adalah detail invoice pembayaran Anda.
            </div>
            
            {/* Invoice card */}
            <div className="invoice-card">
              <div className="invoice-id">Invoice #{invoiceId}</div>
              
              <div className="invoice-item">
                <span className="invoice-label">Deskripsi</span>
                <span className="invoice-value">{description}</span>
              </div>
              
              <div className="invoice-item">
                <span className="invoice-label">Status</span>
                <span className="invoice-value" style={{ color: '#f59e0b' }}>⏳ Menunggu Pembayaran</span>
              </div>
              
              <div className="invoice-item" style={{ borderBottom: 'none' }}>
                <span className="invoice-label">Berlaku Hingga</span>
                <span className="invoice-value">{new Date(expiryDate).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>
            
            {/* Amount box */}
            <div className="amount-box">
              <div className="amount-label">Total Pembayaran</div>
              <div className="amount-value">{currency} {amount.toLocaleString('id-ID')}</div>
            </div>
            
            {/* Countdown */}
            <div className="countdown-section">
              <div className="countdown-header">
                <span className="countdown-label">
                  {isUrgent ? '⚠️ Segera Bayar' : '⏰ Waktu Tersisa'}
                </span>
                <span className="countdown-time">
                  {hoursRemaining > 0 ? `${hoursRemaining} jam lagi` : 'Segera berakhir!'}
                </span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill"></div>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="cta-section">
              <a href={invoiceUrl} className="cta-button">
                💳 Bayar Sekarang
              </a>
              <a href={invoiceUrl} className="secondary-link">
                Lihat Detail Invoice →
              </a>
            </div>
            
            {/* Payment methods */}
            <div className="payment-methods">
              <div className="payment-methods-title">Metode Pembayaran Tersedia:</div>
              <div className="payment-icons">
                <span className="payment-badge">🏦 Transfer Bank</span>
                <span className="payment-badge">💳 Kartu Kredit</span>
                <span className="payment-badge">📱 E-Wallet</span>
                <span className="payment-badge">🏪 Alfamart</span>
                <span className="payment-badge">🏬 Indomaret</span>
              </div>
            </div>
            
            {/* Trust badge */}
            <div className="trust-badge">
              <div className="trust-badge-text">
                <span className="trust-icon">🔒</span>
                Pembayaran Aman - Dienkripsi dengan SSL 256-bit
              </div>
            </div>
            
            {/* Warning */}
            <div className="warning-box">
              <div className="warning-text">
                ⚡ <strong>Penting:</strong> Link pembayaran ini akan kedaluwarsa pada {new Date(expiryDate).toLocaleString('id-ID')}. 
                Segera lakukan pembayaran untuk menghindari pembatalan otomatis.
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="footer">
            <div className="footer-brand">Jobmate x Infolokerjombang</div>
            <div className="footer-text">Platform Karir Terpercaya</div>
            <div className="footer-text">
              Butuh bantuan? Hubungi <a href="mailto:admin@jobmate.web.id" className="footer-link">admin@jobmate.web.id</a>
            </div>
            <div className="footer-text" style={{ marginTop: 12 }}>
              © 2025 JOBMATE. All rights reserved.
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

// Plain text version
export const InvoiceEmailText = ({
  userName,
  invoiceUrl,
  amount,
  currency,
  expiryDate,
  description,
}: InvoiceEmailProps) => `
Halo ${userName},

Terima kasih telah menggunakan layanan kami. Berikut adalah detail invoice Anda:

Detail Pembayaran:
- Deskripsi: ${description}
- Jumlah: ${currency} ${amount.toLocaleString('id-ID')}
- Berlaku hingga: ${new Date(expiryDate).toLocaleString('id-ID')}

Bayar sekarang: ${invoiceUrl}

Link pembayaran ini akan kedaluwarsa pada ${new Date(expiryDate).toLocaleString('id-ID')}.

---
Email ini dikirim secara otomatis. Jangan membalas email ini.
`;
