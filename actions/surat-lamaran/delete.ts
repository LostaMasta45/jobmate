"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteCoverLetter(id: string) {
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

    // Delete cover letter
    const { error } = await supabase
      .from("cover_letters")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting cover letter:", error);
      return { error: error.message };
    }

    revalidatePath("/surat-lamaran");
    return { success: true };
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return { error: error.message || "Something went wrong" };
  }
}
