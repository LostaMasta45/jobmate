"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    CheckCircle2,
    Clock,
    Shield,
    ArrowLeft,
    RefreshCw,
    Smartphone,
    Download,
    Share2,
    MoreHorizontal,
    QrCode
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface PaymentData {
    orderId: string;
    amount: number;
    totalAmount: string;
    qrisImage: string;
    qrisUrl: string;
    directUrl: string;
    expiredAt: string;
    customerData: {
        email: string;
        fullName: string;
        whatsapp: string;
        plan: string;
    };
}

function MYPGPaymentDisplayContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isPaid, setIsPaid] = useState(false);

    // Polling state
    const [lastChecked, setLastChecked] = useState<Date>(new Date());
    const [isPolling, setIsPolling] = useState(false);

    // Initial load
    useEffect(() => {
        if (!orderId) {
            setError('Order ID tidak ditemukan');
            setLoading(false);
            return;
        }

        try {
            const storedData = sessionStorage.getItem(`mypg-payment-${orderId}`);
            if (storedData) {
                const data = JSON.parse(storedData);
                setPaymentData(data);
                setLoading(false);

                // Calculate time left (30 minutes default)
                if (data.expiredAt) {
                    const expiredTime = new Date(data.expiredAt).getTime();
                    const now = Date.now();
                    const diff = Math.floor((expiredTime - now) / 1000);
                    setTimeLeft(Math.max(0, diff));
                } else {
                    setTimeLeft(30 * 60); // 30 minutes default
                }
            } else {
                // If not found in session, try to fetch status to see if it exists
                fetch(`/api/mypg/check-status?order_id=${orderId}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && data.transaction) {
                            // Reconstruct partial payment data from transaction
                            const newData: PaymentData = {
                                orderId: data.transaction.order_id,
                                amount: parseInt(data.transaction.amount),
                                totalAmount: data.transaction.amount,
                                qrisImage: data.transaction.qris_image || '', // Might be missing if not stored
                                qrisUrl: data.transaction.qris_url || '',
                                directUrl: '',
                                expiredAt: data.transaction.expired_at || new Date(Date.now() + 30 * 60000).toISOString(),
                                customerData: {
                                    email: data.transaction.email || 'Unknown',
                                    fullName: 'Customer',
                                    whatsapp: '',
                                    plan: 'Unknown'
                                }
                            };
                            setPaymentData(newData);
                            setLoading(false);

                            if (data.status === 'SUCCESS' || data.status === 'PAID') {
                                setIsPaid(true);
                                setTimeout(() => router.push(`/test-mypg/success?order_id=${orderId}`), 1500);
                            }
                        } else {
                            setError('Data pembayaran tidak ditemukan. Silakan buat pembayaran baru.');
                            setLoading(false);
                        }
                    })
                    .catch(err => {
                        setError('Gagal memuat data pembayaran');
                        setLoading(false);
                    });
            }
        } catch (err) {
            console.error('Error loading payment data:', err);
            setError('Gagal memuat data pembayaran');
            setLoading(false);
        }
    }, [orderId, router]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Auto check function
    const checkPaymentStatus = async (isManual = false) => {
        if (!orderId || isPaid) return;

        if (isManual) setIsPolling(true);

        try {
            const response = await fetch(`/api/mypg/check-status?order_id=${orderId}`);
            const data = await response.json();

            setLastChecked(new Date());

            if (data.success && (data.status === 'SUCCESS' || data.status === 'PAID')) {
                setIsPaid(true);
                if (isManual) toast.success("Pembayaran Berhasil!");

                // Navigate to success
                router.push(`/test-mypg/success?order_id=${orderId}`);
            } else if (isManual) {
                toast.info("Pembayaran belum terdeteksi. Silakan coba sesaat lagi.");
            }
        } catch (err) {
            console.error('Error checking payment status:', err);
            if (isManual) toast.error("Gagal mengecek status");
        } finally {
            if (isManual) setIsPolling(false);
        }
    };

    // Polling interval (Every 5 seconds)
    useEffect(() => {
        if (!orderId || isPaid) return; // FIXED: Removed timeLeft check to prevent re-creation loop

        const interval = setInterval(() => {
            checkPaymentStatus(false);
        }, 5000); // 5 detik

        return () => clearInterval(interval);
    }, [orderId, isPaid]); // FIXED: Removed timeLeft dependency

    // Format helpers
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

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
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                    <p className="text-slate-400 font-medium animate-pulse">Memuat Data Pembayaran...</p>
                </div>
            </div>
        );
    }

    if (error || !paymentData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] p-4">
                <div className="max-w-md w-full bg-[#151b2d] border border-red-900/50 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto ring-4 ring-red-500/5">
                        <Shield className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Sesi Tidak Valid</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">{error || 'Data pembayaran tidak ditemukan.'}</p>
                    </div>
                    <Button onClick={() => router.push('/test-mypg')} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium">
                        Kembali ke Halaman Utama
                    </Button>
                </div>
            </div>
        );
    }

    const isExpired = timeLeft <= 0;
    const displayAmount = paymentData.totalAmount || paymentData.amount;

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans selection:bg-orange-500/30">
            {/* Header / Navbar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2" onClick={() => router.push('/test-mypg')}>
                        <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
                            <span className="font-black text-white text-xs">MY</span>
                        </div>
                        <span className="font-bold text-lg hidden sm:block">Payment Gateway</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Order ID</p>
                            <p className="text-xs font-mono font-medium">{orderId}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.push('/test-mypg')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="pt-24 pb-12 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* LEFT COLUMN: Payment Instructions & Details */}
                    <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">

                        {/* Timer Card */}
                        <div className="bg-white dark:bg-[#151b2d] rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Sisa Waktu</p>
                                <div className="text-3xl font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Clock className="w-6 h-6 text-orange-500 animate-pulse" />
                                    {formatTime(timeLeft)}
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                                <span className="text-xl">⏳</span>
                            </div>
                        </div>

                        {/* Amount Card */}
                        <div className="bg-white dark:bg-[#151b2d] rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Pembayaran</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-bold text-slate-500">Rp</span>
                                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {new Intl.NumberFormat('id-ID').format(typeof displayAmount === 'string' ? parseFloat(displayAmount) : displayAmount)}
                                    </span>
                                </div>
                                <div className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-900/20 inline-block">
                                    ⚠ Mohon transfer Sesuai nominal persis (termasuk 3 digit terakhir)
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Merchant</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">infolokerjombang</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Item</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{paymentData.customerData.plan}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Customer</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{paymentData.customerData.fullName}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Steps */}
                        <div className="bg-white dark:bg-[#151b2d] rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-slate-500" />
                                Cara Pembayaran
                            </h3>
                            <div className="space-y-4 relative">
                                <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-slate-200 dark:bg-slate-700" />

                                {[
                                    { text: "Buka aplikasi e-wallet (Gopay, OVO, Dana, LinkAja, ShopeePay) atau Mobile Banking (BCA, Mandiri, dll)" },
                                    { text: "Pilih menu 'Scan QRIS' atau 'Bayar'" },
                                    { text: "Arahkan kamera ke QR Code di samping kanan" },
                                    { text: "Periksa nama merchant 'KlikQRIS' atau 'JOBMATE' dan nominal" },
                                    { text: "Masukkan PIN anda dan pembaayaran selesai" }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-4 relative">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400 flex-shrink-0 z-10">
                                            {idx + 1}
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug pt-0.5">{step.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: The Authentic QRIS */}
                    <div className="lg:col-span-7 flex flex-col items-center order-1 lg:order-2">

                        {/* AUTHENTIC QRIS CARD */}
                        <div className="bg-white rounded-[20px] shadow-2xl overflow-hidden w-full max-w-[380px] border-2 border-slate-200 relative transform transition-transform hover:scale-[1.01] duration-300">

                            {/* QRIS Header Standar Nasional */}
                            <div className="bg-white p-6 pb-2 relative">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="relative w-24 h-12">
                                        {/* QRIS Logo Vector Replacement */}
                                        <svg viewBox="0 0 200 65" className="w-full h-full text-slate-900" fill="currentColor">
                                            <path d="M22.5,41.2c-5.8,0-10.8-3.4-13-8.3c-0.2-0.5-0.4-1-0.5-1.5c-1-2.9-1.5-6-1.5-9.3c0-3.3,0.5-6.5,1.5-9.4 c0.2-0.5,0.4-1,0.5-1.5c2.2-4.9,7.2-8.3,13-8.3c5.8,0,10.8,3.4,13,8.3c0.2,0.5,0.4,1,0.5,1.5c1,2.9,1.5,6,1.5,9.4 c0,3.3-0.5,6.5-1.5,9.3c-0.2,0.5-0.4,1-0.6,1.5C33.3,37.8,28.3,41.2,22.5,41.2z M22.5,9.9c-2.9,0-5.5,1.3-7.2,3.4 c-0.6,0.7-1.1,1.5-1.5,2.4C13.2,17.4,13,19.7,13,22.1c0,2.4,0.3,4.7,0.8,6.4c0.4,0.9,0.9,1.7,1.5,2.4c1.7,2.1,4.4,3.4,7.2,3.4 s5.5-1.3,7.2-3.4c0.6-0.7,1.1-1.5,1.5-2.4c0.5-1.7,0.8-4,0.8-6.4c0-2.4-0.3-4.7-0.8-6.4c-0.4-0.9-0.9-1.7-1.5-2.4 C28,11.2,25.4,9.9,22.5,9.9z" fill="#ED1C24" />
                                            <path d="M51,40h-6V4h6V40z M60,4h17v6H66v5h11v6H66v7h11v6H60V4z M83,4h6v36h-6V4z M100,26.5L100,26.5 c4.8-1,7-4.1,7-9.5c0-7.2-4.1-13-13-13h-12v36h6v-11h5.8l6.8,11h7.4L100,26.5z M94,22h-6v-12h6c5.2,0,7,2,7,6S99.2,22,94,22z" />
                                        </svg>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-slate-800 text-lg">QRIS</div>
                                        <div className="text-[10px] text-slate-500 font-medium">LinkAja, Gopay, OVO, Dana, ShopeePay</div>
                                    </div>
                                </div>
                                <div className="text-center border-b border-dashed border-slate-300 pb-4">
                                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{paymentData.customerData.plan}</h2>
                                    <p className="text-sm text-slate-500 font-medium">NMID: {paymentData.orderId.substring(0, 15)}</p>
                                </div>
                            </div>

                            {/* QR Pattern Sides */}
                            <div className="absolute top-[108px] left-0 right-0 h-4 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Qris_logo.svg/1200px-Qris_logo.svg.png')] bg-repeat-x opacity-10 hidden" />

                            {/* QR Code Area */}
                            <div className="p-8 bg-white flex flex-col items-center justify-center relative">

                                {/* Scanning Line Animation */}
                                {!isExpired && !isPaid && (
                                    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-b-[20px]">
                                        <motion.div
                                            className="w-full h-[2px] bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                                            animate={{ top: ["10%", "90%", "10%"] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        />
                                    </div>
                                )}

                                {paymentData.qrisImage ? (
                                    <div className="relative group">
                                        <img
                                            src={paymentData.qrisImage}
                                            alt="QRIS"
                                            className={`w-64 h-64 object-contain mix-blend-multiply ${isExpired ? 'opacity-20 grayscale' : ''}`}
                                        />
                                        {/* Center Logo */}
                                        {!isExpired && (
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-lg p-1 shadow-sm">
                                                <div className="w-full h-full bg-orange-600 rounded flex items-center justify-center text-white font-bold text-xs">
                                                    MY
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-64 h-64 bg-slate-100 flex items-center justify-center rounded-xl border-2 border-dashed border-slate-300">
                                        <QrCode className="w-12 h-12 text-slate-300" />
                                    </div>
                                )}

                                {isExpired && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
                                            <Shield className="w-8 h-8 text-red-500" />
                                        </div>
                                        <p className="font-bold text-slate-900">QR Code Expired</p>
                                        <p className="text-xs text-slate-500">Silakan request ulang</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="bg-slate-50 px-6 py-4 flex flex-col gap-3 border-t border-slate-100">
                                <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                                    <span>Dicetak oleh: KlikQRIS</span>
                                    <span>v2.0</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Check & Polling Indicator */}
                        <div className="mt-8 text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
                                <span className={`w-2 h-2 rounded-full ${isPolling ? 'bg-orange-500 animate-ping' : 'bg-slate-300'}`} />
                                {isPolling ? (
                                    <span>Mengecek pembayaran manual...</span>
                                ) : (
                                    <span>Auto-check aktif (tiap 5 detik)</span>
                                )}
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => checkPaymentStatus(true)}
                                disabled={isPolling || isExpired}
                                className="rounded-full px-8 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#151b2d] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all font-medium"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isPolling ? 'animate-spin' : ''}`} />
                                Cek Status Manual
                            </Button>

                            <p className="text-[10px] text-slate-400">
                                Terakhir dicek: {lastChecked.toLocaleTimeString()}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TestMYPGPayPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
                <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
            </div>
        }>
            <MYPGPaymentDisplayContent />
        </Suspense>
    );
}
