"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";

async function fetchStats(userId: string) {
  const supabase = await createClient();

  // Single query with aggregation is faster than 4 parallel queries
  const { data, error } = await supabase
    .from("applications")
    .select("status")
    .eq("user_id", userId);

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
}

export async function getStats() {
  try {
    const user = await getUser();

    if (!user) {
      return { total: 0, inProcess: 0, accepted: 0, rejected: 0 };
    }

    // Cache stats for 30 seconds
    const getCachedStats = unstable_cache(
      async (userId: string) => fetchStats(userId),
      ["dashboard-stats"],
      { revalidate: 30, tags: ["applications"] }
    );

    return await getCachedStats(user.id);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { total: 0, inProcess: 0, accepted: 0, rejected: 0 };
  }
}
