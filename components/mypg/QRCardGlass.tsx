
import { motion } from "framer-motion";
import { Shield, QrCode, Check, Smartphone } from "lucide-react";

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

export function QRCardGlass({ paymentData, isExpired = false, isPaid = false, className = "" }: QRCardProps) {
    const displayAmount = paymentData.amount;

    return (
        <div className={`relative overflow-hidden w-full max-w-[380px] rounded-[30px] p-[1px] ${className}`}>
            {/* Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-white/40 rounded-[30px]" />

            {/* Glass Container */}
            <div className="relative bg-black/60 backdrop-blur-xl rounded-[29px] h-full flex flex-col items-center p-8 overflow-hidden">

                {/* Glow Effects */}
                <div className="absolute top-[-20%] right-[-20%] w-[200px] h-[200px] bg-purple-500/30 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-20%] left-[-20%] w-[200px] h-[200px] bg-blue-500/30 blur-[80px] rounded-full pointer-events-none" />

                {/* Header */}
                <div className="w-full flex justify-between items-center mb-8 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md text-white font-bold text-xs">
                            MY
                        </div>
                        <span className="text-white/80 font-medium tracking-wide text-sm">Pay</span>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 tracking-wider">
                        PREMIUM
                    </div>
                </div>

                {/* Amount */}
                <div className="text-center mb-8 relative z-10">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-2">Total Amount</p>
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tight">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(displayAmount))}
                    </div>
                    <p className="text-white/60 text-sm mt-2 font-medium">{paymentData.customerData.plan}</p>
                </div>

                {/* QR Area */}
                <div className="relative p-1 rounded-[24px] bg-gradient-to-br from-white/20 to-transparent mb-8 group">
                    <div className="bg-white rounded-[23px] p-6 relative overflow-hidden">

                        {/* Scanning Line Animation */}
                        {!isExpired && !isPaid && (
                            <motion.div
                                className="absolute left-0 right-0 h-[3px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20"
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />
                        )}

                        {paymentData.qrisImage ? (
                            <div className="relative">
                                <img
                                    src={paymentData.qrisImage}
                                    alt="QRIS"
                                    className={`w-48 h-48 object-contain ${isExpired ? 'opacity-20 grayscale' : ''}`}
                                />
                                {isPaid && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-30 rounded-xl">
                                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                                            <Check className="w-7 h-7 text-green-600 stroke-[3]" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-48 h-48 bg-slate-100 flex items-center justify-center rounded-xl">
                                <QrCode className="w-10 h-10 text-slate-300" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="w-full space-y-3 relative z-10">
                    <div className="flex justify-between items-center text-sm border-t border-white/10 pt-4">
                        <span className="text-white/40">Status</span>
                        {isPaid ? (
                            <span className="text-green-400 font-bold flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Successful</span>
                        ) : isExpired ? (
                            <span className="text-red-400 font-bold">Expired</span>
                        ) : (
                            <span className="text-blue-400 font-bold animate-pulse">Waiting Payment</span>
                        )}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">Expires</span>
                        <span className="text-white/80 font-medium">30:00</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
