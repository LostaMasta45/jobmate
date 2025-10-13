"use server";

import { createClient, getUser } from "@/lib/supabase/server";

const STATUSES = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"] as const;

export async function getPipeline() {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) {
      return STATUSES.map((s) => ({ status: s, count: 0 }));
    }

    // Single query with aggregation is much faster than 6 parallel queries
    const { data, error } = await supabase
      .from("applications")
      .select("status")
      .eq("user_id", user.id);

    if (error) throw error;

    const counts: Record<string, number> = {};
    STATUSES.forEach((s) => (counts[s] = 0));

    data.forEach((app) => {
      if (counts[app.status] !== undefined) {
        counts[app.status]++;
      }
    });

    return STATUSES.map((s) => ({ status: s, count: counts[s] }));
  } catch (error) {
    console.error("Error fetching pipeline:", error);
    return STATUSES.map((s) => ({ status: s, count: 0 }));
  }
}
