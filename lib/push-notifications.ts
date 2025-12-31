/**
 * Push Notifications Utility Library
 * Client-side functions for managing push notification subscriptions
 */

// Check if push notifications are supported
export function isPushSupported(): boolean {
    return (
        typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window
    );
}

// Get current notification permission status
export function getNotificationPermission(): NotificationPermission | "unsupported" {
    if (!isPushSupported()) return "unsupported";
    return Notification.permission;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (!isPushSupported()) {
        throw new Error("Push notifications are not supported");
    }

    const permission = await Notification.requestPermission();
    return permission;
}

// Subscribe to push notifications
export async function subscribeToPush(): Promise<PushSubscription | null> {
    if (!isPushSupported()) {
        console.warn("Push notifications not supported");
        return null;
    }

    try {
        // Wait for service worker to be ready
        const registration = await navigator.serviceWorker.ready;

        // Get VAPID public key from environment
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
            console.error("VAPID public key not found");
            return null;
        }

        // Convert VAPID key to Uint8Array
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        // Subscribe to push manager
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey.buffer as ArrayBuffer,
        });

        // Save subscription to server
        await saveSubscriptionToServer(subscription);

        return subscription;
    } catch (error) {
        console.error("Failed to subscribe to push:", error);
        throw error;
    }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPush(): Promise<boolean> {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            // Remove from server first
            await removeSubscriptionFromServer(subscription);

            // Then unsubscribe locally
            await subscription.unsubscribe();
            return true;
        }

        return false;
    } catch (error) {
        console.error("Failed to unsubscribe from push:", error);
        throw error;
    }
}

// Check if user is subscribed
export async function isSubscribedToPush(): Promise<boolean> {
    if (!isPushSupported()) return false;

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        return subscription !== null;
    } catch {
        return false;
    }
}

// Get current subscription
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
    if (!isPushSupported()) return null;

    try {
        const registration = await navigator.serviceWorker.ready;
        return await registration.pushManager.getSubscription();
    } catch {
        return null;
    }
}

// Save subscription to server
async function saveSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            subscription: subscription.toJSON(),
            deviceInfo: getDeviceInfo(),
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to save subscription to server");
    }
}

// Remove subscription from server
async function removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
    const response = await fetch("/api/notifications/subscribe", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            endpoint: subscription.endpoint,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to remove subscription from server");
    }
}

// Get basic device info
function getDeviceInfo(): Record<string, string> {
    if (typeof window === "undefined") return {};

    return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        standalone: (window.matchMedia("(display-mode: standalone)").matches).toString(),
    };
}

// Convert VAPID key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

// Notification types
export type NotificationType = "lowongan_baru" | "interview_reminder" | "follow_up" | "general";

export interface NotificationPayload {
    type: NotificationType;
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    url?: string;
    data?: Record<string, unknown>;
}
