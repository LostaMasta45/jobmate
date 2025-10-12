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

    const results = await Promise.all(
      STATUSES.map((s) =>
        supabase
          .from("applications")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", s)
      )
    );

    return STATUSES.map((s, i) => ({ status: s, count: results[i].count ?? 0 }));
  } catch (error) {
    console.error("Error fetching pipeline:", error);
    return STATUSES.map((s) => ({ status: s, count: 0 }));
  }
}
