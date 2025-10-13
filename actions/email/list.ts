"use server";

import { createClient } from "@/lib/supabase/server";

export async function listEmailDrafts() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "Unauthorized: Please login first" };
    }

    // Fetch all email drafts for the user
    const { data: drafts, error: fetchError } = await supabase
      .from("email_drafts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Error fetching email drafts:", fetchError);
      return { error: fetchError.message };
    }

    return { data: drafts || [] };
  } catch (error: any) {
    console.error("Error in listEmailDrafts:", error);
    return { error: error.message || "Failed to fetch email drafts" };
  }
}
