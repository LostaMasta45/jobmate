"use server";

import { createClient, getUser } from "@/lib/supabase/server";

export async function getStats() {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) {
      return { total: 0, inProcess: 0, accepted: 0, rejected: 0 };
    }

    // Single query with aggregation is faster than 4 parallel queries
    const { data, error } = await supabase
      .from("applications")
      .select("status")
      .eq("user_id", user.id);

    if (error) throw error;

    const stats = {
      total: data.length,
      inProcess: 0,
      accepted: 0,
      rejected: 0,
    };

    data.forEach((app) => {
      if (["Applied", "Screening", "Interview", "Offer"].includes(app.status)) {
        stats.inProcess++;
      } else if (app.status === "Hired") {
        stats.accepted++;
      } else if (app.status === "Rejected") {
        stats.rejected++;
      }
    });

    return stats;
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { total: 0, inProcess: 0, accepted: 0, rejected: 0 };
  }
}
