"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    CheckCircle2,
    Clock,
    Shield,
    ArrowLeft,
    RefreshCw,
    Zap,
    Smartphone,
} from "lucide-react";

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
    const amount = searchParams.get('amount');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [checkingStatus, setCheckingStatus] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    // Load payment data from sessionStorage
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
                setError('Data pembayaran tidak ditemukan. Silakan buat pembayaran baru.');
                setLoading(false);
            }
        } catch (err) {
            console.error('Error loading payment data:', err);
            setError('Gagal memuat data pembayaran');
            setLoading(false);
        }
    }, [orderId]);

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

    // Auto check payment status every 5 seconds
    useEffect(() => {
        if (!orderId || isPaid) return;

        const checkStatus = async () => {
            try {
                const response = await fetch(`/api/mypg/check-status?order_id=${orderId}`);
                const data = await response.json();

                if (data.success && (data.status === 'SUCCESS' || data.status === 'PAID')) {
                    setIsPaid(true);
                    router.push(`/test-mypg/success?order_id=${orderId}`);
                }
            } catch (err) {
                console.error('Error checking payment status:', err);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 5000);
        return () => clearInterval(interval);
    }, [orderId, isPaid, router]);

    // Manual check status
    const handleCheckStatus = async () => {
        if (!orderId) return;

        setCheckingStatus(true);
        try {
            const response = await fetch(`/api/mypg/check-status?order_id=${orderId}`);
            const data = await response.json();

            if (data.success) {
                if (data.status === 'SUCCESS' || data.status === 'PAID') {
                    router.push(`/test-mypg/success?order_id=${orderId}`);
                } else {
                    alert(`Status: ${data.status}\nBelum dibayar. Silakan selesaikan pembayaran.`);
                }
            } else {
                alert('Gagal mengecek status pembayaran');
            }
        } catch (err) {
            console.error('Error checking status:', err);
            alert('Terjadi kesalahan saat mengecek status');
        } finally {
            setCheckingStatus(false);
        }
    };

    // Format time
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    // Format currency
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
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-orange-600 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-slate-700" />
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium tracking-wide">MY PG CHECKOUT</p>
                </div>
            </div>
        );
    }

    if (error || !paymentData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] px-4">
                <div className="max-w-md w-full bg-[#111625] border border-slate-800 rounded-2xl p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                        <Shield className="w-8 h-8 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-white">Sesi Berakhir</h2>
                        <p className="text-slate-400">{error || 'Terjadi kesalahan'}</p>
                    </div>
                    <Button onClick={() => router.push('/test-mypg')} variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                        Kembali
                    </Button>
                </div>
            </div>
        );
    }

    const isExpired = timeLeft <= 0;
    const displayAmount = paymentData.totalAmount || paymentData.amount;

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans">
            {/* MY PG Test Banner */}
            <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-center py-2 font-bold z-50">
                🧪 MY PG - klikqris.com | Order: {orderId}
            </div>

            <div className="p-4 lg:p-8 pt-16 flex flex-col items-center">
                {/* Navbar */}
                <div className="w-full max-w-5xl mx-auto flex items-center justify-between mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/test-mypg')}
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-transparent pl-0"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <span className="font-medium">Cancel</span>
                    </Button>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                        <Shield className="w-3 h-3 text-orange-500" />
                        <span className="text-xs font-bold text-orange-600 dark:text-orange-400">MY PG QRIS</span>
                    </div>
                </div>

                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT: Payment Details */}
                    <div className="lg:col-span-4 order-2 lg:order-1">
                        <div className="bg-white dark:bg-[#111625] rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-100 dark:border-slate-800">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 tracking-wider mb-2">AMOUNT TO PAY</p>
                                    <div className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                                        {formatCurrency(displayAmount)}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">*Termasuk kode unik untuk verifikasi</p>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
                                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    <div>
                                        <p className="text-xs font-bold text-orange-800 dark:text-orange-300 uppercase">Payment Timer</p>
                                        <p className="text-sm font-mono font-medium text-orange-900 dark:text-orange-200">{formatTime(timeLeft)}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Order ID</span>
                                        <span className="font-mono text-xs text-slate-700 dark:text-slate-300 max-w-[180px] truncate">{paymentData.orderId}</span>
                                    </div>
                                    {paymentData.customerData && (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Customer</span>
                                                <span className="font-medium text-slate-900 dark:text-white text-right max-w-[150px] truncate">{paymentData.customerData.fullName}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Email</span>
                                                <span className="text-slate-700 dark:text-slate-300 text-right max-w-[150px] truncate">{paymentData.customerData.email}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Plan</span>
                                                <span className="font-medium text-orange-600 dark:text-orange-400">{paymentData.customerData.plan}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="pt-4 mt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Smartphone className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cara Bayar</span>
                                    </div>
                                    <ul className="text-xs space-y-2 text-slate-500 pl-6 list-disc">
                                        <li>Buka aplikasi e-wallet/m-banking (GoPay, OVO, DANA, BCA, dll)</li>
                                        <li>Pilih menu "Scan QRIS"</li>
                                        <li>Scan QR code di sebelah kanan</li>
                                        <li>Pastikan nominal sesuai (termasuk kode unik)</li>
                                        <li>Konfirmasi dan masukkan PIN</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: QR Code */}
                    <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col items-center">
                        <div className="bg-white dark:bg-[#111625] rounded-[40px] p-8 lg:p-12 shadow-2xl border border-slate-200 dark:border-slate-800 relative w-full max-w-xl mx-auto text-center overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Scan QRIS</h2>
                                <p className="text-slate-500 dark:text-slate-400 mb-8">Powered by MY PG (klikqris.com)</p>

                                <div className="relative mx-auto w-fit">
                                    {/* Corner Borders */}
                                    <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-xl" />
                                    <div className="absolute -top-3 -right-3 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-xl" />
                                    <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-xl" />
                                    <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-xl" />

                                    <div className="bg-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                                        {/* QR Code Image from MY PG */}
                                        {paymentData.qrisImage ? (
                                            <img
                                                src={paymentData.qrisImage}
                                                alt="QRIS Code"
                                                className="w-[280px] h-[280px] object-contain"
                                            />
                                        ) : paymentData.qrisUrl ? (
                                            <img
                                                src={paymentData.qrisUrl}
                                                alt="QRIS Code"
                                                className="w-[280px] h-[280px] object-contain"
                                            />
                                        ) : (
                                            <div className="w-[280px] h-[280px] bg-slate-100 flex items-center justify-center">
                                                <p className="text-slate-500">QR Code unavailable</p>
                                            </div>
                                        )}

                                        {/* Scanning Animation */}
                                        {!isExpired && (
                                            <motion.div
                                                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_20px_rgba(249,115,22,0.5)] z-20"
                                                animate={{ top: ['0%', '100%', '0%'] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            />
                                        )}

                                        {isExpired && (
                                            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                                                    <Clock className="w-6 h-6 text-red-600" />
                                                </div>
                                                <p className="font-bold text-slate-900">Expired</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-center gap-4">
                                    <Button
                                        onClick={handleCheckStatus}
                                        disabled={checkingStatus || isExpired}
                                        className="bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 rounded-full h-10 px-6 font-medium"
                                    >
                                        {checkingStatus ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                                        {checkingStatus ? 'Checking...' : 'Check Status'}
                                    </Button>
                                </div>

                                {/* Direct URL */}
                                {paymentData.directUrl && (
                                    <div className="mt-6 text-center">
                                        <a
                                            href={paymentData.directUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-orange-600 hover:underline"
                                        >
                                            Buka di Browser →
                                        </a>
                                    </div>
                                )}

                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                                    <p className="text-xs text-slate-400">Auto-checking payment status setiap 5 detik...</p>
                                </div>
                            </div>
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
