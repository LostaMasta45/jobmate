"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { CreativeCV } from "@/lib/schemas/cv-creative";
import { generateAISummary, rewriteBulletsWithAI, analyzeATSScore } from "./cv-ats";

export { generateAISummary, rewriteBulletsWithAI, analyzeATSScore };

export async function saveCreativeCV(cv: Partial<CreativeCV>) {
  try {
    const supabase = await createClient();
    const user = await getUser();
    if (!user) throw new Error("User tidak ditemukan");

    const cvData = {
      id: cv.id,
      user_id: user.id,
      title: cv.title,
      template_id: cv.templateId,
      color_scheme: cv.colorScheme,
      photo_url: cv.photoUrl,
      photo_options: cv.photoOptions,
      content: cv.content,
      ats_score: cv.atsScore,
      is_default: cv.isDefault || false,
    };

    const { data: existing } = await supabase.from("creative_cvs").select("id").eq("id", cv.id).single();

    if (existing) {
      const { error } = await supabase.from("creative_cvs").update(cvData).eq("id", cv.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("creative_cvs").insert(cvData);
      if (error) throw error;
    }

    // 🆕 MONITORING: Log CV Creative generation
    try {
      const { logToolUsageWithNotification } = await import("@/lib/telegram-monitoring");
      const fullName = cv.content?.personalInfo?.fullName || "Unknown";
      await logToolUsageWithNotification(
        "CV Creative Generator",
        cv.title || `${fullName} - Creative CV`,
        { template: cv.templateId }
      );
    } catch (monitorError) {
      console.error("[Monitoring] Failed to log CV Creative:", monitorError);
    }

    return { success: true };
  } catch (error) {
    console.error("Save Creative CV error:", error);
    throw new Error("Gagal menyimpan Creative CV");
  }
}

export async function getAllCreativeCVs() {
  try {
    const supabase = await createClient();
    const user = await getUser();
    if (!user) throw new Error("User tidak ditemukan");

    const { data, error } = await supabase
      .from("creative_cvs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Map database format to app format
    const mappedData = (data || []).map((cv) => ({
      id: cv.id,
      user_id: cv.user_id,
      title: cv.title,
      template_id: cv.template_id,
      color_scheme: cv.color_scheme,
      photo_url: cv.photo_url,        // Keep snake_case for history display
      photo_options: cv.photo_options,
      content: cv.content,
      ats_score: cv.ats_score,
      is_default: cv.is_default,
      created_at: cv.created_at,
      updated_at: cv.updated_at,
    }));
    
    return mappedData;
  } catch (error) {
    console.error("Get Creative CVs error:", error);
    throw new Error("Gagal load Creative CVs");
  }
}

export async function deleteCreativeCV(id: string) {
  try {
    const supabase = await createClient();
    const user = await getUser();
    if (!user) throw new Error("User tidak ditemukan");

    const { error } = await supabase.from("creative_cvs").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Delete Creative CV error:", error);
    throw new Error("Gagal hapus Creative CV");
  }
}

export async function uploadCVPhoto(file: File) {
  try {
    const supabase = await createClient();
    const user = await getUser();
    if (!user) throw new Error("User tidak ditemukan");

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("cv-photos").upload(fileName, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("cv-photos").getPublicUrl(fileName);
    return { url: data.publicUrl };
  } catch (error) {
    console.error("Upload photo error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Gagal upload foto: ${errorMessage}`);
  }
}
