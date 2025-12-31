"use client";

import { useState } from "react";
import { Download, Check, Smartphone } from "lucide-react";
import { useCanInstallPWA, usePWAMode } from "@/hooks/usePWAMode";
import { cn } from "@/lib/utils";

interface PWAInstallButtonProps {
    /**
     * Button variant
     */
    variant?: "default" | "outline" | "ghost" | "gradient";
    /**
     * Button size
     */
    size?: "sm" | "md" | "lg";
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Show icon only (no text)
     */
    iconOnly?: boolean;
    /**
     * Custom label
     */
    label?: string;
}

export function PWAInstallButton({
    variant = "gradient",
    size = "md",
    className,
    iconOnly = false,
    label = "Install App",
}: PWAInstallButtonProps) {
    const { canInstall, promptInstall } = useCanInstallPWA();
    const { isPWA } = usePWAMode();
    const [isInstalling, setIsInstalling] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    const handleInstall = async () => {
        if (!canInstall || isInstalling) return;

        setIsInstalling(true);
        try {
            const accepted = await promptInstall();
            if (accepted) {
                setIsInstalled(true);
            }
        } finally {
            setIsInstalling(false);
        }
    };

    // Don't show if already installed as PWA, not available, or on desktop
    if (isPWA || typeof window !== "undefined" && window.innerWidth > 768) {
        return null;
    }

    // Show "installed" state briefly after installation
    if (isInstalled) {
        return (
            <div
                className={cn(
                    "flex items-center gap-2 rounded-xl bg-green-500/20 px-4 py-2 text-green-400",
                    size === "sm" && "px-3 py-1.5 text-sm",
                    size === "lg" && "px-5 py-3 text-lg",
                    className
                )}
            >
                <Check className="h-4 w-4" />
                {!iconOnly && <span>Installed!</span>}
            </div>
        );
    }

    // Don't render if install is not available
    if (!canInstall) {
        return null;
    }

    const sizeClasses = {
        sm: "px-3 py-1.5 text-sm gap-1.5",
        md: "px-4 py-2.5 text-sm gap-2",
        lg: "px-5 py-3 text-base gap-2.5",
    };

    const iconSizes = {
        sm: "h-3.5 w-3.5",
        md: "h-4 w-4",
        lg: "h-5 w-5",
    };

    const variantClasses = {
        default:
            "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800",
        outline:
            "border border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 active:bg-indigo-500/20",
        ghost:
            "text-indigo-400 hover:bg-indigo-500/10 active:bg-indigo-500/20",
        gradient:
            "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:opacity-90 active:opacity-80 shadow-lg shadow-indigo-500/25",
    };

    return (
        <button
            onClick={handleInstall}
            disabled={isInstalling}
            className={cn(
                "flex items-center justify-center rounded-xl font-medium transition-all active:scale-95 disabled:opacity-70",
                sizeClasses[size],
                variantClasses[variant],
                iconOnly && "aspect-square p-0",
                iconOnly && size === "sm" && "h-8 w-8",
                iconOnly && size === "md" && "h-10 w-10",
                iconOnly && size === "lg" && "h-12 w-12",
                className
            )}
            aria-label={iconOnly ? label : undefined}
        >
            {isInstalling ? (
                <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {!iconOnly && <span>Installing...</span>}
                </>
            ) : (
                <>
                    {variant === "gradient" ? (
                        <Smartphone className={iconSizes[size]} />
                    ) : (
                        <Download className={iconSizes[size]} />
                    )}
                    {!iconOnly && <span>{label}</span>}
                </>
            )}
        </button>
    );
}
