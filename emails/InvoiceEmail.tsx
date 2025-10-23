// emails/InvoiceEmail.tsx
import React from 'react';

interface InvoiceEmailProps {
  userName: string;
  invoiceUrl: string;
  amount: number;
  currency: string;
  expiryDate: string;
  description: string;
}

export const InvoiceEmail: React.FC<InvoiceEmailProps> = ({
  userName,
  invoiceUrl,
  amount,
  currency,
  expiryDate,
  description,
}) => {
  return (
    <html>
      <head>
        <style>{`
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; margin: 20px 0; border-radius: 8px; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; 
                   text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .invoice-details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .amount { font-size: 32px; font-weight: bold; color: #4F46E5; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>Invoice Pembayaran</h1>
          </div>
          
          <div className="content">
            <p>Halo {userName},</p>
            <p>Terima kasih telah menggunakan layanan kami. Berikut adalah detail invoice Anda:</p>
            
            <div className="invoice-details">
              <h2>Detail Pembayaran</h2>
              <p><strong>Deskripsi:</strong> {description}</p>
              <p><strong>Jumlah:</strong></p>
              <p className="amount">{currency} {amount.toLocaleString('id-ID')}</p>
              <p><strong>Berlaku hingga:</strong> {new Date(expiryDate).toLocaleString('id-ID')}</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <a href={invoiceUrl} className="button">
                Bayar Sekarang
              </a>
            </div>
            
            <p style={{ marginTop: 30, fontSize: 14, color: '#666' }}>
              Link pembayaran ini akan kedaluwarsa pada {new Date(expiryDate).toLocaleString('id-ID')}.
              Segera lakukan pembayaran untuk menghindari pembatalan otomatis.
            </p>
          </div>
          
          <div className="footer">
            <p>Email ini dikirim secara otomatis. Jangan membalas email ini.</p>
            <p>Jika ada pertanyaan, hubungi support kami.</p>
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
