"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteEmailDraft(id: string) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "Unauthorized: Please login first" };
    }

    // Delete the email draft
    const { error: deleteError } = await supabase
      .from("email_drafts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting email draft:", deleteError);
      return { error: deleteError.message };
    }

    revalidatePath("/tools/email-generator");
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteEmailDraft:", error);
    return { error: error.message || "Failed to delete email draft" };
  }
}
