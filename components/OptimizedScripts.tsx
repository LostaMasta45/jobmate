"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lazy load heavy providers/components that aren't needed for LCP
const Toaster = dynamic(() => import("sonner").then((mod) => mod.Toaster), {
    ssr: false,
});
const ToastContainer = dynamic(
    () => import("@/components/mobile/ToastNotification").then((mod) => mod.ToastContainer),
    { ssr: false }
);
const ConditionalSessionTimeout = dynamic(
    () =>
        import("@/components/auth/ConditionalSessionTimeout").then(
            (mod) => mod.ConditionalSessionTimeout
        ),
    { ssr: false }
);

export function DelayedScripts() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Delay loading these non-critical components until after LCP (approx 3s)
        // or use requestIdleCallback if available
        const timer = setTimeout(() => {
            setMounted(true);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <ConditionalSessionTimeout />
            <Toaster position="top-center" richColors />
            <ToastContainer />
        </>
    );
}
