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
import { Eye, FileText, Briefcase, Sparkles, MapPin, Folder, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Color Palette from @colorpallate.md
const COLORS = {
  heliotrope: "#8e68fd",
  robinsEggBlue: "#00d1dc",
  alto: "#dfdfdf",
  pacificBlue: "#00acc7",
  purpleHeart: "#5547d0",
  mariner: "#3977d3",
  robinsEggBlue2: "#00bed1",
};

async function DashboardContent() {
  const stats = await getVipDashboardStats();
  const weeklyData = await getLokerWeeklyData();
  const recentLoker = await getRecentLoker();
  const categoryData = await getLokerByCategory();
  const locationData = await getLokerByLocation();

  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-500 font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-background to-muted/30 p-6 rounded-2xl border border-border/50">
        <div>
          <h1 className="text-4xl font-bold tracking-tight font-poppins bg-clip-text text-transparent bg-gradient-to-r from-[#8e68fd] to-[#3977d3]">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Welcome back to the admin command center.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/vip-loker/tambah">
            <Button 
              className="shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-6 rounded-xl font-semibold text-white border-none"
              style={{ background: `linear-gradient(135deg, ${COLORS.heliotrope}, ${COLORS.purpleHeart})` }}
            >
              <Sparkles className="mr-2 h-5 w-5" /> Post New Job
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
          color={COLORS.heliotrope}
          delay={0}
          href="/admin/vip-loker"
        />
        <VipStatsCard
          title="New Jobs Today"
          value={stats.lokerHariIni}
          icon="TrendingUp"
          description="Added in the last 24h"
          color={COLORS.robinsEggBlue}
          delay={0.1}
        />
        <VipStatsCard
          title="Companies"
          value={stats.totalPerusahaan}
          icon="Building2"
          description="Registered partners"
          color={COLORS.purpleHeart}
          delay={0.2}
          href="/admin/perusahaan"
        />
        <VipStatsCard
          title="VIP Members"
          value={stats.memberVip}
          icon="Crown"
          description="Active subscriptions"
          color={COLORS.pacificBlue}
          delay={0.3}
          href="/admin/member"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="group border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3977d3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <h2 className="text-3xl font-bold mt-2 font-poppins" style={{ color: COLORS.mariner }}>
                  {stats.totalViews.toLocaleString()}
                </h2>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  Across all listings
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                </p>
              </div>
              <div 
                className="rounded-2xl p-4 transition-transform duration-300 group-hover:scale-110 shadow-sm"
                style={{ backgroundColor: `${COLORS.mariner}15`, color: COLORS.mariner }}
              >
                <Eye className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00bed1]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Draft Jobs</p>
                <h2 className="text-3xl font-bold mt-2 font-poppins" style={{ color: COLORS.robinsEggBlue2 }}>
                  {stats.lokerDraft}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Pending publication</p>
              </div>
              <div 
                className="rounded-2xl p-4 transition-transform duration-300 group-hover:scale-110 shadow-sm"
                style={{ backgroundColor: `${COLORS.robinsEggBlue2}15`, color: COLORS.robinsEggBlue2 }}
              >
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8e68fd]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">All Time Jobs</p>
                <h2 className="text-3xl font-bold mt-2 font-poppins" style={{ color: COLORS.heliotrope }}>
                  {stats.totalLoker}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Total jobs created</p>
              </div>
              <div 
                className="rounded-2xl p-4 transition-transform duration-300 group-hover:scale-110 shadow-sm"
                style={{ backgroundColor: `${COLORS.heliotrope}15`, color: COLORS.heliotrope }}
              >
                <Briefcase className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Activity Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 lg:h-[420px]">
        <div className="lg:col-span-2 h-full bg-card rounded-xl border shadow-sm p-1">
          <LokerWeeklyChart data={weeklyData} />
        </div>
        <div className="h-full">
          <NotificationPanel draftCount={stats.lokerDraft} />
        </div>
      </div>

      {/* Bottom Grid: Recent Jobs & Insights */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between bg-muted/20">
              <h3 className="font-bold text-lg font-poppins flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Recent Jobs
              </h3>
              <Link href="/admin/vip-loker">
                <Button variant="ghost" size="sm" className="text-xs">View All</Button>
              </Link>
            </div>
            <RecentLokerTable loker={recentLoker} />
          </div>
        </div>

        <div className="space-y-6">
          {/* Categories */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-4 bg-muted/20 border-b">
              <CardTitle className="text-base font-bold font-poppins flex items-center gap-2">
                <Folder className="h-5 w-5" style={{ color: COLORS.purpleHeart }} />
                Top Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {categoryData.length > 0 ? (
                <div className="space-y-4">
                  {categoryData.slice(0, 5).map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between group cursor-default">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-2.5 w-2.5 rounded-full shadow-sm group-hover:scale-125 transition-transform duration-300" 
                          style={{ backgroundColor: idx === 0 ? COLORS.heliotrope : idx === 1 ? COLORS.purpleHeart : idx === 2 ? COLORS.pacificBlue : COLORS.alto }}
                        />
                        <span className="text-sm font-medium truncate max-w-[180px] text-foreground/80 group-hover:text-foreground transition-colors">
                          {cat.category}
                        </span>
                      </div>
                      <span className="text-xs font-bold bg-muted px-2.5 py-1 rounded-full text-muted-foreground min-w-[2rem] text-center">
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
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-4 bg-muted/20 border-b">
              <CardTitle className="text-base font-bold font-poppins flex items-center gap-2">
                <MapPin className="h-5 w-5" style={{ color: COLORS.robinsEggBlue }} />
                Top Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {locationData.length > 0 ? (
                <div className="space-y-4">
                  {locationData.slice(0, 5).map((loc, idx) => (
                    <div key={idx} className="flex items-center justify-between group cursor-default">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-2.5 w-2.5 rounded-full shadow-sm group-hover:scale-125 transition-transform duration-300"
                          style={{ backgroundColor: idx === 0 ? COLORS.robinsEggBlue : idx === 1 ? COLORS.pacificBlue : idx === 2 ? COLORS.mariner : COLORS.alto }} 
                        />
                        <span className="text-sm font-medium truncate max-w-[180px] text-foreground/80 group-hover:text-foreground transition-colors">
                          {loc.location}
                        </span>
                      </div>
                      <span className="text-xs font-bold bg-muted px-2.5 py-1 rounded-full text-muted-foreground min-w-[2rem] text-center">
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
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: COLORS.heliotrope, borderTopColor: "transparent" }} />
            <p className="text-sm text-muted-foreground font-medium">Loading dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
