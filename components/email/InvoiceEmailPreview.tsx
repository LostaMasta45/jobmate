'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface InvoiceEmailPreviewProps {
  userName: string;
  invoiceUrl: string;
  amount: number;
  currency: string;
  expiryDate: string;
  description: string;
}

export const InvoiceEmailPreview: React.FC<InvoiceEmailPreviewProps> = ({
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
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        '0 4px 12px rgba(85, 71, 208, 0.4)',
        '0 4px 20px rgba(85, 71, 208, 0.6), 0 0 30px rgba(85, 71, 208, 0.3)',
        '0 4px 12px rgba(85, 71, 208, 0.4)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-400 p-4 md:p-8">
      <motion.div
        className="max-w-2xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="relative bg-gradient-to-r from-[#5547d0] via-[#3977d3] to-[#00acc7] text-white p-10 text-center overflow-hidden"
          variants={itemVariants}
        >
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="relative z-10 text-3xl font-bold mb-2"
            variants={floatVariants}
            animate="animate"
          >
            ✨ JOBMATE
          </motion.div>
          <motion.div className="relative z-10 text-lg opacity-95 font-medium" variants={itemVariants}>
            Invoice Pembayaran
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="p-8">
          {/* Greeting */}
          <motion.div variants={itemVariants}>
            <div className="text-xl font-semibold mb-3 text-gray-900">Halo {userName},</div>
            <div className="text-gray-600 mb-6">
              Terima kasih telah memilih layanan kami. Berikut adalah detail invoice pembayaran Anda.
            </div>
          </motion.div>

          {/* Invoice Card */}
          <motion.div
            className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 mb-6 shadow-sm"
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="text-sm text-gray-600 font-semibold mb-4 pb-3 border-b-2 border-gray-200">
              Invoice #{invoiceId}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Deskripsi</span>
                <span className="font-semibold text-gray-900">{description}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Status</span>
                <motion.span
                  className="font-semibold text-amber-500 flex items-center gap-1"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⏳ Menunggu Pembayaran
                </motion.span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Berlaku Hingga</span>
                <span className="font-semibold text-gray-900">
                  {new Date(expiryDate).toLocaleDateString('id-ID', {
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
            className="relative bg-gradient-to-r from-[#5547d0] to-[#3977d3] rounded-xl p-6 text-center mb-6 overflow-hidden"
            variants={itemVariants}
            {...pulseVariants}
            {...glowVariants}
          >
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                background: [
                  'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                  'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                ],
                backgroundPosition: ['-200% 0', '200% 0'],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <div className="relative z-10">
              <div className="text-white/90 text-sm font-semibold mb-2 uppercase tracking-wider">
                Total Pembayaran
              </div>
              <motion.div
                className="text-white text-5xl font-bold"
                variants={pulseVariants}
                animate="animate"
              >
                {currency} {amount.toLocaleString('id-ID')}
              </motion.div>
            </div>
          </motion.div>

          {/* Countdown */}
          <motion.div
            className={`${
              isUrgent ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
            } border-2 rounded-xl p-5 mb-6`}
            variants={itemVariants}
            animate={isUrgent ? { scale: [1, 1.02, 1] } : {}}
            transition={isUrgent ? { duration: 1.5, repeat: Infinity } : {}}
          >
            <div className="flex justify-between items-center mb-3">
              <span className={`${isUrgent ? 'text-red-900' : 'text-blue-900'} font-semibold text-sm`}>
                {isUrgent ? '⚠️ Segera Bayar' : '⏰ Waktu Tersisa'}
              </span>
              <motion.span
                className={`${isUrgent ? 'text-red-600' : 'text-blue-600'} font-bold`}
                animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
                transition={isUrgent ? { duration: 1, repeat: Infinity } : {}}
              >
                {hoursRemaining > 0 ? `${hoursRemaining} jam lagi` : 'Segera berakhir!'}
              </motion.span>
            </div>
            <div className={`${isUrgent ? 'bg-red-100' : 'bg-blue-100'} h-2 rounded-full overflow-hidden`}>
              <motion.div
                className={`h-full ${
                  isUrgent ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-blue-600 to-blue-400'
                } shadow-lg`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div className="text-center mb-6" variants={itemVariants}>
            <motion.a
              href={invoiceUrl}
              className="relative inline-block bg-gradient-to-r from-[#5547d0] to-[#3977d3] text-white px-12 py-4 rounded-xl font-bold text-lg overflow-hidden"
              whileHover={{
                scale: 1.05,
                y: -4,
                boxShadow: '0 8px 20px rgba(85, 71, 208, 0.6)',
              }}
              whileTap={{ scale: 0.98 }}
              variants={pulseVariants}
              animate="animate"
            >
              <motion.span
                className="absolute inset-0 opacity-20"
                animate={{
                  background: [
                    'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                    'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                  ],
                  backgroundPosition: ['-200% 0', '200% 0'],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              />
              <span className="relative z-10">💳 Bayar Sekarang</span>
            </motion.a>
            <motion.a
              href={invoiceUrl}
              className="block mt-4 text-gray-600 text-sm hover:text-gray-900 transition-colors"
              whileHover={{ x: 5 }}
            >
              Lihat Detail Invoice →
            </motion.a>
          </motion.div>

          {/* Payment Methods */}
          <motion.div className="bg-gray-50 rounded-xl p-5 mb-6" variants={itemVariants}>
            <div className="text-sm font-semibold text-gray-700 mb-3">Metode Pembayaran Tersedia:</div>
            <div className="flex flex-wrap gap-2">
              {['🏦 Transfer Bank', '💳 Kartu Kredit', '📱 E-Wallet', '🏪 Alfamart', '🏬 Indomaret'].map(
                (method, index) => (
                  <motion.span
                    key={method}
                    className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-xs font-semibold text-gray-700"
                    whileHover={{ y: -2, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                  >
                    {method}
                  </motion.span>
                )
              )}
            </div>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            className="text-center p-4 bg-green-50 border border-green-200 rounded-lg mb-6"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="text-green-800 text-sm font-semibold"
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-lg mr-1">🔒</span>
              Pembayaran Aman - Dienkripsi dengan SSL 256-bit
            </motion.div>
          </motion.div>

          {/* Warning */}
          <motion.div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6" variants={itemVariants}>
            <div className="text-yellow-900 text-sm leading-relaxed">
              ⚡ <strong>Penting:</strong> Link pembayaran ini akan kedaluwarsa pada{' '}
              {new Date(expiryDate).toLocaleString('id-ID')}. Segera lakukan pembayaran untuk menghindari pembatalan
              otomatis.
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div className="bg-gray-50 p-8 text-center" variants={itemVariants}>
          <div className="font-semibold text-gray-900 mb-1">Jobmate x Infolokerjombang</div>
          <div className="text-gray-600 text-sm mb-1">Platform Karir Terpercaya</div>
          <div className="text-gray-600 text-sm mb-3">
            Butuh bantuan? Hubungi{' '}
            <a href="mailto:admin@jobmate.web.id" className="text-blue-600 hover:underline">
              admin@jobmate.web.id
            </a>
          </div>
          <div className="text-gray-500 text-xs mt-3">© 2025 JOBMATE. All rights reserved.</div>
        </motion.div>
      </motion.div>
    </div>
  );
};
