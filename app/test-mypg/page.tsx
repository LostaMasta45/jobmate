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
    Sparkles,
    TestTube2,
    Check
} from "lucide-react";
import { validateEmail, validateWhatsApp, formatWhatsApp, formatWhatsAppForAPI } from "@/lib/form-validation";

// --- Components ---

function PremiumInput({ icon: Icon, ...props }: any) {
    return (
        <div className="relative group">
            <div className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-orange-600 transition-colors duration-300">
                <Icon className="w-5 h-5" />
            </div>
            <Input
                {...props}
                className={`pl-11 h-12 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 rounded-xl ${props.className}`}
            />
        </div>
    );
}

function JobMateLogo() {
    return (
        <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl shadow-lg shadow-orange-500/30 text-white">
                <BriefcaseIcon className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-bold text-2xl tracking-tighter text-slate-900 dark:text-white">
                JOB<span className="text-orange-600">MATE</span>
            </span>
        </div>
    );
}

const BriefcaseIcon = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
)

function TestMYPGFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planParam = searchParams.get('plan') as 'test' | 'basic' | 'premium';

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
    const [selectedPlan, setSelectedPlan] = React.useState<'test' | 'basic' | 'premium'>(planParam || 'premium');
    const [isHovered, setIsHovered] = React.useState(false);

    // --- Plan Details Configuration ---
    const planDetails = {
        test: {
            id: 'test',
            name: 'Tester Mode',
            tagline: 'Mode testing untuk developer',
            price: 1000,
            priceText: 'Rp 1.000',
            originalPrice: null,
            saveAmount: null,
            discount: null,
            duration: 'Test Only',
            features: ['Test Payment Flow', 'Verify API Connection'],
            color: 'from-orange-500 to-amber-500',
            icon: TestTube2,
        },
        basic: {
            id: 'basic',
            name: 'VIP Basic',
            tagline: 'Mulai karirmu lebih cepat',
            price: 10000,
            priceText: 'Rp 10.000',
            originalPrice: 'Rp 19.000',
            saveAmount: 'Hemat 9rb',
            discount: '47%',
            duration: 'Per Bulan',
            features: ['Akses Dasar JobMate', 'Support Standar Email', 'Update Lowongan Harian'],
            color: 'from-blue-600 to-cyan-600',
            icon: Zap,
        },
        premium: {
            id: 'premium',
            name: 'Pro VIP',
            tagline: 'Investasi terbaik masa depan',
            price: 39000,
            priceText: 'Rp 39.000',
            originalPrice: 'Rp 99.000',
            saveAmount: 'Hemat 60rb',
            discount: '60%',
            duration: 'Lifetime',
            features: ['Akses Selamanya', 'Prioritas Support 24/7', 'Fitur Eksklusif'],
            color: 'from-orange-600 to-amber-600',
            icon: Crown,
        },
    };

    const currentPlan = planDetails[selectedPlan];
    const PlanIcon = currentPlan.icon;

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
            if (!validation.valid) setWhatsappError(validation.error || null);
            else setWhatsappError(null);
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

            const response = await fetch('/api/mypg/create-invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan: selectedPlan,
                    email: formData.email,
                    fullName: formData.fullName,
                    whatsapp: formatWhatsAppForAPI(formData.whatsapp),
                }),
            });

            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message || 'Gagal membuat invoice');

            sessionStorage.setItem(`mypg-payment-${data.orderId}`, JSON.stringify(data));
            router.push(`/test-mypg/pay?order_id=${data.orderId}`);

        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans selection:bg-orange-500/30 selection:text-orange-900 dark:selection:text-orange-100">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-200/20 dark:bg-orange-900/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-200/20 dark:bg-amber-900/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent opacity-50" />
            </div>

            <div className="relative min-h-screen flex items-center justify-center p-4 lg:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0 bg-white dark:bg-[#111625] rounded-[32px] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden border border-white/50 dark:border-slate-800/50 backdrop-blur-3xl"
                >
                    {/* LEFT SIDE: Visuals */}
                    <div className="lg:col-span-5 relative p-8 lg:p-12 flex flex-col justify-between overflow-hidden group">
                        {/* Dynamic Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${currentPlan.color} opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.06] transition-opacity duration-700`} />

                        <div className="relative z-10">
                            {/* Logo */}
                            <div className="mb-10">
                                <JobMateLogo />
                            </div>

                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold tracking-wider text-orange-600 dark:text-orange-400 uppercase">
                                        Secure Payment
                                    </h3>
                                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                                        Unlock Your <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Career Potential</span>
                                    </h1>
                                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mt-4">
                                        Bergabung dengan ribuan profesional yang telah sukses mendapatkan pekerjaan impian.
                                    </p>
                                </div>

                                {/* Current Plan Visual */}
                                <div className="relative mt-8 group cursor-default">
                                    <div className={`absolute -inset-1 bg-gradient-to-r ${currentPlan.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`} />
                                    <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentPlan.color} flex items-center justify-center text-white shadow-lg`}>
                                                <PlanIcon className="w-6 h-6" />
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
                                    100% Secure
                                </div>
                                <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                                <div className="flex items-center gap-1.5">
                                    <Lock className="w-4 h-4 text-emerald-500" />
                                    256-bit Encrypted
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Form */}
                    <div className="lg:col-span-7 bg-white dark:bg-[#111625] p-8 lg:p-12 relative flex flex-col justify-center">
                        <div className="absolute top-0 left-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800 hidden lg:block" />

                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>

                            {/* Plan Switcher */}
                            <div className="flex sm:hidden overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
                                {Object.values(planDetails).map((p: any) => (
                                    <Badge
                                        key={p.id}
                                        variant={selectedPlan === p.id ? "default" : "outline"}
                                        onClick={() => setSelectedPlan(p.id)}
                                        className="cursor-pointer shrink-0"
                                    >
                                        {p.name}
                                    </Badge>
                                ))}
                            </div>

                            {/* Plan Tabs Deskstop */}
                            <div className="hidden sm:grid grid-cols-3 gap-3 mb-8 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
                                {Object.values(planDetails).map((p: any) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedPlan(p.id)}
                                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${selectedPlan === p.id
                                                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-end justify-between mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium mb-1">Total Tagihan</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{currentPlan.priceText}</span>
                                        {currentPlan.originalPrice && (
                                            <span className="text-lg text-slate-400 line-through decoration-slate-300 dark:decoration-slate-700">{currentPlan.originalPrice}</span>
                                        )}
                                    </div>
                                    {currentPlan.saveAmount && (
                                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded w-fit">
                                            {currentPlan.saveAmount}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-slate-500 mb-1">Paket Dipilih</p>
                                    <div className="flex items-center justify-end gap-2">
                                        <Crown className="w-4 h-4 text-orange-500" />
                                        <p className="font-semibold text-slate-900 dark:text-white">{currentPlan.name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Warning Banner */}
                            <div className="mb-8 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 flex gap-3">
                                <Sparkles className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-orange-800 dark:text-orange-200 leading-snug">
                                    <strong>MY PG Gateway:</strong> Pembayaran instan via QRIS (Gopay/OVO/Dana/BCA/dll). Otomatis verifikasi.
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Nama Lengkap</Label>
                                        <PremiumInput
                                            icon={User}
                                            placeholder="Nama Anda"
                                            value={formData.fullName}
                                            onChange={(e: any) => setFormData({ ...formData, fullName: e.target.value })}
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</Label>
                                        <PremiumInput
                                            icon={Mail}
                                            type="email"
                                            placeholder="email@anda.com"
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
                                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">WhatsApp</Label>
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
                                    {error && (
                                        <Alert variant="destructive" className="mb-4">
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className={`w-full h-14 rounded-xl text-base font-bold shadow-lg shadow-orange-500/20 transition-all duration-300 ${loading ? 'opacity-80 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
                                            } bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700`}
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
                                                <span>Bayar dengan QRIS</span>
                                                <div className={`w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                                </div>
                                            </div>
                                        )}
                                    </Button>
                                    <p className="text-center text-xs text-slate-400 mt-4 px-8 leading-normal">
                                        Transaksi diproses otomatis oleh sistem. Akses premium akan aktif instan setelah pembayaran berhasil.
                                    </p>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function TestMYPGPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B0F19]">
                <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
            </div>
        }>
            <TestMYPGFormContent />
        </Suspense>
    );
}
