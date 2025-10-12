"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signOutAll() {
  try {
    const supabase = await createClient();
    
    // Sign out from all devices
    await supabase.auth.signOut({ scope: "global" });

    return { success: true };
  } catch (error) {
    console.error("Error signing out all devices:", error);
    throw error;
  }
}
