"use client";

import { useState, useEffect } from "react";

export interface PWAModeState {
    /**
     * True if app is running in standalone mode (installed as PWA)
     */
    isPWA: boolean;

    /**
     * True if running on iOS Safari with "Add to Home Screen"
     */
    isIOSPWA: boolean;

    /**
     * True if running on Android (can detect PWA or browser)
     */
    isAndroid: boolean;

    /**
     * True if this is the first check (loading state)
     */
    isLoading: boolean;

    /**
     * Display mode: 'standalone' | 'browser' | 'minimal-ui' | 'fullscreen'
     */
    displayMode: string;
}

/**
 * Hook to detect if the app is running as an installed PWA
 * 
 * Usage:
 * ```tsx
 * const { isPWA, isIOSPWA } = usePWAMode();
 * 
 * if (isPWA) {
 *   // Show PWA-specific UI (fullscreen, custom header, etc.)
 * }
 * ```
 */
export function usePWAMode(): PWAModeState {
    const [state, setState] = useState<PWAModeState>({
        isPWA: false,
        isIOSPWA: false,
        isAndroid: false,
        isLoading: true,
        displayMode: "browser",
    });

    useEffect(() => {
        const checkPWAMode = () => {
            // Check for standalone display mode (Android PWA / Desktop PWA)
            const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

            // Check for iOS Safari "Add to Home Screen"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isIOSSafariStandalone = (window.navigator as any).standalone === true;

            // Check for minimal-ui (some PWAs use this)
            const isMinimalUI = window.matchMedia("(display-mode: minimal-ui)").matches;

            // Check for fullscreen
            const isFullscreen = window.matchMedia("(display-mode: fullscreen)").matches;

            // Detect Android
            const isAndroid = /android/i.test(navigator.userAgent);

            // Determine display mode
            let displayMode = "browser";
            if (isStandalone || isIOSSafariStandalone) {
                displayMode = "standalone";
            } else if (isMinimalUI) {
                displayMode = "minimal-ui";
            } else if (isFullscreen) {
                displayMode = "fullscreen";
            }

            setState({
                isPWA: isStandalone || isIOSSafariStandalone,
                isIOSPWA: isIOSSafariStandalone,
                isAndroid,
                isLoading: false,
                displayMode,
            });
        };

        checkPWAMode();

        // Listen for display mode changes
        const mediaQuery = window.matchMedia("(display-mode: standalone)");
        const handler = () => checkPWAMode();

        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    return state;
}

/**
 * Hook to detect if user can install the PWA
 */
export function useCanInstallPWA() {
    const [canInstall, setCanInstall] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setCanInstall(true);
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const promptInstall = async () => {
        if (!deferredPrompt) return false;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        setDeferredPrompt(null);
        setCanInstall(false);

        return outcome === "accepted";
    };

    return { canInstall, promptInstall };
}
