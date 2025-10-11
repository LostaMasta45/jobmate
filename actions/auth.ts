"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function signOut() {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Error signing out:", error);
    return { error: error.message };
  }

  // Clear all auth cookies
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  allCookies.forEach(cookie => {
    if (cookie.name.includes('sb-') || cookie.name.includes('supabase')) {
      cookieStore.delete(cookie.name);
    }
  });

  revalidatePath("/", "layout");
  return { success: true };
}
