// emails/AccountPendingEmail.tsx - V2 Modern UI with Brand Colors
import React from 'react';

interface AccountPendingEmailProps {
  userName: string;
  email: string;
  submittedAt: string;
}

// Optimized logo dari Imgur (8.83 KB - instant loading!)
const LOGO_URL = 'https://i.imgur.com/frAxpop.png';

export const AccountPendingEmail: React.FC<AccountPendingEmailProps> = ({
  userName,
  email,
  submittedAt,
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
                
                {/* Header with Logo - Brand Colors */}
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

                    {/* Icon */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                      <tr>
                        <td align="center">
                          <div style={{
                            fontSize: '80px',
                            lineHeight: '1',
                            margin: '20px 0',
                          }}>
                            ⏳
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
                      Pengajuan Diterima!<br/>Menunggu Verifikasi
                    </h1>

                    {/* Status Badge */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{ marginTop: '24px' }}>
                      <tr>
                        <td align="center">
                          <div style={{
                            display: 'inline-block',
                            background: 'rgba(254,243,199,1)',
                            padding: '12px 32px',
                            borderRadius: '25px',
                            border: '2px solid rgba(251,191,36,0.5)',
                          }}>
                            <span style={{
                              color: '#92400e',
                              fontSize: '16px',
                              fontWeight: '700',
                              letterSpacing: '0.5px',
                            }}>
                              ⏳ Status: Menunggu Review
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
                      Halo {userName}, 👋
                    </h2>
                    <p style={{
                      margin: '0 0 30px',
                      color: '#6b7280',
                      fontSize: '16px',
                      lineHeight: '1.6',
                    }}>
                      Terima kasih telah mendaftar di <strong style={{ color: '#5547d0' }}>JOBMATE</strong>! 🎉 
                      Kami senang Anda tertarik bergabung dengan platform pencarian kerja terpercaya di Jombang.
                    </p>

                    {/* Submission Info Card */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#fffbeb',
                      border: '2px solid #fde68a',
                      borderRadius: '12px',
                      marginBottom: '30px',
                    }}>
                      <tr>
                        <td style={{ padding: '24px' }}>
                          <h3 style={{
                            margin: '0 0 16px',
                            paddingBottom: '12px',
                            borderBottom: '2px solid #fef3c7',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#92400e',
                          }}>
                            📋 Detail Pengajuan Anda
                          </h3>
                          
                          <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                            <tr>
                              <td style={{ padding: '8px 0' }}>
                                <span style={{ color: '#78350f', fontSize: '14px' }}>Nama</span>
                              </td>
                              <td align="right" style={{ padding: '8px 0' }}>
                                <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>{userName}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: '8px 0', borderTop: '1px solid #fef3c7' }}>
                                <span style={{ color: '#78350f', fontSize: '14px' }}>Email</span>
                              </td>
                              <td align="right" style={{ padding: '8px 0', borderTop: '1px solid #fef3c7' }}>
                                <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>{email}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: '8px 0', borderTop: '1px solid #fef3c7' }}>
                                <span style={{ color: '#78350f', fontSize: '14px' }}>Waktu Pengajuan</span>
                              </td>
                              <td align="right" style={{ padding: '8px 0', borderTop: '1px solid #fef3c7' }}>
                                <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>
                                  {new Date(submittedAt).toLocaleDateString('id-ID', {
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

                    {/* Timeline Section */}
                    <h3 style={{
                      margin: '30px 0 20px',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#111827',
                    }}>
                      📍 Apa yang Terjadi Selanjutnya?
                    </h3>

                    {/* Timeline Item 1 - Completed */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      marginBottom: '16px',
                    }}>
                      <tr>
                        <td style={{ width: '50px', verticalAlign: 'top', paddingTop: '4px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            color: '#ffffff',
                            boxShadow: '0 4px 8px rgba(16, 185, 129, 0.3)',
                          }}>
                            ✓
                          </div>
                        </td>
                        <td style={{
                          paddingLeft: '16px',
                          paddingTop: '4px',
                          verticalAlign: 'top',
                        }}>
                          <strong style={{ 
                            color: '#111827', 
                            fontSize: '15px',
                            display: 'block',
                            marginBottom: '4px'
                          }}>
                            1. Pengajuan Diterima ✅
                          </strong>
                          <span style={{ 
                            color: '#6b7280', 
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}>
                            Selamat! Data Anda sudah kami terima dengan baik dan masuk dalam antrian review.
                          </span>
                        </td>
                      </tr>
                    </table>

                    {/* Timeline Item 2 - In Progress */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      marginBottom: '16px',
                    }}>
                      <tr>
                        <td style={{ width: '50px', verticalAlign: 'top', paddingTop: '4px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            boxShadow: '0 4px 8px rgba(245, 158, 11, 0.3)',
                          }}>
                            ⏳
                          </div>
                        </td>
                        <td style={{
                          paddingLeft: '16px',
                          paddingTop: '4px',
                          verticalAlign: 'top',
                        }}>
                          <strong style={{ 
                            color: '#111827', 
                            fontSize: '15px',
                            display: 'block',
                            marginBottom: '4px'
                          }}>
                            2. Verifikasi Tim Kami 🔍
                          </strong>
                          <span style={{ 
                            color: '#6b7280', 
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}>
                            Admin kami sedang meninjau pengajuan Anda. <strong>Estimasi waktu: 1-2 hari kerja.</strong>
                          </span>
                        </td>
                      </tr>
                    </table>

                    {/* Timeline Item 3 - Pending */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      marginBottom: '30px',
                    }}>
                      <tr>
                        <td style={{ width: '50px', verticalAlign: 'top', paddingTop: '4px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            background: '#e5e7eb',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                          }}>
                            📧
                          </div>
                        </td>
                        <td style={{
                          paddingLeft: '16px',
                          paddingTop: '4px',
                          verticalAlign: 'top',
                        }}>
                          <strong style={{ 
                            color: '#111827', 
                            fontSize: '15px',
                            display: 'block',
                            marginBottom: '4px'
                          }}>
                            3. Notifikasi Persetujuan 🎉
                          </strong>
                          <span style={{ 
                            color: '#6b7280', 
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}>
                            Anda akan menerima email konfirmasi begitu akun Anda disetujui. Stay tuned!
                          </span>
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

                    {/* Help Box */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                      borderRadius: '12px',
                      border: '2px solid #bae6fd',
                      marginTop: '30px',
                      marginBottom: '30px',
                    }}>
                      <tr>
                        <td style={{ padding: '28px', textAlign: 'center' }}>
                          <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
                          <h3 style={{
                            margin: '0 0 12px',
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#0c4a6e',
                          }}>
                            Butuh Bantuan?
                          </h3>
                          <p style={{
                            margin: '0 0 20px',
                            color: '#0369a1',
                            fontSize: '15px',
                            lineHeight: '1.6',
                          }}>
                            Ada pertanyaan? Ingin mempercepat proses?<br/>
                            Tim support kami siap membantu Anda! 
                          </p>
                          <a href="https://t.me/jobmate_support" style={{
                            display: 'inline-block',
                            background: 'linear-gradient(135deg, #5547d0 0%, #3977d3 100%)',
                            color: '#ffffff',
                            padding: '14px 36px',
                            textDecoration: 'none',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontSize: '15px',
                            boxShadow: '0 4px 12px rgba(85, 71, 208, 0.3)',
                          }}>
                            💬 Hubungi Support
                          </a>
                        </td>
                      </tr>
                    </table>

                    {/* Tips Box */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#ecfdf5',
                      border: '2px solid #a7f3d0',
                      borderRadius: '12px',
                      marginBottom: '30px',
                    }}>
                      <tr>
                        <td style={{ padding: '20px' }}>
                          <strong style={{ 
                            color: '#065f46', 
                            fontSize: '15px',
                            display: 'block',
                            marginBottom: '8px'
                          }}>
                            💡 Tips Penting:
                          </strong>
                          <ul style={{
                            margin: '0',
                            paddingLeft: '20px',
                            color: '#047857',
                            fontSize: '14px',
                            lineHeight: '1.7',
                          }}>
                            <li style={{ marginBottom: '6px' }}>
                              Pastikan email <strong>{email}</strong> aktif dan cek folder spam/inbox secara berkala
                            </li>
                            <li style={{ marginBottom: '6px' }}>
                              Simpan email ini sebagai referensi status pengajuan Anda
                            </li>
                            <li>
                              Follow Instagram kami <strong>@infolokerjombang</strong> untuk update lowongan terbaru!
                            </li>
                          </ul>
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
                      <strong style={{ color: '#111827' }}>Terima kasih atas kesabaran Anda!</strong><br/>
                      Kami akan segera meninjau pengajuan Anda. 🚀
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
                      📧 Email ini dikirim otomatis dari sistem JOBMATE
                    </p>
                    <p style={{
                      margin: '0 0 16px',
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
                      margin: '0',
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
export const AccountPendingEmailText = ({
  userName,
  email,
  submittedAt,
}: AccountPendingEmailProps) => `
JOBMATE - Pengajuan Diterima! Menunggu Verifikasi ⏳
=====================================

STATUS: Menunggu Review

Halo ${userName}, 👋

Terima kasih telah mendaftar di JOBMATE! 🎉
Kami senang Anda tertarik bergabung dengan platform pencarian kerja terpercaya di Jombang.

📋 Detail Pengajuan Anda:
- Nama: ${userName}
- Email: ${email}
- Waktu Pengajuan: ${new Date(submittedAt).toLocaleString('id-ID')}

📍 Apa yang Terjadi Selanjutnya?

1. ✅ Pengajuan Diterima
   Selamat! Data Anda sudah kami terima dengan baik dan masuk dalam antrian review.

2. ⏳ Verifikasi Tim Kami
   Admin kami sedang meninjau pengajuan Anda. Estimasi waktu: 1-2 hari kerja.

3. 📧 Notifikasi Persetujuan
   Anda akan menerima email konfirmasi begitu akun Anda disetujui. Stay tuned!

💬 BUTUH BANTUAN?
Ada pertanyaan? Ingin mempercepat proses?
Hubungi support: https://t.me/jobmate_support

💡 TIPS PENTING:
- Pastikan email ${email} aktif dan cek folder spam/inbox
- Simpan email ini sebagai referensi status pengajuan
- Follow Instagram @infolokerjombang untuk update lowongan!

Terima kasih atas kesabaran Anda!
Kami akan segera meninjau pengajuan Anda. 🚀

---
Email ini dikirim otomatis dari sistem JOBMATE
💬 Butuh bantuan? @jobmate_support
© 2025 JOBMATE - Platform Karir Terpercaya
`;
