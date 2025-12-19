"use server";

import { createClient } from "@/lib/supabase/server";
import type { WAStats } from "@/components/wa-generator/types";

export async function getWAStats(): Promise<WAStats> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            application: 0,
            follow_up: 0,
            interview_confirmation: 0,
            thank_you: 0,
            status_inquiry: 0,
            re_application: 0,
            referral: 0,
            total: 0,
        };
    }

    const { data, error } = await supabase
        .from('wa_messages')
        .select('message_type')
        .eq('user_id', user.id);

    if (error || !data) {
        console.error('Error fetching WA stats:', error);
        return {
            application: 0,
            follow_up: 0,
            interview_confirmation: 0,
            thank_you: 0,
            status_inquiry: 0,
            re_application: 0,
            referral: 0,
            total: 0,
        };
    }

    const stats: WAStats = {
        application: 0,
        follow_up: 0,
        interview_confirmation: 0,
        thank_you: 0,
        status_inquiry: 0,
        re_application: 0,
        referral: 0,
        total: data.length,
    };

    data.forEach((item) => {
        const type = item.message_type as keyof Omit<WAStats, 'total'>;
        if (type in stats) {
            stats[type]++;
        }
    });

    return stats;
}
