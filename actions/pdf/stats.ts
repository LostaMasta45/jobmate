"use server";

import { createClient } from "@/lib/supabase/server";

export interface PDFStats {
    total: number;
    merge: number;
    compress: number;
    convert: number;
}

export async function getPDFStats(): Promise<PDFStats | null> {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return null;
        }

        // Fetch all operations for the user to aggregate stats
        // We only select the 'operation' field to minimize data transfer
        const { data: operations, error: fetchError } = await supabase
            .from('pdf_operations')
            .select('operation')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .is('deleted_at', null);

        if (fetchError) {
            console.error('Error fetching stats:', fetchError);
            return null;
        }

        const counts: Record<string, number> = {};
        let total = 0;

        // Initialize counts
        counts['merge'] = 0;
        counts['compress'] = 0;
        counts['convert'] = 0;

        if (operations) {
            operations.forEach((op: any) => {
                total++;
                const type = op.operation;

                if (type === 'merge') {
                    counts['merge']++;
                } else if (type === 'compress') {
                    counts['compress']++;
                } else if (['convert_office', 'convert_image', 'pdf_to_word', 'pdf_to_image'].includes(type)) {
                    counts['convert']++;
                }
            });
        }

        return {
            total,
            merge: counts['merge'],
            compress: counts['compress'],
            convert: counts['convert'],
        };

    } catch (error) {
        console.error("Error calculating PDF stats:", error);
        return null;
    }
}
