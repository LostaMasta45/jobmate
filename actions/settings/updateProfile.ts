"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ProfilePayload = {
  full_name?: string;
  username?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  linkedin?: string;
  locale?: string;
  timezone?: string;
  notify_email?: boolean;
  notify_telegram?: boolean;
  telegram_chat_id?: string | null;
  avatar_url?: string | null;
  skills?: string[];
  headline?: string | null;
  bio?: string | null;
  portfolio?: string | null;
};

export async function updateProfile(payload: ProfilePayload) {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Username ke lowercase & trim
    if (payload.username) {
      payload.username = payload.username.trim().toLowerCase();
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation (e.g. duplicate username)
      if (error.code === "23505") {
        throw new Error("Username sudah dipakai oleh pengguna lain. Silakan pilih username yang berbeda.");
      }
      throw error;
    }

    revalidatePath("/settings");
    revalidatePath("/dashboard");

    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    // Re-throw with user-friendly message if not already formatted
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Gagal memperbarui profil. Silakan coba lagi.");
  }
}
