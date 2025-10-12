"use server";

import { createClient, getUser } from "@/lib/supabase/server";

export async function deleteMyAccount() {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Delete user data in order (respecting foreign keys)
    await supabase.from("templates").delete().eq("user_id", user.id);
    await supabase.from("applications").delete().eq("user_id", user.id);
    await supabase.from("profiles").delete().eq("id", user.id);

    // Sign out from all devices
    await supabase.auth.signOut({ scope: "global" });

    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
}
