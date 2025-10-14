"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteWAMessage(id: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("wa_messages")
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Ensure user owns this message

    if (error) {
      console.error("Error deleting WA message:", error);
      return { error: error.message };
    }

    revalidatePath("/tools/wa-generator");
    revalidatePath("/tools/wa-generator/history");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteWAMessage:", error);
    return { error: error.message || "Failed to delete message" };
  }
}

export async function deleteMultipleWAMessages(ids: string[]) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("wa_messages")
      .delete()
      .in('id', ids)
      .eq('user_id', user.id);

    if (error) {
      console.error("Error deleting multiple WA messages:", error);
      return { error: error.message };
    }

    revalidatePath("/tools/wa-generator");
    revalidatePath("/tools/wa-generator/history");
    
    return { success: true, deleted: ids.length };
  } catch (error: any) {
    console.error("Error in deleteMultipleWAMessages:", error);
    return { error: error.message || "Failed to delete messages" };
  }
}

export async function archiveWAMessage(id: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("wa_messages")
      .update({ status: 'archived' })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error("Error archiving WA message:", error);
      return { error: error.message };
    }

    revalidatePath("/tools/wa-generator");
    revalidatePath("/tools/wa-generator/history");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error in archiveWAMessage:", error);
    return { error: error.message || "Failed to archive message" };
  }
}
