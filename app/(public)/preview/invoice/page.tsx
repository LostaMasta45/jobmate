'use client';

import React, { useState, useEffect } from 'react';

export default function InvoicePreviewPage() {
  // Sample data for preview
  const userName = 'Test User';
  const invoiceUrl = 'https://invoice.xendit.co/test-invoice-123456';
  const amount = 50000;
  const currency = 'Rp';
  const description = 'VIP Basic - 1 Bulan';

  // State for dynamic values (prevents hydration mismatch)
  const [invoiceId, setInvoiceId] = useState('INV-123456789');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [minutesRemaining, setMinutesRemaining] = useState(30);
  const [totalMinutes, setTotalMinutes] = useState(30);
  const [isUrgent, setIsUrgent] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dynamic values on client-side only
  useEffect(() => {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 30); // 30 minutes from now

    const now = new Date();
    const totalMins = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60));
    const hours = Math.floor(totalMins / 60);
    const minutes = totalMins % 60;

    setInvoiceId(`INV-${Date.now().toString().slice(-9)}`);
    setExpiryDate(expiry);
    setHoursRemaining(hours);
    setMinutesRemaining(minutes);
    setTotalMinutes(totalMins);
    setIsUrgent(totalMins < 60);
    setMounted(true);

    // Check system dark mode preference
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
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      borderLight: '#f3f4f6',
    },
    dark: {
      bg: '#0f172a',
      bgSecondary: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      border: '#334155',
      borderLight: '#475569',
    }
  };

  const theme = darkMode ? colors.dark : colors.light;

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
      lineHeight: 1.6,
      color: '#1f2937',
      backgroundColor: '#f3f4f6',
      padding: '20px',
      minHeight: '100vh'
    }}>
      {/* Preview Header */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto 20px',
        background: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>
          📧 Email Preview - Invoice
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#6b7280' }}>
          Preview design email tanpa kirim email • Hemat limit Resend
        </p>
      </div>

      {/* Email Container */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header dengan gradient dan logo */}
        <div style={{
          background: 'linear-gradient(135deg, #5547d0 0%, #3977d3 50%, #00acc7 100%)',
          color: 'white',
          padding: '40px 30px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '8px',
            letterSpacing: '1px'
          }}>
            ✨ JOBMATE
          </div>
          <div style={{
            fontSize: '16px',
            opacity: 0.95,
            fontWeight: 500
          }}>
            Invoice Pembayaran
          </div>
        </div>

        {/* Content area */}
        <div style={{ padding: '40px 30px' }}>
          {/* Greeting */}
          <div style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '12px',
            color: '#111827'
          }}>
            Halo {userName},
          </div>

          <div style={{
            color: '#6b7280',
            marginBottom: '30px',
            fontSize: '15px'
          }}>
            Terima kasih telah memilih layanan kami. Berikut adalah detail invoice pembayaran Anda.
          </div>

          {/* Invoice card */}
          <div style={{
            background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '13px',
              color: '#6b7280',
              fontWeight: 600,
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '2px solid #e5e7eb'
            }}>
              Invoice #{invoiceId}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Deskripsi</span>
              <span style={{ color: '#111827', fontWeight: 600, fontSize: '14px' }}>{description}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Status</span>
              <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: '14px' }}>⏳ Menunggu Pembayaran</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0'
            }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Berlaku Hingga</span>
              <span style={{ color: '#111827', fontWeight: 600, fontSize: '14px' }}>
                {mounted ? expiryDate.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Memuat...'}
              </span>
            </div>
          </div>

          {/* Amount box */}
          <div style={{
            background: 'linear-gradient(135deg, #5547d0 0%, #3977d3 100%)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            margin: '24px 0',
            boxShadow: '0 4px 12px rgba(85, 71, 208, 0.3)'
          }}>
            <div style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Total Pembayaran
            </div>
            <div style={{
              color: 'white',
              fontSize: '40px',
              fontWeight: 'bold',
              letterSpacing: '-1px'
            }}>
              {currency} {amount.toLocaleString('id-ID')}
            </div>
          </div>

          {/* Countdown */}
          <div style={{
            background: isUrgent ? '#fef2f2' : '#f0f9ff',
            border: `2px solid ${isUrgent ? '#fecaca' : '#bfdbfe'}`,
            borderRadius: '12px',
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
                color: isUrgent ? '#991b1b' : '#1e40af',
                fontSize: '14px',
                fontWeight: 600
              }}>
                {isUrgent ? '⚠️ Segera Bayar' : '⏰ Waktu Tersisa'}
              </span>
              <span style={{
                color: isUrgent ? '#dc2626' : '#2563eb',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {hoursRemaining > 0
                  ? `${hoursRemaining} jam ${minutesRemaining > 0 ? `${minutesRemaining} menit ` : ''}lagi`
                  : totalMinutes > 0 ? `${minutesRemaining} menit lagi` : 'Segera berakhir!'}
              </span>
            </div>
            <div style={{
              background: isUrgent ? '#fee2e2' : '#dbeafe',
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: isUrgent ? 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)' : 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
                height: '100%',
                width: `${Math.max(10, Math.min(100, (totalMinutes / (24 * 60)) * 100))}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* CTA Button */}
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <a
              href={invoiceUrl}
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #5547d0 0%, #3977d3 100%)',
                color: 'white',
                padding: '16px 48px',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(85, 71, 208, 0.4)',
                transition: 'transform 0.2s'
              }}
            >
              💳 Bayar Sekarang
            </a>
            <div style={{ marginTop: '16px' }}>
              <a
                href={invoiceUrl}
                style={{
                  color: '#6b7280',
                  fontSize: '14px',
                  textDecoration: 'none'
                }}
              >
                Lihat Detail Invoice →
              </a>
            </div>
          </div>

          {/* Payment methods */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '12px',
            padding: '20px',
            margin: '24px 0'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '12px'
            }}>
              Metode Pembayaran Tersedia:
            </div>
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <span style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#374151'
              }}>🏦 Transfer Bank</span>
              <span style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#374151'
              }}>💳 Kartu Kredit</span>
              <span style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#374151'
              }}>📱 E-Wallet</span>
              <span style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#374151'
              }}>🏪 Alfamart</span>
              <span style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#374151'
              }}>🏬 Indomaret</span>
            </div>
          </div>

          {/* Trust badge */}
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '8px',
            margin: '24px 0'
          }}>
            <div style={{
              color: '#065f46',
              fontSize: '13px',
              fontWeight: 600
            }}>
              <span style={{ fontSize: '18px', marginRight: '4px' }}>🔒</span>
              Pembayaran Aman - Dienkripsi dengan SSL 256-bit
            </div>
          </div>

          {/* Warning */}
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '16px',
            margin: '24px 0'
          }}>
            <div style={{
              color: '#92400e',
              fontSize: '13px',
              lineHeight: 1.6
            }}>
              ⚡ <strong>Penting:</strong> Link pembayaran ini akan kedaluwarsa pada {mounted ? expiryDate.toLocaleString('id-ID') : 'memuat...'}.
              Segera lakukan pembayaran untuk menghindari pembatalan otomatis.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: '#f9fafb',
          padding: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            fontWeight: 600,
            color: '#111827',
            marginBottom: '8px',
            fontSize: '14px'
          }}>
            InfoLokerJombang
          </div>
          <div style={{
            color: '#6b7280',
            fontSize: '13px',
            margin: '4px 0'
          }}>
            Platform Karir Terpercaya
          </div>
          <div style={{
            color: '#6b7280',
            fontSize: '13px',
            margin: '4px 0'
          }}>
            Butuh bantuan? Hubungi{' '}
            <a href="mailto:admin@infolokerjombang.id" style={{ color: '#3977d3', textDecoration: 'none' }}>
              admin@infolokerjombang.id
            </a>
          </div>
          <div style={{
            color: '#6b7280',
            fontSize: '13px',
            marginTop: '12px'
          }}>
            © 2025 JOBMATE. All rights reserved.
          </div>
        </div>
      </div>

      {/* Preview Controls */}
      <div style={{
        maxWidth: '600px',
        margin: '20px auto',
        background: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '14px', color: '#111827' }}>
          💡 Preview Controls
        </h3>
        <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>
          <p style={{ margin: '4px 0' }}>✅ Lihat design tanpa kirim email</p>
          <p style={{ margin: '4px 0' }}>✅ Hemat limit Resend</p>
          <p style={{ margin: '4px 0' }}>✅ Test responsive di berbagai device</p>
          <p style={{ margin: '4px 0', marginTop: '12px' }}>
            <strong>URL:</strong> <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>
              /preview/invoice
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
