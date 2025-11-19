'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function InvoiceAnimatedPreview() {
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

  const progressPercentage = Math.max(10, Math.min(100, (hoursRemaining / 24) * 100));

  const colors = {
    primary: {
      heliotrope: '#8e68fd',
      purpleHeart: '#5547d0',
      mariner: '#3977d3',
      pacificBlue: '#00acc7',
    },
    light: {
      bg: '#ffffff',
      bgSecondary: '#f9fafb',
      bgTertiary: '#f3f4f6',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
    },
    dark: {
      bg: '#0f172a',
      bgSecondary: '#1e293b',
      bgTertiary: '#334155',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      border: '#475569',
    },
  };

  const theme = darkMode ? colors.dark : colors.light;

  const containerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  if (!mounted) return null;

  return (
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        background: darkMode
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        minHeight: '100vh',
        padding: '20px',
        transition: 'background 0.5s ease',
      }}
    >
      {/* Header Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: '650px',
          margin: '0 auto 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: theme.bg,
          padding: '16px 24px',
          borderRadius: '20px',
          boxShadow: darkMode
            ? '0 10px 40px rgba(0,0,0,0.5)'
            : '0 10px 40px rgba(0,0,0,0.15)',
          border: `1px solid ${theme.border}`,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 700,
              color: theme.text,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '28px' }}>📧</span>
            Invoice Email Preview
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: theme.textSecondary }}>
            Preview dengan animasi • Tanpa kirim email
          </p>
        </div>
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: darkMode ? colors.dark.bgTertiary : colors.light.bgTertiary,
            border: 'none',
            borderRadius: '12px',
            padding: '10px 20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: theme.text,
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: darkMode
              ? '0 4px 12px rgba(0,0,0,0.3)'
              : '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </motion.button>
      </motion.div>

      {/* Email Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: '650px',
          margin: '0 auto',
          background: theme.bg,
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: darkMode
            ? '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)'
            : '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
        }}
      >
        {/* Header with Logo */}
        <motion.div
          variants={itemVariants}
          style={{
            position: 'relative',
            background: `linear-gradient(135deg, ${colors.primary.purpleHeart} 0%, ${colors.primary.mariner} 50%, ${colors.primary.pacificBlue} 100%)`,
            padding: '40px 30px',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.3,
            }}
          />
          <motion.div
            variants={floatVariants}
            animate="animate"
            style={{ position: 'relative', zIndex: 1 }}
          >
            <Image
              src="/Logo/logopanjang.png"
              alt="Jobmate Logo"
              width={200}
              height={50}
              style={{
                margin: '0 auto 12px',
                display: 'block',
                filter: 'brightness(0) invert(1)',
              }}
            />
            <div style={{ color: 'white', fontSize: '18px', fontWeight: 500, opacity: 0.95 }}>
              Invoice Pembayaran
            </div>
          </motion.div>
        </motion.div>

        {/* Content */}
        <div style={{ padding: '40px 30px' }}>
          {/* Greeting */}
          <motion.div variants={itemVariants}>
            <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: theme.text }}>
              Halo {userName},
            </div>
            <div style={{ color: theme.textSecondary, marginBottom: '30px', fontSize: '15px' }}>
              Terima kasih telah memilih layanan kami. Berikut adalah detail invoice pembayaran Anda.
            </div>
          </motion.div>

          {/* Invoice Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.15)' }}
            style={{
              background: darkMode
                ? `linear-gradient(135deg, ${colors.dark.bgSecondary} 0%, ${colors.dark.bgTertiary} 100%)`
                : `linear-gradient(135deg, ${colors.light.bgSecondary} 0%, ${colors.light.bg} 100%)`,
              border: `2px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                fontSize: '13px',
                color: theme.textSecondary,
                fontWeight: 600,
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: `2px solid ${theme.border}`,
              }}
            >
              Invoice #{invoiceId}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                <span style={{ color: theme.textSecondary, fontSize: '14px' }}>Deskripsi</span>
                <span style={{ color: theme.text, fontWeight: 600, fontSize: '14px' }}>{description}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                <span style={{ color: theme.textSecondary, fontSize: '14px' }}>Status</span>
                <motion.span
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ color: '#f59e0b', fontWeight: 600, fontSize: '14px' }}
                >
                  ⏳ Menunggu Pembayaran
                </motion.span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                <span style={{ color: theme.textSecondary, fontSize: '14px' }}>Berlaku Hingga</span>
                <span style={{ color: theme.text, fontWeight: 600, fontSize: '14px' }}>
                  {expiryDate.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Amount Box */}
          <motion.div
            variants={itemVariants}
            animate={{
              boxShadow: [
                '0 4px 12px rgba(85, 71, 208, 0.4)',
                '0 4px 20px rgba(85, 71, 208, 0.6), 0 0 30px rgba(85, 71, 208, 0.3)',
                '0 4px 12px rgba(85, 71, 208, 0.4)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'relative',
              background: `linear-gradient(135deg, ${colors.primary.purpleHeart} 0%, ${colors.primary.mariner} 100%)`,
              borderRadius: '16px',
              padding: '30px',
              textAlign: 'center',
              margin: '24px 0',
              overflow: 'hidden',
            }}
          >
            <motion.div
              animate={{
                backgroundPosition: ['-200% 0', '200% 0'],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                backgroundSize: '200% 100%',
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Total Pembayaran
              </div>
              <motion.div
                variants={pulseVariants}
                animate="animate"
                style={{ color: 'white', fontSize: '48px', fontWeight: 'bold', letterSpacing: '-1px' }}
              >
                {currency} {amount.toLocaleString('id-ID')}
              </motion.div>
            </div>
          </motion.div>

          {/* Countdown */}
          <motion.div
            variants={itemVariants}
            animate={isUrgent ? { scale: [1, 1.02, 1] } : {}}
            transition={isUrgent ? { duration: 1.5, repeat: Infinity } : {}}
            style={{
              background: isUrgent
                ? darkMode
                  ? '#7f1d1d'
                  : '#fef2f2'
                : darkMode
                  ? '#1e3a8a'
                  : '#f0f9ff',
              border: `2px solid ${
                isUrgent
                  ? darkMode
                    ? '#991b1b'
                    : '#fecaca'
                  : darkMode
                    ? '#1e40af'
                    : '#bfdbfe'
              }`,
              borderRadius: '16px',
              padding: '20px',
              margin: '24px 0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span
                style={{
                  color: isUrgent ? (darkMode ? '#fca5a5' : '#991b1b') : darkMode ? '#93c5fd' : '#1e40af',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {isUrgent ? '⚠️ Segera Bayar' : '⏰ Waktu Tersisa'}
              </span>
              <motion.span
                animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
                transition={isUrgent ? { duration: 1, repeat: Infinity } : {}}
                style={{
                  color: isUrgent ? (darkMode ? '#ef4444' : '#dc2626') : darkMode ? '#3b82f6' : '#2563eb',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                {hoursRemaining > 0 ? `${hoursRemaining} jam lagi` : 'Segera berakhir!'}
              </motion.span>
            </div>
            <div
              style={{
                background: isUrgent ? (darkMode ? '#991b1b' : '#fee2e2') : darkMode ? '#1e40af' : '#dbeafe',
                height: '8px',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                style={{
                  background: isUrgent
                    ? 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)'
                    : 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
                  height: '100%',
                  boxShadow: isUrgent
                    ? '0 0 10px rgba(220, 38, 38, 0.5)'
                    : '0 0 10px rgba(37, 99, 235, 0.5)',
                }}
              />
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={itemVariants} style={{ textAlign: 'center', margin: '32px 0' }}>
            <motion.a
              href={invoiceUrl}
              whileHover={{
                scale: 1.05,
                y: -4,
                boxShadow: '0 12px 24px rgba(85, 71, 208, 0.6)',
              }}
              whileTap={{ scale: 0.98 }}
              variants={pulseVariants}
              animate="animate"
              style={{
                position: 'relative',
                display: 'inline-block',
                background: `linear-gradient(135deg, ${colors.primary.purpleHeart} 0%, ${colors.primary.mariner} 100%)`,
                color: 'white',
                padding: '16px 48px',
                textDecoration: 'none',
                borderRadius: '14px',
                fontWeight: 'bold',
                fontSize: '16px',
                overflow: 'hidden',
              }}
            >
              <motion.span
                animate={{
                  backgroundPosition: ['-200% 0', '200% 0'],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                  backgroundSize: '200% 100%',
                }}
              />
              <span style={{ position: 'relative', zIndex: 1 }}>💳 Bayar Sekarang</span>
            </motion.a>
            <motion.a
              href={invoiceUrl}
              whileHover={{ x: 5 }}
              style={{
                display: 'block',
                marginTop: '16px',
                color: theme.textSecondary,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              Lihat Detail Invoice →
            </motion.a>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            variants={itemVariants}
            style={{
              background: darkMode ? colors.dark.bgSecondary : colors.light.bgSecondary,
              borderRadius: '16px',
              padding: '20px',
              margin: '24px 0',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 600, color: theme.text, marginBottom: '12px' }}>
              Metode Pembayaran Tersedia:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['🏦 Transfer Bank', '💳 Kartu Kredit', '📱 E-Wallet', '🏪 Alfamart', '🏬 Indomaret'].map(
                (method, index) => (
                  <motion.span
                    key={method}
                    whileHover={{ y: -2, boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.15)' }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    style={{
                      background: theme.bg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '10px',
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: theme.text,
                      cursor: 'default',
                    }}
                  >
                    {method}
                  </motion.span>
                )
              )}
            </div>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            style={{
              textAlign: 'center',
              padding: '16px',
              background: darkMode ? '#064e3b' : '#ecfdf5',
              border: `1px solid ${darkMode ? '#059669' : '#a7f3d0'}`,
              borderRadius: '12px',
              margin: '24px 0',
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                color: darkMode ? '#6ee7b7' : '#065f46',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              <span style={{ fontSize: '18px', marginRight: '4px' }}>🔒</span>
              Pembayaran Aman - Dienkripsi dengan SSL 256-bit
            </motion.div>
          </motion.div>

          {/* Warning */}
          <motion.div
            variants={itemVariants}
            style={{
              background: darkMode ? '#78350f' : '#fffbeb',
              border: `1px solid ${darkMode ? '#a16207' : '#fde68a'}`,
              borderRadius: '12px',
              padding: '16px',
              margin: '24px 0',
            }}
          >
            <div
              style={{
                color: darkMode ? '#fde047' : '#92400e',
                fontSize: '13px',
                lineHeight: 1.6,
              }}
            >
              ⚡ <strong>Penting:</strong> Link pembayaran ini akan kedaluwarsa pada{' '}
              {expiryDate.toLocaleString('id-ID')}. Segera lakukan pembayaran untuk menghindari pembatalan otomatis.
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          style={{
            background: darkMode ? colors.dark.bgSecondary : colors.light.bgSecondary,
            padding: '30px',
            textAlign: 'center',
            borderTop: `1px solid ${theme.border}`,
          }}
        >
          <div style={{ fontWeight: 600, color: theme.text, marginBottom: '4px', fontSize: '14px' }}>
            Jobmate x Infolokerjombang
          </div>
          <div style={{ color: theme.textSecondary, fontSize: '13px', marginBottom: '4px' }}>
            Platform Karir Terpercaya
          </div>
          <div style={{ color: theme.textSecondary, fontSize: '13px', marginBottom: '12px' }}>
            Butuh bantuan? Hubungi{' '}
            <a
              href="mailto:admin@jobmate.web.id"
              style={{ color: colors.primary.mariner, textDecoration: 'none' }}
            >
              admin@jobmate.web.id
            </a>
          </div>
          <div style={{ color: theme.textSecondary, fontSize: '12px', marginTop: '12px' }}>
            © 2025 JOBMATE. All rights reserved.
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
