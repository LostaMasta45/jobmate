"use server";

import { createClient } from "@/lib/supabase/server";

export async function getSuratLamaranList(options?: {
  limit?: number;
  search?: string;
  status?: string;
}) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    let query = supabase
      .from("surat_lamaran_sederhana")
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (options?.status && options.status !== 'all') {
      query = query.eq('status', options.status);
    }

    if (options?.search) {
      query = query.or(`nama_perusahaan.ilike.%${options.search}%,posisi_lowongan.ilike.%${options.search}%`);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching surat lamaran:", error);
      return { error: error.message };
    }

    return { data };
  } catch (error: any) {
    console.error("Error in getSuratLamaranList:", error);
    return { error: error.message || "Failed to fetch surat lamaran" };
  }
}

export async function getSuratLamaranStats() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const { data: allSurat, error: fetchError } = await supabase
      .from("surat_lamaran_sederhana")
      .select('status, template_id')
      .eq('user_id', user.id);

    if (fetchError) {
      return { error: fetchError.message };
    }

    const stats = {
      total: allSurat?.length || 0,
      draft: allSurat?.filter(s => s.status === 'draft').length || 0,
      final: allSurat?.filter(s => s.status === 'final').length || 0,
      mostUsedTemplate: '',
    };

    // Find most used template
    if (allSurat && allSurat.length > 0) {
      const templateCounts: Record<string, number> = {};
      allSurat.forEach(s => {
        if (s.template_id) {
          templateCounts[s.template_id] = (templateCounts[s.template_id] || 0) + 1;
        }
      });
      stats.mostUsedTemplate = Object.keys(templateCounts).reduce((a, b) => 
        templateCounts[a] > templateCounts[b] ? a : b
      , '');
    }

    return { data: stats };
  } catch (error: any) {
    console.error("Error in getSuratLamaranStats:", error);
    return { error: error.message || "Failed to get stats" };
  }
}

export async function getSuratLamaranById(id: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("surat_lamaran_sederhana")
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error("Error fetching surat lamaran:", error);
      return { error: error.message };
    }

    return { data };
  } catch (error: any) {
    console.error("Error in getSuratLamaranById:", error);
    return { error: error.message || "Failed to fetch surat lamaran" };
  }
}
