"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, X, Check } from "lucide-react";
import {
    isPushSupported,
    getNotificationPermission,
    requestNotificationPermission,
    subscribeToPush,
    unsubscribeFromPush,
    isSubscribedToPush,
} from "@/lib/push-notifications";

interface NotificationPromptProps {
    onClose?: () => void;
    showAsCard?: boolean;
}

export function NotificationPrompt({ onClose, showAsCard = false }: NotificationPromptProps) {
    const [isSupported, setIsSupported] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            const supported = isPushSupported();
            setIsSupported(supported);

            if (supported) {
                setPermission(getNotificationPermission());
                const subscribed = await isSubscribedToPush();
                setIsSubscribed(subscribed);
            }
        };

        checkStatus();

        // Check if user dismissed the prompt before
        const dismissed = localStorage.getItem("notification_prompt_dismissed");
        if (dismissed) {
            setIsDismissed(true);
        }
    }, []);

    const handleEnable = async () => {
        setIsLoading(true);
        try {
            const perm = await requestNotificationPermission();
            setPermission(perm);

            if (perm === "granted") {
                await subscribeToPush();
                setIsSubscribed(true);
            }
        } catch (error) {
            console.error("Failed to enable notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisable = async () => {
        setIsLoading(true);
        try {
            await unsubscribeFromPush();
            setIsSubscribed(false);
        } catch (error) {
            console.error("Failed to disable notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDismiss = () => {
        setIsDismissed(true);
        localStorage.setItem("notification_prompt_dismissed", "true");
        onClose?.();
    };

    // Don't show if not supported, already subscribed, denied, or dismissed
    if (!isSupported || isSubscribed || permission === "denied" || isDismissed) {
        return null;
    }

    const content = (
        <>
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-sm">
                        Aktifkan Notifikasi
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                        Dapatkan update lowongan terbaru, reminder interview, dan follow-up langsung di HP kamu!
                    </p>
                </div>
                <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X className="w-4 h-4 text-gray-500" />
                </button>
            </div>
            <div className="flex gap-2 mt-4">
                <button
                    onClick={handleEnable}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Check className="w-4 h-4" />
                            Aktifkan
                        </>
                    )}
                </button>
                <button
                    onClick={handleDismiss}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium text-gray-400 transition-colors"
                >
                    Nanti
                </button>
            </div>
        </>
    );

    if (showAsCard) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
            >
                {content}
            </motion.div>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 p-4 rounded-xl bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl"
            >
                {content}
            </motion.div>
        </AnimatePresence>
    );
}

// Toggle button component for settings
export function NotificationToggle() {
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            const supported = isPushSupported();
            setIsSupported(supported);

            if (supported) {
                const subscribed = await isSubscribedToPush();
                setIsSubscribed(subscribed);
            }
        };

        checkStatus();
    }, []);

    const handleToggle = async () => {
        setIsLoading(true);
        try {
            if (isSubscribed) {
                await unsubscribeFromPush();
                setIsSubscribed(false);
            } else {
                const perm = await requestNotificationPermission();
                if (perm === "granted") {
                    await subscribeToPush();
                    setIsSubscribed(true);
                }
            }
        } catch (error) {
            console.error("Failed to toggle notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isSupported) {
        return (
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                    <BellOff className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-500">Push notifications not supported</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
                {isSubscribed ? (
                    <Bell className="w-5 h-5 text-indigo-400" />
                ) : (
                    <BellOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                    <span className="text-white font-medium">Push Notifications</span>
                    <p className="text-xs text-gray-400">
                        {isSubscribed ? "Notifications are enabled" : "Get updates on your device"}
                    </p>
                </div>
            </div>
            <button
                onClick={handleToggle}
                disabled={isLoading}
                className={`relative w-12 h-6 rounded-full transition-colors ${isSubscribed ? "bg-indigo-600" : "bg-gray-600"
                    }`}
            >
                <motion.div
                    initial={false}
                    animate={{ x: isSubscribed ? 24 : 0 }}
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                />
            </button>
        </div>
    );
}
