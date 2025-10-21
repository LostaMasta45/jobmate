"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAllPerusahaan() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("vip_perusahaan")
      .select(`
        *,
        loker_count:vip_loker(count)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Process count
    const processedData = data?.map((perusahaan) => ({
      ...perusahaan,
      loker_count: perusahaan.loker_count?.[0]?.count || 0,
    }));

    return { data: processedData, error: null };
  } catch (error) {
    console.error("Error fetching perusahaan:", error);
    return { data: null, error };
  }
}

export async function verifyPerusahaan(id: string, verified: boolean) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("vip_perusahaan")
      .update({ verified })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/perusahaan");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error verifying perusahaan:", error);
    return { success: false, error };
  }
}

export async function deletePerusahaan(id: string) {
  const supabase = await createClient();

  try {
    // Check if has loker
    const { count } = await supabase
      .from("vip_loker")
      .select("*", { count: "exact", head: true })
      .eq("perusahaan_id", id);

    if (count && count > 0) {
      return { 
        success: false, 
        error: "Tidak bisa menghapus perusahaan yang masih memiliki loker aktif" 
      };
    }

    const { error } = await supabase
      .from("vip_perusahaan")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/perusahaan");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting perusahaan:", error);
    return { success: false, error };
  }
}

export async function updatePerusahaan(
  id: string,
  data: {
    name?: string;
    lokasi?: string;
    kontak?: string;
    email?: string;
    whatsapp?: string;
    alamat?: string;
  }
) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("vip_perusahaan")
      .update(data)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/perusahaan");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating perusahaan:", error);
    return { success: false, error };
  }
}
