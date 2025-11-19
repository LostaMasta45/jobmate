// emails/InvoiceEmailTable.tsx - Table-based layout for email compatibility
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

export const InvoiceEmailTable: React.FC<InvoiceEmailProps> = ({
  userName,
  invoiceUrl,
  amount,
  currency,
  expiryDate,
  description,
}) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const hoursRemaining = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));
  const isUrgent = hoursRemaining < 6;
  const invoiceId = `INV-${new Date().getTime().toString().slice(-9)}`;
  const progressPercentage = Math.max(10, Math.min(100, (hoursRemaining / 24) * 100));

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: '#f3f4f6',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        width: '100%',
      }}>
        {/* Main Container */}
        <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
          backgroundColor: '#f3f4f6',
          padding: '20px 0',
        }}>
          <tr>
            <td align="center">
              {/* Content Table */}
              <table cellPadding="0" cellSpacing="0" border={0} width="600" style={{
                maxWidth: '600px',
                width: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}>
                
                {/* Header */}
                <tr>
                  <td style={{
                    background: 'linear-gradient(135deg, #5547d0 0%, #3977d3 50%, #00acc7 100%)',
                    padding: '40px 30px',
                    textAlign: 'center',
                  }}>
                    {/* Logo Section */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                      <tr>
                        <td align="center">
                          <img 
                            src="https://raw.githubusercontent.com/LostaMasta45/jobmate/main/public/Logo/logopanjang.png"
                            alt="Jobmate x Infolokerjombang"
                            width="200"
                            height="50"
                            style={{
                              display: 'block',
                              margin: '0 auto 16px',
                              maxWidth: '200px',
                              height: 'auto',
                              filter: 'brightness(0) invert(1)',
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <h1 style={{
                            margin: 0,
                            color: '#ffffff',
                            fontSize: '32px',
                            fontWeight: '800',
                            letterSpacing: '2px',
                            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                          }}>
                            JOBMATE
                          </h1>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <p style={{
                            margin: '8px 0 0',
                            color: '#ffffff',
                            fontSize: '14px',
                            opacity: 0.9,
                            fontWeight: '500',
                          }}>
                            x Infolokerjombang
                          </p>
                        </td>
                      </tr>
                    </table>
                    <p style={{
                      margin: '20px 0 0',
                      color: '#ffffff',
                      fontSize: '16px',
                      opacity: 0.95,
                      fontWeight: '500',
                    }}>
                      Invoice Pembayaran
                    </p>
                  </td>
                </tr>

                {/* Content */}
                <tr>
                  <td style={{ padding: '40px 30px' }}>
                    
                    {/* Greeting */}
                    <h2 style={{
                      margin: '0 0 12px',
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#111827',
                    }}>
                      Halo {userName},
                    </h2>
                    <p style={{
                      margin: '0 0 30px',
                      color: '#6b7280',
                      fontSize: '15px',
                      lineHeight: '1.6',
                    }}>
                      Terima kasih telah memilih layanan kami. Berikut adalah detail invoice pembayaran Anda.
                    </p>

                    {/* Invoice Card */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#f9fafb',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      marginBottom: '24px',
                    }}>
                      <tr>
                        <td style={{ padding: '24px' }}>
                          <p style={{
                            margin: '0 0 16px',
                            paddingBottom: '12px',
                            borderBottom: '2px solid #e5e7eb',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#6b7280',
                          }}>
                            Invoice #{invoiceId}
                          </p>
                          
                          <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                            <tr>
                              <td style={{ padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Deskripsi</span>
                              </td>
                              <td align="right" style={{ padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                                <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>{description}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Status</span>
                              </td>
                              <td align="right" style={{ padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                                <span style={{ color: '#f59e0b', fontSize: '14px', fontWeight: '600' }}>⏳ Menunggu Pembayaran</span>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: '12px 0' }}>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Berlaku Hingga</span>
                              </td>
                              <td align="right" style={{ padding: '12px 0' }}>
                                <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>
                                  {new Date(expiryDate).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    {/* Amount Box */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      background: 'linear-gradient(135deg, #5547d0 0%, #3977d3 100%)',
                      borderRadius: '12px',
                      marginBottom: '24px',
                      boxShadow: '0 4px 12px rgba(85, 71, 208, 0.4)',
                    }}>
                      <tr>
                        <td style={{ padding: '30px', textAlign: 'center' }}>
                          <p style={{
                            margin: '0 0 12px',
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '13px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                          }}>
                            Total Pembayaran
                          </p>
                          <p style={{
                            margin: 0,
                            color: '#ffffff',
                            fontSize: '48px',
                            fontWeight: 'bold',
                            letterSpacing: '-1px',
                          }}>
                            {currency} {amount.toLocaleString('id-ID')}
                          </p>
                        </td>
                      </tr>
                    </table>

                    {/* Countdown */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: isUrgent ? '#fef2f2' : '#f0f9ff',
                      border: `2px solid ${isUrgent ? '#fecaca' : '#bfdbfe'}`,
                      borderRadius: '12px',
                      marginBottom: '24px',
                    }}>
                      <tr>
                        <td style={{ padding: '20px' }}>
                          <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                            <tr>
                              <td>
                                <span style={{
                                  color: isUrgent ? '#991b1b' : '#1e40af',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                }}>
                                  {isUrgent ? '⚠️ Segera Bayar' : '⏰ Waktu Tersisa'}
                                </span>
                              </td>
                              <td align="right">
                                <span style={{
                                  color: isUrgent ? '#dc2626' : '#2563eb',
                                  fontSize: '16px',
                                  fontWeight: 'bold',
                                }}>
                                  {hoursRemaining > 0 ? `${hoursRemaining} jam lagi` : 'Segera berakhir!'}
                                </span>
                              </td>
                            </tr>
                          </table>
                          <div style={{
                            marginTop: '12px',
                            height: '8px',
                            backgroundColor: isUrgent ? '#fee2e2' : '#dbeafe',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${progressPercentage}%`,
                              background: isUrgent 
                                ? 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)'
                                : 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
                            }} />
                          </div>
                        </td>
                      </tr>
                    </table>

                    {/* CTA Button */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{ marginBottom: '24px' }}>
                      <tr>
                        <td align="center" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                          <a href={invoiceUrl} style={{
                            display: 'inline-block',
                            background: 'linear-gradient(135deg, #5547d0 0%, #3977d3 100%)',
                            color: '#ffffff',
                            padding: '16px 48px',
                            textDecoration: 'none',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            boxShadow: '0 4px 12px rgba(85, 71, 208, 0.4)',
                          }}>
                            💳 Bayar Sekarang
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <a href={invoiceUrl} style={{
                            display: 'inline-block',
                            marginTop: '16px',
                            color: '#6b7280',
                            fontSize: '14px',
                            textDecoration: 'none',
                          }}>
                            Lihat Detail Invoice →
                          </a>
                        </td>
                      </tr>
                    </table>

                    {/* Payment Methods */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '12px',
                      marginBottom: '24px',
                    }}>
                      <tr>
                        <td style={{ padding: '20px' }}>
                          <p style={{
                            margin: '0 0 12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                          }}>
                            Metode Pembayaran Tersedia:
                          </p>
                          <p style={{
                            margin: 0,
                            fontSize: '13px',
                            color: '#6b7280',
                            lineHeight: '1.8',
                          }}>
                            🏦 Transfer Bank • 💳 Kartu Kredit • 📱 E-Wallet • 🏪 Alfamart • 🏬 Indomaret
                          </p>
                        </td>
                      </tr>
                    </table>

                    {/* Trust Badge */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      borderRadius: '12px',
                      marginBottom: '24px',
                    }}>
                      <tr>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <p style={{
                            margin: 0,
                            color: '#065f46',
                            fontSize: '13px',
                            fontWeight: '600',
                          }}>
                            🔒 Pembayaran Aman - Dienkripsi dengan SSL 256-bit
                          </p>
                        </td>
                      </tr>
                    </table>

                    {/* Warning */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: '12px',
                    }}>
                      <tr>
                        <td style={{ padding: '16px' }}>
                          <p style={{
                            margin: 0,
                            color: '#92400e',
                            fontSize: '13px',
                            lineHeight: '1.6',
                          }}>
                            ⚡ <strong>Penting:</strong> Link pembayaran ini akan kedaluwarsa pada{' '}
                            {new Date(expiryDate).toLocaleString('id-ID')}. Segera lakukan pembayaran untuk menghindari pembatalan otomatis.
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{
                    backgroundColor: '#f9fafb',
                    padding: '30px',
                    textAlign: 'center',
                  }}>
                    <p style={{
                      margin: '0 0 4px',
                      fontWeight: '600',
                      color: '#111827',
                      fontSize: '14px',
                    }}>
                      Jobmate x Infolokerjombang
                    </p>
                    <p style={{
                      margin: '0 0 4px',
                      color: '#6b7280',
                      fontSize: '13px',
                    }}>
                      Platform Karir Terpercaya
                    </p>
                    <p style={{
                      margin: '0 0 12px',
                      color: '#6b7280',
                      fontSize: '13px',
                    }}>
                      Butuh bantuan? Hubungi{' '}
                      <a href="mailto:admin@jobmate.web.id" style={{ color: '#3977d3', textDecoration: 'none' }}>
                        admin@jobmate.web.id
                      </a>
                    </p>
                    <p style={{
                      margin: 0,
                      color: '#6b7280',
                      fontSize: '12px',
                    }}>
                      © 2025 JOBMATE. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};

// Plain text version
export const InvoiceEmailTableText = ({
  userName,
  invoiceUrl,
  amount,
  currency,
  expiryDate,
  description,
}: InvoiceEmailProps) => `
JOBMATE - Invoice Pembayaran

Halo ${userName},

Terima kasih telah menggunakan layanan kami. Berikut adalah detail invoice Anda:

Detail Pembayaran:
- Deskripsi: ${description}
- Jumlah: ${currency} ${amount.toLocaleString('id-ID')}
- Berlaku hingga: ${new Date(expiryDate).toLocaleString('id-ID')}

💳 Bayar sekarang: ${invoiceUrl}

Metode Pembayaran:
Transfer Bank, Kartu Kredit, E-Wallet, Alfamart, Indomaret

🔒 Pembayaran Aman - Dienkripsi dengan SSL 256-bit

⚡ PENTING: Link pembayaran ini akan kedaluwarsa pada ${new Date(expiryDate).toLocaleString('id-ID')}.

---
Jobmate x Infolokerjombang
Platform Karir Terpercaya

Butuh bantuan? admin@jobmate.web.id
© 2025 JOBMATE. All rights reserved.
`;
