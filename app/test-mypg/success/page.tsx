"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import {
    Check,
    Loader2,
    Mail,
    Home,
    ArrowRight
} from "lucide-react";

function MYPGSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('order_id');

    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState<any>(null);

    // Load payment data
    useEffect(() => {
        if (!orderId) {
            setLoading(false);
            return;
        }

        try {
            const storedData = sessionStorage.getItem(`mypg-payment-${orderId}`);
            if (storedData) {
                const data = JSON.parse(storedData);
                setPaymentData(data);

                // Trigger confetti
                const duration = 3000;
                const end = Date.now() + duration;

                (function frame() {
                    confetti({
                        particleCount: 2,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: ['#f97316', '#eab308', '#22c55e']
                    });
                    confetti({
                        particleCount: 2,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: ['#f97316', '#eab308', '#22c55e']
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                }());
            }
            setLoading(false);
        } catch (err) {
            console.error('Error loading payment data:', err);
            setLoading(false);
        }
    }, [orderId]);

    const formatCurrency = (amount: number | string) => {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
        );
    }

    const displayAmount = paymentData?.totalAmount || paymentData?.amount || 0;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden bg-slate-950">
            {/* Premium Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-orange-600/20 blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-amber-500/10 blur-[100px] mix-blend-screen" />
                <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] mix-blend-screen" />

                {/* Subtle Grid overlay for texture */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+CjxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPgo8L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-30 block mix-blend-overlay" />
            </div>

            <motion.div
                initial={{ y: 40, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-[420px] z-10"
            >
                {/* Success Icon Animation */}
                <div className="flex justify-center mb-6 md:mb-10 relative">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-orange-600 rounded-full animate-pulse blur-xl opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-orange-600 rounded-full shadow-[0_0_40px_rgba(249,115,22,0.5)] border-[3px] md:border-4 border-slate-950 backdrop-blur-sm flex items-center justify-center z-10">
                            <Check className="w-10 h-10 md:w-12 md:h-12 text-white stroke-[3] drop-shadow-md" />
                        </div>
                    </motion.div>
                </div>

                <div className="text-center mb-8 md:mb-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-3xl md:text-4xl font-extrabold text-white mb-2 md:mb-3 tracking-tight"
                    >
                        Pembayaran Berhasil
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-slate-300 text-[14px] md:text-[15px] font-medium px-4"
                    >
                        Terima kasih, transaksi Anda telah selesai.
                    </motion.p>
                </div>

                {/* Premium Receipt Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="relative"
                >
                    {/* Glow behind card */}
                    <div className="absolute -inset-1 bg-gradient-to-b from-white/20 to-white/0 rounded-[32px] blur-md opacity-50" />

                    <div className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl relative block w-full z-10">
                        {/* Top Section */}
                        <div className="p-6 md:p-8 pt-8 md:pt-10 pb-6 md:pb-8 bg-white relative">
                            {/* Watermark pattern */}
                            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-[radial-gradient(circle,rgba(249,115,22,0.05)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none rounded-bl-full" />

                            <div className="text-center relative z-10">
                                <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 md:mb-3">Total Pembayaran</p>
                                <div className="text-4xl md:text-[42px] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 drop-shadow-sm leading-none">
                                    {formatCurrency(displayAmount)}
                                </div>
                            </div>
                        </div>

                        {/* Perforated Divider */}
                        <div className="relative h-px w-full flex items-center justify-between px-0 bg-white">
                            {/* Left cutout */}
                            <div className="absolute left-[-16px] w-8 h-8 rounded-full bg-slate-950 border-r border-white/10 shadow-inner z-20" />

                            {/* Dashed line */}
                            <div className="w-full mx-6 border-t-[2.5px] border-dashed border-slate-200" />

                            {/* Right cutout */}
                            <div className="absolute right-[-16px] w-8 h-8 rounded-full bg-slate-950 border-l border-white/10 shadow-inner z-20" />
                        </div>

                        {/* Middle Section - Details */}
                        <div className="p-5 md:p-8 bg-slate-50/80 backdrop-blur-sm relative border-b border-slate-100">
                            <div className="space-y-4">
                                {/* Email Sent Badge */}
                                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-sm transition-transform hover:scale-[1.02] duration-300">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800">Struk Terkirim</p>
                                        <p className="text-xs font-medium text-slate-500 truncate">{paymentData?.customerData?.email || paymentData?.email || 'Email sent'}</p>
                                    </div>
                                </div>

                                {/* Transaction Information Table */}
                                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5 shadow-sm">
                                    <div className="flex justify-between items-center text-[13px]">
                                        <span className="text-slate-500 font-medium">Order ID</span>
                                        <span className="font-mono font-bold text-slate-800 bg-slate-100/80 px-2 py-1 rounded-md">{orderId}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[13px]">
                                        <span className="text-slate-500 font-medium">Paket</span>
                                        <span className="font-bold text-amber-600 uppercase tracking-wide bg-amber-50 px-2 py-1 rounded-md">{paymentData?.customerData?.plan || paymentData?.plan || 'VIP Membership'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[13px]">
                                        <span className="text-slate-500 font-medium">WhatsApp</span>
                                        <span className="font-bold text-slate-800 truncate pl-4">{paymentData?.customerData?.whatsapp || paymentData?.whatsapp || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[13px] pt-3 mt-1 border-t border-dashed border-slate-200">
                                        <span className="text-slate-500 font-medium">Waktu</span>
                                        <span className="font-bold text-slate-800">
                                            {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section - CTAs */}
                        <div className="p-5 md:p-8 bg-white flex flex-col items-center">
                            <div className="w-full flex gap-3 mb-5 md:mb-6">
                                <Button onClick={() => router.push('/')} variant="outline" className="w-[48px] h-[48px] md:w-[52px] md:h-[52px] rounded-xl md:rounded-2xl border-slate-200 hover:bg-slate-50 transition-colors shadow-sm focus:ring-2 focus:ring-amber-500/20" title="Beranda">
                                    <Home className="w-5 h-5 text-slate-600" />
                                </Button>
                                <Button onClick={() => router.push('/ajukan-akun')} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white h-[48px] md:h-[52px] rounded-xl md:rounded-2xl font-bold shadow-[0_8px_20px_-6px_rgba(249,115,22,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(249,115,22,0.5)] transition-all flex items-center justify-center gap-2 text-[14px] md:text-[15px]">
                                    Ajukan Akun VIP <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>

                            <div className="text-center relative bg-orange-50/50 p-4 rounded-xl border border-orange-100/50 w-full">
                                <p className="text-[12px] font-bold text-orange-600/80 uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                    Langkah Terakhir
                                </p>
                                <p className="text-[13px] font-medium text-slate-700 leading-relaxed">
                                    Klik tombol <span className="font-bold text-orange-600">Ajukan Akun VIP</span> lalu daftarkan diri Anda dengan email yang sama. Status VIP Anda akan otomatis aktif.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function TestMYPGSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
        }>
            <MYPGSuccessContent />
        </Suspense>
    );
}
