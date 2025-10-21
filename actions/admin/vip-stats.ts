"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getVipDashboardStats() {
  // Use admin client to bypass RLS for accurate stats
  const supabase = createAdminClient();

  try {
    // Total Loker
    const { count: totalLoker } = await supabase
      .from("vip_loker")
      .select("*", { count: "exact", head: true });

    // Loker Aktif (published & belum expired)
    const { count: lokerAktif } = await supabase
      .from("vip_loker")
      .select("*", { count: "exact", head: true })
      .eq("status", "published")
      .gte("deadline", new Date().toISOString());

    // Loker Baru Hari Ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: lokerHariIni } = await supabase
      .from("vip_loker")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString());

    // Total Perusahaan
    const { count: totalPerusahaan } = await supabase
      .from("vip_perusahaan")
      .select("*", { count: "exact", head: true });

    // Member VIP Aktif
    const { count: memberVip } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .in("membership", ["vip_basic", "vip_premium"]);

    // Loker Draft
    const { count: lokerDraft } = await supabase
      .from("vip_loker")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft");

    // Total Views (aggregate from vip_member_views)
    const { data: viewsData } = await supabase
      .from("vip_member_views")
      .select("view_count");
    
    const totalViews = viewsData?.reduce((sum, row) => sum + (row.view_count || 0), 0) || 0;

    return {
      totalLoker: totalLoker || 0,
      lokerAktif: lokerAktif || 0,
      lokerHariIni: lokerHariIni || 0,
      totalPerusahaan: totalPerusahaan || 0,
      memberVip: memberVip || 0,
      lokerDraft: lokerDraft || 0,
      totalViews,
    };
  } catch (error) {
    console.error("Error fetching VIP stats:", error);
    return {
      totalLoker: 0,
      lokerAktif: 0,
      lokerHariIni: 0,
      totalPerusahaan: 0,
      memberVip: 0,
      lokerDraft: 0,
      totalViews: 0,
    };
  }
}

export async function getLokerWeeklyData() {
  // Use admin client to bypass RLS
  const supabase = createAdminClient();

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: lokerData } = await supabase
      .from("vip_loker")
      .select("created_at")
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    // Group by day
    const dailyData: { [key: string]: number } = {};
    lokerData?.forEach((loker) => {
      const date = new Date(loker.created_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });
      dailyData[date] = (dailyData[date] || 0) + 1;
    });

    return Object.entries(dailyData).map(([date, count]) => ({
      date,
      count,
    }));
  } catch (error) {
    console.error("Error fetching weekly data:", error);
    return [];
  }
}

export async function getRecentLoker(limit = 5) {
  // Use admin client to bypass RLS
  const supabase = createAdminClient();

  try {
    const { data: lokerData } = await supabase
      .from("vip_loker")
      .select(`
        id,
        title,
        status,
        created_at,
        perusahaan_id,
        vip_perusahaan!inner(name)
      `)
      .order("created_at", { ascending: false })
      .limit(limit);

    // Transform data to match expected type
    const transformedData = lokerData?.map((item: any) => ({
      id: item.id,
      title: item.title,
      status: item.status,
      created_at: item.created_at,
      perusahaan: item.vip_perusahaan ? { name: item.vip_perusahaan.name } : null,
    })) || [];

    return transformedData;
  } catch (error) {
    console.error("Error fetching recent loker:", error);
    return [];
  }
}

export async function getLokerByCategory() {
  // Use admin client to bypass RLS
  const supabase = createAdminClient();

  try {
    const { data: lokerData } = await supabase
      .from("vip_loker")
      .select("kategori")
      .eq("status", "published");

    // Count by category
    const categoryCount: { [key: string]: number } = {};
    lokerData?.forEach((loker) => {
      if (loker.kategori && Array.isArray(loker.kategori)) {
        loker.kategori.forEach((cat: string) => {
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
      }
    });

    // Sort and get top 5
    return Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
  } catch (error) {
    console.error("Error fetching category data:", error);
    return [];
  }
}

export async function getLokerByLocation() {
  // Use admin client to bypass RLS
  const supabase = createAdminClient();

  try {
    const { data: lokerData } = await supabase
      .from("vip_loker")
      .select("lokasi")
      .eq("status", "published");

    // Count by location
    const locationCount: { [key: string]: number } = {};
    lokerData?.forEach((loker) => {
      if (loker.lokasi) {
        locationCount[loker.lokasi] = (locationCount[loker.lokasi] || 0) + 1;
      }
    });

    // Sort and get top 5
    return Object.entries(locationCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));
  } catch (error) {
    console.error("Error fetching location data:", error);
    return [];
  }
}
