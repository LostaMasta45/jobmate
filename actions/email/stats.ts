"use server";

import { createClient } from "@/lib/supabase/server";

interface EmailStats {
    application: number;
    follow_up: number;
    thank_you: number;
    inquiry: number;
    total: number;
}

export async function getEmailStats(): Promise<EmailStats> {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { application: 0, follow_up: 0, thank_you: 0, inquiry: 0, total: 0 };
        }

        const { data, error } = await supabase
            .from("email_drafts")
            .select("email_type")
            .eq("user_id", user.id);

        if (error || !data) {
            console.error("[EmailStats] Error fetching stats:", error);
            return { application: 0, follow_up: 0, thank_you: 0, inquiry: 0, total: 0 };
        }

        const stats: EmailStats = {
            application: 0,
            follow_up: 0,
            thank_you: 0,
            inquiry: 0,
            total: data.length
        };

        data.forEach((row) => {
            const type = row.email_type as keyof Omit<EmailStats, 'total'>;
            if (type in stats) {
                stats[type]++;
            }
        });

        return stats;

    } catch (error) {
        console.error("[EmailStats] Error:", error);
        return { application: 0, follow_up: 0, thank_you: 0, inquiry: 0, total: 0 };
    }
}
