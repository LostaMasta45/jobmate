"use client";

import { ReactNode } from "react";
import { usePWAMode } from "@/hooks/usePWAMode";

interface PWASafeAreaProps {
    children: ReactNode;
    className?: string;
    /**
     * Apply padding to top (for notch/camera area)
     */
    top?: boolean;
    /**
     * Apply padding to bottom (for home indicator)
     */
    bottom?: boolean;
    /**
     * Apply padding to left/right (for edge displays)
     */
    horizontal?: boolean;
    /**
     * Only apply safe area in PWA mode
     */
    pwaOnly?: boolean;
}

/**
 * Component that provides safe area padding for notch/camera areas
 * Works automatically in PWA standalone mode
 * 
 * Usage:
 * ```tsx
 * <PWASafeArea top bottom>
 *   <YourContent />
 * </PWASafeArea>
 * ```
 */
export function PWASafeArea({
    children,
    className = "",
    top = false,
    bottom = false,
    horizontal = false,
    pwaOnly = false,
}: PWASafeAreaProps) {
    const { isPWA, isLoading } = usePWAMode();

    // If pwaOnly is true and not in PWA mode, just render children
    if (pwaOnly && !isPWA && !isLoading) {
        return <div className={className}>{children}</div>;
    }

    const safeAreaClasses: string[] = [];

    if (top) {
        safeAreaClasses.push("pt-[env(safe-area-inset-top)]");
    }
    if (bottom) {
        safeAreaClasses.push("pb-[env(safe-area-inset-bottom)]");
    }
    if (horizontal) {
        safeAreaClasses.push(
            "pl-[env(safe-area-inset-left)]",
            "pr-[env(safe-area-inset-right)]"
        );
    }

    return (
        <div className={`${safeAreaClasses.join(" ")} ${className}`}>
            {children}
        </div>
    );
}

/**
 * Header wrapper with automatic safe area handling for PWA mode
 */
interface PWAHeaderProps {
    children: ReactNode;
    className?: string;
    /**
     * Background color class (will extend to notch area)
     */
    bgColor?: string;
}

export function PWAHeader({
    children,
    className = "",
    bgColor = "bg-black",
}: PWAHeaderProps) {
    const { isPWA } = usePWAMode();

    return (
        <header
            className={`
        ${bgColor}
        ${isPWA ? "pt-[env(safe-area-inset-top)]" : ""}
        ${className}
      `}
        >
            {children}
        </header>
    );
}

/**
 * Bottom bar wrapper with automatic safe area handling
 */
interface PWABottomBarProps {
    children: ReactNode;
    className?: string;
    bgColor?: string;
}

export function PWABottomBar({
    children,
    className = "",
    bgColor = "bg-black",
}: PWABottomBarProps) {
    const { isPWA } = usePWAMode();

    return (
        <div
            className={`
        ${bgColor}
        ${isPWA ? "pb-[env(safe-area-inset-bottom)]" : ""}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
