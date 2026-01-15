import { NextRequest, NextResponse } from "next/server";
import { logToolUsageWithNotification } from "@/lib/telegram-monitoring";

/**
 * API endpoint untuk tracking tool usage dari client components
 * POST /api/notifications/track-usage
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { toolName, documentTitle, metadata } = body;

        if (!toolName) {
            return NextResponse.json(
                { error: "toolName is required" },
                { status: 400 }
            );
        }

        const success = await logToolUsageWithNotification(
            toolName,
            documentTitle,
            metadata
        );

        return NextResponse.json({ success });
    } catch (error) {
        console.error("[Track Usage API] Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
