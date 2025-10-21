import { Suspense } from "react";
import {
  getVipDashboardStats,
  getLokerWeeklyData,
  getRecentLoker,
  getLokerByCategory,
  getLokerByLocation,
} from "@/actions/admin/vip-stats";
import { VipStatsCard } from "@/components/admin/vip/VipStatsCard";
import { LokerWeeklyChart } from "@/components/admin/vip/LokerWeeklyChart";
import { RecentLokerTable } from "@/components/admin/vip/RecentLokerTable";
import { NotificationPanel } from "@/components/admin/vip/NotificationPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileText, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function DashboardContent() {
  const stats = await getVipDashboardStats();
  const weeklyData = await getLokerWeeklyData();
  const recentLoker = await getRecentLoker();
  const categoryData = await getLokerByCategory();
  const locationData = await getLokerByLocation();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard VIP Career
        </h1>
        <p className="text-muted-foreground mt-2">
          Selamat datang kembali, Admin! 👋
        </p>
        {stats.lokerHariIni > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            🎉 {stats.lokerHariIni} loker baru ditambahkan hari ini
          </p>
        )}
      </div>

      {/* Statistik Ringkas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <VipStatsCard
          title="Total Loker Aktif"
          value={stats.lokerAktif}
          icon="Briefcase"
          description="Loker yang sedang tayang"
          color="text-blue-600"
          delay={0}
          href="/admin/vip-loker"
        />
        <VipStatsCard
          title="Loker Baru Hari Ini"
          value={stats.lokerHariIni}
          icon="TrendingUp"
          description="Ditambahkan hari ini"
          color="text-green-600"
          delay={0.1}
        />
        <VipStatsCard
          title="Perusahaan Terdaftar"
          value={stats.totalPerusahaan}
          icon="Building2"
          description="Total perusahaan"
          color="text-purple-600"
          delay={0.2}
          href="/admin/perusahaan"
        />
        <VipStatsCard
          title="Member VIP Aktif"
          value={stats.memberVip}
          icon="Crown"
          description="Basic & Premium"
          color="text-amber-600"
          delay={0.3}
          href="/admin/member"
        />
      </div>

      {/* Statistik Tambahan */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <h2 className="text-2xl font-bold mt-2 text-indigo-600">
                  {stats.totalViews.toLocaleString()}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Semua loker VIP</p>
              </div>
              <div className="rounded-full p-3 bg-indigo-100 dark:bg-indigo-950">
                <Eye className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Draft Loker</p>
                <h2 className="text-2xl font-bold mt-2 text-yellow-600">
                  {stats.lokerDraft}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Belum dipublish</p>
              </div>
              <div className="rounded-full p-3 bg-yellow-100 dark:bg-yellow-950">
                <FileText className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Loker</p>
                <h2 className="text-2xl font-bold mt-2">
                  {stats.totalLoker}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Semua status</p>
              </div>
              <div className="rounded-full p-3 bg-gray-100 dark:bg-gray-800">
                <Briefcase className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grafik & Notifikasi */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2">
          <LokerWeeklyChart data={weeklyData} />
        </div>
        <NotificationPanel draftCount={stats.lokerDraft} />
      </div>

      {/* Tabel Loker Terbaru & Insights */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2">
          <RecentLokerTable loker={recentLoker} />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/vip-loker/tambah">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                ➕ Tambah Loker Baru
              </Button>
            </Link>
            <Link href="/admin/tools-ai">
              <Button variant="outline" className="w-full">
                🤖 Tools AI
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full">
                📊 Lihat Laporan Lengkap
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Kategori & Lokasi Populer */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>📂 Kategori Terpopuler</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="space-y-3">
                {categoryData.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{cat.category}</span>
                    <span className="text-sm text-muted-foreground">
                      {cat.count} loker
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Belum ada data
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📍 Lokasi Terbanyak</CardTitle>
          </CardHeader>
          <CardContent>
            {locationData.length > 0 ? (
              <div className="space-y-3">
                {locationData.map((loc, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{loc.location}</span>
                    <span className="text-sm text-muted-foreground">
                      {loc.count} loker
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Belum ada data
              </p>
            )}
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
