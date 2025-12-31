import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Subscribe to push notifications
export async function POST(request: NextRequest) {
    try {
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

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { subscription, deviceInfo } = body;

        if (!subscription || !subscription.endpoint || !subscription.keys) {
            return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
        }

        // Upsert subscription (insert or update if exists)
        const { error: insertError } = await supabase
            .from("notification_subscriptions")
            .upsert({
                user_id: user.id,
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
                device_info: deviceInfo || {},
            }, {
                onConflict: "user_id,endpoint",
            });

        if (insertError) {
            console.error("[Subscribe] Error saving subscription:", insertError);
            return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[Subscribe] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Unsubscribe from push notifications
export async function DELETE(request: NextRequest) {
    try {
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

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { endpoint } = body;

        if (!endpoint) {
            return NextResponse.json({ error: "Endpoint required" }, { status: 400 });
        }

        // Delete subscription
        const { error: deleteError } = await supabase
            .from("notification_subscriptions")
            .delete()
            .eq("user_id", user.id)
            .eq("endpoint", endpoint);

        if (deleteError) {
            console.error("[Unsubscribe] Error deleting subscription:", deleteError);
            return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[Unsubscribe] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
