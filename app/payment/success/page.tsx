"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  PartyPopper,
  Sparkles,
  Gift,
  Trophy,
  Crown,
  Mail,
  FileCheck,
  UserPlus,
  Zap,
  Star
} from "lucide-react";

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const externalId = searchParams.get('external_id');
  
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
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
      
      // Fire from left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#fbbf24', '#f59e0b', '#ea580c', '#dc2626']
      });
      
      // Fire from right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#10b981', '#059669', '#3b82f6', '#6366f1']
      });
    }, 250);
  };

  useEffect(() => {
    // Check payment status
    if (externalId) {
      fetch(`/api/payment/check-status?external_id=${externalId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setPaymentData(data.payment);
            setShowConfetti(true);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [externalId]);

  useEffect(() => {
    if (showConfetti) {
      // Fire confetti after a short delay
      setTimeout(() => {
        fireConfetti();
      }, 500);
    }
  }, [showConfetti]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-3xl"
        />
        {/* Floating Stars */}
        {[...Array(8)].map((_, i) => (
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
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`
            }}
          >
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </motion.div>
        ))}
      </div>

      <div className="container max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <Card className="shadow-2xl border-2 border-emerald-300/50 dark:border-emerald-700/50 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 overflow-hidden">
            {/* Success Header with Trophy */}
            <CardHeader className="text-center space-y-6 pb-8 pt-10 relative bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30">
              {/* Trophy Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                className="mx-auto relative"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl relative">
                  <Trophy className="w-16 h-16 text-white" />
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
                    className="absolute inset-0 rounded-full border-4 border-emerald-400"
                  />
                </div>
                {/* Floating Sparkles */}
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
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                </motion.div>
                <motion.div
                  animate={{ 
                    rotate: -360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.5
                  }}
                  className="absolute -bottom-2 -left-2"
                >
                  <PartyPopper className="w-8 h-8 text-pink-400 fill-pink-400" />
                </motion.div>
              </motion.div>

              {/* Success Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <CardTitle className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  Pembayaran Berhasil!
                </CardTitle>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="flex items-center justify-center gap-2"
                >
                  <span className="text-6xl">🎉</span>
                  <span className="text-6xl">✨</span>
                  <span className="text-6xl">🚀</span>
                </motion.div>
                <CardDescription className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                  Selamat! Anda sekarang adalah member VIP
                </CardDescription>
              </motion.div>
            </CardHeader>

          <CardContent className="space-y-8 px-6 sm:px-10 pb-10">
            {/* Payment Summary */}
            {paymentData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-2xl p-6 border-2 border-emerald-200/50 dark:border-emerald-700/50 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-lg">Detail Pembayaran</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ID Transaksi</span>
                    <span className="font-mono text-sm font-semibold">{paymentData.externalId?.slice(0, 30)}...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Paket</span>
                    <span className="font-bold text-base flex items-center gap-2 capitalize">
                      <Crown className="w-4 h-4 text-amber-500" />
                      VIP {paymentData.planType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-emerald-200 dark:border-emerald-800">
                    <span className="font-semibold">Total Dibayar</span>
                    <span className="text-2xl font-black text-emerald-600">
                      Rp {paymentData.amount?.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      LUNAS
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* EPIC Next Steps Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-6 border-2 border-blue-200/50 dark:border-blue-700/50 shadow-lg relative overflow-hidden"
            >
              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="w-6 h-6 text-blue-600" />
                  <h3 className="font-bold text-xl">Langkah Selanjutnya 🎁</h3>
                </div>
                
                <div className="grid gap-3">
                  {[
                    { icon: Mail, text: "Cek email untuk invoice pembayaran", color: "text-blue-600" },
                    { icon: FileCheck, text: "Simpan invoice sebagai bukti", color: "text-green-600" },
                    { icon: UserPlus, text: "Ajukan akun untuk aktivasi VIP", color: "text-purple-600" },
                    { icon: Zap, text: "Akses semua fitur premium!", color: "text-amber-600" }
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center">
                        <step.icon className={`w-5 h-5 ${step.color}`} />
                      </div>
                      <p className="text-sm font-medium pt-1">{step.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* EPIC CTA: AJUKAN AKUN */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, type: "spring" }}
              className="relative"
            >
              {/* Pulsing Glow Effect */}
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
                className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl blur-xl"
              />
              
              <div className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
                {/* Trophy + Crown Icon */}
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
                  className="flex items-center justify-center gap-3"
                >
                  <Crown className="w-12 h-12 text-yellow-300 fill-yellow-300" />
                  <Trophy className="w-16 h-16 text-white" />
                  <Crown className="w-12 h-12 text-yellow-300 fill-yellow-300" />
                </motion.div>

                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg">
                    Aktivasi Akun VIP Sekarang!
                  </h2>
                  <p className="text-white/90 text-lg font-semibold">
                    ⚡ Klik tombol di bawah untuk mengajukan akun dan mulai menikmati semua fitur premium
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto px-12 py-7 bg-white hover:bg-gray-100 text-emerald-600 font-black text-xl shadow-2xl border-4 border-white/50 rounded-xl"
                  >
                    <a href="/ajukan-akun" className="flex items-center gap-3">
                      <Sparkles className="w-7 h-7" />
                      AJUKAN AKUN SEKARANG
                      <ArrowRight className="w-7 h-7" />
                    </a>
                  </Button>
                </motion.div>

                <p className="text-white/80 text-sm">
                  📝 Isi formulir sederhana dan akun Anda akan diaktivasi dalam 1x24 jam
                </p>
              </div>
            </motion.div>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 text-sm text-muted-foreground">atau</span>
              </div>
            </div>

            {/* Alternative: Contact Admin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="text-center space-y-4"
            >
              <p className="text-sm text-muted-foreground font-semibold">
                💬 Punya pertanyaan? Hubungi admin:
              </p>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 font-bold"
              >
                <a 
                  href={`https://wa.me/6281234567890?text=Halo,%20saya%20sudah%20bayar%20VIP%20dengan%20ID:%20${externalId}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Hubungi Admin WhatsApp
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
