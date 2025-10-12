"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCoverLetter(id: string) {
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

    // Fetch single cover letter
    const { data: letter, error } = await supabase
      .from("cover_letters")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching cover letter:", error);
      return { error: error.message };
    }

    return { data: letter };
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return { error: error.message || "Something went wrong" };
  }
}
