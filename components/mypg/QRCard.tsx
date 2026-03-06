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

            {/* Main Card Container - The "Official Elite" Standard */}
            <div className="relative bg-white rounded-[24px] overflow-hidden shadow-[0_30px_100px_-15px_rgba(0,0,0,0.4)] transition-all duration-700 hover:shadow-[0_40px_120px_-20px_rgba(255,100,0,0.1)]">

                {/* Metallic Gradient Border Frame - Fixed to be a border only */}
                <div className="absolute inset-0 rounded-[24px] border-[1.5px] border-slate-200/60 pointer-events-none z-20" />

                {/* Background: Pure Clean White for Official Look */}
                <div className="absolute inset-0 bg-white" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-500/5 to-transparent rounded-bl-[100px]" />

                {/* Header: Official Modern */}
                <div className="px-6 pt-8 pb-4 relative z-10 flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="relative h-10 w-32 -ml-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/payment-logos/qris.png"
                                alt="QRIS"
                                className="h-full w-auto object-contain object-left"
                                crossOrigin="anonymous"
                            />
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Pembayaran Nasional</p>
                    </div>

                    {/* GPN with Holographic effect */}
                    <div className="relative h-8 w-14 flex items-center justify-center overflow-hidden rounded-md border border-slate-100 bg-slate-50 shadow-sm">
                        <span className="text-[#DA251C] font-black italic text-xl z-10">GPN</span>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/80 to-transparent animate-[shimmer_3s_infinite]" />
                    </div>
                </div>

                {/* Merchant Name - Responsive & Preventing Cutoff */}
                <div className="text-center px-4 mb-4 relative z-10">
                    <h2 className="text-[20px] sm:text-[22px] font-[900] text-slate-900 tracking-tight leading-tight mb-2 uppercase font-sans break-words w-full">
                        INFOLOKERJOMBANG
                    </h2>
                    <div className="inline-flex items-center justify-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">NMID</span>
                        <span className="text-[10px] font-mono font-bold text-slate-700 tracking-wide">{nmid}</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="relative w-full px-6 mb-6">
                    <div className="w-full border-t-2 border-dashed border-slate-200" />
                </div>

                {/* QR Code Container - Secure Zone */}
                <div className="flex justify-center mb-8 relative z-10 px-6">
                    <div className="relative bg-white p-1 rounded-xl">
                        <div className="relative">
                            {/* Priority 1: Use pre-rendered QRIS image from KlikQRIS API */}
                            {qrisImageSrc ? (
                                <img
                                    src={qrisImageSrc}
                                    alt="QRIS Payment QR Code"
                                    width={240}
                                    height={240}
                                    className="aspect-square w-[240px] h-[240px] object-contain"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                            ) : qrisDataString ? (
                                /* Priority 2: Generate QR from QRIS data string */
                                <QRCode
                                    value={qrisDataString}
                                    size={240}
                                    level={"M"}
                                    viewBox={`0 0 256 256`}
                                    className="aspect-square w-full h-full"
                                />
                            ) : (
                                /* Fallback: No valid QR data available */
                                <div className="w-[240px] h-[240px] flex flex-col items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                                    <span className="text-3xl mb-2">⚠️</span>
                                    <p className="text-sm font-bold text-slate-500 text-center px-4">QR Code tidak tersedia</p>
                                    <p className="text-xs text-slate-400 text-center px-4 mt-1">Silakan buat transaksi baru</p>
                                </div>
                            )}
                        </div>

                        {/* Status Overlays */}
                        {isExpired && !isPaid && (
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-xl flex flex-col items-center justify-center z-30">
                                <span className="text-3xl mb-1">⚠️</span>
                                <p className="text-red-500 font-extrabold text-sm uppercase tracking-wider">Kedaluwarsa</p>
                            </div>
                        )}
                        {isPaid && (
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-xl flex flex-col items-center justify-center z-30">
                                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-2 shadow-lg shadow-emerald-200">
                                    <Check className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-emerald-600 font-extrabold text-lg tracking-widest uppercase">Lunas</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer - "Luxury Integration" */}
                <div className="pb-6 px-6 relative overflow-hidden bg-slate-50 border-t border-slate-100 pt-4">

                    {/* Bottom Info */}
                    <div className="flex justify-between items-end relative z-20">
                        <div className="text-left space-y-0.5">
                            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">Dicetak oleh</p>
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck className="w-3 h-3 text-slate-600" />
                                <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest">JobMate</p>
                            </div>
                        </div>
                        {/* "SATU QRIS" Slogan - Clean Official Look */}
                        <p className="text-[9px] font-[800] text-slate-400 text-right tracking-[0.1em] uppercase">
                            Satu QRIS<br />Untuk Semua
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );

}
