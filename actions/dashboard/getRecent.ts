"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";

async function fetchRecent(userId: string, limit: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("applications")
    .select("id, company, position, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data ?? [];
}

export async function getRecent(limit = 5) {
  try {
    const user = await getUser();

    if (!user) return [];

    // Cache recent applications for 30 seconds
    const getCachedRecent = unstable_cache(
      async (userId: string, lim: number) => fetchRecent(userId, lim),
      ["dashboard-recent"],
      { revalidate: 30, tags: ["applications"] }
    );

    return await getCachedRecent(user.id, limit);
  } catch (error) {
    console.error("Error fetching recent applications:", error);
    return [];
  }
}
