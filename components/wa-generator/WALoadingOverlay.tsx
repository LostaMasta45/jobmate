"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Sparkles, Send, CheckCircle } from "lucide-react";
import type { WAMessageType } from "./types";

interface WALoadingOverlayProps {
    isLoading: boolean;
    messageType?: WAMessageType;
}

const loadingMessages: Record<WAMessageType, string[]> = {
    application: [
        "Menyusun opening yang menarik...",
        "Menambahkan value proposition...",
        "Membuat pesan yang personal...",
        "Finalisasi pesan lamaran...",
    ],
    follow_up: [
        "Menyusun pesan follow-up...",
        "Menambahkan context yang tepat...",
        "Membuat tone yang profesional...",
        "Finalisasi pesan...",
    ],
    interview_confirmation: [
        "Menyusun konfirmasi kehadiran...",
        "Menambahkan detail interview...",
        "Membuat pesan yang jelas...",
        "Finalisasi konfirmasi...",
    ],
    thank_you: [
        "Menyusun ucapan terima kasih...",
        "Menambahkan kesan spesifik...",
        "Membuat pesan yang memorable...",
        "Finalisasi pesan...",
    ],
    status_inquiry: [
        "Menyusun pertanyaan status...",
        "Menambahkan context interview...",
        "Membuat tone yang sopan...",
        "Finalisasi pesan...",
    ],
    re_application: [
        "Menyusun pesan re-application...",
        "Menambahkan value baru...",
        "Membuat fresh perspective...",
        "Finalisasi pesan...",
    ],
    referral: [
        "Menyusun pesan referral...",
        "Menambahkan context koneksi...",
        "Membuat ask yang jelas...",
        "Finalisasi pesan...",
    ],
};

export function WALoadingOverlay({ isLoading, messageType = 'application' }: WALoadingOverlayProps) {
    const messages = loadingMessages[messageType] || loadingMessages.application;

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 max-w-md w-full mx-4 shadow-2xl overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl" />

                        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                            {/* Animated Icon */}
                            <div className="relative">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl"
                                >
                                    <MessageCircle className="h-10 w-10 text-white" />
                                </motion.div>

                                {/* Floating Sparkle */}
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, 10, 0]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute -top-2 -right-2 p-2 bg-yellow-400 rounded-xl shadow-lg"
                                >
                                    <Sparkles className="h-4 w-4 text-yellow-900" />
                                </motion.div>
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    AI Sedang Bekerja...
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-zinc-400">
                                    Membuat pesan WhatsApp profesional untuk Anda
                                </p>
                            </div>

                            {/* Progress Steps */}
                            <div className="w-full space-y-3">
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.8 }}
                                        className="flex items-center gap-3 text-left"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.8 + 0.3 }}
                                            className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0"
                                        >
                                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        </motion.div>
                                        <span className="text-sm text-slate-600 dark:text-zinc-300">
                                            {message}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Loading Bar */}
                            <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3, ease: "easeInOut" }}
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
