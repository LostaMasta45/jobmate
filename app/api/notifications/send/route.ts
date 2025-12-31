import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import webPush from "web-push";

// Initialize web-push with VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@infolokerjombang.net";

if (vapidPublicKey && vapidPrivateKey) {
    webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export type NotificationType = "lowongan_baru" | "interview_reminder" | "follow_up" | "general";

interface SendNotificationBody {
    type: NotificationType;
    title: string;
    body: string;
    url?: string;
    targetUserId?: string; // Optional: send to specific user
    data?: Record<string, unknown>;
}

// Send push notification (admin only)
export async function POST(request: NextRequest) {
    try {
        // Check VAPID configuration
        if (!vapidPublicKey || !vapidPrivateKey) {
            return NextResponse.json(
                { error: "Push notifications not configured" },
                { status: 500 }
            );
        }

        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    },
                },
            }
        );

        // Get current user and check if admin
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== "admin") {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        // Parse request body
        const body: SendNotificationBody = await request.json();
        const { type, title, body: notificationBody, url, targetUserId, data } = body;

        if (!title || !notificationBody) {
            return NextResponse.json(
                { error: "Title and body are required" },
                { status: 400 }
            );
        }

        // Get subscriptions
        let query = supabase.from("notification_subscriptions").select("*");
        if (targetUserId) {
            query = query.eq("user_id", targetUserId);
        }

        const { data: subscriptions, error: subError } = await query;

        if (subError) {
            console.error("[Send] Error fetching subscriptions:", subError);
            return NextResponse.json(
                { error: "Failed to fetch subscriptions" },
                { status: 500 }
            );
        }

        if (!subscriptions || subscriptions.length === 0) {
            return NextResponse.json({
                success: true,
                sent: 0,
                message: "No subscriptions found"
            });
        }

        // Prepare notification payload
        const payload = JSON.stringify({
            type,
            title,
            body: notificationBody,
            icon: "/icons/icon-192x192.png",
            badge: "/icons/icon-72x72.png",
            url: url || "/dashboard",
            data: {
                ...data,
                type,
                timestamp: Date.now(),
            },
        });

        // Send to all subscriptions
        let successCount = 0;
        let failCount = 0;
        const failedEndpoints: string[] = [];

        for (const sub of subscriptions) {
            try {
                const pushSubscription = {
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth,
                    },
                };

                await webPush.sendNotification(pushSubscription, payload);
                successCount++;
            } catch (error: unknown) {
                failCount++;
                const pushError = error as { statusCode?: number };

                // If subscription is invalid, mark for deletion
                if (pushError.statusCode === 404 || pushError.statusCode === 410) {
                    failedEndpoints.push(sub.endpoint);
                }

                console.error(`[Send] Failed to send to ${sub.endpoint}:`, error);
            }
        }

        // Clean up invalid subscriptions
        if (failedEndpoints.length > 0) {
            await supabase
                .from("notification_subscriptions")
                .delete()
                .in("endpoint", failedEndpoints);
        }

        return NextResponse.json({
            success: true,
            sent: successCount,
            failed: failCount,
            cleaned: failedEndpoints.length,
        });
    } catch (error) {
        console.error("[Send] Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
