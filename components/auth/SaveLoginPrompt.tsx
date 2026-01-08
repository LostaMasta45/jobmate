"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Bookmark, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SaveLoginPromptProps {
    isOpen: boolean;
    userName: string;
    onSave: () => void;
    onSkip: () => void;
    variant?: "default" | "mobile";
}

export function SaveLoginPrompt({
    isOpen,
    userName,
    onSave,
    onSkip,
    variant = "default",
}: SaveLoginPromptProps) {
    if (!isOpen) return null;

    const handleSave = () => {
        onSave();
    };

    const handleSkip = () => {
        onSkip();
    };

    if (variant === "mobile") {
        return (
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="w-full max-w-md bg-white rounded-t-[2rem] p-6 pb-8 shadow-2xl"
                        >
                            {/* Header Illustration */}
                            <div className="flex justify-center mb-4">
                                <div className="relative">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.2 }}
                                        className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/30"
                                    >
                                        <CheckCircle2 className="h-10 w-10 text-white" />
                                    </motion.div>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.4 }}
                                        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-[#00acc7] flex items-center justify-center shadow-lg"
                                    >
                                        <Bookmark className="h-4 w-4 text-white" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="text-center mb-6">
                                <motion.h3
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-xl font-bold text-slate-900 mb-2"
                                >
                                    Login Berhasil! 🎉
                                </motion.h3>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-slate-600 text-sm leading-relaxed"
                                >
                                    Hai <span className="font-semibold text-[#00acc7]">{userName}</span>,
                                    <br />
                                    simpan login di perangkat ini?
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-slate-400 text-xs mt-2"
                                >
                                    Lain kali bisa login dengan satu klik!
                                </motion.p>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <Button
                                    onClick={handleSave}
                                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#00acc7] to-[#009eb5] hover:from-[#00bed1] hover:to-[#00acc7] text-white font-semibold text-base shadow-lg shadow-[#00acc7]/25"
                                >
                                    <Bookmark className="h-5 w-5 mr-2" />
                                    Simpan Login
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={handleSkip}
                                    className="w-full h-12 rounded-2xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 font-medium"
                                >
                                    Nanti Saja
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // Desktop variant
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-sm bg-background rounded-2xl p-6 shadow-2xl border"
                    >
                        {/* Close button */}
                        <button
                            onClick={handleSkip}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>

                        {/* Header Illustration */}
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 0.2 }}
                                    className="h-16 w-16 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/20"
                                >
                                    <CheckCircle2 className="h-8 w-8 text-white" />
                                </motion.div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 0.4 }}
                                    className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-brand flex items-center justify-center shadow-lg"
                                >
                                    <Bookmark className="h-3 w-3 text-white" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-center mb-6">
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg font-bold mb-1"
                            >
                                Login Berhasil! 🎉
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-muted-foreground text-sm"
                            >
                                Hai <span className="font-semibold text-brand">{userName}</span>,
                                simpan login di perangkat ini?
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-muted-foreground/60 text-xs mt-1"
                            >
                                Lain kali bisa login dengan satu klik!
                            </motion.p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={handleSkip}
                                className="flex-1 h-11"
                            >
                                Nanti Saja
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="flex-1 h-11 bg-brand hover:bg-brand/90"
                            >
                                <Bookmark className="h-4 w-4 mr-2" />
                                Simpan
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
