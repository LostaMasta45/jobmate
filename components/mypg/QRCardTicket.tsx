
import { QrCode, Ticket, Scissors } from "lucide-react";

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

export function QRCardTicket({ paymentData, isExpired = false, isPaid = false, className = "" }: QRCardProps) {
    const displayAmount = paymentData.amount;
    const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className={`w-full max-w-[360px] filter drop-shadow-xl ${className}`}>
            <div className="bg-[#fffdf5] relative rounded-lg overflow-hidden flex flex-col">

                {/* Top Section */}
                <div className="p-6 pb-8 border-b-2 border-dashed border-gray-300 relative bg-[#fffae8]">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-slate-700 font-bold font-mono">
                            <Ticket className="w-5 h-5" />
                            <span>TICKET</span>
                        </div>
                        <div className="text-xs font-mono text-slate-500 bg-white px-2 py-1 border border-slate-200 rounded">
                            {date}
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 font-mono tracking-tighter uppercase leading-none mb-2">
                        {paymentData.customerData.plan}
                    </h2>
                    <p className="font-mono text-xs text-slate-500">REF: {paymentData.orderId.substring(5, 15)}</p>

                    {/* Half Circles for cutouts */}
                    <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-slate-50 dark:bg-[#0B0F19]" />
                    <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-slate-50 dark:bg-[#0B0F19]" />
                </div>

                {/* Bottom Section */}
                <div className="p-6 pt-8 bg-white flex flex-col items-center">

                    <div className="p-2 border-4 border-slate-900 rounded-lg mb-6">
                        {paymentData.qrisImage ? (
                            <img
                                src={paymentData.qrisImage}
                                alt="QRIS"
                                className={`w-48 h-48 object-contain ${isExpired ? 'opacity-20 sepia' : ''}`}
                            />
                        ) : (
                            <div className="w-48 h-48 bg-slate-100 flex items-center justify-center">
                                <QrCode className="w-10 h-10 text-slate-300" />
                            </div>
                        )}
                        {isPaid && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-[6px] border-red-600 px-4 py-2 rounded-lg mix-blend-multiply opacity-80 mask-stamp">
                                <span className="text-4xl font-black text-red-600 uppercase tracking-widest">PAID</span>
                            </div>
                        )}
                    </div>

                    <div className="w-full border-t border-slate-200 mt-2 mb-4 pt-4 flex justify-between items-center">
                        <span className="font-mono text-sm text-slate-500">TOTAL</span>
                        <span className="font-mono text-2xl font-bold text-slate-900">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(displayAmount))}
                        </span>
                    </div>

                    <div className="w-full flex items-center gap-2 opacity-30 mt-2">
                        <Scissors className="w-4 h-4" />
                        <div className="h-px w-full border-t border-dashed border-slate-900" />
                    </div>

                </div>
            </div>
        </div>
    );
}
