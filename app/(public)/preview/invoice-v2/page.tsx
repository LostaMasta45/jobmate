'use client';

import React, { useState, useEffect } from 'react';

export default function InvoicePreviewV2() {
  const userName = 'Test User';
  const invoiceUrl = 'https://invoice.xendit.co/test-invoice-123456';
  const amount = 50000;
  const currency = 'Rp';
  const description = 'VIP Basic - 1 Bulan';
  
  const [invoiceId, setInvoiceId] = useState('INV-123456789');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [hoursRemaining, setHoursRemaining] = useState(24);
  const [isUrgent, setIsUrgent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 1);
    const now = new Date();
    const hours = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    setInvoiceId(`INV-${Date.now().toString().slice(-9)}`);
    setExpiryDate(expiry);
    setHoursRemaining(hours);
    setIsUrgent(hours < 6);
    setMounted(true);
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);
  
  // Color palette from colorpallate.md
  const colors = {
    primary: {
      heliotrope: '#8e68fd',
      purpleHeart: '#5547d0',
      mariner: '#3977d3',
      pacificBlue: '#00acc7',
      robinsEggBlue: '#00d1dc',
      cyan: '#00bed1',
    },
    light: {
      bg: '#ffffff',
      bgSecondary: '#f9fafb',
      bgTertiary: '#f3f4f6',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      borderLight: '#f3f4f6',
    },
    dark: {
      bg: '#0f172a',
      bgSecondary: '#1e293b',
      bgTertiary: '#334155',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      border: '#475569',
      borderLight: '#64748b',
    }
  };
  
  const theme = darkMode ? colors.dark : colors.light;

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      backgroundColor: theme.bgSecondary,
      minHeight: '100vh',
      padding: '20px',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Dark Mode Toggle */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: theme.bg,
        padding: '16px 20px',
        borderRadius: '16px',
        boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: 700,
            color: theme.text,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '24px' }}>📧</span>
            Invoice Email Preview
          </h1>
          <p style={{ 
            margin: '4px 0 0', 
            fontSize: '13px', 
            color: theme.textSecondary 
          }}>
            Preview tanpa kirim email • Hemat limit Resend
          </p>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            background: darkMode ? '#334155' : '#f3f4f6',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            color: theme.text,
            fontWeight: 600,
            fontSize: '13px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>

      {/* Email Container */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: theme.bg,
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.4)' : '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}>
        {/* Header dengan gradient dan logo */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.primary.purpleHeart} 0%, ${colors.primary.mariner} 50%, ${colors.primary.pacificBlue} 100%)`,
          padding: '48px 32px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(40px)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            left: '-50px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(40px)'
          }} />
          
          {/* Logo */}
          <div style={{
            position: 'relative',
            zIndex: 1
          }}>
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 48 48" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginBottom: '12px' }}
            >
              <rect width="48" height="48" rx="12" fill="white" fillOpacity="0.2"/>
              <path d="M24 12L32 18V30L24 36L16 30V18L24 12Z" fill="white"/>
              <path d="M24 18L28 21V27L24 30L20 27V21L24 18Z" fill={colors.primary.purpleHeart}/>
              <circle cx="24" cy="24" r="3" fill={colors.primary.robinsEggBlue}/>
            </svg>
            <div style={{
              fontSize: '32px',
              fontWeight: 800,
              color: 'white',
              marginBottom: '8px',
              letterSpacing: '1px',
              textShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              JOBMATE
            </div>
            <div style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.95)',
              fontWeight: 500
            }}>
              Invoice Pembayaran
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '40px 32px' }}>
          {/* Greeting */}
          <div style={{
            fontSize: '20px',
            fontWeight: 700,
            marginBottom: '8px',
            color: theme.text
          }}>
            Halo {userName} 👋
          </div>

          <div style={{
            color: theme.textSecondary,
            marginBottom: '32px',
            fontSize: '15px',
            lineHeight: 1.6
          }}>
            Terima kasih telah memilih layanan kami. Berikut adalah detail invoice pembayaran Anda.
          </div>

          {/* Invoice Card */}
          <div style={{
            background: darkMode ? theme.bgSecondary : 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
            border: `2px solid ${theme.border}`,
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              fontSize: '12px',
              color: theme.textSecondary,
              fontWeight: 700,
              marginBottom: '16px',
              paddingBottom: '16px',
              borderBottom: `2px solid ${theme.borderLight}`,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Invoice #{invoiceId}
            </div>

            {[
              { label: 'Deskripsi', value: description },
              { label: 'Status', value: '⏳ Menunggu Pembayaran', color: '#f59e0b' },
              { 
                label: 'Berlaku Hingga', 
                value: mounted ? expiryDate.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Memuat...'
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: idx < 2 ? `1px solid ${theme.borderLight}` : 'none'
              }}>
                <span style={{ 
                  color: theme.textSecondary, 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  {item.label}
                </span>
                <span style={{ 
                  color: item.color || theme.text, 
                  fontWeight: 600, 
                  fontSize: '14px',
                  textAlign: 'right'
                }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Amount Box */}
          <div style={{
            background: `linear-gradient(135deg, ${colors.primary.purpleHeart} 0%, ${colors.primary.mariner} 100%)`,
            borderRadius: '20px',
            padding: '32px',
            textAlign: 'center',
            margin: '24px 0',
            boxShadow: darkMode 
              ? `0 8px 32px ${colors.primary.purpleHeart}40`
              : `0 8px 32px ${colors.primary.purpleHeart}30`,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              filter: 'blur(30px)'
            }} />
            <div style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '13px',
              fontWeight: 700,
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              Total Pembayaran
            </div>
            <div style={{
              color: 'white',
              fontSize: '48px',
              fontWeight: 800,
              letterSpacing: '-2px',
              textShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              {currency} {amount.toLocaleString('id-ID')}
            </div>
          </div>

          {/* Countdown */}
          <div style={{
            background: isUrgent 
              ? (darkMode ? '#7f1d1d' : '#fef2f2') 
              : (darkMode ? '#1e3a8a' : '#eff6ff'),
            border: `2px solid ${isUrgent 
              ? (darkMode ? '#991b1b' : '#fecaca') 
              : (darkMode ? '#1e40af' : '#bfdbfe')}`,
            borderRadius: '16px',
            padding: '20px',
            margin: '24px 0'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{
                color: isUrgent 
                  ? (darkMode ? '#fca5a5' : '#991b1b')
                  : (darkMode ? '#93c5fd' : '#1e40af'),
                fontSize: '14px',
                fontWeight: 700
              }}>
                {isUrgent ? '⚠️ Segera Bayar!' : '⏰ Waktu Tersisa'}
              </span>
              <span style={{
                color: isUrgent 
                  ? (darkMode ? '#fee2e2' : '#dc2626')
                  : (darkMode ? '#dbeafe' : '#2563eb'),
                fontSize: '16px',
                fontWeight: 800
              }}>
                {hoursRemaining > 0 ? `${hoursRemaining} jam` : 'Segera berakhir!'}
              </span>
            </div>
            <div style={{
              background: isUrgent 
                ? (darkMode ? '#450a0a' : '#fee2e2')
                : (darkMode ? '#1e3a8a' : '#dbeafe'),
              height: '10px',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: isUrgent 
                  ? `linear-gradient(90deg, #dc2626 0%, #ef4444 100%)`
                  : `linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)`,
                height: '100%',
                width: `${Math.max(10, Math.min(100, (hoursRemaining / 24) * 100))}%`,
                transition: 'width 0.3s ease',
                borderRadius: '6px'
              }} />
            </div>
          </div>

          {/* CTA Button */}
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <a
              href={invoiceUrl}
              style={{
                display: 'inline-block',
                background: `linear-gradient(135deg, ${colors.primary.purpleHeart} 0%, ${colors.primary.mariner} 100%)`,
                color: 'white',
                padding: '18px 48px',
                textDecoration: 'none',
                borderRadius: '16px',
                fontWeight: 700,
                fontSize: '16px',
                boxShadow: darkMode 
                  ? `0 8px 32px ${colors.primary.purpleHeart}40`
                  : `0 8px 32px ${colors.primary.purpleHeart}30`,
                transition: 'all 0.2s ease'
              }}
            >
              💳 Bayar Sekarang
            </a>
            <div style={{ marginTop: '16px' }}>
              <a
                href={invoiceUrl}
                style={{
                  color: theme.textSecondary,
                  fontSize: '14px',
                  textDecoration: 'none',
                  fontWeight: 500
                }}
              >
                Lihat Detail Invoice →
              </a>
            </div>
          </div>

          {/* Payment Methods */}
          <div style={{
            background: darkMode ? theme.bgSecondary : theme.bgTertiary,
            borderRadius: '16px',
            padding: '24px',
            margin: '24px 0'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 700,
              color: theme.text,
              marginBottom: '16px'
            }}>
              Metode Pembayaran Tersedia
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px'
            }}>
              {['🏦 Bank', '💳 Kartu', '📱 E-Wallet', '🏪 Alfamart', '🏬 Indomaret'].map((method, idx) => (
                <div key={idx} style={{
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: theme.text,
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}>
                  {method}
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badge */}
          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: darkMode ? '#064e3b' : '#ecfdf5',
            border: `1px solid ${darkMode ? '#059669' : '#a7f3d0'}`,
            borderRadius: '12px',
            margin: '24px 0'
          }}>
            <div style={{
              color: darkMode ? '#6ee7b7' : '#065f46',
              fontSize: '14px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>🔒</span>
              Pembayaran Aman • SSL 256-bit
            </div>
          </div>

          {/* Warning */}
          <div style={{
            background: darkMode ? '#78350f' : '#fffbeb',
            border: `1px solid ${darkMode ? '#92400e' : '#fde68a'}`,
            borderRadius: '12px',
            padding: '16px',
            margin: '24px 0'
          }}>
            <div style={{
              color: darkMode ? '#fcd34d' : '#92400e',
              fontSize: '13px',
              lineHeight: 1.6,
              fontWeight: 500
            }}>
              ⚡ <strong>Penting:</strong> Link pembayaran akan kedaluwarsa pada{' '}
              {mounted ? expiryDate.toLocaleString('id-ID') : 'memuat...'}.
              Segera lakukan pembayaran.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: darkMode ? theme.bgSecondary : theme.bgTertiary,
          padding: '32px',
          textAlign: 'center',
          borderTop: `1px solid ${theme.border}`
        }}>
          <div style={{
            fontWeight: 700,
            color: theme.text,
            marginBottom: '8px',
            fontSize: '15px'
          }}>
            Jobmate x Infolokerjombang
          </div>
          <div style={{
            color: theme.textSecondary,
            fontSize: '13px',
            margin: '6px 0'
          }}>
            Platform Karir Terpercaya
          </div>
          <div style={{
            color: theme.textSecondary,
            fontSize: '13px',
            margin: '6px 0'
          }}>
            Butuh bantuan?{' '}
            <a 
              href="mailto:admin@jobmate.web.id" 
              style={{ 
                color: colors.primary.mariner, 
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              admin@jobmate.web.id
            </a>
          </div>
          <div style={{
            color: theme.textSecondary,
            fontSize: '12px',
            marginTop: '16px',
            opacity: 0.7
          }}>
            © 2025 JOBMATE. All rights reserved.
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div style={{
        maxWidth: '600px',
        margin: '20px auto 0',
        background: theme.bg,
        padding: '20px',
        borderRadius: '16px',
        boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ 
          margin: '0 0 12px', 
          fontSize: '15px', 
          color: theme.text,
          fontWeight: 700
        }}>
          💡 Preview Controls
        </h3>
        <div style={{ fontSize: '13px', color: theme.textSecondary, lineHeight: 1.8 }}>
          <p style={{ margin: '6px 0' }}>✅ Dark mode support (otomatis detect system preference)</p>
          <p style={{ margin: '6px 0' }}>✅ Fresh, minimalist, elegant design</p>
          <p style={{ margin: '6px 0' }}>✅ Color palette dari colorpallate.md</p>
          <p style={{ margin: '6px 0' }}>✅ Logo JOBMATE dengan SVG custom</p>
          <p style={{ margin: '6px 0', marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${theme.border}` }}>
            <strong style={{ color: theme.text }}>URL:</strong>{' '}
            <code style={{ 
              background: darkMode ? theme.bgSecondary : theme.bgTertiary,
              padding: '4px 8px', 
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>
              /preview/invoice-v2
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
