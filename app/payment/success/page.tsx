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
  Mail,
  FileCheck,
  UserPlus,
  Zap,
  Star,
  Phone
} from "lucide-react";

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const externalId = searchParams.get('external_id');
  
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const maxRetries = 10; // Retry up to 10 times (30 seconds total)

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
      
      // Fire from multiple points
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#fbbf24', '#f59e0b', '#ea580c', '#dc2626']
      });
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#10b981', '#059669', '#3b82f6', '#6366f1']
      });
    }, 250);
  };

  // Function to fetch payment status with retry logic
  const fetchPaymentStatus = async (attempt: number = 0) => {
    if (!externalId) {
      console.warn('[Success Page] No external_id provided');
      setLoading(false);
      return;
    }

    console.log(`[Success Page] Fetching payment status (attempt ${attempt + 1}/${maxRetries})...`);
    setIsRetrying(attempt > 0);
    
    try {
      const response = await fetch(`/api/payment/check-status?external_id=${externalId}`);
      console.log('[Success Page] API Response status:', response.status);
      
      if (!response.ok) {
        // If 404 and we haven't exceeded retries, retry after delay
        if (response.status === 404 && attempt < maxRetries) {
          console.log(`[Success Page] Payment not found yet, will retry in 3 seconds... (${attempt + 1}/${maxRetries})`);
          setRetryCount(attempt + 1);
          
          setTimeout(() => {
            fetchPaymentStatus(attempt + 1);
          }, 3000); // Retry after 3 seconds
          
          return;
        }
        
        // Max retries exceeded or other error
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      console.log('[Success Page] Payment data:', data);
      
      if (data.success && data.payment) {
        // Success! Payment found
        setPaymentData(data.payment);
        setShowConfetti(true);
        setLoading(false);
        setIsRetrying(false);
        console.log('[Success Page] Payment found successfully!', data.source ? `(source: ${data.source})` : '');
      } else {
        console.error('[Success Page] Payment not found:', data.error);
        setLoading(false);
        setIsRetrying(false);
      }
      
    } catch (error: any) {
      console.error('[Success Page] Error fetching payment:', error);
      
      // If we haven't exceeded retries, try again
      if (attempt < maxRetries) {
        console.log(`[Success Page] Error occurred, will retry in 3 seconds... (${attempt + 1}/${maxRetries})`);
        setRetryCount(attempt + 1);
        
        setTimeout(() => {
          fetchPaymentStatus(attempt + 1);
        }, 3000);
      } else {
        // Max retries exceeded
        console.error('[Success Page] Max retries exceeded, giving up');
        setLoading(false);
        setIsRetrying(false);
      }
    }
  };

  useEffect(() => {
    // Start fetching payment status when component mounts
    fetchPaymentStatus();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalId]);

  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => {
        fireConfetti();
      }, 500);
    }
  }, [showConfetti]);

  // Extract first name from full name
  const getFirstName = (fullName: string) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
        <div className="text-center space-y-4 max-w-md">
          <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin mx-auto text-emerald-600" />
          <div className="space-y-2">
            <p className="text-sm sm:text-base font-semibold text-foreground">
              {isRetrying ? '🔄 Menunggu konfirmasi pembayaran...' : '📋 Memuat data pembayaran...'}
            </p>
            {isRetrying && (
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Sedang memproses pembayaran Anda dari Xendit
                </p>
                <p className="text-xs text-muted-foreground">
                  Percobaan ke-{retryCount} dari {maxRetries}
                </p>
                <p className="text-xs text-muted-foreground italic">
                  Mohon tunggu, ini normal untuk pembayaran baru... ⏳
                </p>
              </div>
            )}
            {!isRetrying && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                Mohon tunggu sebentar...
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Handle payment not found
  if (!loading && !paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600">Data Pembayaran Tidak Ditemukan</h2>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Maaf, kami tidak dapat menemukan data pembayaran Anda.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-xs font-mono break-all">
              {externalId || 'No external_id provided'}
            </div>
            <p className="text-sm text-muted-foreground">
              Kemungkinan penyebab:
            </p>
            <ul className="text-sm text-left space-y-1 text-muted-foreground">
              <li>• Invoice belum dibayar</li>
              <li>• Data sedang diproses (tunggu 1-2 menit)</li>
              <li>• Link sudah kadaluarsa</li>
            </ul>
            <Button asChild className="w-full">
              <a href="/payment">Kembali ke Halaman Payment</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const firstName = getFirstName(paymentData?.userName || '');
  const planName = paymentData?.planType === 'premium' ? 'Premium' : 'Basic';
  const isPremium = paymentData?.planType === 'premium';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-6 sm:py-12 px-3 sm:px-4 lg:px-6 relative overflow-hidden">
      {/* Animated Background Elements - Hide on mobile for performance */}
      <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-10 left-10 w-64 h-64 lg:w-96 lg:h-96 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-10 right-10 w-64 h-64 lg:w-96 lg:h-96 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-3xl"
        />
        {/* Floating Stars - Desktop only */}
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

      <div className="container max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Card className="shadow-xl sm:shadow-2xl border-2 border-emerald-300/50 dark:border-emerald-700/50 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 overflow-hidden">
            {/* Success Header - IMPROVED & RESPONSIVE */}
            <CardHeader className="text-center space-y-4 sm:space-y-6 pb-6 sm:pb-8 pt-6 sm:pt-10 px-4 sm:px-6 relative bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30">
              {/* Trophy Icon - Responsive size */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.7, type: "spring", bounce: 0.5 }}
                className="mx-auto relative"
              >
                <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl relative">
                  <Trophy className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white" />
                  {/* Pulsing Ring */}
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
                    className="absolute inset-0 rounded-full border-2 sm:border-4 border-emerald-400"
                  />
                </div>
                {/* Floating Sparkles - Hidden on small mobile */}
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

              {/* Success Text with Personalization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2 sm:space-y-3"
              >
                {/* Personalized Greeting */}
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-700 dark:text-emerald-400"
                >
                  Terima Kasih{firstName ? `, ${firstName}` : ''}! 🙏
                </motion.h2>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent px-4">
                  Pembayaran Berhasil!
                </h1>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="flex items-center justify-center gap-1 sm:gap-2 text-4xl sm:text-5xl lg:text-6xl"
                >
                  <span>🎉</span>
                  <span>✨</span>
                  <span>🚀</span>
                </motion.div>
                
                <div className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-base sm:text-lg lg:text-xl ${
                  isPremium
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-white shadow-lg shadow-amber-500/50'
                    : 'bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                }`}>
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Member VIP {isPremium ? 'PREMIUM' : 'BASIC'}</span>
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-10 pb-6 sm:pb-10">
              {/* Payment Summary - IMPROVED RESPONSIVE */}
              {paymentData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-emerald-200/50 dark:border-emerald-700/50 shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                    <h3 className="font-bold text-base sm:text-lg">Detail Pembayaran</h3>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {/* Customer Info Section */}
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Informasi Customer</h4>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground min-w-[80px]">Nama</span>
                          <span className="text-sm font-medium">{paymentData.userName || '-'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground min-w-[80px]">Email</span>
                          <span className="text-sm font-medium break-all">{paymentData.userEmail || '-'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground min-w-[80px]">WhatsApp</span>
                          <span className="text-sm font-medium">{paymentData.userWhatsapp || '-'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Info */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 pt-2 border-t border-emerald-200/50 dark:border-emerald-700/50">
                      <span className="text-xs sm:text-sm text-muted-foreground">ID Transaksi</span>
                      <span className="font-mono text-xs sm:text-sm font-semibold break-all sm:break-normal">{paymentData.externalId?.slice(0, 40)}...</span>
                    </div>
                    {paymentData.invoiceId && (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-xs sm:text-sm text-muted-foreground">Invoice ID</span>
                        <span className="font-mono text-xs sm:text-sm font-semibold">{paymentData.invoiceId}</span>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-muted-foreground">Paket</span>
                      <div className={`px-3 py-1.5 rounded-lg font-bold text-sm sm:text-base flex items-center gap-2 ${
                        isPremium 
                          ? 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-700'
                          : 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-700'
                      }`}>
                        <Crown className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          isPremium ? 'text-amber-500 fill-amber-500' : 'text-emerald-500 fill-emerald-500'
                        }`} />
                        VIP {isPremium ? 'PREMIUM' : 'BASIC'}
                      </div>
                    </div>
                    {paymentData.paymentMethod && (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-xs sm:text-sm text-muted-foreground">Metode Pembayaran</span>
                        <span className="text-sm font-medium">{paymentData.paymentMethod}</span>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 sm:pt-3 border-t-2 border-emerald-200 dark:border-emerald-800 gap-1 sm:gap-0">
                      <span className="font-semibold text-sm sm:text-base">Total Dibayar</span>
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1">
                        <span className="text-base sm:text-lg lg:text-xl font-black text-emerald-600">Rp</span>
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-600 tabular-nums">
                          {paymentData.amount?.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-muted-foreground">Status</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        LUNAS
                      </span>
                    </div>
                    {paymentData.paidAt && (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-xs sm:text-sm text-muted-foreground">Dibayar pada</span>
                        <span className="text-xs sm:text-sm">
                          {new Date(paymentData.paidAt).toLocaleString('id-ID', { 
                            dateStyle: 'long', 
                            timeStyle: 'short' 
                          })}
                        </span>
                      </div>
                    )}
                    {paymentData.expiredAt && (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-xs sm:text-sm text-muted-foreground">Berlaku hingga</span>
                        <span className="text-xs sm:text-sm font-semibold text-amber-600">
                          {new Date(paymentData.expiredAt).toLocaleDateString('id-ID', { 
                            dateStyle: 'long'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Next Steps - IMPROVED COPYWRITING & RESPONSIVE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-blue-200/50 dark:border-blue-700/50 shadow-lg relative overflow-hidden"
              >
                {/* Decorative Element - Hide on mobile */}
                <div className="hidden sm:block absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                    <h3 className="font-bold text-lg sm:text-xl">Yang Perlu Anda Lakukan</h3>
                  </div>
                  
                  <div className="grid gap-2 sm:gap-3">
                    {[
                      { icon: Mail, text: "Cek email untuk invoice pembayaran", color: "text-blue-600" },
                      { icon: FileCheck, text: "Simpan invoice sebagai bukti", color: "text-green-600" },
                      { icon: UserPlus, text: "Ajukan akun untuk aktivasi VIP", color: "text-purple-600" },
                      { icon: Zap, text: "Nikmati semua fitur premium!", color: "text-amber-600" }
                    ].map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg sm:rounded-xl"
                      >
                        <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center">
                          <step.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${step.color}`} />
                        </div>
                        <p className="text-xs sm:text-sm font-medium pt-1">{step.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* MAIN CTA: AJUKAN AKUN - FULLY RESPONSIVE */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, type: "spring" }}
                className="relative"
              >
                {/* Pulsing Glow - Hide on mobile */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="hidden sm:block absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-xl sm:rounded-2xl blur-xl"
                />
                
                <div className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center space-y-4 sm:space-y-6 shadow-2xl">
                  {/* Trophy + Crowns - Responsive */}
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="flex items-center justify-center gap-2 sm:gap-3"
                  >
                    <Crown className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-yellow-300 fill-yellow-300" />
                    <Trophy className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-white" />
                    <Crown className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-yellow-300 fill-yellow-300" />
                  </motion.div>

                  <div className="space-y-2 sm:space-y-3">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-lg px-2">
                      Aktivasi Akun VIP Sekarang!
                    </h2>
                    <p className="text-white/95 text-sm sm:text-base lg:text-lg font-semibold px-4">
                      Klik tombol di bawah untuk mengajukan akun dan mulai menikmati semua fitur premium
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="w-full h-12 sm:h-14 lg:h-16 bg-white hover:bg-gray-100 text-emerald-600 font-black text-base sm:text-lg lg:text-xl shadow-2xl border-4 border-white/50 rounded-xl"
                    >
                      <a href="/ajukan-akun" className="flex items-center justify-center gap-2 sm:gap-3">
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                        <span className="whitespace-nowrap">AJUKAN AKUN SEKARANG</span>
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                      </a>
                    </Button>
                  </motion.div>

                  <p className="text-white/90 text-xs sm:text-sm px-4">
                    📝 Isi formulir sederhana dan akun Anda akan diaktivasi dalam 1x24 jam
                  </p>
                </div>
              </motion.div>

              {/* Divider */}
              <div className="relative py-3 sm:py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-3 sm:px-4 text-xs sm:text-sm text-muted-foreground">atau</span>
                </div>
              </div>

              {/* WhatsApp Contact - RESPONSIVE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="text-center space-y-3 sm:space-y-4"
              >
                <p className="text-xs sm:text-sm text-muted-foreground font-semibold">
                  💬 Punya pertanyaan? Hubungi admin kami:
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 font-bold h-11 sm:h-12"
                >
                  <a 
                    href={`https://wa.me/6281234567890?text=Halo,%20saya%20${encodeURIComponent(firstName || paymentData?.userName || '')}%20sudah%20bayar%20VIP%20dengan%20ID:%20${externalId}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Hubungi Admin WhatsApp</span>
                  </a>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin mx-auto text-emerald-600" />
          <p className="text-sm sm:text-base text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
