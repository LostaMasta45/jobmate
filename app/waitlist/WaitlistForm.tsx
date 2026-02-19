"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, CheckCircle2, ExternalLink } from "lucide-react";

export function WaitlistForm({ id }: { id?: string }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [waLink, setWaLink] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Terjadi kesalahan");
                return;
            }

            setSuccess(true);
            setWaLink(data.wa_group_link);
        } catch {
            setError("Gagal terhubung ke server. Coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border border-emerald-500/30 rounded-3xl p-8 text-center backdrop-blur-xl max-w-md mx-auto"
            >
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Selamat, {name}! 🎉</h3>
                <p className="text-emerald-200 mb-6">Kamu berhasil terdaftar di Waitlist Career VIP InfoLokerJombang!</p>
                <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-full text-lg shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] hover:scale-105 transition-all"
                >
                    Gabung Grup WA Sekarang
                    <ExternalLink className="w-5 h-5" />
                </a>
                <p className="text-xs text-emerald-300/60 mt-4">Klik tombol di atas untuk langsung join grup WhatsApp eksklusif</p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} id={id} className="max-w-md mx-auto space-y-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-14 px-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 backdrop-blur-md transition-all text-base"
                    required
                />
            </div>
            <div className="relative">
                <input
                    type="tel"
                    placeholder="Nomor WhatsApp (08xxxxxxxxxx)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-14 px-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 backdrop-blur-md transition-all text-base"
                    required
                />
            </div>
            {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                    {error}
                </motion.p>
            )}
            <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-brand to-purple-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(0,172,199,0.4)] hover:shadow-[0_0_50px_rgba(0,172,199,0.6)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        Daftar Waitlist
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>
        </form>
    );
}
