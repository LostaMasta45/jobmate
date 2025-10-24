"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteSuratLamaran(id: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const { error: deleteError } = await supabase
      .from("surat_lamaran_sederhana")
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error("Error deleting surat lamaran:", deleteError);
      return { error: deleteError.message };
    }

    revalidatePath("/surat-lamaran-sederhana");
    revalidatePath("/surat-lamaran-sederhana/history");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteSuratLamaran:", error);
    return { error: error.message || "Failed to delete surat lamaran" };
  }
}
