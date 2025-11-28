// emails/ResetPasswordEmail.tsx - Reset Password Email with Resend
import React from 'react';

interface ResetPasswordEmailProps {
  userName: string;
  email: string;
  resetUrl: string;
  expiresIn: string;
}

// Logo dari production URL - pastikan file ada di public/Logo/x.png
const LOGO_URL = 'https://jobmate.web.id/Logo/x.png';

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({
  userName,
  email,
  resetUrl,
  expiresIn,
}) => {
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
        <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
          backgroundColor: '#f3f4f6',
          padding: '20px 0',
        }}>
          <tr>
            <td align="center">
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
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)',
                    padding: '40px 30px',
                    textAlign: 'center',
                  }}>
                    {/* Logo Box */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                      <tr>
                        <td align="center" style={{ paddingBottom: '24px' }}>
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
                                  src={LOGO_URL}
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
                    </table>

                    {/* Icon - Shield/Lock visual */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                      <tr>
                        <td align="center" style={{ padding: '16px 0' }}>
                          <table cellPadding="0" cellSpacing="0" border={0}>
                            <tr>
                              <td align="center" style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                borderRadius: '50%',
                                border: '3px solid rgba(255,255,255,0.3)',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                              }}>
                                <span style={{
                                  fontSize: '32px',
                                  lineHeight: '80px',
                                }}>&#128272;</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    {/* Title */}
                    <h1 style={{
                      margin: '0',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      lineHeight: '1.2',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}>
                      Reset Password Anda
                    </h1>

                    <p style={{
                      margin: '12px 0 0',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '15px',
                    }}>
                      Permintaan reset password diterima
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
                      margin: '0 0 24px',
                      color: '#6b7280',
                      fontSize: '16px',
                      lineHeight: '1.6',
                    }}>
                      Kami menerima permintaan untuk mereset password akun JOBMATE Anda.
                      Klik tombol di bawah ini untuk membuat password baru.
                    </p>

                    {/* Warning Box */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#fef3c7',
                      border: '2px solid #fbbf24',
                      borderRadius: '12px',
                      marginBottom: '24px',
                    }}>
                      <tr>
                        <td style={{ padding: '16px 20px' }}>
                          <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                            <tr>
                              <td width="40" valign="top">
                                <span style={{ fontSize: '24px' }}>⏰</span>
                              </td>
                              <td>
                                <p style={{
                                  margin: '0',
                                  color: '#92400e',
                                  fontSize: '14px',
                                  lineHeight: '1.5',
                                }}>
                                  <strong>Link ini akan kedaluwarsa dalam {expiresIn}.</strong><br/>
                                  Jika Anda tidak meminta reset password, abaikan email ini.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    {/* CTA Button */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{ marginBottom: '24px' }}>
                      <tr>
                        <td align="center" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                          <a href={resetUrl} style={{
                            display: 'inline-block',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            color: '#ffffff',
                            padding: '18px 48px',
                            textDecoration: 'none',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            fontSize: '18px',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                          }}>
                            🔑 Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>

                    {/* Alternative Link */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      marginBottom: '24px',
                    }}>
                      <tr>
                        <td style={{ padding: '16px' }}>
                          <p style={{
                            margin: '0 0 8px',
                            color: '#6b7280',
                            fontSize: '13px',
                          }}>
                            Atau copy dan paste link ini di browser Anda:
                          </p>
                          <p style={{
                            margin: '0',
                            color: '#3b82f6',
                            fontSize: '12px',
                            wordBreak: 'break-all',
                            lineHeight: '1.4',
                          }}>
                            {resetUrl}
                          </p>
                        </td>
                      </tr>
                    </table>

                    {/* Account Info */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '12px',
                      marginBottom: '24px',
                    }}>
                      <tr>
                        <td style={{ padding: '20px' }}>
                          <h3 style={{
                            margin: '0 0 12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1e40af',
                          }}>
                            📋 Informasi Akun
                          </h3>
                          <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                            <tr>
                              <td style={{ padding: '4px 0' }}>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Email:</span>
                              </td>
                              <td align="right" style={{ padding: '4px 0' }}>
                                <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>{email}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    {/* Security Tips */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      borderTop: '1px solid #e5e7eb',
                      paddingTop: '24px',
                    }}>
                      <tr>
                        <td>
                          <h3 style={{
                            margin: '24px 0 16px',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#111827',
                          }}>
                            🛡️ Tips Keamanan Password:
                          </h3>
                          <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                            <tr>
                              <td style={{ padding: '8px 0', verticalAlign: 'top' }}>
                                <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Gunakan minimal 8 karakter</span>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: '8px 0', verticalAlign: 'top' }}>
                                <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Kombinasikan huruf besar, kecil, angka, dan simbol</span>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: '8px 0', verticalAlign: 'top' }}>
                                <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Jangan gunakan password yang sama dengan akun lain</span>
                              </td>
                            </tr>
                          </table>
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
                    <img 
                      src={LOGO_URL}
                      alt="JOBMATE Logo"
                      width="120"
                      height="30"
                      style={{
                        display: 'block',
                        margin: '0 auto 16px',
                        opacity: 0.7,
                      }}
                    />
                    
                    <p style={{
                      margin: '0 0 8px',
                      fontWeight: '700',
                      color: '#111827',
                      fontSize: '15px',
                    }}>
                      JOBMATE x Infolokerjombang
                    </p>
                    <p style={{
                      margin: '0 0 16px',
                      color: '#6b7280',
                      fontSize: '13px',
                    }}>
                      🎯 Platform Karir Terpercaya
                    </p>
                    
                    <p style={{
                      margin: '0 0 4px',
                      color: '#9ca3af',
                      fontSize: '13px',
                    }}>
                      💬 Butuh bantuan?{' '}
                      <a href="https://t.me/jobmate_support" style={{
                        color: '#3b82f6',
                        textDecoration: 'none',
                        fontWeight: '600',
                      }}>
                        @jobmate_support
                      </a>
                    </p>
                    
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

export const ResetPasswordEmailText = ({
  userName,
  email,
  resetUrl,
  expiresIn,
}: ResetPasswordEmailProps) => `
JOBMATE - Reset Password 🔐
===========================

Halo ${userName},

Kami menerima permintaan untuk mereset password akun JOBMATE Anda.

⏰ PENTING: Link ini akan kedaluwarsa dalam ${expiresIn}.
Jika Anda tidak meminta reset password, abaikan email ini.

RESET PASSWORD SEKARANG:
${resetUrl}

Informasi Akun:
- Email: ${email}

Tips Keamanan Password:
✓ Gunakan minimal 8 karakter
✓ Kombinasikan huruf besar, kecil, angka, dan simbol
✓ Jangan gunakan password yang sama dengan akun lain

---
Email ini dikirim secara otomatis oleh sistem JOBMATE
Butuh bantuan? Hubungi: @jobmate_support
© 2025 JOBMATE - Platform Karir Terpercaya
`;
