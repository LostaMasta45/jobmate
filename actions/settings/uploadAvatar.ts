"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadAvatar(formData: FormData) {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("File size must be less than 2MB");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    console.log("Updating profile avatar_url for user:", user.id);
    console.log("New avatar URL:", urlData.publicUrl);

    const { data: updateData, error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: urlData.publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select();

    console.log("Update result:", { data: updateData, error: updateError });

    if (updateError) {
      console.error("Failed to update profile with avatar_url:", updateError);
      throw new Error(`Failed to save avatar: ${updateError.message || JSON.stringify(updateError)}`);
    }

    revalidatePath("/settings");
    revalidatePath("/dashboard");

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
}
