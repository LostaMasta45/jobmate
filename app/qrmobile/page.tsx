"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Clock, Download, Share2, ChevronDown, ChevronUp, Copy, Check, Info, Lock, RefreshCw, Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { QRCard } from "@/components/mypg/QRCard";
import html2canvas from "html2canvas";
// Fix: Import from local ThemeProvider to ensure context match
import { useTheme } from "@/components/layout/ThemeProvider";

export default function MobileQRPage() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const qrCardRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

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
            });

            const link = document.createElement("a");
            link.download = `JobMate-QR-${mockPaymentData.orderId}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            toast.success("Gambar berhasil disimpan");
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
                toast.success('Link disalin');
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
                toast.info("Pembayaran belum terdeteksi");
            }
        }, 2000);
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // Render nothing until mounted to prevent mismatch
    if (!mounted) return null;

    return (
        <div className="min-h-screen relative flex flex-col font-sans overflow-hidden transition-colors duration-500 bg-slate-50 dark:bg-[#0B0F19]">

            {/* AMBIENT BACKGROUNDS - The "Premium Depth" */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Dark Mode Ambience */}
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-600/20 rounded-full blur-[100px] hidden dark:block animate-pulse duration-[8000ms]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/10 rounded-full blur-[100px] hidden dark:block animate-pulse duration-[10000ms]" />

                {/* Light Mode Ambience (Subtler) */}
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-400/10 rounded-full blur-[120px] dark:hidden" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-orange-400/10 rounded-full blur-[120px] dark:hidden" />

                {/* Texture Grid */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            {/* Native Header - Frosted Glass */}
            <header className="fixed top-0 left-0 right-0 h-[56px] flex items-center justify-between px-3 z-50 bg-white/70 dark:bg-[#0B0F19]/60 backdrop-blur-xl border-b border-black/5 dark:border-white/5 transition-all">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>

                <h1 className="text-[15px] font-semibold tracking-wide text-slate-800 dark:text-white/90">Pembayaran</h1>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition-transform active:scale-90"
                    onClick={toggleTheme}
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 pt-[80px] pb-[110px] px-6 overflow-y-auto no-scrollbar relative z-10">

                {/* PREMIUM HERO CARD */}
                <div className="relative mb-8 rounded-[32px] p-1 border border-white/50 dark:border-white/10 shadow-2xl shadow-blue-500/5 dark:shadow-black/20 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent backdrop-blur-md">
                    <div className="rounded-[28px] bg-white/50 dark:bg-[#151b2d]/50 p-6 flex flex-col items-center text-center backdrop-blur-sm border border-white/40 dark:border-white/5">
                        <div className="flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider">
                            <Sparkles className="w-3 h-3" />
                            Premium Access
                        </div>

                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-0.5">Total Tagihan</p>

                        <div className="flex items-start justify-center gap-1.5 mb-4">
                            <span className="text-lg font-semibold text-slate-400 dark:text-slate-500 mt-2">Rp</span>
                            <span className="text-[46px] font-bold text-slate-800 dark:text-white tracking-tighter leading-none drop-shadow-sm">
                                {new Intl.NumberFormat('id-ID').format(mockPaymentData.amount)}
                            </span>
                        </div>

                        <div className={`
                            flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold
                            ${timeLeft < 300
                                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 animate-pulse'
                                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-black/5 dark:border-white/10'
                            }
                        `}>
                            <Clock className="w-3.5 h-3.5" />
                            <span className="tabular-nums tracking-wide">{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </div>


                {/* QR CARD - Floating Glass */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="relative z-10 mx-auto max-w-[320px] mb-10"
                >
                    {/* Glow behind QR */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />

                    <div ref={qrCardRef} className="relative rounded-[28px] overflow-hidden shadow-2xl shadow-slate-300 dark:shadow-black/60 border border-white dark:border-white/10 ring-1 ring-black/5 dark:ring-white/10">
                        <QRCard
                            paymentData={mockPaymentData}
                            isExpired={timeLeft <= 0}
                            isPaid={isPaid}
                            className="w-full bg-white dark:bg-[#1E293B]" // Force contrast for the QR itself
                        />
                    </div>
                </motion.div>

                {/* DETAILS - Glass List */}
                <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-white/5 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center group cursor-pointer" onClick={() => copyToClipboard(mockPaymentData.orderId)}>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order ID</p>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 font-mono tracking-wide mt-0.5">{mockPaymentData.orderId}</p>
                        </div>
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />}
                    </div>

                    {/* Collapsible Instructions */}
                    <button
                        onClick={() => setShowInstructions(!showInstructions)}
                        className="w-full flex items-center justify-between p-4 bg-transparent active:bg-black/5 dark:active:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                                <Info className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Cara Pembayaran</p>
                                <p className="text-[10px] text-slate-500">Klik untuk melihat detail</p>
                            </div>
                        </div>
                        {showInstructions ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    <AnimatePresence>
                        {showInstructions && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-slate-50/50 dark:bg-black/20"
                            >
                                <div className="p-4 pt-2 space-y-5 pb-6">
                                    <div className="relative pl-5 space-y-5 ml-1">
                                        {/* Timeline Line */}
                                        <div className="absolute left-[3px] top-2 bottom-2 w-[2px] bg-slate-200 dark:bg-white/10 rounded-full" />

                                        {[
                                            { t: "Buka Aplikasi", d: "Gopay, OVO, Dana, atau Mobile Banking." },
                                            { t: "Scan QR", d: "Pilih menu Scan QRIS dan arahkan kamera." },
                                            { t: "Cek Detail", d: "Pastikan nama 'JobMate' & nominal sesuai." },
                                            { t: "Konfirmasi", d: "Masukkan PIN untuk menyelesaikan." }
                                        ].map((step, i) => (
                                            <div key={i} className="relative group">
                                                <div className="absolute -left-[21px] mt-0.5 w-[14px] h-[14px] rounded-full bg-white dark:bg-[#0B0F19] border-2 border-slate-300 dark:border-slate-600 group-hover:border-blue-500 transition-colors z-10" />
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{step.t}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{step.d}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-8 mb-4 flex justify-center opacity-70">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-black/5 dark:border-white/5">
                        <Lock className="w-3 h-3" />
                        Secure Payment via JobMate Gateway
                    </div>
                </div>

            </main>

            {/* Sticky Bottom Action Bar - Frosted Glass Gradient */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-2xl border-t border-black/5 dark:border-white/10 p-5 pb-8 z-50">
                <div className="flex gap-4 max-w-md mx-auto items-center">
                    <Button
                        onClick={() => checkPaymentStatus(true)}
                        disabled={isPolling || isPaid}
                        className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-white/5 text-[15px] font-bold tracking-wide transition-all active:scale-[0.98] hover:shadow-2xl hover:-translate-y-0.5"
                    >
                        {isPolling ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
                        {isPolling ? 'Mengecek...' : 'Cek Status Pembayaran'}
                    </Button>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleDownload}
                            variant="outline"
                            size="icon"
                            className="h-14 w-14 rounded-2xl border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 hover:-translate-y-0.5 transition-all"
                        >
                            <Download className="w-5 h-5" />
                        </Button>

                        <Button
                            onClick={handleShare}
                            variant="outline"
                            size="icon"
                            className="h-14 w-14 rounded-2xl border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 hover:-translate-y-0.5 transition-all"
                        >
                            <Share2 className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
}
