"use client";

import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { useCanInstallPWA } from "@/hooks/usePWAMode";
import { motion, AnimatePresence } from "framer-motion";

interface PWAInstallBannerProps {
    /**
     * Delay before showing banner (in ms)
     * @default 3000
     */
    delay?: number;
    /**
     * Key for localStorage to remember dismissal
     * @default "pwa-banner-dismissed"
     */
    storageKey?: string;
    /**
     * How long to remember dismissal (in days)
     * @default 7
     */
    dismissDays?: number;
}

export function PWAInstallBanner({
    delay = 3000,
    storageKey = "pwa-banner-dismissed",
    dismissDays = 7,
}: PWAInstallBannerProps) {
    const { canInstall, promptInstall } = useCanInstallPWA();
    const [showBanner, setShowBanner] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);

    useEffect(() => {
        // Check if banner was dismissed recently
        const dismissedTime = localStorage.getItem(storageKey);
        if (dismissedTime) {
            const dismissedDate = new Date(parseInt(dismissedTime));
            const now = new Date();
            const daysDiff = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
            if (daysDiff < dismissDays) {
                return; // Don't show if dismissed within the period
            }
        }

        // Show banner after delay if install is available
        const timer = setTimeout(() => {
            if (canInstall) {
                setShowBanner(true);
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [canInstall, delay, storageKey, dismissDays]);

    // Update visibility when canInstall changes
    useEffect(() => {
        if (canInstall && showBanner === false) {
            const dismissedTime = localStorage.getItem(storageKey);
            if (!dismissedTime) {
                const timer = setTimeout(() => setShowBanner(true), delay);
                return () => clearTimeout(timer);
            }
        }
    }, [canInstall, showBanner, delay, storageKey]);

    const handleDismiss = () => {
        localStorage.setItem(storageKey, Date.now().toString());
        setShowBanner(false);
    };

    const handleInstall = async () => {
        setIsInstalling(true);
        try {
            const accepted = await promptInstall();
            if (accepted) {
                setShowBanner(false);
            }
        } finally {
            setIsInstalling(false);
        }
    };

    // Only render on mobile-sized screens
    if (typeof window !== "undefined" && window.innerWidth > 768) {
        return null;
    }

    return (
        <AnimatePresence>
            {showBanner && canInstall && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed bottom-0 left-0 right-0 z-[9999] p-4 pb-safe"
                >
                    <div className="mx-auto max-w-md">
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-600/95 via-purple-600/95 to-pink-600/95 p-4 shadow-2xl backdrop-blur-xl">
                            {/* Glow effect */}
                            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
                            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-pink-400/20 blur-3xl" />

                            {/* Close button */}
                            <button
                                onClick={handleDismiss}
                                className="absolute right-3 top-3 rounded-full bg-white/10 p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                                aria-label="Tutup"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="relative flex items-start gap-3">
                                {/* Icon */}
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                    <Smartphone className="h-6 w-6 text-white" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pr-6">
                                    <h3 className="font-semibold text-white">
                                        Install JobMate
                                    </h3>
                                    <p className="mt-0.5 text-sm text-white/80">
                                        Akses lebih cepat langsung dari home screen kamu!
                                    </p>

                                    {/* Install button */}
                                    <button
                                        onClick={handleInstall}
                                        disabled={isInstalling}
                                        className="mt-3 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 shadow-lg transition-all hover:bg-white/90 active:scale-95 disabled:opacity-70"
                                    >
                                        <Download className="h-4 w-4" />
                                        {isInstalling ? "Installing..." : "Install Sekarang"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
