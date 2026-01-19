// emails/PaymentSuccessEmail.tsx
import React from 'react';

// Logo dari production URL
const LOGO_PANJANG_URL = 'https://jobmate.web.id/Logo/x.png';
const LOGO_KECIL_URL = 'https://jobmate.web.id/Logo/x.png';

interface PaymentSuccessEmailProps {
    userName: string;
    amount: number;
    transactionDate: string;
    planType: string;
    dashboardUrl?: string;
}

export const PaymentSuccessEmail: React.FC<PaymentSuccessEmailProps> = ({
    userName,
    amount,
    transactionDate,
    planType,
    dashboardUrl = 'https://jobmate.web.id/dashboard',
}) => {
    const planName = planType === 'premium' ? 'VIP Premium' : 'VIP Basic';

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
                                        {/* Brand Section with Logo */}
                                        <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                                            <tr>
                                                <td align="center" style={{ paddingBottom: '24px' }}>
                                                    {/* Logo Box */}
                                                    <table cellPadding="0" cellSpacing="0" border={0}>
                                                        <tr>
                                                            <td align="center" style={{
                                                                background: 'rgba(255,255,255,0.15)',
                                                                padding: '20px 36px',
                                                                borderRadius: '16px',
                                                                border: '2px solid rgba(255,255,255,0.25)',
                                                                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                                            }}>
                                                                <img
                                                                    src={LOGO_PANJANG_URL}
                                                                    alt="JOBMATE x Infolokerjombang"
                                                                    width="280"
                                                                    height="70"
                                                                    style={{
                                                                        display: 'block',
                                                                        maxWidth: '280px',
                                                                        width: '100%',
                                                                        height: 'auto',
                                                                        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))',
                                                                    }}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <div style={{
                                                        display: 'inline-block',
                                                        background: 'rgba(255,255,255,0.12)',
                                                        padding: '10px 24px',
                                                        borderRadius: '20px',
                                                        border: '1px solid rgba(255,255,255,0.2)',
                                                    }}>
                                                        <p style={{
                                                            margin: 0,
                                                            color: '#ffffff',
                                                            fontSize: '15px',
                                                            fontWeight: '600',
                                                            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                            letterSpacing: '0.5px',
                                                        }}>
                                                            ✅ Pembayaran Berhasil
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
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
                                            textAlign: 'center',
                                        }}>
                                            Selamat, {userName}! 🎉
                                        </h2>
                                        <p style={{
                                            margin: '0 0 30px',
                                            color: '#6b7280',
                                            fontSize: '15px',
                                            lineHeight: '1.6',
                                            textAlign: 'center',
                                        }}>
                                            Pembayaran Anda untuk paket <strong>{planName}</strong> telah berhasil diproses.
                                        </p>

                                        {/* Success Icon/Badge */}
                                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                            <div style={{
                                                display: 'inline-block',
                                                padding: '20px',
                                                backgroundColor: '#ecfdf5',
                                                borderRadius: '50%',
                                                border: '4px solid #d1fae5',
                                            }}>
                                                <div style={{
                                                    fontSize: '48px',
                                                    lineHeight: '1',
                                                }}>
                                                    👑
                                                </div>
                                            </div>
                                            <p style={{
                                                margin: '16px 0 0',
                                                color: '#059669',
                                                fontWeight: '700',
                                                fontSize: '18px',
                                            }}>
                                                Akses VIP Aktif
                                            </p>
                                        </div>

                                        {/* Transaction Details */}
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
                                                        Detail Transaksi
                                                    </p>

                                                    <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                                                        <tr>
                                                            <td style={{ padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                                                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Jumlah Dibayar</span>
                                                            </td>
                                                            <td align="right" style={{ padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                                                                <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>
                                                                    IDR {amount.toLocaleString('id-ID')}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                                                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Tanggal</span>
                                                            </td>
                                                            <td align="right" style={{ padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                                                                <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>
                                                                    {new Date(transactionDate).toLocaleDateString('id-ID', {
                                                                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ padding: '12px 0' }}>
                                                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Paket</span>
                                                            </td>
                                                            <td align="right" style={{ padding: '12px 0' }}>
                                                                <span style={{
                                                                    color: '#7c3aed',
                                                                    fontSize: '14px',
                                                                    fontWeight: '700',
                                                                    backgroundColor: '#f5f3ff',
                                                                    padding: '4px 8px',
                                                                    borderRadius: '6px',
                                                                }}>
                                                                    {planName}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>

                                        {/* CTA Button - Ajukan Akun */}
                                        <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{ marginBottom: '24px' }}>
                                            <tr>
                                                <td align="center" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                                                    <a href={dashboardUrl} style={{
                                                        display: 'inline-block',
                                                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', // Green gradient
                                                        color: '#ffffff',
                                                        padding: '16px 48px',
                                                        textDecoration: 'none',
                                                        borderRadius: '12px',
                                                        fontWeight: 'bold',
                                                        fontSize: '16px',
                                                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                                                    }}>
                                                        📝 Ajukan Akun Sekarang
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <p style={{
                                                        margin: '16px 0 0',
                                                        color: '#6b7280',
                                                        fontSize: '13px',
                                                    }}>
                                                        Lengkapi profil Anda untuk mulai melamar kerja!
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
                                        {/* Footer Logo */}
                                        <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                                            <tr>
                                                <td align="center" style={{ paddingBottom: '16px' }}>
                                                    <img
                                                        src={LOGO_KECIL_URL}
                                                        alt="JOBMATE Logo"
                                                        width="48"
                                                        height="48"
                                                        style={{
                                                            display: 'block',
                                                            margin: '0 auto',
                                                            borderRadius: '12px',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        </table>

                                        <p style={{
                                            margin: '0 0 8px',
                                            fontWeight: '700',
                                            color: '#111827',
                                            fontSize: '15px',
                                            letterSpacing: '0.5px',
                                        }}>
                                            JOBMATE x Infolokerjombang
                                        </p>
                                        <p style={{
                                            margin: '0 0 16px',
                                            color: '#6b7280',
                                            fontSize: '13px',
                                            fontWeight: '500',
                                        }}>
                                            🎯 Platform Karir Terpercaya
                                        </p>

                                        {/* Contact Info */}
                                        <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                                            <tr>
                                                <td align="center" style={{
                                                    padding: '12px',
                                                    backgroundColor: '#ffffff',
                                                    borderRadius: '8px',
                                                    marginBottom: '12px',
                                                }}>
                                                    <p style={{
                                                        margin: '0 0 4px',
                                                        color: '#6b7280',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                    }}>
                                                        💬 Butuh bantuan?
                                                    </p>
                                                    <a href="mailto:admin@jobmate.web.id" style={{
                                                        color: '#3977d3',
                                                        textDecoration: 'none',
                                                        fontWeight: '600',
                                                        fontSize: '13px',
                                                    }}>
                                                        admin@jobmate.web.id
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>

                                        <p style={{
                                            margin: '16px 0 0',
                                            color: '#9ca3af',
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
export const PaymentSuccessEmailText = ({
    userName,
    amount,
    transactionDate,
    planType,
    dashboardUrl = 'https://jobmate.web.id/dashboard',
}: PaymentSuccessEmailProps) => `
JOBMATE - Pembayaran Berhasil

Selamat ${userName}! 🎉
Pembayaran Anda untuk paket ${planType === 'premium' ? 'VIP Premium' : 'VIP Basic'} telah berhasil diproses.

Detail Transaksi:
- Jumlah: IDR ${amount.toLocaleString('id-ID')}
- Tanggal: ${new Date(transactionDate).toLocaleString('id-ID')}
- Paket: ${planType === 'premium' ? 'VIP Premium' : 'VIP Basic'}
- Status: SUKSES (VIP Aktif)

📝 Ajukan Akun Sekarang: ${dashboardUrl}

Butuh bantuan? admin@jobmate.web.id
© 2025 JOBMATE. All rights reserved.
`;
