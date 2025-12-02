"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Biodata, Perusahaan } from "@/lib/surat-lamaran-utils";

export interface SaveSuratLamaranData {
  // Biodata
  biodata: Biodata;
  
  // Perusahaan
  perusahaan: Perusahaan;
  
  // Template
  templateId: string;
  templateName: string;
  
  // Generated Content
  generatedContent: string;
  
  // AI Content (custom/edited)
  aiContent?: string;
  colorTheme?: string;
  
  // Metadata
  status?: string;
  wordCount?: number;
  charCount?: number;
}

export async function saveSuratLamaran(data: SaveSuratLamaranData) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "Unauthorized: Please login first" };
    }

    // Insert surat lamaran
    const { data: surat, error: insertError } = await supabase
      .from("surat_lamaran_sederhana")
      .insert({
        user_id: user.id,
        // Biodata
        nama_lengkap: data.biodata.namaLengkap,
        tempat_lahir: data.biodata.tempatLahir,
        tanggal_lahir: data.biodata.tanggalLahir || null,
        jenis_kelamin: data.biodata.jenisKelamin,
        status_pernikahan: data.biodata.status,
        pendidikan: data.biodata.pendidikan,
        no_handphone: data.biodata.noHandphone,
        email: data.biodata.email,
        alamat_kota: data.biodata.alamatKota,
        alamat_lengkap: data.biodata.alamatLengkap,
        // Perusahaan
        kepada_yth: data.perusahaan.kepadaYth,
        nama_perusahaan: data.perusahaan.namaPerusahaan,
        kota_perusahaan: data.perusahaan.kotaPerusahaan,
        jenis_instansi: data.perusahaan.jenisInstansi,
        posisi_lowongan: data.perusahaan.posisiLowongan,
        sumber_lowongan: data.perusahaan.sumberLowongan,
        tanggal_lamaran: data.perusahaan.tanggalLamaran || null,
        lampiran: data.perusahaan.lampiran,
        // Template
        template_id: data.templateId,
        template_name: data.templateName,
        // Content
        generated_content: data.generatedContent,
        custom_content: data.aiContent || null,
        color_theme: data.colorTheme || 'classic',
        // Metadata
        status: data.status || 'draft',
        word_count: data.wordCount || 0,
        char_count: data.charCount || 0,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error saving surat lamaran:", insertError);
      return { error: insertError.message };
    }

    // 🆕 MONITORING: Log tool usage and send Telegram notification
    try {
      const { logToolUsageWithNotification } = await import("@/lib/telegram-monitoring");
      await logToolUsageWithNotification(
        "Surat Lamaran Sederhana",
        `${data.perusahaan.posisiLowongan} at ${data.perusahaan.namaPerusahaan}`,
        { templateId: data.templateId, templateName: data.templateName }
      );
    } catch (monitorError) {
      console.error("[Monitoring] Failed to log surat lamaran sederhana usage:", monitorError);
    }

    revalidatePath("/surat-lamaran-sederhana");
    revalidatePath("/surat-lamaran-sederhana/history");
    
    return { data: surat };
  } catch (error: any) {
    console.error("Error in saveSuratLamaran:", error);
    return { error: error.message || "Failed to save surat lamaran" };
  }
}

export async function updateSuratLamaran(id: string, updates: Partial<SaveSuratLamaranData>) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const updateData: any = {};
    
    if (updates.biodata) {
      Object.assign(updateData, {
        nama_lengkap: updates.biodata.namaLengkap,
        tempat_lahir: updates.biodata.tempatLahir,
        tanggal_lahir: updates.biodata.tanggalLahir || null,
        jenis_kelamin: updates.biodata.jenisKelamin,
        status_pernikahan: updates.biodata.status,
        pendidikan: updates.biodata.pendidikan,
        no_handphone: updates.biodata.noHandphone,
        email: updates.biodata.email,
        alamat_kota: updates.biodata.alamatKota,
        alamat_lengkap: updates.biodata.alamatLengkap,
      });
    }
    
    if (updates.perusahaan) {
      Object.assign(updateData, {
        kepada_yth: updates.perusahaan.kepadaYth,
        nama_perusahaan: updates.perusahaan.namaPerusahaan,
        kota_perusahaan: updates.perusahaan.kotaPerusahaan,
        jenis_instansi: updates.perusahaan.jenisInstansi,
        posisi_lowongan: updates.perusahaan.posisiLowongan,
        sumber_lowongan: updates.perusahaan.sumberLowongan,
        tanggal_lamaran: updates.perusahaan.tanggalLamaran || null,
        lampiran: updates.perusahaan.lampiran,
      });
    }
    
    if (updates.templateId) updateData.template_id = updates.templateId;
    if (updates.templateName) updateData.template_name = updates.templateName;
    if (updates.generatedContent) updateData.generated_content = updates.generatedContent;
    if (updates.aiContent !== undefined) updateData.custom_content = updates.aiContent;
    if (updates.colorTheme) updateData.color_theme = updates.colorTheme;
    if (updates.status) updateData.status = updates.status;
    if (updates.wordCount) updateData.word_count = updates.wordCount;
    if (updates.charCount) updateData.char_count = updates.charCount;

    const { data: surat, error: updateError } = await supabase
      .from("surat_lamaran_sederhana")
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating surat lamaran:", updateError);
      return { error: updateError.message };
    }

    revalidatePath("/surat-lamaran-sederhana");
    revalidatePath("/surat-lamaran-sederhana/history");
    
    return { data: surat };
  } catch (error: any) {
    console.error("Error in updateSuratLamaran:", error);
    return { error: error.message || "Failed to update surat lamaran" };
  }
}

export async function incrementDownloadCount(id: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Unauthorized" };

    const { data: surat } = await supabase
      .from("surat_lamaran_sederhana")
      .select('times_downloaded')
      .eq('id', id)
      .single();

    if (surat) {
      await supabase
        .from("surat_lamaran_sederhana")
        .update({ 
          times_downloaded: (surat.times_downloaded || 0) + 1,
          last_downloaded_at: new Date().toISOString()
        })
        .eq('id', id);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error incrementing download count:", error);
    return { error: error.message };
  }
}
