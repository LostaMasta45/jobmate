"use server";

import { createClient } from "@/lib/supabase/server";

export async function listCoverLetters() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    // Fetch cover letters for current user
    const { data: letters, error } = await supabase
      .from("cover_letters")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching cover letters:", error);
      return { error: error.message };
    }

    return { data: letters || [] };
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return { error: error.message || "Something went wrong" };
  }
}
