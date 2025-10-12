"use server";

import { createClient, getUser } from "@/lib/supabase/server";

type Alert = {
  type: "warning" | "info" | "error";
  message: string;
  href?: string;
};

export async function getAlerts(): Promise<Alert[]> {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) return [];

    const alerts: Alert[] = [];

    // Lamaran tanpa update >14 hari
    const { data } = await supabase
      .from("applications")
      .select("id, company, position, updated_at, created_at, status")
      .eq("user_id", user.id)
      .in("status", ["Applied", "Screening", "Interview", "Offer"]);

    const now = Date.now();
    data?.forEach((a) => {
      const updatedAt = a.updated_at || a.created_at;
      const days = Math.floor((now - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24));
      
      if (days >= 14) {
        alerts.push({
          type: "warning",
          message: `Lamaran ke ${a.company} (${a.position}) belum update ${days} hari.`,
          href: `/tools/tracker`,
        });
      }
    });

    return alerts.slice(0, 5);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return [];
  }
}
