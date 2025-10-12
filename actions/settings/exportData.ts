"use server";

import { createClient, getUser } from "@/lib/supabase/server";

export async function exportMyData() {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Fetch all user data in parallel
    const [applications, templates, profile] = await Promise.all([
      supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("templates")
        .select("id, type, title, created_at, updated_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single(),
    ]);

    return {
      profile: profile.data,
      applications: applications.data ?? [],
      templates: templates.data ?? [],
      exported_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error exporting data:", error);
    throw error;
  }
}
