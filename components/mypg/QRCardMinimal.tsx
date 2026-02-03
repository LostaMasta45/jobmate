
import { motion } from "framer-motion";
import { QrCode, ArrowUpRight, Check } from "lucide-react";

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

export function QRCardMinimal({ paymentData, isExpired = false, isPaid = false, className = "" }: QRCardProps) {
    const displayAmount = paymentData.amount;

    return (
        <div className={`w-full max-w-[380px] bg-white border border-slate-200 rounded-none p-8 font-sans ${className}`}>

            {/* Minimal Header */}
            <div className="flex justify-between items-start mb-12">
                <div>
                    <h2 className="text-2xl font-light tracking-tight text-slate-900">Payment</h2>
                    <p className="text-slate-400 text-sm mt-1">Invoice #{paymentData.orderId.substring(9, 16)}</p>
                </div>
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5" />
                </div>
            </div>

            {/* Main Content Group */}
            <div className="flex flex-col items-center">

                {/* QR Container - Stark & Clean */}
                <div className="relative mb-10">
                    <div className="p-4 border border-black/10">
                        {paymentData.qrisImage ? (
                            <div className="relative group">
                                <img
                                    src={paymentData.qrisImage}
                                    alt="QRIS"
                                    className={`w-56 h-56 object-contain mix-blend-multiply ${isExpired ? 'opacity-20 blur-[2px]' : ''}`}
                                />
                                {isPaid && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/95">
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-2">
                                                <Check className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="font-bold text-black tracking-tight text-sm uppercase">Paid</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-56 h-56 bg-slate-50 flex items-center justify-center">
                                <QrCode className="w-10 h-10 text-slate-200" />
                            </div>
                        )}
                    </div>

                    {/* Corner accents */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-black" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-black" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-black" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-black" />
                </div>

                {/* Amount */}
                <div className="text-center w-full">
                    <div className="text-3xl font-medium text-slate-900 tracking-tighter mb-2">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(displayAmount))}
                    </div>
                    <div className="h-px w-16 bg-black/20 mx-auto my-4" />
                    <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-widest text-slate-500 w-full px-4">
                        <span>Scan to Pay</span>
                        <span>KlikQRIS</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
