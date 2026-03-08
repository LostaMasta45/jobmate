"use client";

import React, { useRef } from "react";
import QRCode from "react-qr-code";
import { Download, ShieldCheck, CheckCircle2, Wallet, Building2, CreditCard, Lock, Shield, Landmark, FileText, CheckCircle, BadgeCheck, AlertCircle, Phone, Smartphone } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import Image from "next/image";

// Mock Data
const mockData = {
    orderId: "INV-987654321",
    amount: 150000,
    nmid: "ID1022147265592",
    qrString: "00020101021126660014ID.CO.QRIS.WWW01189360001431100000090214088014522444140303UMI51440014ID.CO.QRIS.WWW0215ID10221085028440303UMI52045812530336054061500005802ID5916INFOLOKERJOMBANG6007JOMBANG61056141362190715INV-9876543216304A1B2",
};

const handleDownload = async (ref: React.RefObject<HTMLDivElement | null>, name: string) => {
    if (!ref.current) return;
    const toastId = toast.loading("Menyiapkan gambar...");
    try {
        const canvas = await html2canvas(ref.current, {
            backgroundColor: null, // Transparent to capture custom borders if any
            scale: 3,
            useCORS: true,
            logging: false,
        } as any);
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `QR-${name}.png`;
        link.click();
        toast.dismiss(toastId);
        toast.success(`Berhasil mengunduh ${name}`);
    } catch (error) {
        console.error("Download failed:", error);
        toast.dismiss(toastId);
        toast.error("Gagal mengunduh gambar");
    }
};

// --- Variant 1: Minimalist Clean ---
const MinimalistOne = ({ data }: { data: typeof mockData }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    return (
        <div className="flex flex-col items-center gap-4">
            <div
                ref={cardRef}
                className="w-[320px] bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center"
            >
                <div className="w-full flex justify-between items-center mb-6">
                    <span className="text-xl font-bold tracking-tight text-slate-800">JobMate</span>
                    <span className="text-xs font-medium text-slate-400">QRIS</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl w-full flex justify-center mb-6 border border-slate-100">
                    <QRCode value={data.qrString} size={200} level="M" className="w-full h-auto" />
                </div>
                <div className="w-full text-center space-y-1">
                    <p className="text-sm text-slate-500 font-medium">Total Pembayaran</p>
                    <p className="text-2xl font-bold text-slate-900">Rp {data.amount.toLocaleString("id-ID")}</p>
                </div>
                <div className="w-full mt-4 pt-4 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 font-mono">{data.orderId}</p>
                </div>
            </div>
            <button onClick={() => handleDownload(cardRef, "Minimalist-1")} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
                <Download className="w-4 h-4" /> Download PNG
            </button>
        </div>
    );
};

// --- Variant 2: Minimalist Dark ---
const MinimalistDark = ({ data }: { data: typeof mockData }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    return (
        <div className="flex flex-col items-center gap-4">
            <div
                ref={cardRef}
                className="w-[320px] bg-[#121212] p-8 rounded-3xl shadow-xl border border-white/10 flex flex-col items-center relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                <div className="w-full text-center mb-8 relative z-10">
                    <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Scan untuk bayar</h3>
                    <p className="text-white text-3xl font-light tracking-tight">Rp {data.amount.toLocaleString("id-ID")}</p>
                </div>
                <div className="bg-white p-3 rounded-2xl w-full flex justify-center mb-8 relative z-10">
                    <QRCode value={data.qrString} size={200} level="M" className="w-full h-auto" />
                </div>
                <div className="w-full flex items-center justify-center gap-2 relative z-10">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <p className="text-xs text-white/60 font-medium">Secure Payment by JobMate</p>
                </div>
            </div>
            <button onClick={() => handleDownload(cardRef, "Minimalist-Dark")} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
                <Download className="w-4 h-4" /> Download PNG
            </button>
        </div>
    );
};

// --- Variant 3: Elegant Gold/Premium ---
const ElegantPremium = ({ data }: { data: typeof mockData }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    return (
        <div className="flex flex-col items-center gap-4">
            <div
                ref={cardRef}
                className="w-[320px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-[2px] rounded-3xl shadow-2xl relative"
            >
                <div className="bg-slate-900 w-full h-full rounded-[23px] p-6 flex flex-col items-center overflow-hidden relative">
                    {/* Gold accents */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600" />
                    <div className="absolute -right-6 -top-6 w-24 h-24 border border-amber-500/20 rounded-full" />
                    <div className="absolute -right-12 -top-12 w-36 h-36 border border-amber-500/10 rounded-full" />

                    <div className="mb-6 mt-2 relative z-10">
                        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 font-serif text-2xl font-bold italic text-center">PREMIUM</h2>
                        <p className="text-amber-500/50 text-[9px] uppercase tracking-[0.3em] mt-1 text-center">Invoice Pembayaran</p>
                    </div>

                    <div className="bg-gradient-to-b from-amber-100 to-white p-1 rounded-xl w-[220px] mb-6 shadow-[0_0_20px_rgba(251,191,36,0.15)] relative z-10">
                        <div className="bg-white p-3 rounded-lg w-full flex justify-center">
                            <QRCode value={data.qrString} size={180} level="M" className="w-full h-auto" />
                        </div>
                    </div>

                    <div className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center relative z-10">
                        <p className="text-slate-400 text-xs mb-1">Total Tagihan</p>
                        <p className="text-amber-400 text-xl font-bold tracking-wider">Rp {data.amount.toLocaleString("id-ID")}</p>
                    </div>
                </div>
            </div>
            <button onClick={() => handleDownload(cardRef, "Elegant-Premium")} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-amber-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
                <Download className="w-4 h-4" /> Download PNG
            </button>
        </div>
    );
};

// --- Variant 4: Elegant Glassmorphism ---
const ElegantGlass = ({ data }: { data: typeof mockData }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    return (
        <div className="flex flex-col items-center gap-4">
            {/* Wrapper to provide background for glass effect in downloaded image */}
            <div
                ref={cardRef}
                className="w-[340px] p-4 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-[40px] flex items-center justify-center relative overflow-hidden"
            >
                <div className="absolute w-40 h-40 bg-white/30 rounded-full blur-2xl top-0 left-0" />
                <div className="absolute w-40 h-40 bg-black/20 rounded-full blur-2xl bottom-0 right-0" />

                <div className="w-full bg-white/20 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-6 flex flex-col items-center relative z-10">
                    <h2 className="text-white font-bold tracking-widest uppercase text-sm mb-6 drop-shadow-sm">JobMate Pay</h2>

                    <div className="bg-white/90 p-4 rounded-2xl w-[220px] mb-6 shadow-xl backdrop-blur-sm transform transition-transform hover:scale-105 duration-500 shadow-purple-900/20">
                        <QRCode value={data.qrString} size={180} level="M" className="w-full h-auto" />
                    </div>

                    <div className="w-full flex justify-between items-end border-b border-white/20 pb-4 mb-4">
                        <div className="text-left">
                            <p className="text-white/70 text-xs font-medium mb-1 drop-shadow-sm">Bayar ke</p>
                            <p className="text-white font-semibold drop-shadow-sm">INFOLOKERJOMBANG</p>
                        </div>
                        <div className="bg-white/20 px-2 py-1 rounded text-[10px] text-white backdrop-blur-sm border border-white/30">
                            QRIS
                        </div>
                    </div>

                    <div className="w-full text-center">
                        <p className="text-white text-2xl font-bold drop-shadow-md">Rp {data.amount.toLocaleString("id-ID")}</p>
                    </div>
                </div>
            </div>
            <button onClick={() => handleDownload(cardRef, "Elegant-Glass")} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
                <Download className="w-4 h-4" /> Download PNG
            </button>
        </div>
    );
};

// --- Variant 5: Professional Banking ---
const ProfessionalBanking = ({ data }: { data: typeof mockData }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    return (
        <div className="flex flex-col items-center gap-4">
            <div
                ref={cardRef}
                className="w-[320px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-200 overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="bg-[#0056b3] p-5 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        <span className="font-bold tracking-wide">JobMate</span>
                    </div>
                    <div className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest border border-white/30">
                        MERCHANT
                    </div>
                </div>

                <div className="p-6 flex flex-col items-center">
                    <h3 className="text-slate-800 font-bold mb-1 text-lg">INFOLOKERJOMBANG</h3>
                    <p className="text-slate-500 text-xs mb-6">NMID: {data.nmid}</p>

                    <div className="border-2 border-blue-100 p-2 rounded-lg mb-6 w-[200px]">
                        <QRCode value={data.qrString} size={180} level="M" className="w-full h-auto" />
                    </div>

                    <div className="w-full bg-blue-50/50 rounded-lg p-3 border border-blue-100 flex justify-between items-center mb-4">
                        <div className="text-left">
                            <p className="text-[10px] text-slate-500 uppercase font-semibold">Nominal Tagihan</p>
                            <p className="text-blue-700 font-bold text-lg">Rp {data.amount.toLocaleString("id-ID")}</p>
                        </div>
                        <CreditCard className="w-6 h-6 text-blue-400" />
                    </div>

                    <div className="flex items-center gap-1 mt-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <p className="text-[10px] text-slate-500">Terverifikasi & Aman</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-3 border-t border-slate-200 flex justify-center items-center gap-4">
                    <span className="text-[10px] font-bold italic text-red-600 border border-red-200 bg-red-50 px-2 py-0.5 rounded">GPN</span>
                    <span className="text-[10px] font-bold text-slate-400">QRIS</span>
                </div>
            </div>
            <button onClick={() => handleDownload(cardRef, "Professional-Banking")} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
                <Download className="w-4 h-4" /> Download PNG
            </button>
        </div>
    );
};

// --- Variant 6: Professional Receipt/Invoice ---
const ProfessionalReceipt = ({ data }: { data: typeof mockData }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    return (
        <div className="flex flex-col items-center gap-4">
            <div
                ref={cardRef}
                className="w-[320px] bg-[#fdfbf7] p-6 rounded-sm shadow-md border-x-4 border-slate-800 relative"
            >
                {/* Top zigzag effect simulation with CSS */}
                <div className="absolute top-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDEwIDUsMCAxMCwxMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] opacity-50" />

                <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-6">
                    <h2 className="font-mono text-xl font-bold text-slate-800 uppercase tracking-widest mb-1">INVOICE</h2>
                    <p className="font-mono text-xs text-slate-500">#{data.orderId}</p>
                </div>

                <div className="space-y-2 mb-6 font-mono text-xs text-slate-600">
                    <div className="flex justify-between">
                        <span>MERCHANT:</span>
                        <span className="font-bold text-slate-800">JobMate</span>
                    </div>
                    <div className="flex justify-between">
                        <span>NMID:</span>
                        <span>{data.nmid.substring(0, 8)}...</span>
                    </div>
                    <div className="flex justify-between">
                        <span>DATE:</span>
                        <span>{new Date().toLocaleDateString('id-ID')}</span>
                    </div>
                </div>

                <div className="flex justify-center mb-6">
                    <div className="bg-white p-2 border border-slate-300">
                        <QRCode value={data.qrString} size={160} level="L" className="w-full h-auto" />
                    </div>
                </div>

                <div className="border-t-2 border-slate-800 pt-3 flex justify-between items-center">
                    <span className="font-mono font-bold text-slate-800 text-sm">TOTAL DUE</span>
                    <span className="font-mono font-bold text-slate-800 text-lg">Rp {data.amount.toLocaleString("id-ID")}</span>
                </div>

                <div className="w-full text-center mt-6">
                    <svg className="w-full h-8" preserveAspectRatio="none">
                        <path d="M0 15 Q 10 0 20 15 T 40 15 T 60 15 T 80 15 T 100 15 T 120 15 T 140 15 T 160 15 T 180 15 T 200 15 T 220 15 T 240 15 T 260 15 T 280 15 T 300 15 T 320 15" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                    </svg>
                    <p className="font-mono text-[9px] text-slate-400 mt-2">THANK YOU FOR YOUR BUSINESS</p>
                </div>
            </div>
            <button onClick={() => handleDownload(cardRef, "Professional-Receipt")} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
                <Download className="w-4 h-4" /> Download PNG
            </button>
        </div>
    );
};


// --- Variant 7: Pro Banking - Trust & Secure ---
const ProBankingSecure = ({ data }: { data: typeof mockData }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    return (
        <div className="flex flex-col items-center gap-4">
            <div
                ref={cardRef}
                className="w-[320px] bg-white rounded-2xl shadow-lg border border-teal-100 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        <span className="font-bold">SecureScan</span>
                    </div>
                    <Lock className="w-4 h-4 opacity-80" />
                </div>
                <div className="p-6 pb-2 text-center border-b border-teal-50">
                    <h3 className="text-slate-700 font-bold mb-1">INFOLOKERJOMBANG</h3>
                    <p className="text-teal-600 text-sm font-semibold mb-4">Pembayaran Terenkripsi</p>
                    <div className="bg-slate-50 p-3 rounded-xl inline-block border border-teal-100 mb-4 shadow-inner">
                        <QRCode value={data.qrString} size={160} level="M" className="w-full h-auto" />
                    </div>
                </div>
                <div className="p-4 bg-teal-50/30 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] text-slate-500 font-medium uppercase">Nominal</p>
                        <p className="text-slate-800 font-bold text-lg">Rp {data.amount.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="flex gap-1 items-center bg-teal-100/50 text-teal-700 px-2 py-1 rounded text-xs font-semibold border border-teal-200">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                    </div>
                </div>
            </div>
            <button onClick={() => handleDownload(cardRef, "ProBanking-Secure")} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-teal-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
                <Download className="w-4 h-4" /> Download PNG
            </button>
        </div>
    );
};

// --- Variant 8: Pro Banking - Modern Corporate ---
const ProBankingCorporate = ({ data }: { data: typeof mockData }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    return (
        <div className="flex flex-col items-center gap-4">
            <div
                ref={cardRef}
                className="w-[320px] bg-white p-6 rounded-xl shadow-md border-t-8 border-t-[#003366] border-x border-b border-slate-200"
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-[#003366] font-bold text-xl tracking-tight">BankCorp</h2>
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest">Corporate Services</p>
                    </div>
                    <Landmark className="w-6 h-6 text-slate-300" />
                </div>

                <div className="border border-slate-200 p-3 rounded-lg flex justify-center mb-4">
                    <QRCode value={data.qrString} size={180} level="M" className="w-full h-auto" />
                </div>

                <div className="space-y-3">
                    <div className="bg-slate-50 p-3 rounded border border-slate-100 flex justify-between items-center">
                        <span className="text-xs text-slate-500">Merchant</span>
                        <span className="text-xs font-bold text-slate-800">INFOLOKERJOMBANG</span>
                    </div>
                    <div className="bg-[#003366]/5 p-3 rounded border border-[#003366]/10 flex justify-between items-center">
                        <span className="text-xs font-bold text-[#003366]">Total</span>
                        <span className="text-lg font-bold text-[#003366]">Rp {data.amount.toLocaleString("id-ID")}</span>
                    </div>
                </div>
            </div>
            <button onClick={() => handleDownload(cardRef, "ProBanking-Corporate")} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#003366] bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
                <Download className="w-4 h-4" /> Download PNG
            </button>
        </div>
    );
};

// --- Variant 9: Pro Banking - App Style ---
const ProBankingApp = ({ data }: { data: typeof mockData }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    return (
        <div className="flex flex-col items-center gap-4">
            <div
                ref={cardRef}
                className="w-[320px] bg-[#f4f6f9] rounded-[2rem] shadow-xl border-4 border-white overflow-hidden"
            >
                <div className="bg-gradient-to-b from-[#5547d0] to-[#3977d3] p-6 pb-12 text-white text-center rounded-b-[2rem] relative shadow-inner">
                    <h2 className="font-bold text-lg mb-1">SCAN UNTUK BAYAR</h2>
                    <p className="text-blue-100 text-xs font-medium">Scan to Pay</p>
                </div>

                <div className="mx-6 -mt-8 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 relative z-10 flex flex-col items-center">
                    <div className="bg-[#5547d0]/10 text-[#5547d0] text-[10px] font-bold px-2 py-1 rounded-full mb-3 uppercase tracking-wider">
                        infolokerjombang
                    </div>
                    <QRCode value={data.qrString} size={150} level="M" className="w-full h-auto mb-4" />

                    <div className="w-full text-center border-t border-slate-100 pt-3">
                        <p className="text-2xl font-black text-slate-800 tracking-tight">Rp {data.amount.toLocaleString("id-ID")}</p>
                        <p className="text-[10px] text-slate-400 mt-1">NMID: {data.nmid}</p>
                    </div>
                </div>

                <div className="p-5 flex justify-center items-center gap-2 text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-[#3977d3]" />
                    <span className="text-xs font-semibold">Dilindungi oleh OJK</span>
                </div>
            </div>
            <button onClick={() => handleDownload(cardRef, "ProBanking-App")} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#5547d0] bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
                <Download className="w-4 h-4" /> Download PNG
            </button>
        </div>
    );
};

// --- Variant 10: Pro Banking - Minimal Trust ---
const ProBankingMinimalTrust = ({ data }: { data: typeof mockData }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    return (
        <div className="flex flex-col items-center gap-4">
            <div
                ref={cardRef}
                className="w-[320px] bg-white p-6 rounded-xl shadow border border-slate-200 flex flex-col items-center"
            >
                <div className="flex items-center gap-2 mb-4 w-full justify-center">
                    <BadgeCheck className="w-6 h-6 text-indigo-600" />
                    <span className="font-bold text-slate-800 text-lg">Verified Merchant</span>
                </div>

                <p className="text-slate-500 text-sm mb-6 text-center">Pastikan nama merchant sesuai dengan tujuan pembayaran Anda.</p>

                <div className="bg-slate-50 p-2 rounded-xl mb-6 shadow-sm border border-slate-100">
                    <QRCode value={data.qrString} size={180} level="M" className="w-full h-auto" />
                </div>

                <div className="w-full space-y-2">
                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Merchant</span>
                        <span className="font-bold text-slate-800">INFOLOKERJOMBANG</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-1">
                        <span className="text-slate-500">Nominal</span>
                        <span className="font-bold text-indigo-700 text-lg">Rp {data.amount.toLocaleString("id-ID")}</span>
                    </div>
                </div>
            </div>
            <button onClick={() => handleDownload(cardRef, "ProBanking-MinimalTrust")} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
                <Download className="w-4 h-4" /> Download PNG
            </button>
        </div>
    );
};

// --- Variant 11: Pro Banking - Neo Digital ---
const ProBankingNeo = ({ data }: { data: typeof mockData }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    return (
        <div className="flex flex-col items-center gap-4">
            <div
                ref={cardRef}
                className="w-[320px] bg-gradient-to-b from-orange-50 to-white p-6 rounded-[24px] shadow-lg border border-orange-100"
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Smartphone className="w-3 h-3" /> Digital Pay
                    </div>
                    <span className="text-xl font-black text-slate-800 italic pr-1">NEO</span>
                </div>

                <div className="bg-white p-4 rounded-[20px] shadow-sm mb-6 border border-orange-50 inline-block w-full flex justify-center relative">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-orange-400/10 rounded-bl-[20px] rounded-tr-[20px]" />
                    <QRCode value={data.qrString} size={170} level="M" className="w-full h-auto" />
                </div>

                <div className="text-center px-2">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Tagihan</p>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Rp {data.amount.toLocaleString("id-ID")}</h2>
                    <p className="text-slate-400 text-[11px] font-medium max-w-[200px] mx-auto leading-tight">Gunakan aplikasi Neo Digital untuk pembayaran lebih cepat.</p>
                </div>
            </div>
            <button onClick={() => handleDownload(cardRef, "ProBanking-Neo")} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-orange-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
                <Download className="w-4 h-4" /> Download PNG
            </button>
        </div>
    );
};

export default function ContohQRPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-800 mb-4">6 Gaya Desain UI QR Code</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Berikut adalah 6 variasi desain ulang untuk UI komponen pembayaran QR (Minimalist, Elegant, dan Professional).
                        Klik "Download PNG" untuk menyimpan dan mengecek hasil export-nya.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 justify-items-center">
                    {/* Minimalist Grid */}
                    <div className="space-y-4 flex flex-col items-center">
                        <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest border-b-2 border-blue-500 pb-2 mb-4 w-full text-center">Minimalist Clean</h2>
                        <MinimalistOne data={mockData} />
                    </div>

                    <div className="space-y-4 flex flex-col items-center">
                        <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest border-b-2 border-slate-800 pb-2 mb-4 w-full text-center">Minimalist Dark</h2>
                        <MinimalistDark data={mockData} />
                    </div>

                    {/* Elegant Grid */}
                    <div className="space-y-4 flex flex-col items-center">
                        <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest border-b-2 border-amber-500 pb-2 mb-4 w-full text-center">Elegant Premium</h2>
                        <ElegantPremium data={mockData} />
                    </div>

                    <div className="space-y-4 flex flex-col items-center">
                        <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest border-b-2 border-purple-500 pb-2 mb-4 w-full text-center">Elegant Glass</h2>
                        <ElegantGlass data={mockData} />
                    </div>

                    {/* Professional Grid */}
                    <div className="space-y-4 flex flex-col items-center">
                        <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest border-b-2 border-blue-700 pb-2 mb-4 w-full text-center">Pro Banking</h2>
                        <ProfessionalBanking data={mockData} />
                    </div>

                    <div className="space-y-4 flex flex-col items-center">
                        <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest border-b-2 border-slate-600 pb-2 mb-4 w-full text-center">Pro Invoice</h2>
                        <ProfessionalReceipt data={mockData} />
                    </div>
                </div>

                <div className="text-center mt-16 mb-8 border-t border-slate-200 pt-16">
                    <h1 className="text-3xl font-bold text-slate-800 mb-4">5 Gaya Pro Banking & Trust</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto mb-12">
                        Desain tambahan yang secara khusus menonjolkan elemen keamanan, verifikasi, dan kenyamanan ala aplikasi perbankan modern dan konvensional.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 justify-items-center mb-16">
                    {/* Trust & Secure Grid */}
                    <div className="space-y-4 flex flex-col items-center">
                        <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest border-b-2 border-teal-500 pb-2 mb-4 w-full text-center">Banking Secure</h2>
                        <ProBankingSecure data={mockData} />
                    </div>

                    <div className="space-y-4 flex flex-col items-center">
                        <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest border-b-2 border-[#003366] pb-2 mb-4 w-full text-center">Banking Corp</h2>
                        <ProBankingCorporate data={mockData} />
                    </div>

                    <div className="space-y-4 flex flex-col items-center">
                        <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest border-b-2 border-blue-500 pb-2 mb-4 w-full text-center">Banking App</h2>
                        <ProBankingApp data={mockData} />
                    </div>

                    <div className="space-y-4 flex flex-col items-center">
                        <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest border-b-2 border-indigo-600 pb-2 mb-4 w-full text-center">Minimal Trust</h2>
                        <ProBankingMinimalTrust data={mockData} />
                    </div>

                    <div className="space-y-4 flex flex-col items-center md:col-span-2 xl:col-span-1">
                        <h2 className="text-lg font-bold text-slate-700 uppercase tracking-widest border-b-2 border-orange-500 pb-2 mb-4 w-full text-center">Neo Digital</h2>
                        <ProBankingNeo data={mockData} />
                    </div>
                </div>
            </div>
        </div>
    );
}
