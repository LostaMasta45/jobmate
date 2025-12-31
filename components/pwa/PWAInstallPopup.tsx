"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { useCanInstallPWA, usePWAMode } from "@/hooks/usePWAMode";
import { motion, AnimatePresence } from "framer-motion";

interface PWAInstallPopupProps {
    /**
     * Delay before showing popup (in ms)
     * @default 2000
     */
    delay?: number;
    /**
     * Key for localStorage to remember dismissal
     * @default "pwa-popup-dismissed"
     */
    storageKey?: string;
    /**
     * How long to remember dismissal (in days)
     * @default 3
     */
    dismissDays?: number;
}

export function PWAInstallPopup({
    delay = 2000,
    storageKey = "pwa-popup-dismissed",
    dismissDays = 3,
}: PWAInstallPopupProps) {
    const { canInstall, promptInstall } = useCanInstallPWA();
    const { isPWA } = usePWAMode();
    const [showPopup, setShowPopup] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        // Don't show if already PWA or not mobile
        if (isPWA || !isMobile) return;

        // Check if popup was dismissed recently
        const dismissedTime = localStorage.getItem(storageKey);
        if (dismissedTime) {
            const dismissedDate = new Date(parseInt(dismissedTime));
            const now = new Date();
            const daysDiff = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
            if (daysDiff < dismissDays) {
                return;
            }
        }

        // Show popup after delay if install is available
        const timer = setTimeout(() => {
            if (canInstall) {
                setShowPopup(true);
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [canInstall, isPWA, isMobile, delay, storageKey, dismissDays]);

    // Update visibility when canInstall changes
    useEffect(() => {
        if (!isPWA && isMobile && canInstall && !showPopup) {
            const dismissedTime = localStorage.getItem(storageKey);
            if (!dismissedTime) {
                const timer = setTimeout(() => setShowPopup(true), delay);
                return () => clearTimeout(timer);
            }
        }
    }, [canInstall, isPWA, isMobile, showPopup, delay, storageKey]);

    const handleDismiss = () => {
        localStorage.setItem(storageKey, Date.now().toString());
        setShowPopup(false);
    };

    const handleInstall = async () => {
        setIsInstalling(true);
        try {
            const accepted = await promptInstall();
            if (accepted) {
                setShowPopup(false);
            }
        } finally {
            setIsInstalling(false);
        }
    };

    // Don't render on desktop, when already PWA, or when can't install
    if (!isMobile || isPWA || !canInstall) {
        return null;
    }

    return (
        <AnimatePresence>
            {showPopup && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    className="fixed bottom-4 left-4 right-4 z-[9999] md:hidden"
                >
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/95 px-4 py-3 shadow-xl backdrop-blur-sm">
                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            className="shrink-0 rounded-full p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                            aria-label="Tutup"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {/* Content */}
                        <p className="flex-1 text-sm text-zinc-300">
                            Install <span className="font-medium text-white">JobMate</span> untuk akses cepat
                        </p>

                        {/* Install button */}
                        <button
                            onClick={handleInstall}
                            disabled={isInstalling}
                            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-indigo-500 active:scale-95 disabled:opacity-70"
                        >
                            <Download className="h-3.5 w-3.5" />
                            {isInstalling ? "..." : "Install"}
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
