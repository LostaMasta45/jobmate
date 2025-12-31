"use client";

import { useState, useEffect } from "react";
import { X, Download, Share, PlusSquare } from "lucide-react";
import { useCanInstallPWA, usePWAMode } from "@/hooks/usePWAMode";
import { motion, AnimatePresence } from "framer-motion";

interface PWAInstallPopupProps {
    /**
     * Delay before showing popup (in ms)
     * @default 1500
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
    delay = 1500,
    storageKey = "pwa-popup-dismissed",
    dismissDays = 3,
}: PWAInstallPopupProps) {
    const { canInstall, promptInstall } = useCanInstallPWA();
    const { isPWA } = usePWAMode();
    const [showPopup, setShowPopup] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);

    // Check if mobile and detect platform
    useEffect(() => {
        const checkDevice = () => {
            const width = window.innerWidth;
            const userAgent = navigator.userAgent.toLowerCase();

            setIsMobile(width <= 768);
            setIsIOS(/iphone|ipad|ipod/.test(userAgent) && !('MSStream' in window));
            setIsAndroid(/android/.test(userAgent));
        };
        checkDevice();
        window.addEventListener("resize", checkDevice);
        return () => window.removeEventListener("resize", checkDevice);
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

        // Show popup after delay - regardless of canInstall for iOS
        // For Android, show if canInstall is available OR after longer delay as fallback
        const timer = setTimeout(() => {
            // Show for iOS (doesn't support beforeinstallprompt)
            if (isIOS) {
                setShowPopup(true);
                return;
            }
            // Show for Android if canInstall is true
            if (isAndroid && canInstall) {
                setShowPopup(true);
                return;
            }
            // Fallback: show anyway after delay for other mobile browsers
            if (isMobile && !isIOS && !isAndroid) {
                setShowPopup(true);
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [canInstall, isPWA, isMobile, isIOS, isAndroid, delay, storageKey, dismissDays]);

    // For Android: also show when canInstall becomes true later
    useEffect(() => {
        if (!isPWA && isMobile && isAndroid && canInstall && !showPopup) {
            const dismissedTime = localStorage.getItem(storageKey);
            if (!dismissedTime) {
                setShowPopup(true);
            }
        }
    }, [canInstall, isPWA, isMobile, isAndroid, showPopup, storageKey]);

    const handleDismiss = () => {
        localStorage.setItem(storageKey, Date.now().toString());
        setShowPopup(false);
    };

    const handleInstall = async () => {
        if (isIOS) {
            // iOS doesn't support programmatic install, just dismiss
            handleDismiss();
            return;
        }

        if (canInstall) {
            setIsInstalling(true);
            try {
                const accepted = await promptInstall();
                if (accepted) {
                    setShowPopup(false);
                }
            } finally {
                setIsInstalling(false);
            }
        } else {
            // Fallback: just dismiss if can't install
            handleDismiss();
        }
    };

    // Don't render on desktop or when already PWA
    if (!isMobile || isPWA) {
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
                    <div className="rounded-xl border border-white/10 bg-zinc-900/95 px-4 py-3 shadow-xl backdrop-blur-sm">
                        {/* Header with close button */}
                        <div className="flex items-start gap-3">
                            <button
                                onClick={handleDismiss}
                                className="shrink-0 rounded-full p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                                aria-label="Tutup"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="flex-1">
                                {isIOS ? (
                                    // iOS Instructions
                                    <>
                                        <p className="text-sm text-zinc-300">
                                            Install <span className="font-medium text-white">JobMate</span>
                                        </p>
                                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-zinc-500">
                                            Tap <Share className="h-3.5 w-3.5 text-indigo-400" /> lalu <PlusSquare className="h-3.5 w-3.5 text-indigo-400" /> Add to Home Screen
                                        </p>
                                    </>
                                ) : (
                                    // Android / Other
                                    <p className="text-sm text-zinc-300">
                                        Install <span className="font-medium text-white">JobMate</span> untuk akses cepat
                                    </p>
                                )}
                            </div>

                            {/* Install button - only for non-iOS */}
                            {!isIOS && (
                                <button
                                    onClick={handleInstall}
                                    disabled={isInstalling}
                                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-indigo-500 active:scale-95 disabled:opacity-70"
                                >
                                    <Download className="h-3.5 w-3.5" />
                                    {isInstalling ? "..." : "Install"}
                                </button>
                            )}

                            {/* OK button for iOS */}
                            {isIOS && (
                                <button
                                    onClick={handleDismiss}
                                    className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-indigo-500 active:scale-95"
                                >
                                    OK
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
