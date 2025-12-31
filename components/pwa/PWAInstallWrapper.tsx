"use client";

import { PWAInstallPopup } from "@/components/pwa";

/**
 * Client component wrapper to add PWA install popup on specific pages.
 * Use this in server components like Dashboard and VIP pages.
 */
export function PWAInstallWrapper() {
    return <PWAInstallPopup />;
}
