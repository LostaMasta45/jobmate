import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/server";
import {
    setTelegramWebhook,
    deleteTelegramWebhook,
    getTelegramWebhookInfo
} from "@/lib/telegram";

// GET - Get current webhook status
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const user = await getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const result = await getTelegramWebhookInfo();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// POST - Set or delete webhook
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const user = await getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { action } = body;

        if (action === "set") {
            // Auto-detect webhook URL from request or use provided URL
            const appUrl = process.env.NEXT_PUBLIC_APP_URL ||
                `${request.headers.get("x-forwarded-proto") || "https"}://${request.headers.get("host")}`;
            const webhookUrl = body.webhookUrl || `${appUrl}/api/telegram-webhook`;

            const result = await setTelegramWebhook(webhookUrl);
            return NextResponse.json({ ...result, webhookUrl });
        } else if (action === "delete") {
            const result = await deleteTelegramWebhook();
            return NextResponse.json(result);
        } else {
            return NextResponse.json(
                { error: "Invalid action. Use 'set' or 'delete'" },
                { status: 400 }
            );
        }
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
