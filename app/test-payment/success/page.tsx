"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  Sparkles,
  Trophy,
  Crown,
  FileCheck,
  Zap,
  Star,
  RefreshCw
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Epic confetti celebration 🎉
  const fireConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#a855f7', '#8b5cf6', '#7c3aed', '#6d28d9']
      });
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#10b981', '#3b82f6', '#06b6d4', '#8b5cf6']
      });
    }, 250);
  };

  // Load payment data from sessionStorage
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      const storedData = sessionStorage.getItem(`payment-${orderId}`);
      if (storedData) {
        const data = JSON.parse(storedData);
        setPaymentData(data.payment);
        setCustomerData(data.customerData);
        setShowConfetti(true);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading payment data:', err);
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => {
        fireConfetti();
      }, 500);
    }
  }, [showConfetti]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Extract first name
  const getFirstName = (fullName: string) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };

  const firstName = customerData?.fullName ? getFirstName(customerData.fullName) : '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin mx-auto text-purple-600" />
          <p className="text-sm sm:text-base text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-6 sm:py-12 px-3 sm:px-4 lg:px-6 relative overflow-hidden">
      {/* TEST MODE Banner */}
      <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 font-bold z-50">
        🧪 TEST MODE - PAKASIR.COM PAYMENT SUCCESS
      </div>

      {/* Animated Background Elements */}
      <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-10 left-10 w-64 h-64 lg:w-96 lg:h-96 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-10 right-10 w-64 h-64 lg:w-96 lg:h-96 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-3xl"
        />
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -50 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: [-50, 100],
              x: Math.random() * 100 - 50
            }}
            transition={{
              duration: 3,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="absolute hidden lg:block"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`
            }}
          >
            <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-yellow-400" />
          </motion.div>
        ))}
      </div>

      <div className="container max-w-5xl mx-auto relative z-10 mt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Card className="shadow-xl sm:shadow-2xl border-2 border-purple-300/50 dark:border-purple-700/50 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 overflow-hidden">
            {/* Success Header */}
            <CardHeader className="text-center space-y-4 sm:space-y-6 pb-6 sm:pb-8 pt-6 sm:pt-10 px-4 sm:px-6 relative bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
              {/* Trophy Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.7, type: "spring", bounce: 0.5 }}
                className="mx-auto relative"
              >
                <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl relative">
                  <Trophy className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white" />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-full border-2 sm:border-4 border-purple-400"
                  />
                </div>
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2"
                >
                  <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-yellow-400 fill-yellow-400" />
                </motion.div>
              </motion.div>

              {/* Success Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2 sm:space-y-3"
              >
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-700 dark:text-purple-400"
                >
                  Terima Kasih{firstName ? `, ${firstName}` : ''}! 🙏
                </motion.h2>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent px-4">
                  Test Payment Berhasil!
                </h1>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="flex items-center justify-center gap-1 sm:gap-2 text-4xl sm:text-5xl lg:text-6xl"
                >
                  <span>🎉</span>
                  <span>✨</span>
                  <span>🧪</span>
                </motion.div>
                
                <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-base sm:text-lg lg:text-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-white shadow-lg shadow-yellow-500/50">
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>TEST MODE - PAKASIR.COM</span>
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-10 pb-6 sm:pb-10">
              {/* Payment Summary */}
              {paymentData && customerData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-purple-200/50 dark:border-purple-700/50 shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                    <h3 className="font-bold text-base sm:text-lg">Detail Test Payment</h3>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {/* Customer Info */}
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Informasi Customer</h4>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground min-w-[80px]">Nama</span>
                          <span className="text-sm font-medium">{customerData.fullName || '-'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground min-w-[80px]">Email</span>
                          <span className="text-sm font-medium break-all">{customerData.email || '-'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground min-w-[80px]">WhatsApp</span>
                          <span className="text-sm font-medium">{customerData.whatsapp || '-'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground min-w-[80px]">Paket</span>
                          <span className="text-sm font-medium">{customerData.plan || '-'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Info */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 pt-2 border-t border-purple-200/50 dark:border-purple-700/50">
                      <span className="text-xs sm:text-sm text-muted-foreground">Order ID</span>
                      <span className="font-mono text-xs sm:text-sm font-semibold break-all">{paymentData.order_id}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-muted-foreground">Metode</span>
                      <span className="text-sm font-semibold uppercase">{paymentData.payment_method}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-muted-foreground">Gateway</span>
                      <span className="text-sm font-semibold">Pakasir.com (TEST)</span>
                    </div>
                    
                    {/* Amount Info */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 sm:pt-3 border-t-2 border-purple-200 dark:border-purple-800 gap-1 sm:gap-0">
                      <span className="font-semibold text-sm sm:text-base">Subtotal</span>
                      <span className="text-base sm:text-lg font-bold">{formatCurrency(paymentData.amount)}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                      <span className="text-sm text-muted-foreground">Biaya Admin</span>
                      <span className="text-sm font-semibold">{formatCurrency(paymentData.fee)}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 border-t-2 border-dashed border-purple-200 dark:border-purple-800 gap-1 sm:gap-0">
                      <span className="font-bold text-base">Total Dibayar</span>
                      <span className="text-2xl sm:text-3xl font-black text-purple-600 tabular-nums">
                        {formatCurrency(paymentData.total_payment)}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-muted-foreground">Status</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        COMPLETED (TEST)
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Info Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-blue-950/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-blue-200/50 dark:border-blue-700/50"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-lg">Informasi Test Payment</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    Ini adalah transaksi test menggunakan Pakasir.com API
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    QR Code QRIS berhasil di-generate dan di-display
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    Auto-check payment status berfungsi dengan baik
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    Custom UI payment berhasil diimplementasikan
                  </p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <Button
                  onClick={() => router.push('/test-payment')}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Test Payment Lagi
                </Button>
                <Button
                  onClick={() => router.push('/')}
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                >
                  Kembali ke Beranda
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>

              {/* Test Info Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-center space-y-2 pt-4 border-t-2 border-dashed border-purple-200 dark:border-purple-700"
              >
                <p className="text-xs text-muted-foreground">
                  🧪 Test payment flow completed successfully
                </p>
                <p className="text-xs text-muted-foreground">
                  Silakan cek console/logs untuk detail teknis
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function TestPaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
