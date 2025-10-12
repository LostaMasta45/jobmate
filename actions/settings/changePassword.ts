"use server";

import { createClient } from "@/lib/supabase/server";

export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) {
      throw new Error("User not found");
    }

    // Verify current password by attempting sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      throw new Error("Password saat ini salah");
    }

    // Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) throw updateError;

    return { success: true, message: "Password berhasil diubah" };
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
}
