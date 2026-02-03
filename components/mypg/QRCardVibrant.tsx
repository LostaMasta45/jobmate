
import { motion } from "framer-motion";
import { QrCode, Sparkles, Zap } from "lucide-react";

interface QRCardProps {
    paymentData: {
        amount: number | string;
        orderId: string;
        qrisImage?: string;
        qrisUrl?: string;
        customerData: {
            plan: string;
            fullName?: string;
        }
    };
    isExpired?: boolean;
    isPaid?: boolean;
    className?: string;
}

export function QRCardVibrant({ paymentData, isExpired = false, isPaid = false, className = "" }: QRCardProps) {
    const displayAmount = paymentData.amount;

    return (
        <div className={`w-full max-w-[380px] relative group ${className}`}>

            {/* Animated Gradient Border/Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-purple-600 to-amber-500 rounded-3xl opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />

            <div className="relative bg-[#0F0F0F] rounded-2xl p-8 h-full flex flex-col overflow-hidden">

                {/* Mesh Gradient Overlay */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-500/20 blur-[100px] rounded-full pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 flex justify-between items-center mb-8">
                    <div className="flex flex-col">
                        <span className="text-orange-500 font-bold text-xs uppercase tracking-wider mb-1">Payment Gateway</span>
                        <h3 className="text-white font-black text-xl italic tracking-wide">FLASH<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">PAY</span></h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <Zap className="w-5 h-5 text-white fill-current" />
                    </div>
                </div>

                {/* Main Card Content */}
                <div className="relative z-10 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center">

                    {/* Amount Chip */}
                    <div className="mb-6 bg-black/40 rounded-full px-6 py-2 border border-white/5 shadow-inner">
                        <span className="text-2xl font-bold text-white tracking-tight">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(displayAmount))}
                        </span>
                    </div>

                    {/* QR Frame */}
                    <div className="relative p-3 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 mb-2">
                        <div className="bg-white rounded-lg p-3">
                            {paymentData.qrisImage ? (
                                <img
                                    src={paymentData.qrisImage}
                                    alt="QRIS"
                                    className={`w-48 h-48 object-contain ${isExpired ? 'grayscale opacity-50' : ''}`}
                                />
                            ) : (
                                <div className="w-48 h-48 bg-slate-100 flex items-center justify-center">
                                    <QrCode className="w-10 h-10 text-slate-300" />
                                </div>
                            )}

                            {isPaid && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg backdrop-blur-sm">
                                    <div className="text-center text-white font-bold text-lg animate-pulse">
                                        PAYMENT<br />SUCCESS
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-400">
                        <Sparkles className="w-3 h-3 text-orange-400" />
                        <span>Instant Verification</span>
                    </div>

                </div>

                {/* Plan Info Footer */}
                <div className="mt-6 relative z-10 text-center">
                    <p className="text-white/60 text-sm">{paymentData.customerData.plan} Access</p>
                </div>

            </div>
        </div>
    );
}
