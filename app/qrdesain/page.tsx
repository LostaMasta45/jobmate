"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Copy, Check, Download, Share2, ArrowLeft, Clock, Shield, CreditCard, Zap, Smartphone, Lock, Wallet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { QRCard } from "@/components/mypg/QRCard";
import html2canvas from "html2canvas";

export default function DesainQRPageContent() {
    const router = useRouter();
    const qrCardRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);

    // Mock Data State
    const [mockPaymentData] = useState({
        orderId: "INV-20240125-0001",
        amount: 150000,
        totalAmount: "150000",
        customerData: {
            plan: "Premium",
            fullName: "Budi Santoso",
            email: "budi@example.com"
        },
        qrisUrl: "00020101021126600014COM.GO-JEK.WWW0118936009143009191851020820091918510303UMI5204593253033605802ID5909INFO LOKER6007JOMBANG6107614190062070703A0163040E0F",
        directUrl: "00020101021126600014COM.GO-JEK.WWW0118936009143009191851020820091918510303UMI5204593253033605802ID5909INFO LOKER6007JOMBANG6107614190062070703A0163040E0F"
    });

    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
    const [isPaid, setIsPaid] = useState(false);
    const [isPolling, setIsPolling] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Order ID disalin!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = async () => {
        if (!qrCardRef.current) return;
        const toastId = toast.loading("Menyiapkan gambar...");

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const canvas = await html2canvas(qrCardRef.current, {
                background: undefined,
                scale: 2,
                useCORS: true,
                logging: false,
            } as any);

            const link = document.createElement("a");
            link.download = `JobMate-QR-${mockPaymentData.orderId}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            toast.success("QR Code berhasil disimpan!");
            toast.dismiss(toastId);
        } catch (error) {
            console.error("Download failed:", error);
            toast.error("Gagal menyimpan gambar");
            toast.dismiss(toastId);
        }
    };

    const handleShare = async () => {
        try {
            const text = `Tagihan JobMate\nOrder ID: ${mockPaymentData.orderId}\nNominal: Rp ${new Intl.NumberFormat('id-ID').format(mockPaymentData.amount)}`;
            if (navigator.share) {
                await navigator.share({
                    title: 'Tagihan JobMate Premium',
                    text: text,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link pembayaran disalin!');
            }
        } catch (err) {
            console.error('Share failed:', err);
        }
    };

    const checkPaymentStatus = (isManual = false) => {
        if (isManual) setIsPolling(true);
        setTimeout(() => {
            if (isManual) {
                setIsPolling(false);
                toast.info("Pembayaran belum terdeteksi (Simulasi).");
            }
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans selection:bg-orange-500/30 overflow-hidden relative">

            {/* Ambient Background (Ported from Reference) */}
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
                    {/* Logo Only - Resized */}
                    <div className="flex items-center cursor-pointer group" onClick={() => router.push('/test-mypg')}>
                        <div className="relative h-24 w-24 transition-transform group-hover:scale-105 duration-300">
                            <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
                            <Image
                                src="/Logo/x.png"
                                alt="JobMate"
                                fill
                                className="object-contain relative z-10"
                                priority
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Order ID</p>
                            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => copyToClipboard(mockPaymentData.orderId)}>
                                <p className="text-xs font-mono font-medium text-slate-300 group-hover:text-white transition-colors">{mockPaymentData.orderId}</p>
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
                                    animate={{ width: `${(timeLeft / 1800) * 100}%` }}
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
                                            {new Intl.NumberFormat('id-ID').format(mockPaymentData.amount)}
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
                            className="hidden lg:block"
                        >
                            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">Selesaikan Pembayaran</h1>
                            <p className="text-slate-400 text-lg">Segera lakukan pembayaran untuk mengaktifkan paket Premium Anda.</p>
                        </motion.div>

                        {/* Timer & Amount Grid - Desktop Only */}
                        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        animate={{ width: `${(timeLeft / 1800) * 100}%` }}
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
                                                {new Intl.NumberFormat('id-ID').format(mockPaymentData.amount)}
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
                                <span className="text-sm font-semibold text-white">{mockPaymentData.customerData.plan}</span>
                            </div>
                            <div className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                                <span className="text-sm text-slate-400">Customer</span>
                                <span className="text-sm font-semibold text-white">{mockPaymentData.customerData.fullName}</span>
                            </div>
                            <div className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                                <span className="text-sm text-slate-400">Email</span>
                                <span className="text-sm font-semibold text-white">{mockPaymentData.customerData.email}</span>
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
                                        paymentData={mockPaymentData}
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
                                    <div className="flex items-center gap-1"><Wallet className="w-3 h-3" /> <span className="text-xs font-bold text-slate-300">Gopay</span></div>
                                    <div className="flex items-center gap-1"><Wallet className="w-3 h-3" /> <span className="text-xs font-bold text-slate-300">OVO</span></div>
                                    <div className="flex items-center gap-1"><Wallet className="w-3 h-3" /> <span className="text-xs font-bold text-slate-300">Dana</span></div>
                                    <div className="flex items-center gap-1"><Wallet className="w-3 h-3" /> <span className="text-xs font-bold text-slate-300">ShopeePay</span></div>
                                    <div className="flex items-center gap-1"><Wallet className="w-3 h-3" /> <span className="text-xs font-bold text-slate-300">BCA</span></div>
                                </div>
                            </motion.div>

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
