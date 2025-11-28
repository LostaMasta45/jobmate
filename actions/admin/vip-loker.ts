"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteLoker(id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("vip_loker")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/vip-loker");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting loker:", error);
    return { success: false, error };
  }
}

export async function updateLokerStatus(id: string, status: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("vip_loker")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/vip-loker");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating loker status:", error);
    return { success: false, error };
  }
}
