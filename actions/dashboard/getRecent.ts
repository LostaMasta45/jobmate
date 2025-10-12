"use server";

import { createClient, getUser } from "@/lib/supabase/server";

export async function getRecent(limit = 5) {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("applications")
      .select("id, company, position, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data ?? [];
  } catch (error) {
    console.error("Error fetching recent applications:", error);
    return [];
  }
}
