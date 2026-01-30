"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Shield,
  Zap,
  Crown,
  Mail,
  User,
  Phone,
  Lock,
  CreditCard,
  Building2,
  Sparkles
} from "lucide-react";
import { validateEmail, validateWhatsApp, formatWhatsApp, formatWhatsAppForAPI } from "@/lib/form-validation";

// --- Components ---

function PremiumInput({ icon: Icon, ...props }: any) {
  return (
    <div className="relative group">
      <div className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-purple-600 transition-colors duration-300">
        <Icon className="w-5 h-5" />
      </div>
      <Input
        {...props}
        className={`pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 rounded-xl ${props.className}`}
      />
    </div>
  );
}

function TestPaymentFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') as 'basic' | 'premium';

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    email: "",
    fullName: "",
    whatsapp: "",
  });
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [emailSuggestion, setEmailSuggestion] = React.useState<string | null>(null);
  const [whatsappError, setWhatsappError] = React.useState<string | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  // --- Plan Details Configuration ---
  const planDetails = {
    basic: {
      name: 'VIP Basic',
      tagline: 'Mulai karirmu dengan lebih cepat',
      price: 10000,
      priceText: 'Rp 10.000',
      originalPrice: 'Rp 19.000',
      saveAmount: 'Hemat Rp 9.000',
      discount: '47%',
      duration: 'Per Bulan',
      features: ['Akses Dasar ke JobMate', 'Support Standar via Email', 'Update Lowongan Harian'],
      color: 'from-blue-600 to-cyan-600',
      shadow: 'shadow-blue-500/20'
    },
    premium: {
      name: 'VIP Premium',
      tagline: 'Investasi terbaik untuk masa depanmu',
      price: 39000,
      priceText: 'Rp 39.000',
      originalPrice: 'Rp 99.000',
      saveAmount: 'Hemat Rp 60.000',
      discount: '60%',
      duration: 'Akses Selamanya',
      features: ['Akses Selamanya (Lifetime)', 'Prioritas Support 24/7', 'Akses Fitur Beta & Eksklusif', 'Konsultasi CV Gratis'],
      color: 'from-purple-600 via-violet-600 to-indigo-600',
      shadow: 'shadow-purple-500/20'
    },
  };

  const currentPlan = plan && planDetails[plan] ? planDetails[plan] : planDetails.premium;

  // --- Validation Logic ---
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, email });

    if (email) {
      const validation = validateEmail(email);
      if (!validation.valid) {
        setEmailError(validation.error || null);
        setEmailSuggestion(validation.suggestion || null);
      } else {
        setEmailError(null);
        setEmailSuggestion(null);
      }
    } else {
      setEmailError(null);
      setEmailSuggestion(null);
    }
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    const formatted = formatWhatsApp(phone);
    setFormData({ ...formData, whatsapp: formatted });

    if (phone) {
      const validation = validateWhatsApp(phone);
      if (!validation.valid) {
        setWhatsappError(validation.error || null);
      } else {
        setWhatsappError(null);
      }
    } else {
      setWhatsappError(null);
    }
  };

  const applySuggestion = () => {
    if (emailSuggestion) {
      setFormData({ ...formData, email: emailSuggestion });
      setEmailError(null);
      setEmailSuggestion(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const emailValidation = validateEmail(formData.email);
      const whatsappValidation = validateWhatsApp(formData.whatsapp);

      if (!emailValidation.valid) {
        setError(emailValidation.error || 'Email tidak valid');
        setLoading(false);
        return;
      }

      if (!whatsappValidation.valid) {
        setError(whatsappValidation.error || 'Nomor WhatsApp tidak valid');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/test-payment/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan || 'premium',
          email: formData.email,
          fullName: formData.fullName,
          whatsapp: formatWhatsAppForAPI(formData.whatsapp),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Gagal membuat invoice');
      }

      sessionStorage.setItem(`payment-${data.orderId}`, JSON.stringify(data));
      sessionStorage.setItem('last-payment-order-id', data.orderId);

      router.push(`/test-payment/pay?order_id=${data.orderId}`);

    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans selection:bg-purple-500/30 selection:text-purple-900 dark:selection:text-purple-100">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-200/20 dark:bg-purple-900/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-200/20 dark:bg-blue-900/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent opacity-50" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0 bg-white dark:bg-[#111625] rounded-[32px] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden border border-white/50 dark:border-slate-800/50 backdrop-blur-3xl"
        >
          {/* LEFT SIDE: Product Visual & Details */}
          <div className="lg:col-span-5 relative p-8 lg:p-12 flex flex-col justify-between overflow-hidden group">
            {/* Dynamic Background for Left Panel */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentPlan.color} opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.06] transition-opacity duration-700`} />

            <div className="relative z-10">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 dark:bg-white/10 backdrop-blur-md border border-slate-900/5 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-8 cursor-pointer hover:bg-slate-900/10 transition-colors"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Beranda
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold tracking-wider text-purple-600 dark:text-purple-400 uppercase">Secure Checkout</h3>
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                    VIP Access <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">.</span>
                  </h1>
                  <p className="text-lg text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                    {currentPlan.tagline}. Tingkatkan peluang karirmu sekarang.
                  </p>
                </div>

                {/* Plan Card (Visual) */}
                <div className="relative mt-8 group cursor-default">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${currentPlan.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`} />
                  <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentPlan.color} flex items-center justify-center text-white shadow-lg`}>
                        {plan === 'basic' ? <Zap className="w-6 h-6" /> : <Crown className="w-6 h-6" />}
                      </div>
                      <Badge className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 border-0 px-3 py-1 text-xs font-bold tracking-wide uppercase">
                        {currentPlan.name}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      {currentPlan.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                          <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                          </div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="relative z-10 mt-12 space-y-4">
              <div className="flex items-center gap-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Review 100% Aman
                </div>
                <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  Enkripsi 256-bit
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Payment Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#111625] p-8 lg:p-12 relative">
            <div className="absolute top-0 left-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800 hidden lg:block" />

            <div className="max-w-md mx-auto h-full flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-end justify-between mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Total Pembayaran</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{currentPlan.priceText}</span>
                      <span className="text-lg text-slate-400 line-through decoration-slate-300 dark:decoration-slate-700">{currentPlan.originalPrice}</span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded w-fit">
                      {currentPlan.saveAmount}
                    </p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-500 mb-1">Paket</p>
                    <p className="font-semibold text-slate-900 dark:text-white capitalize">{currentPlan.duration}</p>
                  </div>
                </div>

                {/* Warning Banner */}
                <div className="mb-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 flex gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Test Mode:</strong> Tidak ada pembayaran asli yang diproses. Gunakan data dummy untuk mencoba alur pembayaran.
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="mb-6 animate-shake">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Nama Lengkap</Label>
                      <PremiumInput
                        icon={User}
                        placeholder="Contoh: Budi Santoso"
                        value={formData.fullName}
                        onChange={(e: any) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Alamat Email</Label>
                      <PremiumInput
                        icon={Mail}
                        type="email"
                        placeholder="budi@example.com"
                        value={formData.email}
                        onChange={handleEmailChange}
                        required
                        disabled={loading}
                        className={emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
                      />
                      {emailError && <p className="text-xs font-medium text-red-500 ml-1">{emailError}</p>}
                      {emailSuggestion && (
                        <div className="ml-1 text-xs">
                          <span className="text-slate-500">Maksud anda </span>
                          <button type="button" onClick={applySuggestion} className="font-bold text-blue-600 hover:underline">{emailSuggestion}</button>
                          <span className="text-slate-500">?</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Nomor WhatsApp</Label>
                      <PremiumInput
                        icon={Phone}
                        type="tel"
                        placeholder="0812xxxx"
                        value={formData.whatsapp}
                        onChange={handleWhatsAppChange}
                        required
                        disabled={loading}
                        className={whatsappError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
                      />
                      {whatsappError && <p className="text-xs font-medium text-red-500 ml-1">{whatsappError}</p>}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className={`w-full h-14 rounded-xl text-base font-bold shadow-lg shadow-purple-500/20 transition-all duration-300 ${loading ? 'opacity-80 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
                        } bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100`}
                      disabled={loading}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Memproses...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full px-2">
                          <span>Lanjut ke Pembayaran</span>
                          <div className={`w-8 h-8 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                          </div>
                        </div>
                      )}
                    </Button>
                    <p className="text-center text-xs text-slate-400 mt-4">
                      Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan kami.
                    </p>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function TestPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B0F19]">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    }>
      <TestPaymentFormContent />
    </Suspense>
  );
}
