import { Suspense } from "react";
import {
  getAdminStats,
  getUserGrowthData,
  getApplicationStatusData,
} from "@/actions/admin-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserGrowthChart } from "@/components/admin/UserGrowthChart";
import { ApplicationStatusChart } from "@/components/admin/ApplicationStatusChart";
import { Users, TrendingUp, Activity, FileText } from "lucide-react";

async function AnalyticsContent() {
  const stats = await getAdminStats();
  const growthData = await getUserGrowthData();
  const statusData = await getApplicationStatusData();

  const totalGrowth = growthData.reduce((sum, d) => sum + d.count, 0);
  const avgGrowth = growthData.length > 0 ? (totalGrowth / growthData.length).toFixed(1) : 0;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Detailed insights and performance metrics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <h2 className="text-2xl font-bold mt-2">{stats.totalUsers}</h2>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Weekly Growth</p>
                <h2 className="text-2xl font-bold mt-2">{avgGrowth}</h2>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approval Rate</p>
                <h2 className="text-2xl font-bold mt-2">
                  {stats.totalApplications > 0
                    ? Math.round((stats.approvedApplications / stats.totalApplications) * 100)
                    : 0}
                  %
                </h2>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applications</p>
                <h2 className="text-2xl font-bold mt-2">{stats.totalApplications}</h2>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <UserGrowthChart data={growthData} />
        <ApplicationStatusChart data={statusData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Registration Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Registered</span>
                <span className="font-bold">{stats.totalUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="font-bold">{stats.approvedApplications}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending Approval</span>
                <span className="font-bold text-yellow-600">{stats.pendingApplications}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rejected</span>
                <span className="font-bold text-red-600">{stats.rejectedApplications}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                    className="bg-green-600 h-2 rounded-full"
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
                    className="bg-yellow-600 h-2 rounded-full"
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
                    className="bg-red-600 h-2 rounded-full"
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
    </>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      }
    >
      <AnalyticsContent />
    </Suspense>
  );
}
