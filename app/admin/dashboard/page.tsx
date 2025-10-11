import { Suspense } from "react";
import {
  getAdminStats,
  getRecentActivity,
  getUserGrowthData,
  getApplicationStatusData,
} from "@/actions/admin-stats";
import { StatsCard } from "@/components/admin/StatsCard";
import { UserGrowthChart } from "@/components/admin/UserGrowthChart";
import { ApplicationStatusChart } from "@/components/admin/ApplicationStatusChart";
import { RecentActivity } from "@/components/admin/RecentActivity";

import { Card, CardContent } from "@/components/ui/card";

async function DashboardContent() {
  const stats = await getAdminStats();
  const activities = await getRecentActivity();
  const growthData = await getUserGrowthData();
  const statusData = await getApplicationStatusData();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground mt-2">
          Selamat datang kembali, Admin! 👋
        </p>
        {stats.todayApplications > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {stats.todayApplications} pengajuan baru hari ini
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <StatsCard
          title="Total Pengguna"
          value={stats.totalUsers}
          icon="Users"
          description="Semua akun terdaftar"
          color="text-blue-600"
          delay={0}
        />
        <StatsCard
          title="Total Pengajuan"
          value={stats.totalApplications}
          icon="FileText"
          description="Semua pengajuan akun"
          color="text-purple-600"
          delay={0.1}
        />
        <StatsCard
          title="Pending"
          value={stats.pendingApplications}
          icon="Clock"
          description="Menunggu verifikasi"
          color="text-yellow-600"
          delay={0.2}
        />
        <StatsCard
          title="Disetujui"
          value={stats.approvedApplications}
          icon="CheckCircle"
          description="Akun sudah aktif"
          color="text-green-600"
          delay={0.3}
        />
        <StatsCard
          title="Ditolak"
          value={stats.rejectedApplications}
          icon="XCircle"
          description="Pengajuan ditolak"
          color="text-red-600"
          delay={0.4}
        />
        <StatsCard
          title="Hari Ini"
          value={stats.todayApplications}
          icon="TrendingUp"
          description="Pengajuan baru"
          color="text-indigo-600"
          delay={0.5}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <UserGrowthChart data={growthData} />
        <ApplicationStatusChart data={statusData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href="/admin/applications"
                className="block p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <p className="font-medium">View Applications</p>
                <p className="text-sm text-muted-foreground">
                  {stats.pendingApplications} pending reviews
                </p>
              </a>
              <a
                href="/admin/analytics"
                className="block p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <p className="font-medium">Analytics</p>
                <p className="text-sm text-muted-foreground">
                  Detailed insights and reports
                </p>
              </a>
              <a
                href="/admin/settings"
                className="block p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <p className="font-medium">Admin Settings</p>
                <p className="text-sm text-muted-foreground">
                  Telegram, appearance, and preferences
                </p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
