"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/server";

export async function getAdminStats() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden: Admin only");

  // Get total users
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // Get applications stats
  const { count: totalApplications } = await supabase
    .from("account_applications")
    .select("*", { count: "exact", head: true });

  const { count: pendingApplications } = await supabase
    .from("account_applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: approvedApplications } = await supabase
    .from("account_applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");

  const { count: rejectedApplications } = await supabase
    .from("account_applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "rejected");

  // Get recent applications (today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count: todayApplications } = await supabase
    .from("account_applications")
    .select("*", { count: "exact", head: true })
    .gte("created_at", today.toISOString());

  return {
    totalUsers: totalUsers || 0,
    totalApplications: totalApplications || 0,
    pendingApplications: pendingApplications || 0,
    approvedApplications: approvedApplications || 0,
    rejectedApplications: rejectedApplications || 0,
    todayApplications: todayApplications || 0,
  };
}

export async function getRecentActivity() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden: Admin only");

  // Get recent applications
  const { data: recentApplications } = await supabase
    .from("account_applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  return recentApplications || [];
}

export async function getUserGrowthData() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden: Admin only");

  // Get user registrations by week (last 8 weeks)
  const { data: users } = await supabase
    .from("profiles")
    .select("created_at")
    .order("created_at", { ascending: true });

  if (!users) return [];

  // Group by week
  const weeklyData: { [key: string]: number } = {};
  const now = new Date();
  
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (i * 7));
    weekStart.setHours(0, 0, 0, 0);
    const weekKey = weekStart.toISOString().split('T')[0];
    weeklyData[weekKey] = 0;
  }

  users.forEach(user => {
    const createdDate = new Date(user.created_at);
    const weekStart = new Date(createdDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (weeklyData[weekKey] !== undefined) {
      weeklyData[weekKey]++;
    }
  });

  return Object.entries(weeklyData).map(([date, count]) => ({
    date,
    count,
  }));
}

export async function getApplicationStatusData() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden: Admin only");

  const { data: applications } = await supabase
    .from("account_applications")
    .select("status");

  if (!applications) return [];

  const statusCounts: { [key: string]: number } = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  applications.forEach(app => {
    if (statusCounts[app.status] !== undefined) {
      statusCounts[app.status]++;
    }
  });

  return [
    { name: "Pending", value: statusCounts.pending },
    { name: "Approved", value: statusCounts.approved },
    { name: "Rejected", value: statusCounts.rejected },
  ];
}
