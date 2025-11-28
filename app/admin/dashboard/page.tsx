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
import { Eye, FileText, Briefcase, Sparkles, MapPin, Folder } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function DashboardContent() {
  const stats = await getVipDashboardStats();
  const weeklyData = await getLokerWeeklyData();
  const recentLoker = await getRecentLoker();
  const categoryData = await getLokerByCategory();
  const locationData = await getLokerByLocation();

  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back to the admin command center.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/vip-loker/tambah">
            <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              <Sparkles className="mr-2 h-4 w-4" /> Post New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <VipStatsCard
          title="Total Jobs Active"
          value={stats.lokerAktif}
          icon="Briefcase"
          description="Currently published and live"
          color="text-blue-600"
          delay={0}
          href="/admin/vip-loker"
        />
        <VipStatsCard
          title="New Jobs Today"
          value={stats.lokerHariIni}
          icon="TrendingUp"
          description="Added in the last 24h"
          color="text-emerald-600"
          delay={0.1}
        />
        <VipStatsCard
          title="Companies"
          value={stats.totalPerusahaan}
          icon="Building2"
          description="Registered partners"
          color="text-purple-600"
          delay={0.2}
          href="/admin/perusahaan"
        />
        <VipStatsCard
          title="VIP Members"
          value={stats.memberVip}
          icon="Crown"
          description="Active subscriptions"
          color="text-amber-600"
          delay={0.3}
          href="/admin/member"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-card hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <h2 className="text-3xl font-bold mt-2 text-indigo-600 dark:text-indigo-400">
                  {stats.totalViews.toLocaleString()}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Across all job listings</p>
              </div>
              <div className="rounded-xl p-3 bg-indigo-100/50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                <Eye className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-950/20 dark:to-card hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Draft Jobs</p>
                <h2 className="text-3xl font-bold mt-2 text-yellow-600 dark:text-yellow-400">
                  {stats.lokerDraft}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Pending publication</p>
              </div>
              <div className="rounded-xl p-3 bg-yellow-100/50 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/20 dark:to-card hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">All Time Jobs</p>
                <h2 className="text-3xl font-bold mt-2 text-foreground">
                  {stats.totalLoker}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Total jobs created</p>
              </div>
              <div className="rounded-xl p-3 bg-gray-100/50 dark:bg-gray-800 text-foreground">
                <Briefcase className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Activity Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 h-auto lg:h-[400px]">
        <div className="lg:col-span-2 h-full">
          <LokerWeeklyChart data={weeklyData} />
        </div>
        <div className="h-full">
          <NotificationPanel draftCount={stats.lokerDraft} />
        </div>
      </div>

      {/* Bottom Grid: Recent Jobs & Insights */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentLokerTable loker={recentLoker} />
        </div>

        <div className="space-y-6">
          {/* Categories */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Folder className="h-4 w-4 text-muted-foreground" />
                Top Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <div className="space-y-3">
                  {categoryData.slice(0, 5).map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary/60" />
                        <span className="text-sm font-medium truncate max-w-[180px]">{cat.category}</span>
                      </div>
                      <span className="text-xs font-semibold bg-secondary px-2 py-1 rounded-md text-secondary-foreground">
                        {cat.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
              )}
            </CardContent>
          </Card>

          {/* Locations */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Top Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {locationData.length > 0 ? (
                <div className="space-y-3">
                  {locationData.slice(0, 5).map((loc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500/60" />
                        <span className="text-sm font-medium truncate max-w-[180px]">{loc.location}</span>
                      </div>
                      <span className="text-xs font-semibold bg-secondary px-2 py-1 rounded-md text-secondary-foreground">
                        {loc.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground font-medium">Loading dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
