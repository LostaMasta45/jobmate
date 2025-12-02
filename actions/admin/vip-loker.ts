"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendAdminNotification } from "@/lib/telegram";

// Helper to get admin info
async function getAdminInfo(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "Unknown Admin";
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();
  
  return profile?.full_name || profile?.email || "Admin";
}

// Helper to get loker details for notification
async function getLokerDetails(supabase: any, ids: string[]) {
  const { data } = await supabase
    .from("vip_loker")
    .select("id, title, perusahaan:vip_perusahaan(name)")
    .in("id", ids);
  
  return data || [];
}

export async function deleteLoker(id: string) {
  const supabase = await createClient();

  try {
    // Get loker details before delete
    const lokerDetails = await getLokerDetails(supabase, [id]);
    const adminName = await getAdminInfo(supabase);
    
    const { error } = await supabase
      .from("vip_loker")
      .delete()
      .eq("id", id);

    if (error) throw error;

    // Send Telegram notification
    if (lokerDetails.length > 0) {
      const loker = lokerDetails[0];
      const message = `🗑️ *LOWONGAN DIHAPUS*

━━━━━━━━━━━━━━━━━━━━━
💼 *${loker.title}*
🏢 ${loker.perusahaan?.name || 'Unknown'}

👨‍💼 *Dihapus oleh:* ${adminName}
⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━`;
      
      await sendAdminNotification(message);
    }

    revalidatePath("/admin/vip-loker");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting loker:", error);
    return { success: false, error };
  }
}

export async function updateLokerStatus(id: string, status: string) {
  const supabase = await createClient();

  try {
    // Get loker details
    const lokerDetails = await getLokerDetails(supabase, [id]);
    const adminName = await getAdminInfo(supabase);
    
    const { error } = await supabase
      .from("vip_loker")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    // Send Telegram notification
    if (lokerDetails.length > 0) {
      const loker = lokerDetails[0];
      const statusEmoji = status === 'published' ? '✅' : status === 'draft' ? '📝' : '🔒';
      const statusLabel = status === 'published' ? 'PUBLISHED' : status === 'draft' ? 'DRAFT' : 'CLOSED';
      
      const message = `${statusEmoji} *STATUS LOWONGAN DIUBAH*

━━━━━━━━━━━━━━━━━━━━━
💼 *${loker.title}*
🏢 ${loker.perusahaan?.name || 'Unknown'}

📊 *Status Baru:* ${statusLabel}

👨‍💼 *Diubah oleh:* ${adminName}
⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━`;
      
      await sendAdminNotification(message);
    }

    revalidatePath("/admin/vip-loker");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating loker status:", error);
    return { success: false, error };
  }
}

// Bulk delete multiple loker
export async function bulkDeleteLoker(ids: string[]) {
  const supabase = await createClient();

  try {
    // Get loker details before delete
    const lokerDetails = await getLokerDetails(supabase, ids);
    const adminName = await getAdminInfo(supabase);
    
    const { error } = await supabase
      .from("vip_loker")
      .delete()
      .in("id", ids);

    if (error) throw error;

    // Send Telegram notification
    const jobsList = lokerDetails.slice(0, 10).map((job: any, i: number) => 
      `${i + 1}. ${job.title} (${job.perusahaan?.name || 'Unknown'})`
    ).join('\n');
    
    const moreText = lokerDetails.length > 10 ? `\n... dan ${lokerDetails.length - 10} lainnya` : '';
    
    const message = `🗑️ *BULK DELETE LOWONGAN*

━━━━━━━━━━━━━━━━━━━━━
⚠️ *${ids.length} lowongan telah dihapus*

📋 *Daftar Lowongan:*
${jobsList}${moreText}

━━━━━━━━━━━━━━━━━━━━━
👨‍💼 *Dihapus oleh:* ${adminName}
⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━`;
    
    await sendAdminNotification(message);

    revalidatePath("/admin/vip-loker");
    return { success: true, deleted: ids.length, error: null };
  } catch (error) {
    console.error("Error bulk deleting loker:", error);
    return { success: false, deleted: 0, error };
  }
}

// Bulk update status for multiple loker
export async function bulkUpdateLokerStatus(ids: string[], status: string) {
  const supabase = await createClient();

  try {
    // Get loker details
    const lokerDetails = await getLokerDetails(supabase, ids);
    const adminName = await getAdminInfo(supabase);
    
    const { error } = await supabase
      .from("vip_loker")
      .update({ status })
      .in("id", ids);

    if (error) throw error;

    // Send Telegram notification
    const statusEmoji = status === 'published' ? '✅' : status === 'draft' ? '📝' : '🔒';
    const statusLabel = status === 'published' ? 'PUBLISHED' : status === 'draft' ? 'DRAFT' : 'CLOSED';
    
    const jobsList = lokerDetails.slice(0, 10).map((job: any, i: number) => 
      `${i + 1}. ${job.title} (${job.perusahaan?.name || 'Unknown'})`
    ).join('\n');
    
    const moreText = lokerDetails.length > 10 ? `\n... dan ${lokerDetails.length - 10} lainnya` : '';
    
    const message = `${statusEmoji} *BULK UPDATE STATUS*

━━━━━━━━━━━━━━━━━━━━━
📊 *${ids.length} lowongan diubah ke ${statusLabel}*

📋 *Daftar Lowongan:*
${jobsList}${moreText}

━━━━━━━━━━━━━━━━━━━━━
👨‍💼 *Diubah oleh:* ${adminName}
⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━`;
    
    await sendAdminNotification(message);

    revalidatePath("/admin/vip-loker");
    return { success: true, updated: ids.length, error: null };
  } catch (error) {
    console.error("Error bulk updating loker status:", error);
    return { success: false, updated: 0, error };
  }
}
