"use server";

import { createClient } from "@/lib/supabase/server";

export async function getEmailDraft(id: string) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "Unauthorized: Please login first" };
    }

    // Fetch the email draft
    const { data: draft, error: fetchError } = await supabase
      .from("email_drafts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError) {
      console.error("Error fetching email draft:", fetchError);
      return { error: fetchError.message };
    }

    if (!draft) {
      return { error: "Email draft not found" };
    }

    return { data: draft };
  } catch (error: any) {
    console.error("Error in getEmailDraft:", error);
    return { error: error.message || "Failed to fetch email draft" };
  }
}
