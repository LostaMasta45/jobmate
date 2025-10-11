import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Server,
  Database,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

const systemMetrics = [
  { name: "API Response Time", value: "142ms", status: "good", icon: Zap },
  { name: "Database Queries", value: "1,234", status: "good", icon: Database },
  { name: "Active Sessions", value: "56", status: "good", icon: Activity },
  { name: "Error Rate", value: "0.2%", status: "good", icon: AlertCircle },
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
      return <Badge variant="outline" className="bg-red-500/10 text-red-600">Error</Badge>;
    case "warning":
      return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Warning</Badge>;
    case "success":
      return <Badge variant="outline" className="bg-green-500/10 text-green-600">Success</Badge>;
    default:
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-600">Info</Badge>;
  }
}

function getStatusColor(status: string) {
  return status === "good" ? "text-green-600" : "text-red-600";
}

export default function ObservabilityPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Observability</h1>
        <p className="text-muted-foreground mt-2">
          Monitor system health, logs, and performance metrics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        {systemMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                    <h2 className={`text-2xl font-bold mt-2 ${getStatusColor(metric.status)}`}>
                      {metric.value}
                    </h2>
                  </div>
                  <Icon className={`h-8 w-8 ${getStatusColor(metric.status)}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card>
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

        <Card>
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

        <Card>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>System Logs</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Export Logs
            </Button>
            <Button variant="outline" size="sm">
              Clear Old Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    {getLevelBadge(log.level)}
                    <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                    <Badge variant="outline" className="text-xs">{log.source}</Badge>
                  </div>
                  <p className="text-sm">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Requests (24h)</span>
                <span className="font-bold">8,432</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Successful (200)</span>
                <span className="font-bold text-green-600">8,401</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Client Errors (4xx)</span>
                <span className="font-bold text-yellow-600">25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Server Errors (5xx)</span>
                <span className="font-bold text-red-600">6</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Database Connection</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">API Endpoints</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Storage Service</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Telegram Bot</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600">Healthy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
