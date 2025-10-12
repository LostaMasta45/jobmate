"use server";

import { createClient, getUser } from "@/lib/supabase/server";

export async function getStats() {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) {
      return { total: 0, inProcess: 0, accepted: 0, rejected: 0 };
    }

    const [total, inProcess, accepted, rejected] = await Promise.all([
      supabase
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .in("status", ["Applied", "Screening", "Interview", "Offer"]),
      supabase
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "Hired"),
      supabase
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "Rejected"),
    ]);

    return {
      total: total.count ?? 0,
      inProcess: inProcess.count ?? 0,
      accepted: accepted.count ?? 0,
      rejected: rejected.count ?? 0,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { total: 0, inProcess: 0, accepted: 0, rejected: 0 };
  }
}
