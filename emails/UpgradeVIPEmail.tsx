// emails/UpgradeVIPEmail.tsx - V2 Table-based Layout with Brand Colors
import React from 'react';

interface UpgradeVIPEmailProps {
  userName: string;
  email: string;
  membershipType: 'vip_basic' | 'vip_premium';
  upgradedAt: string;
  dashboardUrl: string;
}

// Logo dari production URL - pastikan file ada di public/Logo/x.png
const LOGO_URL = 'https://jobmate.web.id/Logo/x.png';

export const UpgradeVIPEmail: React.FC<UpgradeVIPEmailProps> = ({
  userName,
  email,
  membershipType,
  upgradedAt,
  dashboardUrl,
}) => {
  const isPremium = membershipType === 'vip_premium';
  const membershipName = isPremium ? 'VIP Premium' : 'VIP Basic';
  
  // Color palette from colorpallate.md
  const colors = {
    purpleHeart: '#5547d0',
    mariner: '#3977d3',
    pacificBlue: '#00acc7',
    robinsEggBlue: '#00d1dc',
    heliotrope: '#8e68fd',
    // Premium colors
    premiumGold: '#f59e0b',
    premiumGoldDark: '#d97706',
  };
  
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
                    background: isPremium 
                      ? `linear-gradient(135deg, ${colors.premiumGold} 0%, ${colors.premiumGoldDark} 100%)`
                      : `linear-gradient(135deg, ${colors.purpleHeart} 0%, ${colors.mariner} 50%, ${colors.pacificBlue} 100%)`,
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
                            {isPremium ? '👑' : '⭐'}
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
                      Selamat!<br/>Upgrade ke {membershipName}
                    </h1>

                    {/* Status Badge */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{ marginTop: '24px' }}>
                      <tr>
                        <td align="center">
                          <div style={{
                            display: 'inline-block',
                            background: isPremium 
                              ? 'rgba(254,243,199,1)' 
                              : 'rgba(255,255,255,0.2)',
                            padding: '12px 32px',
                            borderRadius: '25px',
                            border: isPremium 
                              ? '2px solid rgba(251,191,36,0.5)'
                              : '2px solid rgba(255,255,255,0.3)',
                          }}>
                            <span style={{
                              color: isPremium ? '#92400e' : '#ffffff',
                              fontSize: '16px',
                              fontWeight: '700',
                              letterSpacing: '0.5px',
                            }}>
                              {isPremium ? '👑' : '⭐'} Status: {membershipName}
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
                      Halo {userName}, {isPremium ? '👑' : '⭐'}
                    </h2>
                    <p style={{
                      margin: '0 0 30px',
                      color: '#6b7280',
                      fontSize: '16px',
                      lineHeight: '1.6',
                    }}>
                      <strong style={{ color: colors.mariner }}>Luar biasa!</strong> ✨ Akun Anda telah berhasil di-upgrade ke{' '}
                      <strong style={{ color: isPremium ? colors.premiumGold : colors.purpleHeart }}>{membershipName}</strong>.{' '}
                      Sekarang Anda memiliki akses penuh ke fitur-fitur premium yang akan mempercepat pencarian kerja Anda!
                    </p>

                    {/* Membership Info Card */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: isPremium ? '#fef3c7' : '#f0f9ff',
                      border: isPremium ? '2px solid #fde68a' : '2px solid #bfdbfe',
                      borderRadius: '12px',
                      marginBottom: '30px',
                    }}>
                      <tr>
                        <td style={{ padding: '24px' }}>
                          <h3 style={{
                            margin: '0 0 16px',
                            paddingBottom: '12px',
                            borderBottom: isPremium ? '2px solid #fef3c7' : '2px solid #dbeafe',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: isPremium ? '#92400e' : '#1e40af',
                          }}>
                            📋 Detail Membership
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
                              <td style={{ padding: '8px 0', borderTop: isPremium ? '1px solid #fef3c7' : '1px solid #dbeafe' }}>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Email</span>
                              </td>
                              <td align="right" style={{ padding: '8px 0', borderTop: isPremium ? '1px solid #fef3c7' : '1px solid #dbeafe' }}>
                                <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>{email}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: '8px 0', borderTop: isPremium ? '1px solid #fef3c7' : '1px solid #dbeafe' }}>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Status</span>
                              </td>
                              <td align="right" style={{ padding: '8px 0', borderTop: isPremium ? '1px solid #fef3c7' : '1px solid #dbeafe' }}>
                                <span style={{ color: isPremium ? colors.premiumGold : colors.purpleHeart, fontSize: '14px', fontWeight: '700' }}>
                                  {membershipName} {isPremium ? '👑' : '⭐'}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: '8px 0', borderTop: isPremium ? '1px solid #fef3c7' : '1px solid #dbeafe' }}>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Di-upgrade pada</span>
                              </td>
                              <td align="right" style={{ padding: '8px 0', borderTop: isPremium ? '1px solid #fef3c7' : '1px solid #dbeafe' }}>
                                <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>
                                  {new Date(upgradedAt).toLocaleDateString('id-ID', {
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
                          <a href={dashboardUrl} style={{
                            display: 'inline-block',
                            background: isPremium
                              ? `linear-gradient(135deg, ${colors.premiumGold} 0%, ${colors.premiumGoldDark} 100%)`
                              : `linear-gradient(135deg, ${colors.purpleHeart} 0%, ${colors.mariner} 100%)`,
                            color: '#ffffff',
                            padding: '18px 48px',
                            textDecoration: 'none',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            fontSize: '18px',
                            boxShadow: isPremium
                              ? '0 4px 12px rgba(245, 158, 11, 0.4)'
                              : '0 4px 12px rgba(85, 71, 208, 0.4)',
                          }}>
                            🚀 Mulai Gunakan Fitur {membershipName}
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
                            Klik tombol di atas untuk akses dashboard Anda
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

                    {/* Benefits Section */}
                    <h3 style={{
                      margin: '30px 0 20px',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#111827',
                    }}>
                      🎁 Benefit {membershipName} Anda:
                    </h3>

                    {/* Benefit 1 */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '10px',
                      borderLeft: isPremium ? '4px solid #f59e0b' : `4px solid ${colors.purpleHeart}`,
                      marginBottom: '12px',
                    }}>
                      <tr>
                        <td style={{ padding: '16px', width: '50px' }}>
                          <span style={{ fontSize: '28px' }}>💼</span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <strong style={{ color: '#111827', fontSize: '15px', display: 'block', marginBottom: '4px' }}>
                            Akses Penuh Lowongan VIP
                          </strong>
                          <span style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                            Lihat semua lowongan kerja eksklusif tanpa batas
                          </span>
                        </td>
                      </tr>
                    </table>

                    {/* Benefit 2 */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '10px',
                      borderLeft: isPremium ? '4px solid #f59e0b' : `4px solid ${colors.mariner}`,
                      marginBottom: '12px',
                    }}>
                      <tr>
                        <td style={{ padding: '16px', width: '50px' }}>
                          <span style={{ fontSize: '28px' }}>🔖</span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <strong style={{ color: '#111827', fontSize: '15px', display: 'block', marginBottom: '4px' }}>
                            Unlimited Bookmark
                          </strong>
                          <span style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                            Simpan sebanyak mungkin lowongan favorit
                          </span>
                        </td>
                      </tr>
                    </table>

                    {/* Benefit 3 */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '10px',
                      borderLeft: isPremium ? '4px solid #f59e0b' : `4px solid ${colors.pacificBlue}`,
                      marginBottom: '12px',
                    }}>
                      <tr>
                        <td style={{ padding: '16px', width: '50px' }}>
                          <span style={{ fontSize: '28px' }}>🏢</span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <strong style={{ color: '#111827', fontSize: '15px', display: 'block', marginBottom: '4px' }}>
                            Database Perusahaan Lengkap
                          </strong>
                          <span style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                            Info detail perusahaan & budaya kerja
                          </span>
                        </td>
                      </tr>
                    </table>

                    {/* Benefit 4 */}
                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '10px',
                      borderLeft: isPremium ? '4px solid #f59e0b' : `4px solid ${colors.robinsEggBlue}`,
                      marginBottom: '30px',
                    }}>
                      <tr>
                        <td style={{ padding: '16px', width: '50px' }}>
                          <span style={{ fontSize: '28px' }}>🔔</span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <strong style={{ color: '#111827', fontSize: '15px', display: 'block', marginBottom: '4px' }}>
                            Priority Notifications
                          </strong>
                          <span style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                            Dapatkan alert lowongan baru paling cepat
                          </span>
                        </td>
                      </tr>
                    </table>

                    {/* Premium Bonus Features */}
                    {isPremium && (
                      <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                        borderRadius: '12px',
                        border: '2px dashed #f59e0b',
                        marginBottom: '30px',
                      }}>
                        <tr>
                          <td style={{ padding: '24px' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: '#92400e', fontSize: '16px', fontWeight: '700' }}>
                              ⚡ BONUS FITUR PREMIUM:
                            </h4>
                            
                            {/* Premium Feature 1 */}
                            <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                              backgroundColor: '#ffffff',
                              borderRadius: '8px',
                              marginBottom: '10px',
                            }}>
                              <tr>
                                <td style={{ padding: '14px', width: '45px' }}>
                                  <span style={{ fontSize: '24px' }}>📝</span>
                                </td>
                                <td style={{ padding: '14px' }}>
                                  <strong style={{ color: '#111827', fontSize: '14px', display: 'block', marginBottom: '3px' }}>
                                    Surat Lamaran AI
                                  </strong>
                                  <span style={{ color: '#6b7280', fontSize: '13px' }}>
                                    Generate surat lamaran profesional dengan AI
                                  </span>
                                </td>
                              </tr>
                            </table>

                            {/* Premium Feature 2 */}
                            <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                              backgroundColor: '#ffffff',
                              borderRadius: '8px',
                              marginBottom: '10px',
                            }}>
                              <tr>
                                <td style={{ padding: '14px', width: '45px' }}>
                                  <span style={{ fontSize: '24px' }}>🎨</span>
                                </td>
                                <td style={{ padding: '14px' }}>
                                  <strong style={{ color: '#111827', fontSize: '14px', display: 'block', marginBottom: '3px' }}>
                                    CV ATS Optimizer
                                  </strong>
                                  <span style={{ color: '#6b7280', fontSize: '13px' }}>
                                    Buat CV yang lolos sistem ATS perusahaan
                                  </span>
                                </td>
                              </tr>
                            </table>

                            {/* Premium Feature 3 */}
                            <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                              backgroundColor: '#ffffff',
                              borderRadius: '8px',
                              marginBottom: '10px',
                            }}>
                              <tr>
                                <td style={{ padding: '14px', width: '45px' }}>
                                  <span style={{ fontSize: '24px' }}>📧</span>
                                </td>
                                <td style={{ padding: '14px' }}>
                                  <strong style={{ color: '#111827', fontSize: '14px', display: 'block', marginBottom: '3px' }}>
                                    Email Generator
                                  </strong>
                                  <span style={{ color: '#6b7280', fontSize: '13px' }}>
                                    Template email follow-up & networking
                                  </span>
                                </td>
                              </tr>
                            </table>

                            {/* Premium Feature 4 */}
                            <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                              backgroundColor: '#ffffff',
                              borderRadius: '8px',
                              marginBottom: '10px',
                            }}>
                              <tr>
                                <td style={{ padding: '14px', width: '45px' }}>
                                  <span style={{ fontSize: '24px' }}>📊</span>
                                </td>
                                <td style={{ padding: '14px' }}>
                                  <strong style={{ color: '#111827', fontSize: '14px', display: 'block', marginBottom: '3px' }}>
                                    Job Tracker
                                  </strong>
                                  <span style={{ color: '#6b7280', fontSize: '13px' }}>
                                    Kelola semua lamaran Anda dalam satu dashboard
                                  </span>
                                </td>
                              </tr>
                            </table>

                            {/* Premium Feature 5 */}
                            <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                              backgroundColor: '#ffffff',
                              borderRadius: '8px',
                              marginBottom: '10px',
                            }}>
                              <tr>
                                <td style={{ padding: '14px', width: '45px' }}>
                                  <span style={{ fontSize: '24px' }}>📄</span>
                                </td>
                                <td style={{ padding: '14px' }}>
                                  <strong style={{ color: '#111827', fontSize: '14px', display: 'block', marginBottom: '3px' }}>
                                    PDF Tools Premium
                                  </strong>
                                  <span style={{ color: '#6b7280', fontSize: '13px' }}>
                                    Merge, split, dan edit PDF untuk berkas lamaran
                                  </span>
                                </td>
                              </tr>
                            </table>

                            {/* Premium Feature 6 */}
                            <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                              backgroundColor: '#ffffff',
                              borderRadius: '8px',
                            }}>
                              <tr>
                                <td style={{ padding: '14px', width: '45px' }}>
                                  <span style={{ fontSize: '24px' }}>💬</span>
                                </td>
                                <td style={{ padding: '14px' }}>
                                  <strong style={{ color: '#111827', fontSize: '14px', display: 'block', marginBottom: '3px' }}>
                                    WA Message Generator
                                  </strong>
                                  <span style={{ color: '#6b7280', fontSize: '13px' }}>
                                    Template pesan WhatsApp profesional
                                  </span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    )}

                    {/* Basic User Upgrade CTA */}
                    {!isPremium && (
                      <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                        borderRadius: '12px',
                        border: '2px dashed #f59e0b',
                        marginBottom: '30px',
                      }}>
                        <tr>
                          <td style={{ padding: '24px', textAlign: 'center' }}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#92400e', fontSize: '18px', fontWeight: '700' }}>
                              👑 Mau Upgrade ke Premium?
                            </h3>
                            <p style={{ margin: '0 0 16px', color: '#78350f', fontSize: '15px', lineHeight: '1.6' }}>
                              Dapatkan akses ke <strong>6 Tools JOBMATE</strong> untuk maksimalkan peluang diterima kerja!
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
                    )}

                    {/* Closing */}
                    <p style={{
                      margin: '0',
                      color: '#6b7280',
                      fontSize: '15px',
                      lineHeight: '1.6',
                      textAlign: 'center',
                    }}>
                      <strong style={{ color: '#111827' }}>Selamat menikmati fitur {membershipName}!</strong><br/>
                      Semoga segera mendapatkan pekerjaan impian Anda. 🎯💼
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
                        color: colors.purpleHeart,
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
export const UpgradeVIPEmailText = ({
  userName,
  email,
  membershipType,
  upgradedAt,
  dashboardUrl,
}: UpgradeVIPEmailProps) => {
  const isPremium = membershipType === 'vip_premium';
  const membershipName = isPremium ? 'VIP Premium 👑' : 'VIP Basic ⭐';

  return `
JOBMATE - Selamat Upgrade ke ${membershipName}!
=====================================

${isPremium ? '👑' : '⭐'} STATUS: ${membershipName.toUpperCase()}

Halo ${userName},

Luar biasa! ✨ Akun Anda telah berhasil di-upgrade ke ${membershipName}.
Sekarang Anda memiliki akses penuh ke fitur-fitur premium!

Detail Membership:
- Nama: ${userName}
- Email: ${email}
- Status: ${membershipName}
- Di-upgrade pada: ${new Date(upgradedAt).toLocaleString('id-ID')}

MULAI GUNAKAN FITUR:
${dashboardUrl}

Benefit ${membershipName} Anda:
💼 Akses Penuh Lowongan VIP - Lihat semua lowongan eksklusif
🔖 Unlimited Bookmark - Simpan lowongan favorit tanpa batas
🏢 Database Perusahaan Lengkap - Info detail perusahaan
🔔 Priority Notifications - Alert lowongan baru paling cepat

${isPremium ? `
⚡ BONUS FITUR PREMIUM:
📝 Surat Lamaran AI - Generate surat lamaran profesional
🎨 CV ATS Optimizer - Buat CV yang lolos ATS
📧 Email Generator - Template email follow-up
📊 Job Tracker - Kelola semua lamaran Anda
📄 PDF Tools Premium - Edit PDF untuk berkas lamaran
💬 WA Message Generator - Template WhatsApp profesional
` : `
👑 MAU UPGRADE KE PREMIUM?
Dapatkan akses ke 6 Tools JOBMATE untuk maksimalkan peluang diterima!
Info: https://t.me/jobmate_support
`}

Selamat menikmati fitur ${membershipName}!
Semoga segera mendapatkan pekerjaan impian Anda. 🎯💼

---
Email ini dikirim secara otomatis oleh sistem JOBMATE
Butuh bantuan? Hubungi: @jobmate_support
© 2025 JOBMATE - Platform Pencarian Kerja Terpercaya
`;
};
