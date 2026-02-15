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
      return { success: false, error: "Unauthorized" };
    }

    // Username ke lowercase & trim
    if (payload.username) {
      payload.username = payload.username.trim().toLowerCase();
    }

    // Only include fields that exist in the profiles table
    const validFields: (keyof ProfilePayload)[] = [
      'full_name', 'username', 'phone', 'whatsapp', 'website', 'linkedin',
      'locale', 'timezone', 'notify_email', 'notify_telegram',
      'telegram_chat_id', 'avatar_url', 'skills',
      'headline', 'bio', 'portfolio',
    ];

    const cleanPayload: Record<string, any> = {};
    for (const key of validFields) {
      if (key in payload && payload[key] !== undefined) {
        cleanPayload[key] = payload[key];
      }
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...cleanPayload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      // Handle unique constraint violation (e.g. duplicate username)
      if (error.code === "23505") {
        return { success: false, error: "Username sudah dipakai oleh pengguna lain. Silakan pilih username yang berbeda." };
      }
      return { success: false, error: error.message || "Gagal memperbarui profil." };
    }

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    revalidatePath("/vip");
    revalidatePath("/vip/profile");

    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return { success: false, error: error?.message || "Gagal memperbarui profil. Silakan coba lagi." };
  }
}
