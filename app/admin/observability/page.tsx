import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Server,
  Clock,
  Download,
  Trash2
} from "lucide-react";
import { VipStatsCard } from "@/components/admin/vip/VipStatsCard";

const systemMetrics = [
  { name: "API Response Time", value: 142, suffix: "ms", status: "good", icon: "Zap", color: "text-yellow-600" },
  { name: "Database Queries", value: 1234, status: "good", icon: "Database", color: "text-blue-600" },
  { name: "Active Sessions", value: 56, status: "good", icon: "Activity", color: "text-purple-600" },
  { name: "Error Rate", value: 0.2, suffix: "%", status: "good", icon: "AlertCircle", color: "text-red-600" },
];

const recentLogs = [
  {
    id: 1,
    timestamp: "2025-10-10 14:23:45",
    level: "info",
    message: "User approved: testjob@gmail.com",
    source: "admin-action",
  },
  {
    id: 2,
    timestamp: "2025-10-10 14:20:12",
    level: "success",
    message: "Telegram notification sent successfully",
    source: "telegram-bot",
  },
  {
    id: 3,
    timestamp: "2025-10-10 14:15:30",
    level: "info",
    message: "New application submitted: tesjob@gmail.com",
    source: "application",
  },
  {
    id: 4,
    timestamp: "2025-10-10 14:10:05",
    level: "warning",
    message: "Slow query detected (2.5s): SELECT * FROM profiles",
    source: "database",
  },
  {
    id: 5,
    timestamp: "2025-10-10 14:05:22",
    level: "info",
    message: "CV ATS generated for user ID: abc123",
    source: "cv-generator",
  },
  {
    id: 6,
    timestamp: "2025-10-10 13:58:14",
    level: "error",
    message: "Failed to upload proof: file too large",
    source: "storage",
  },
  {
    id: 7,
    timestamp: "2025-10-10 13:45:33",
    level: "info",
    message: "Admin login: admin@jobmate.com",
    source: "auth",
  },
  {
    id: 8,
    timestamp: "2025-10-10 13:30:11",
    level: "success",
    message: "Email sent to testfinal@gmail.com",
    source: "email",
  },
];

function getLevelBadge(level: string) {
  switch (level) {
    case "error":
      return <Badge variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200">Error</Badge>;
    case "warning":
      return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Warning</Badge>;
    case "success":
      return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">Success</Badge>;
    default:
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Info</Badge>;
  }
}

export default function ObservabilityPage() {
  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Observability</h1>
        <p className="text-muted-foreground mt-1">
          Real-time monitoring of system health, logs, and performance.
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {systemMetrics.map((metric) => (
          <VipStatsCard
            key={metric.name}
            title={metric.name}
            value={metric.value}
            icon={metric.icon}
            description={metric.suffix ? `${metric.value}${metric.suffix} avg` : "Total count"}
            color={metric.color}
            delay={0}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-3 bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Status</p>
                <p className="text-lg font-bold text-green-600">Operational</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-3 bg-blue-500/10">
                <Server className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                <p className="text-lg font-bold">99.9%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-3 bg-purple-500/10">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Incident</p>
                <p className="text-lg font-bold">7 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 pb-4 gap-4">
          <CardTitle>System Logs</CardTitle>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between p-4 hover:bg-accent/40 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    {getLevelBadge(log.level)}
                    <span className="text-xs text-muted-foreground font-mono">{log.timestamp}</span>
                    <Badge variant="secondary" className="text-[10px] h-5">{log.source}</Badge>
                  </div>
                  <p className="text-sm font-mono text-foreground/90 break-all">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2 hover:bg-accent/40 rounded-lg">
                <span className="text-sm text-muted-foreground">Total Requests (24h)</span>
                <span className="font-bold">8,432</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-accent/40 rounded-lg">
                <span className="text-sm text-muted-foreground">Successful (200)</span>
                <span className="font-bold text-green-600">8,401</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-accent/40 rounded-lg">
                <span className="text-sm text-muted-foreground">Client Errors (4xx)</span>
                <span className="font-bold text-yellow-600">25</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-accent/40 rounded-lg">
                <span className="text-sm text-muted-foreground">Server Errors (5xx)</span>
                <span className="font-bold text-red-600">6</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Health Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Database Connection", "API Endpoints", "Storage Service", "Telegram Bot"].map((service) => (
                <div key={service} className="flex items-center justify-between p-2 hover:bg-accent/40 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium">{service}</span>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                    Healthy
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
