"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    CheckCircle2,
    CreditCard,
    Loader2,
    ArrowLeft,
    Sparkles,
    Shield,
    Zap,
    Crown,
    Mail,
    User,
    Phone,
    Star,
    Check,
    Lock,
    BadgeCheck,
    Wallet
} from "lucide-react";
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
    const [focusedField, setFocusedField] = React.useState<string | null>(null);

    const planDetails = {
        basic: {
            name: 'VIP Basic',
            price: 10000,
            priceText: 'Rp 10.000',
            originalPrice: 'Rp 19.000',
            discount: '47%',
            duration: '/bulan',
            color: 'from-slate-600 to-slate-800',
            accent: 'slate'
        },
        premium: {
            name: 'VIP Premium',
            price: 39000,
            priceText: 'Rp 39.000',
            originalPrice: 'Rp 99.000',
            discount: '60%',
            duration: 'Lifetime',
            color: 'from-amber-500 to-amber-700',
            accent: 'amber'
        },
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
        setShowOverlay(true);
        setError(null);

        try {
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

            const response = await fetch('/api/payment-midtrans/create-invoice', {
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

            setTimeout(() => {
                window.location.href = data.invoiceUrl;
            }, 3000);

        } catch (err: any) {
            console.error('Payment error:', err);
            setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
            setLoading(false);
            setShowOverlay(false);
        }
    };

    const benefits = [
        "Akses semua fitur premium",
        "Update lowongan real-time",
        "Grup VIP eksklusif",
        "Support prioritas 24/7"
    ];

    return (
        <>
            <PaymentProcessingOverlay isOpen={showOverlay} gatewayName="Midtrans" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Floating Gradient Orbs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ duration: 2 }}
                        className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/30 to-orange-200/20 dark:from-amber-900/20 dark:to-orange-900/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-slate-200/40 to-slate-100/20 dark:from-slate-800/30 dark:to-slate-700/20 rounded-full blur-3xl"
                    />
                </div>

                <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12 relative z-10">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/#pricing')}
                            className="mb-6 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Pricing
                        </Button>
                    </motion.div>

                    <div className="grid lg:grid-cols-5 gap-8 items-start">
                        {/* Left Column - Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="lg:col-span-2 order-2 lg:order-1"
                        >
                            <div className="sticky top-8 space-y-6">
                                {/* Plan Card */}
                                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                                    {/* Plan Header */}
                                    <div className={`bg-gradient-to-r ${currentPlan.color} p-6 text-white relative overflow-hidden`}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                                        <div className="relative">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                                    <Crown className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm opacity-90">Paket Terpilih</p>
                                                    <h3 className="text-xl font-bold">{currentPlan.name}</h3>
                                                </div>
                                            </div>

                                            <div className="flex items-end gap-2 mt-4">
                                                <span className="text-4xl font-black">{currentPlan.priceText}</span>
                                                <span className="text-lg opacity-80 mb-1">{currentPlan.duration}</span>
                                            </div>

                                            <div className="flex items-center gap-3 mt-3">
                                                <span className="text-sm line-through opacity-60">{currentPlan.originalPrice}</span>
                                                <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                                                    HEMAT {currentPlan.discount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Benefits List */}
                                    <div className="p-6">
                                        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                                            Yang Anda Dapatkan
                                        </h4>
                                        <ul className="space-y-3">
                                            {benefits.map((benefit, index) => (
                                                <motion.li
                                                    key={index}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.3 + index * 0.1 }}
                                                    className="flex items-center gap-3 text-slate-700 dark:text-slate-300"
                                                >
                                                    <div className={`w-5 h-5 rounded-full bg-${currentPlan.accent}-100 dark:bg-${currentPlan.accent}-900/30 flex items-center justify-center flex-shrink-0`}>
                                                        <Check className={`w-3 h-3 text-${currentPlan.accent}-600 dark:text-${currentPlan.accent}-400`} />
                                                    </div>
                                                    <span className="text-sm">{benefit}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Trust Indicators */}
                                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800 p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">Pembayaran Aman</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Diproses via Midtrans • SSL 256-bit</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Methods - Compact */}
                                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800 p-5">
                                    <PaymentMethodLogos gatewayName="Midtrans" variant="compact" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column - Payment Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="lg:col-span-3 order-1 lg:order-2"
                        >
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                                {/* Form Header */}
                                <div className="border-b border-slate-100 dark:border-slate-800 p-6 md:p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                            <Wallet className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
                                                Checkout
                                            </h1>
                                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                                Lengkapi data untuk melanjutkan pembayaran
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Body */}
                                <div className="p-6 md:p-8">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <Alert variant="destructive" className="mb-6">
                                                <AlertDescription>{error}</AlertDescription>
                                            </Alert>
                                        </motion.div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Full Name Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                <User className="w-4 h-4 text-slate-400" />
                                                Nama Lengkap
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="fullName"
                                                    type="text"
                                                    placeholder="Nama lengkap sesuai KTP"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                    onFocus={() => setFocusedField('fullName')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    disabled={loading}
                                                    className={`h-14 pl-4 pr-4 text-base bg-slate-50 dark:bg-slate-800/50 border-2 rounded-xl transition-all duration-200 ${focusedField === 'fullName'
                                                        ? 'border-amber-400 ring-4 ring-amber-100 dark:ring-amber-900/30'
                                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        {/* Email Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-slate-400" />
                                                Email
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="email@example.com"
                                                    value={formData.email}
                                                    onChange={handleEmailChange}
                                                    onFocus={() => setFocusedField('email')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    disabled={loading}
                                                    className={`h-14 pl-4 pr-4 text-base bg-slate-50 dark:bg-slate-800/50 border-2 rounded-xl transition-all duration-200 ${emailError
                                                        ? 'border-red-400 ring-4 ring-red-100 dark:ring-red-900/30'
                                                        : focusedField === 'email'
                                                            ? 'border-amber-400 ring-4 ring-amber-100 dark:ring-amber-900/30'
                                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                        }`}
                                                />
                                            </div>
                                            {emailError && (
                                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                                    <span>⚠️</span> {emailError}
                                                </p>
                                            )}
                                            {emailSuggestion && (
                                                <button
                                                    type="button"
                                                    onClick={applySuggestion}
                                                    className="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 underline mt-1"
                                                >
                                                    Maksud Anda: <strong>{emailSuggestion}</strong>?
                                                </button>
                                            )}
                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                <Lock className="w-3 h-3" />
                                                Invoice akan dikirim ke email ini
                                            </p>
                                        </div>

                                        {/* WhatsApp Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="whatsapp" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-slate-400" />
                                                Nomor WhatsApp
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="whatsapp"
                                                    type="tel"
                                                    placeholder="08123456789"
                                                    value={formData.whatsapp}
                                                    onChange={handleWhatsAppChange}
                                                    onFocus={() => setFocusedField('whatsapp')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    disabled={loading}
                                                    inputMode="numeric"
                                                    className={`h-14 pl-4 pr-4 text-base bg-slate-50 dark:bg-slate-800/50 border-2 rounded-xl transition-all duration-200 ${whatsappError
                                                        ? 'border-red-400 ring-4 ring-red-100 dark:ring-red-900/30'
                                                        : focusedField === 'whatsapp'
                                                            ? 'border-amber-400 ring-4 ring-amber-100 dark:ring-amber-900/30'
                                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                        }`}
                                                />
                                            </div>
                                            {whatsappError && (
                                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                                    <span>⚠️</span> {whatsappError}
                                                </p>
                                            )}
                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                <BadgeCheck className="w-3 h-3" />
                                                Untuk konfirmasi & akses grup VIP
                                            </p>
                                        </div>

                                        {/* Order Summary Mobile */}
                                        <div className="lg:hidden bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Crown className="w-5 h-5 text-amber-500" />
                                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{currentPlan.name}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{currentPlan.priceText}</p>
                                                    <p className="text-xs text-slate-400 line-through">{currentPlan.originalPrice}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <motion.div
                                            whileHover={{ scale: loading ? 1 : 1.01 }}
                                            whileTap={{ scale: loading ? 1 : 0.99 }}
                                        >
                                            <Button
                                                type="submit"
                                                size="lg"
                                                className={`w-full h-16 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group ${loading ? 'cursor-wait' : ''
                                                    }`}
                                                disabled={loading}
                                            >
                                                {/* Shimmer effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    {loading ? (
                                                        <>
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                            <span>Memproses...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Lock className="w-5 h-5" />
                                                            <span>Bayar Sekarang</span>
                                                            <Sparkles className="w-5 h-5" />
                                                        </>
                                                    )}
                                                </span>
                                            </Button>
                                        </motion.div>

                                        {/* Security Note */}
                                        <p className="text-center text-xs text-slate-400">
                                            🔐 Transaksi aman & terenkripsi • Didukung oleh Midtrans
                                        </p>
                                    </form>
                                </div>
                            </div>

                            {/* FAQ Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="mt-8"
                            >
                                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800 p-6">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-amber-500" />
                                        Pertanyaan Umum
                                    </h3>
                                    <FAQAccordion gatewayName="Midtrans" />
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                    <p className="text-slate-500">Memuat halaman pembayaran...</p>
                </div>
            </div>
        }>
            <PaymentFormContent />
        </Suspense>
    );
}
