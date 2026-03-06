"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    Clock,
    Shield,
    ArrowLeft,
    RefreshCw,
    Smartphone,
    Copy,
    Check,
    CreditCard,
    Zap,
    Lock,
    Download,
    Share2,
    Wallet
} from "lucide-react";
import { toast } from "sonner";
import { QRCard } from "@/components/mypg/QRCard";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";

interface PaymentData {
    orderId: string;
    amount: number;
    totalAmount: string; // Keep as string for display if needed, but amount is number
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
    const [copied, setCopied] = useState(false);

    // Polling state
    const [lastChecked, setLastChecked] = useState<Date>(new Date());
    const [isPolling, setIsPolling] = useState(false);

    const qrCardRef = useRef<HTMLDivElement>(null);

    // Initial load
    useEffect(() => {
        if (!orderId) {
            setError('Order ID tidak ditemukan');
            setLoading(false);
            return;
        }

        const loadData = async () => {
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
                    // Fetch if not in session
                    const res = await fetch(`/api/mypg/check-status?order_id=${orderId}`);
                    const data = await res.json();

                    if (data.success && data.transaction) {
                        const newData: PaymentData = {
                            orderId: data.transaction.order_id,
                            amount: parseInt(data.transaction.amount),
                            totalAmount: data.transaction.amount,
                            qrisImage: data.transaction.qris_image || '',
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

                        // Set timer
                        if (newData.expiredAt) {
                            const expiredTime = new Date(newData.expiredAt).getTime();
                            const now = Date.now();
                            const diff = Math.floor((expiredTime - now) / 1000);
                            setTimeLeft(Math.max(0, diff));
                        }

                        if (data.status === 'SUCCESS' || data.status === 'PAID') {
                            setIsPaid(true);
                            setTimeout(() => router.push(`/test-mypg/success?order_id=${orderId}`), 1500);
                        }
                    } else {
                        setError('Data pembayaran tidak ditemukan. Silakan buat pembayaran baru.');
                        setLoading(false);
                    }
                }
            } catch (err) {
                console.error('Error loading payment data:', err);
                setError('Gagal memuat data pembayaran');
                setLoading(false);
            }
        };

        loadData();
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
        if (!orderId || isPaid) return;

        const interval = setInterval(() => {
            checkPaymentStatus(false);
        }, 5000);

        return () => clearInterval(interval);
    }, [orderId, isPaid]);


    // Format helpers
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Order ID disalin!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = async () => {
        if (!qrCardRef.current || !paymentData) return;

        const toastId = toast.loading("Menyiapkan gambar...");

        try {
            // Wait a bit for images to be fully rendered
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(qrCardRef.current, {
                backgroundColor: '#ffffff',
                scale: 3,
                useCORS: true,
                allowTaint: true,
                logging: false,
            } as any);

            const image = canvas.toDataURL("image/png");

            // Create download link
            const link = document.createElement("a");
            link.href = image;
            link.download = `JobMate-QR-${paymentData.orderId}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.dismiss(toastId);
            toast.success("QR Code berhasil diunduh");
        } catch (error) {
            console.error("Download failed:", error);
            toast.dismiss(toastId);
            toast.error("Gagal mengunduh gambar");
        }
    };

    const handleShare = () => {
        if (!paymentData) return;

        const displayAmount = paymentData.totalAmount || paymentData.amount;
        const text = `Tagihan JobMate\nOrder ID: ${paymentData.orderId}\nNominal: Rp ${new Intl.NumberFormat('id-ID').format(Number(displayAmount))}\n\nSegera lakukan pembayaran.`;

        if (navigator.share) {
            navigator.share({
                title: 'Tagihan JobMate',
                text: text,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(text);
            toast.success("Link pembayaran disalin");
        }
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

    const displayAmount = paymentData.totalAmount || paymentData.amount;

    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans selection:bg-orange-500/30 overflow-hidden relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            {/* Header / Navbar */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5"
            >
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/test-mypg')}>
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-amber-700 flex items-center justify-center shadow-lg shadow-orange-900/20">
                                <span className="font-black text-white text-xs tracking-tighter">MY</span>
                            </div>
                        </div>
                        <div>
                            <span className="font-bold text-lg tracking-tight text-white block leading-none">JobMate</span>
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Payment Gateway</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Order ID</p>
                            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => copyToClipboard(paymentData.orderId)}>
                                <p className="text-xs font-mono font-medium text-slate-300 group-hover:text-white transition-colors">{paymentData.orderId}</p>
                                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors" />}
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors" onClick={() => router.back()}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </motion.div>

            <div className="pt-32 pb-20 px-4 relative z-10">
                {/* Mobile ONLY Header Section (Title + Timer + Amount) */}
                <div className="lg:hidden mb-8 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Selesaikan Pembayaran</h1>
                        <p className="text-slate-400 text-lg">Segera lakukan pembayaran untuk mengaktifkan paket Premium Anda.</p>
                    </motion.div>

                    {/* Timer & Amount Grid Mobile */}
                    <div className="grid grid-cols-1 gap-4">
                        {/* Timer Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-[#151b2d]/50 backdrop-blur-md rounded-2xl p-6 border border-white/5 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[40px] -mr-16 -mt-16" />
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                        Sisa Waktu
                                    </p>
                                    <div className="text-4xl font-mono font-bold text-white tracking-tighter">
                                        {formatTime(timeLeft)}
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                    <Clock className="w-5 h-5 text-orange-500" />
                                </div>
                            </div>
                            <div className="mt-4 w-full bg-white/5 rounded-full h-1 overflow-hidden">
                                <motion.div
                                    className="h-full bg-orange-500"
                                    initial={{ width: "100%" }}
                                    animate={{ width: `${(timeLeft / (30 * 60)) * 100}%` }}
                                    transition={{ duration: 1, ease: "linear" }}
                                />
                            </div>
                        </motion.div>

                        {/* Amount Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-[#151b2d]/50 backdrop-blur-md rounded-2xl p-6 border border-white/5 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -mr-16 -mt-16" />
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Total Tagihan</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-sm font-semibold text-slate-400">Rp</span>
                                        <span className="text-4xl font-bold text-white tracking-tighter">
                                            {new Intl.NumberFormat('id-ID').format(typeof displayAmount === 'string' ? parseFloat(displayAmount) : displayAmount)}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <CreditCard className="w-5 h-5 text-emerald-500" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-medium text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg w-fit border border-white/5">
                                <Zap className="w-3 h-3 text-amber-500" />
                                Pastikan nominal transfer sesuai digit terakhir
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                    {/* LEFT COLUMN: Payment Instructions & Details */}
                    <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">Selesaikan Pembayaran</h1>
                            <p className="text-slate-400 text-lg">Segera lakukan pembayaran untuk mengaktifkan paket Premium Anda.</p>
                        </motion.div>

                        {/* Timer & Amount Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Timer Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-[#151b2d]/50 backdrop-blur-md rounded-2xl p-6 border border-white/5 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[40px] -mr-16 -mt-16 transition-opacity group-hover:opacity-70" />

                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                            Sisa Waktu
                                        </p>
                                        <div className="text-4xl font-mono font-bold text-white tracking-tighter">
                                            {formatTime(timeLeft)}
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                        <Clock className="w-5 h-5 text-orange-500" />
                                    </div>
                                </div>
                                <div className="mt-4 w-full bg-white/5 rounded-full h-1 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-orange-500"
                                        initial={{ width: "100%" }}
                                        animate={{ width: `${(timeLeft / (30 * 60)) * 100}%` }}
                                        transition={{ duration: 1, ease: "linear" }}
                                    />
                                </div>
                            </motion.div>

                            {/* Amount Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="bg-[#151b2d]/50 backdrop-blur-md rounded-2xl p-6 border border-white/5 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -mr-16 -mt-16 transition-opacity group-hover:opacity-70" />

                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Total Tagihan</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-semibold text-slate-400">Rp</span>
                                            <span className="text-4xl font-bold text-white tracking-tighter">
                                                {new Intl.NumberFormat('id-ID').format(typeof displayAmount === 'string' ? parseFloat(displayAmount) : displayAmount)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                        <CreditCard className="w-5 h-5 text-emerald-500" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-[10px] font-medium text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg w-fit border border-white/5">
                                    <Zap className="w-3 h-3 text-amber-500" />
                                    Pastikan nominal transfer sesuai digit terakhir
                                </div>
                            </motion.div>
                        </div>

                        {/* Details Stack */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-[#151b2d]/50 backdrop-blur-md rounded-2xl border border-white/5 divide-y divide-white/5"
                        >
                            <div className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                                <span className="text-sm text-slate-400">Merchant</span>
                                <span className="text-sm font-semibold text-white flex items-center gap-2">
                                    infolokerjombang (JobMate)
                                    <Shield className="w-3.5 h-3.5 text-blue-500" />
                                </span>
                            </div>
                            <div className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                                <span className="text-sm text-slate-400">Pembelian</span>
                                <span className="text-sm font-semibold text-white">{paymentData.customerData.plan}</span>
                            </div>
                            <div className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                                <span className="text-sm text-slate-400">Customer</span>
                                <span className="text-sm font-semibold text-white">{paymentData.customerData.fullName}</span>
                            </div>
                            <div className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                                <span className="text-sm text-slate-400">Email</span>
                                <span className="text-sm font-semibold text-white">{paymentData.customerData.email}</span>
                            </div>
                        </motion.div>

                        {/* Instructions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="bg-[#151b2d]/50 backdrop-blur-md rounded-2xl p-6 border border-white/5"
                        >
                            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-orange-500" />
                                Langkah Pembayaran
                            </h3>
                            <div className="space-y-6 relative ml-2">
                                <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

                                {[
                                    { text: "Buka aplikasi e-wallet atau Mobile Banking pilihan Anda.", sub: "Gopay, OVO, Dana, ShopeePay, BCA, Mandiri, dll." },
                                    { text: "Pilih menu 'Scan QRIS' atau 'Bayar'.", sub: "Biasanya tombol utama di tengah bawah aplikasi." },
                                    { text: "Scan QR Code yang tampil di layar.", sub: "Pastikan kecerahan layar cukup." },
                                    { text: "Periksa & Konfirmasi Pembayaran.", sub: "Pastikan nama merchant 'JobMate' dan nominal sesuai." }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-4 relative group">
                                        <div className="w-6 h-6 rounded-full bg-[#0B0F19] border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:text-orange-500 group-hover:border-orange-500/50 transition-all flex-shrink-0 z-10 shadow-lg shadow-black/50">
                                            {idx + 1}
                                        </div>
                                        <div className="-mt-1">
                                            <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{step.text}</p>
                                            <p className="text-xs text-slate-500 mt-1">{step.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Security Badge */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex items-center justify-center gap-3 text-xs text-slate-500"
                        >
                            <Lock className="w-3 h-3" />
                            <span>Pembayaran Aman & Terenkripsi</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                            <span>Verifikasi Otomatis</span>
                        </motion.div>

                    </div>

                    {/* RIGHT COLUMN: Sticky QR Card */}
                    <div className="lg:col-span-5 order-1 lg:order-2">
                        <div className="lg:sticky lg:top-32">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, rotate: 1 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                                className="relative z-10"
                            >
                                <div className="absolute -inset-4 bg-gradient-to-b from-orange-500/20 to-purple-500/20 rounded-[3rem] blur-2xl opacity-50 animate-pulse" />

                                <div ref={qrCardRef} className="rounded-[32px] overflow-hidden">
                                    <QRCard
                                        paymentData={paymentData}
                                        isExpired={timeLeft <= 0}
                                        isPaid={isPaid}
                                    />
                                </div>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-6 flex gap-3"
                            >
                                <Button
                                    onClick={handleDownload}
                                    variant="outline"
                                    className="flex-1 rounded-xl h-11 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white hover:border-orange-500/30 transition-all text-slate-300"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download QR
                                </Button>
                                <Button
                                    onClick={handleShare}
                                    variant="outline"
                                    className="flex-1 rounded-xl h-11 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white hover:border-blue-500/30 transition-all text-slate-300"
                                >
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Bagikan
                                </Button>
                            </motion.div>

                            {/* Supported Payments for Trust */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="mt-8 pt-6 border-t border-white/5 text-center"
                            >
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">Didukung Oleh</p>
                                <div className="flex flex-wrap justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                    {/* Placeholder Logos (Text for now to avoid broken images) */}
                                    <div className="flex items-center gap-1"><Wallet className="w-3 h-3" /> <span className="text-xs font-bold text-slate-300">Gopay</span></div>
                                    <div className="flex items-center gap-1"><Wallet className="w-3 h-3" /> <span className="text-xs font-bold text-slate-300">OVO</span></div>
                                    <div className="flex items-center gap-1"><Wallet className="w-3 h-3" /> <span className="text-xs font-bold text-slate-300">Dana</span></div>
                                    <div className="flex items-center gap-1"><Wallet className="w-3 h-3" /> <span className="text-xs font-bold text-slate-300">ShopeePay</span></div>
                                    <div className="flex items-center gap-1"><Wallet className="w-3 h-3" /> <span className="text-xs font-bold text-slate-300">BCA</span></div>
                                </div>
                            </motion.div>

                            {/* Status Control */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="mt-8 flex flex-col items-center gap-4 bg-[#151b2d]/50 rounded-2xl p-4 border border-white/5"
                            >
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5 backdrop-blur-sm">
                                    <span className={`relative flex h-2 w-2`}>
                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPolling ? 'bg-orange-500' : 'bg-slate-500'} opacity-75`}></span>
                                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isPolling ? 'bg-orange-600' : 'bg-slate-400'}`}></span>
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                        {isPolling ? 'Mengecek Pembayaran...' : 'Menunggu Pembayaran'}
                                    </span>
                                </div>

                                <Button
                                    onClick={() => checkPaymentStatus(true)}
                                    disabled={isPolling || isPaid}
                                    className="w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-lg shadow-orange-500/20 transition-all h-10"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${isPolling ? 'animate-spin' : ''}`} />
                                    Cek Status Pembayaran
                                </Button>

                                <p className="text-[10px] text-slate-600 text-center max-w-xs leading-relaxed">
                                    Sistem mengecek status pembayaran secara otomatis.<br />Jika sudah bayar namun belum berhasil, klik tombol di atas.
                                </p>
                            </motion.div>
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
