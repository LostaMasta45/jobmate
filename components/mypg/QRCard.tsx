"use client";

import { Check, ShieldCheck } from "lucide-react";
import QRCode from "react-qr-code";

interface QRCardProps {
    paymentData: {
        orderId: string;
        amount: number;
        totalAmount?: string;
        qrisImage?: string;
        qrisUrl?: string;
        directUrl?: string; // Fallback
        customerData: {
            plan: string;
        };
    } | null;
    isExpired?: boolean;
    isPaid?: boolean;
    className?: string; // Keep for layout flexibility
}

export function QRCard({ paymentData, isExpired = false, isPaid = false, className = "" }: QRCardProps) {
    if (!paymentData) return null;

    const nmid = "ID1022147265592";

    // Priority: qrisImage (pre-rendered from KlikQRIS) > qrisUrl (QRIS data string for react-qr-code)
    const qrisImageSrc = paymentData.qrisImage;
    const qrisDataString = paymentData.qrisUrl;
    const hasValidQR = !!(qrisImageSrc || qrisDataString);

    return (
        <div className={`relative w-full max-w-[340px] mx-auto ${className} perspective-1000 group`}>
            <div className="w-[320px] mx-auto bg-[#f4f6f9] rounded-[2rem] shadow-xl border-4 border-white overflow-hidden relative">
                <div className="bg-gradient-to-b from-[#5547d0] to-[#3977d3] p-6 pb-12 text-white text-center rounded-b-[2rem] relative shadow-inner">
                    <h2 className="font-bold text-lg mb-1">SCAN UNTUK BAYAR</h2>
                    <p className="text-blue-100 text-xs font-medium">Scan to Pay</p>
                </div>

                <div className="mx-6 -mt-8 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 relative z-10 flex flex-col items-center">
                    <div className="bg-[#5547d0]/10 text-[#5547d0] text-[10px] font-bold px-2 py-1 rounded-full mb-3 uppercase tracking-wider">
                        infolokerjombang
                    </div>

                    {/* QR Code Container */}
                    <div className="relative flex justify-center w-full mb-4">
                        {qrisImageSrc ? (
                            <img
                                src={qrisImageSrc}
                                alt="QRIS Payment QR Code"
                                width={150}
                                height={150}
                                className="aspect-square w-[150px] h-[150px] object-contain"
                                style={{ imageRendering: 'pixelated' }}
                                crossOrigin="anonymous"
                            />
                        ) : qrisDataString ? (
                            <QRCode
                                value={qrisDataString}
                                size={150}
                                level={"M"}
                                className="aspect-square w-[150px] h-[150px]"
                            />
                        ) : (
                            <div className="w-[150px] h-[150px] flex flex-col items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                                <span className="text-2xl mb-1">⚠️</span>
                                <p className="text-[10px] font-bold text-slate-500 text-center px-2">QR Code tidak tersedia</p>
                                <p className="text-[9px] text-slate-400 text-center px-2 mt-1">Silakan buat transaksi baru</p>
                            </div>
                        )}

                        {/* Status Overlays */}
                        {isExpired && !isPaid && (
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-xl flex flex-col items-center justify-center z-30">
                                <span className="text-2xl mb-1">⚠️</span>
                                <p className="text-red-500 font-extrabold text-xs uppercase tracking-wider">Kedaluwarsa</p>
                            </div>
                        )}
                        {isPaid && (
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-xl flex flex-col items-center justify-center z-30">
                                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mb-2 shadow-lg shadow-emerald-200">
                                    <Check className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-emerald-600 font-extrabold text-sm tracking-widest uppercase">Lunas</p>
                            </div>
                        )}
                    </div>

                    <div className="w-full text-center border-t border-slate-100 pt-3">
                        <p className="text-xl font-black text-slate-800 tracking-tight">
                            Rp {Number(paymentData.totalAmount || paymentData.amount).toLocaleString("id-ID")}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">NMID: {nmid}</p>
                    </div>
                </div>

                <div className="p-5 flex justify-center items-center gap-2 text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-[#3977d3]" />
                    <span className="text-xs font-semibold">Dilindungi oleh OJK</span>
                </div>
            </div>
        </div>
    );

}
