// emails/AccountApprovedEmail.tsx - V2 Modern UI with Table Layout
import React from 'react';

interface AccountApprovedEmailProps {
  userName: string;
  email: string;
  approvedAt: string;
  loginUrl: string;
}

// Logo dari production URL - pastikan file ada di public/Logo/x.png
const LOGO_URL = 'https://jobmate.web.id/Logo/x.png';

export const AccountApprovedEmail: React.FC<AccountApprovedEmailProps> = ({
  userName,
  email,
  approvedAt,
  loginUrl,
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
                
                {/* Header with Logo */}
                <tr>
                  <td style={{
                    background: 'linear-gradient(135deg, #5547d0 0%, #3977d3 50%, #00acc7 100%)',
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

                    {/* Success Icon */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                      <tr>
                        <td align="center">
                          <div style={{
                            fontSize: '80px',
                            lineHeight: '1',
                            margin: '20px 0',
                          }}>
                            🎉
                          </div>
                        </td>
                      </tr>
                    </table>

                    {/* Title */}
                    <h1 style={{
                      margin: '0',
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      lineHeight: '1.2',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}>
                      Selamat!<br/>Akun Anda Disetujui
                    </h1>

                    {/* Status Badge */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{ marginTop: '24px' }}>
                      <tr>
                        <td align="center">
                          <div style={{
                            display: 'inline-block',
                            background: 'rgba(255,255,255,0.2)',
                            padding: '12px 32px',
                            borderRadius: '25px',
                            border: '2px solid rgba(255,255,255,0.3)',
                          }}>
                            <span style={{
                              color: '#ffffff',
                              fontSize: '16px',
                              fontWeight: '700',
                              letterSpacing: '0.5px',
                            }}>
                              ✅ Akun Telah Aktif
                            </span>
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
                    }}>
                      Halo {userName},
                    </h2>
                    <p style={{
                      margin: '0 0 30px',
                      color: '#6b7280',
                      fontSize: '16px',
                      lineHeight: '1.6',
                    }}>
                      Kabar gembira! 🎊 Pengajuan akun Anda telah <strong style={{ color: '#3977d3' }}>disetujui</strong> oleh tim kami. 
                      Sekarang Anda dapat mengakses semua fitur JOBMATE untuk mendukung pencarian kerja Anda.
                    </p>

                    {/* Account Info Card */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#f0f9ff',
                      border: '2px solid #bfdbfe',
                      borderRadius: '12px',
                      marginBottom: '30px',
                    }}>
                      <tr>
                        <td style={{ padding: '24px' }}>
                          <h3 style={{
                            margin: '0 0 16px',
                            paddingBottom: '12px',
                            borderBottom: '2px solid #dbeafe',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1e40af',
                          }}>
                            📋 Informasi Akun
                          </h3>
                          
                          <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                            <tr>
                              <td style={{ padding: '8px 0' }}>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Nama</span>
                              </td>
                              <td align="right" style={{ padding: '8px 0' }}>
                                <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>{userName}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: '8px 0', borderTop: '1px solid #dbeafe' }}>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Email</span>
                              </td>
                              <td align="right" style={{ padding: '8px 0', borderTop: '1px solid #dbeafe' }}>
                                <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>{email}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: '8px 0', borderTop: '1px solid #dbeafe' }}>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Status</span>
                              </td>
                              <td align="right" style={{ padding: '8px 0', borderTop: '1px solid #dbeafe' }}>
                                <span style={{ color: '#3977d3', fontSize: '14px', fontWeight: '700' }}>Aktif ✓</span>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: '8px 0', borderTop: '1px solid #dbeafe' }}>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Disetujui pada</span>
                              </td>
                              <td align="right" style={{ padding: '8px 0', borderTop: '1px solid #dbeafe' }}>
                                <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>
                                  {new Date(approvedAt).toLocaleDateString('id-ID', {
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

                    {/* CTA Button */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{ marginBottom: '30px' }}>
                      <tr>
                        <td align="center" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                          <a href={loginUrl} style={{
                            display: 'inline-block',
                            background: 'linear-gradient(135deg, #5547d0 0%, #3977d3 100%)',
                            color: '#ffffff',
                            padding: '18px 48px',
                            textDecoration: 'none',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            fontSize: '18px',
                            boxShadow: '0 4px 12px rgba(85, 71, 208, 0.4)',
                          }}>
                            🚀 Login Sekarang
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <p style={{
                            margin: '12px 0 0',
                            color: '#9ca3af',
                            fontSize: '14px',
                          }}>
                            Klik tombol di atas untuk mulai menggunakan JOBMATE
                          </p>
                        </td>
                      </tr>
                    </table>

                    {/* Divider */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                      <tr>
                        <td style={{
                          height: '1px',
                          backgroundColor: '#e5e7eb',
                          margin: '30px 0',
                        }} />
                      </tr>
                    </table>

                    {/* Features Section */}
                    <h3 style={{
                      margin: '30px 0 20px',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#111827',
                    }}>
                      🎁 Fitur yang Bisa Anda Akses:
                    </h3>

                    {/* Feature 1 */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '10px',
                      borderLeft: '4px solid #5547d0',
                      marginBottom: '12px',
                    }}>
                      <tr>
                        <td style={{ padding: '16px', width: '50px' }}>
                          <span style={{ fontSize: '28px' }}>💼</span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <strong style={{ color: '#111827', fontSize: '15px', display: 'block', marginBottom: '4px' }}>
                            Lowongan Kerja VIP
                          </strong>
                          <span style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                            Akses ribuan lowongan kerja terbaru di Jombang
                          </span>
                        </td>
                      </tr>
                    </table>

                    {/* Feature 2 */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '10px',
                      borderLeft: '4px solid #3977d3',
                      marginBottom: '12px',
                    }}>
                      <tr>
                        <td style={{ padding: '16px', width: '50px' }}>
                          <span style={{ fontSize: '28px' }}>🔖</span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <strong style={{ color: '#111827', fontSize: '15px', display: 'block', marginBottom: '4px' }}>
                            Simpan Loker Favorit
                          </strong>
                          <span style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                            Bookmark lowongan menarik untuk dilamar nanti
                          </span>
                        </td>
                      </tr>
                    </table>

                    {/* Feature 3 */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '10px',
                      borderLeft: '4px solid #00acc7',
                      marginBottom: '12px',
                    }}>
                      <tr>
                        <td style={{ padding: '16px', width: '50px' }}>
                          <span style={{ fontSize: '28px' }}>🏢</span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <strong style={{ color: '#111827', fontSize: '15px', display: 'block', marginBottom: '4px' }}>
                            Database Perusahaan
                          </strong>
                          <span style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                            Cari info lengkap tentang perusahaan di Jombang
                          </span>
                        </td>
                      </tr>
                    </table>

                    {/* Feature 4 */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '10px',
                      borderLeft: '4px solid #00d1dc',
                      marginBottom: '30px',
                    }}>
                      <tr>
                        <td style={{ padding: '16px', width: '50px' }}>
                          <span style={{ fontSize: '28px' }}>🔔</span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <strong style={{ color: '#111827', fontSize: '15px', display: 'block', marginBottom: '4px' }}>
                            Notifikasi Real-time
                          </strong>
                          <span style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                            Dapatkan update lowongan kerja terbaru
                          </span>
                        </td>
                      </tr>
                    </table>

                    {/* Upgrade Premium Box */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: '12px',
                      border: '2px dashed #f59e0b',
                      marginBottom: '30px',
                    }}>
                      <tr>
                        <td style={{ padding: '24px', textAlign: 'center' }}>
                          <h4 style={{
                            margin: '0 0 12px',
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#92400e',
                          }}>
                            ⭐ Upgrade ke Premium?
                          </h4>
                          <p style={{
                            margin: '0 0 16px',
                            color: '#78350f',
                            fontSize: '15px',
                            lineHeight: '1.6',
                          }}>
                            Dapatkan akses ke <strong>Tools JOBMATE</strong> untuk membuat CV ATS, Surat Lamaran AI, dan banyak lagi!
                          </p>
                          <a href="https://t.me/jobmate_support" style={{
                            display: 'inline-block',
                            background: '#f59e0b',
                            color: '#ffffff',
                            padding: '12px 32px',
                            textDecoration: 'none',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontSize: '15px',
                            boxShadow: '0 4px 8px rgba(245, 158, 11, 0.3)',
                          }}>
                            💎 Info Upgrade Premium
                          </a>
                        </td>
                      </tr>
                    </table>

                    {/* Closing */}
                    <p style={{
                      margin: '0',
                      color: '#6b7280',
                      fontSize: '15px',
                      lineHeight: '1.6',
                      textAlign: 'center',
                    }}>
                      <strong style={{ color: '#111827' }}>Selamat bergabung di JOBMATE!</strong><br/>
                      Kami siap membantu Anda menemukan pekerjaan impian. 💪
                    </p>
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
                            src={LOGO_URL}
                            alt="JOBMATE Logo"
                            width="120"
                            height="30"
                            style={{
                              display: 'block',
                              margin: '0 auto',
                              opacity: 0.7,
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
                    
                    {/* Contact Links */}
                    <p style={{
                      margin: '0 0 4px',
                      color: '#9ca3af',
                      fontSize: '13px',
                    }}>
                      💬 Butuh bantuan? Hubungi:{' '}
                      <a href="https://t.me/jobmate_support" style={{
                        color: '#5547d0',
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

// Plain text version
export const AccountApprovedEmailText = ({
  userName,
  email,
  approvedAt,
  loginUrl,
}: AccountApprovedEmailProps) => `
JOBMATE - Selamat! Akun Anda Disetujui 🎉
=====================================

STATUS: Akun Telah Aktif ✅

Halo ${userName},

Kabar gembira! Pengajuan akun Anda telah DISETUJUI oleh tim kami.
Sekarang Anda dapat mengakses semua fitur JOBMATE.

Informasi Akun:
- Nama: ${userName}
- Email: ${email}
- Status: Aktif ✓
- Disetujui pada: ${new Date(approvedAt).toLocaleString('id-ID')}

LOGIN SEKARANG:
${loginUrl}

Fitur yang Bisa Anda Akses:
💼 Lowongan Kerja VIP - Akses ribuan lowongan kerja terbaru
🔖 Simpan Loker Favorit - Bookmark lowongan menarik
🏢 Database Perusahaan - Info lengkap perusahaan di Jombang
🔔 Notifikasi Real-time - Update lowongan terbaru

⭐ UPGRADE KE PREMIUM?
Dapatkan akses ke Tools JOBMATE: CV ATS, Surat Lamaran AI, dll
Info: https://t.me/jobmate_support

Selamat bergabung di JOBMATE!
Kami siap membantu Anda menemukan pekerjaan impian. 💪

---
Email ini dikirim secara otomatis oleh sistem JOBMATE
Butuh bantuan? Hubungi: @jobmate_support
© 2025 JOBMATE - Platform Karir Terpercaya
`;
