"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, CreditCard, Loader2, ArrowLeft, Sparkles, Shield, Zap, Crown, Mail, User, Phone } from "lucide-react";
import { TrustBanner } from "@/components/payment/TrustBanner";
import { BenefitReminder } from "@/components/payment/BenefitReminder";
import { FAQAccordion } from "@/components/payment/FAQAccordion";
import { PaymentProcessingOverlay } from "@/components/payment/PaymentProcessingOverlay";
import { PaymentMethodLogos } from "@/components/payment/PaymentMethodLogos";
import { validateEmail, validateWhatsApp, formatWhatsApp, formatWhatsAppForAPI } from "@/lib/form-validation";

function PaymentFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') as 'basic' | 'premium';

  const [loading, setLoading] = React.useState(false);
  const [showOverlay, setShowOverlay] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    email: "",
    fullName: "",
    whatsapp: "",
  });
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [emailSuggestion, setEmailSuggestion] = React.useState<string | null>(null);
  const [whatsappError, setWhatsappError] = React.useState<string | null>(null);

  const planDetails = {
    basic: { name: 'VIP Basic', price: 10000, priceText: 'Rp 10.000', duration: '/bulan' },
    premium: { name: 'VIP Premium', price: 39000, priceText: 'Rp 39.000', duration: 'Lifetime' },
  };

  const currentPlan = plan && planDetails[plan] ? planDetails[plan] : planDetails.premium;

  // Real-time validation handlers
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
    setShowOverlay(true);  // Show overlay immediately
    setError(null);

    try {
      // Validate form
      const emailValidation = validateEmail(formData.email);
      const whatsappValidation = validateWhatsApp(formData.whatsapp);
      
      if (!emailValidation.valid) {
        setError(emailValidation.error || 'Email tidak valid');
        setLoading(false);
        setShowOverlay(false);
        return;
      }
      
      if (!whatsappValidation.valid) {
        setError(whatsappValidation.error || 'Nomor WhatsApp tidak valid');
        setLoading(false);
        setShowOverlay(false);
        return;
      }

      // Create invoice via API
      const response = await fetch('/api/payment/create-invoice', {
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

      // Wait a bit for overlay animation to complete before redirect
      setTimeout(() => {
        // Redirect to Xendit payment page
        window.location.href = data.invoiceUrl;
      }, 3000);  // Match progress bar duration

    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
      setShowOverlay(false);
    }
  };

  return (
    <>
      {/* Payment Processing Overlay */}
      <PaymentProcessingOverlay isOpen={showOverlay} />

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-3xl"
        />
      </div>

      <div className="container max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/#pricing')}
            className="mb-6 hover:bg-white/50 dark:hover:bg-slate-800/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </motion.div>

        {/* NEW: Trust Banner */}
        <TrustBanner />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-2xl border-2 border-amber-200/50 dark:border-amber-900/50 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="text-center space-y-4 pb-6 relative">
              {/* Decorative Crown Icon for Premium */}
              {plan === 'premium' && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="absolute -top-6 left-1/2 -translate-x-1/2"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
              )}
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl relative"
              >
                <CreditCard className="w-10 h-10 text-white" />
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-2xl bg-amber-400 blur-xl"
                />
              </motion.div>
              
              <div className="space-y-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                    Pembayaran {currentPlan.name}
                  </CardTitle>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <CardDescription className="text-base sm:text-lg">
                    ✨ Lengkapi data untuk melanjutkan pembayaran
                  </CardDescription>
                </motion.div>
              </div>
            </CardHeader>

          <CardContent className="space-y-6 px-4 sm:px-8 pb-8">
            {/* Plan Summary with Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-amber-950/30 rounded-2xl p-6 border-2 border-amber-300/50 dark:border-amber-700/50 shadow-lg relative overflow-hidden"
            >
              {/* Sparkle decoration */}
              <div className="absolute top-2 right-2">
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Paket yang dipilih
                  </span>
                  <span className="font-bold text-lg">{currentPlan.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Durasi
                  </span>
                  <span className="font-semibold">{currentPlan.duration}</span>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t-2 border-amber-300/50 dark:border-amber-700/50">
                  <span className="font-bold text-lg">Total Pembayaran</span>
                  <motion.span
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
                  >
                    {currentPlan.priceText}
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* NEW: Benefit Reminder */}
            <BenefitReminder plan={plan || 'premium'} />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Payment Form with Animations */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <Label htmlFor="fullName" className="text-base font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-600" />
                  Nama Lengkap *
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nama lengkap sesuai KTP"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  disabled={loading}
                  className="h-12 border-2 border-amber-200 focus:border-amber-500 dark:border-amber-800 dark:focus:border-amber-600 transition-colors"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-600" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleEmailChange}
                  required
                  disabled={loading}
                  className={`h-12 border-2 transition-colors ${
                    emailError 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-amber-200 focus:border-amber-500 dark:border-amber-800 dark:focus:border-amber-600'
                  }`}
                />
                {emailError && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    ⚠️ {emailError}
                  </p>
                )}
                {emailSuggestion && (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={applySuggestion}
                    className="p-0 h-auto text-blue-600"
                  >
                    Maksud Anda: <strong>{emailSuggestion}</strong>? Klik untuk gunakan
                  </Button>
                )}
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Invoice pembayaran akan dikirim ke email ini
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-2"
              >
                <Label htmlFor="whatsapp" className="text-base font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600" />
                  Nomor WhatsApp *
                </Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="08123456789"
                  value={formData.whatsapp}
                  onChange={handleWhatsAppChange}
                  required
                  disabled={loading}
                  inputMode="numeric"
                  className={`h-12 border-2 transition-colors ${
                    whatsappError 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-amber-200 focus:border-amber-500 dark:border-amber-800 dark:focus:border-amber-600'
                  }`}
                />
                {whatsappError && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    ⚠️ {whatsappError}
                  </p>
                )}
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Untuk konfirmasi pembayaran dan akses grup VIP
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  type="submit"
                  size="lg"
                  className={`w-full h-14 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden ${
                    loading ? 'cursor-wait' : ''
                  }`}
                  disabled={loading}
                >
                  {/* Skeleton Shimmer Effect When Loading */}
                  {loading && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  )}
                  
                  {/* Button Content */}
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                        Menghubungkan ke Xendit...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6 mr-2" />
                        Lanjut ke Pembayaran
                        <Zap className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
            </motion.form>

            {/* Payment Method Logos */}
            <div className="pt-6 border-t-2 border-dashed border-amber-200 dark:border-amber-800">
              <PaymentMethodLogos />
            </div>

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col items-center gap-3 pt-6"
            >
              <div className="flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 px-6 py-3 rounded-full border border-emerald-300 dark:border-emerald-700">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span>Pembayaran aman melalui Xendit</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                🔐 Data Anda dilindungi dengan enkripsi SSL 256-bit
              </p>
            </motion.div>

            {/* NEW: FAQ Accordion */}
            <FAQAccordion />
          </CardContent>
        </Card>
        </motion.div>

        {/* NEW: FAQ Below Card (Alternative Position) */}
        {/* Uncomment if you want FAQ outside the main card */}
        {/* <FAQAccordion /> */}
      </div>
      </div>
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <PaymentFormContent />
    </Suspense>
  );
}
