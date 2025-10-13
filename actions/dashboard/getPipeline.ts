"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";

const STATUSES = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"] as const;

async function fetchPipeline(userId: string) {
  const supabase = await createClient();

  // Single query with aggregation is much faster than 6 parallel queries
  const { data, error } = await supabase
    .from("applications")
    .select("status")
    .eq("user_id", userId);

  if (error) throw error;

  const counts: Record<string, number> = {};
  STATUSES.forEach((s) => (counts[s] = 0));

  data.forEach((app) => {
    if (counts[app.status] !== undefined) {
      counts[app.status]++;
    }
  });

  return STATUSES.map((s) => ({ status: s, count: counts[s] }));
}

export async function getPipeline() {
  try {
    const user = await getUser();

    if (!user) {
      return STATUSES.map((s) => ({ status: s, count: 0 }));
    }

    // Cache pipeline for 30 seconds
    const getCachedPipeline = unstable_cache(
      async (userId: string) => fetchPipeline(userId),
      ["dashboard-pipeline"],
      { revalidate: 30, tags: ["applications"] }
    );

    return await getCachedPipeline(user.id);
  } catch (error) {
    console.error("Error fetching pipeline:", error);
    return STATUSES.map((s) => ({ status: s, count: 0 }));
  }
}
