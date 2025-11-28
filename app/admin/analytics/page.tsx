import { Suspense } from "react";
import {
  getAdminStats,
  getUserGrowthData,
  getApplicationStatusData,
} from "@/actions/admin-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserGrowthChart } from "@/components/admin/UserGrowthChart";
import { ApplicationStatusChart } from "@/components/admin/ApplicationStatusChart";
import { VipStatsCard } from "@/components/admin/vip/VipStatsCard";

async function AnalyticsContent() {
  const stats = await getAdminStats();
  const growthData = await getUserGrowthData();
  const statusData = await getApplicationStatusData();

  const totalGrowth = growthData.reduce((sum, d) => sum + d.count, 0);
  const avgGrowth = growthData.length > 0 ? (totalGrowth / growthData.length).toFixed(1) : 0;

  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Detailed insights and performance metrics
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <VipStatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon="Users"
            description="Registered accounts"
            color="text-blue-600"
            delay={0}
        />
        <VipStatsCard
            title="Avg Growth"
            value={Number(avgGrowth)}
            icon="TrendingUp"
            description="Weekly user acquisition"
            color="text-green-600"
            delay={0.1}
        />
        <VipStatsCard
            title="Approval Rate"
            value={
                stats.totalApplications > 0
                ? Math.round((stats.approvedApplications / stats.totalApplications) * 100)
                : 0
            }
            icon="Activity"
            description="% of accepted apps"
            color="text-purple-600"
            delay={0.2}
        />
        <VipStatsCard
            title="Applications"
            value={stats.totalApplications}
            icon="FileText"
            description="Total submissions"
            color="text-amber-600"
            delay={0.3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <UserGrowthChart data={growthData} />
        <ApplicationStatusChart data={statusData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>User Registration Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2 hover:bg-accent/40 rounded-lg transition-colors">
                <span className="text-sm text-muted-foreground">Total Registered</span>
                <span className="font-bold">{stats.totalUsers}</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-accent/40 rounded-lg transition-colors">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="font-bold">{stats.approvedApplications}</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-accent/40 rounded-lg transition-colors">
                <span className="text-sm text-muted-foreground">Pending Approval</span>
                <span className="font-bold text-yellow-600">{stats.pendingApplications}</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-accent/40 rounded-lg transition-colors">
                <span className="text-sm text-muted-foreground">Rejected</span>
                <span className="font-bold text-red-600">{stats.rejectedApplications}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Approval Success Rate</span>
                  <span className="font-bold">
                    {stats.totalApplications > 0
                      ? Math.round((stats.approvedApplications / stats.totalApplications) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${
                        stats.totalApplications > 0
                          ? Math.round((stats.approvedApplications / stats.totalApplications) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Pending Rate</span>
                  <span className="font-bold">
                    {stats.totalApplications > 0
                      ? Math.round((stats.pendingApplications / stats.totalApplications) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${
                        stats.totalApplications > 0
                          ? Math.round((stats.pendingApplications / stats.totalApplications) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Rejection Rate</span>
                  <span className="font-bold">
                    {stats.totalApplications > 0
                      ? Math.round((stats.rejectedApplications / stats.totalApplications) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${
                        stats.totalApplications > 0
                          ? Math.round((stats.rejectedApplications / stats.totalApplications) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
           <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground font-medium">Loading analytics...</p>
          </div>
        </div>
      }
    >
      <AnalyticsContent />
    </Suspense>
  );
}
