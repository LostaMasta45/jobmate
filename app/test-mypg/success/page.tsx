"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import {
    Check,
    Loader2,
    Download,
    Mail,
    Receipt,
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
            <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
                <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
        );
    }

    const displayAmount = paymentData?.totalAmount || paymentData?.amount || 0;

    return (
        <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-md"
            >
                {/* Success Icon Animation */}
                <div className="flex justify-center mb-8 relative z-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                        className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30"
                    >
                        <Check className="w-10 h-10 text-white stroke-[3]" />
                    </motion.div>
                </div>

                <div className="text-center mb-8 z-10 relative">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-white mb-2"
                    >
                        Pembayaran Berhasil!
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-400"
                    >
                        Terima kasih atas pembayaran Anda.
                    </motion.p>
                </div>

                {/* Receipt Card */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-2xl relative">
                    <div className="p-8 space-y-6">
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">TOTAL PAID</p>
                            <div className="text-4xl font-black text-slate-900 tracking-tight">
                                {formatCurrency(displayAmount)}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                <div className="w-10 h-10 rounded-full bg-white border border-orange-200 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Receipt Sent</p>
                                    <p className="text-xs text-slate-500 line-clamp-1">{paymentData?.customerData?.email || 'Email sent'}</p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Order ID</span>
                                    <span className="font-mono font-medium text-slate-900 text-xs max-w-[180px] truncate">{orderId}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Payment Time</span>
                                    <span className="font-medium text-slate-900">
                                        {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Gateway</span>
                                    <span className="font-medium text-orange-600">MY PG (klikqris.com)</span>
                                </div>
                                {paymentData?.customerData?.plan && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Plan</span>
                                        <span className="font-medium text-slate-900">{paymentData.customerData.plan}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Perforated Line */}
                    <div className="relative h-px bg-slate-100 w-full flex items-center justify-between px-2">
                        <div className="w-4 h-4 rounded-full bg-[#0B0F19] -ml-4" />
                        <div className="w-full border-t-2 border-dashed border-slate-200 h-px" />
                        <div className="w-4 h-4 rounded-full bg-[#0B0F19] -mr-4" />
                    </div>

                    <div className="p-6 bg-slate-50 flex gap-3">
                        <Button onClick={() => router.push('/ajukan-akun')} className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 h-12 rounded-xl font-bold shadow-lg shadow-orange-500/10">
                            Ajukan Akun VIP
                        </Button>
                        <Button variant="outline" className="h-12 w-12 rounded-xl border-slate-200" title="Admin Dashboard" onClick={() => router.push('/test-mypg/admin')}>
                            <Receipt className="w-5 h-5 text-slate-600" />
                        </Button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm">
                        Lihat semua transaksi di <a href="/test-mypg/admin" className="text-orange-400 hover:underline">Admin Dashboard</a>
                    </p>
                </div>

            </motion.div>
        </div>
    );
}

export default function TestMYPGSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
                <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
        }>
            <MYPGSuccessContent />
        </Suspense>
    );
}
