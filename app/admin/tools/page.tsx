import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Mail,
  Briefcase,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

const toolsData = [
  {
    name: "CV ATS Generator",
    icon: FileText,
    totalUsage: 245,
    lastUsed: "10 Oct 2025",
    trend: "up",
    trendValue: "+12%",
    color: "text-blue-600",
  },
  {
    name: "Cover Letter Generator",
    icon: Mail,
    totalUsage: 189,
    lastUsed: "09 Oct 2025",
    trend: "up",
    trendValue: "+8%",
    color: "text-green-600",
  },
  {
    name: "Application Tracker",
    icon: Briefcase,
    totalUsage: 156,
    lastUsed: "10 Oct 2025",
    trend: "stable",
    trendValue: "0%",
    color: "text-purple-600",
  },
  {
    name: "Email Template",
    icon: MessageSquare,
    totalUsage: 98,
    lastUsed: "08 Oct 2025",
    trend: "down",
    trendValue: "-3%",
    color: "text-orange-600",
  },
  {
    name: "WhatsApp Generator",
    icon: MessageSquare,
    totalUsage: 76,
    lastUsed: "09 Oct 2025",
    trend: "up",
    trendValue: "+5%",
    color: "text-cyan-600",
  },
  {
    name: "PDF Tools",
    icon: FileText,
    totalUsage: 134,
    lastUsed: "10 Oct 2025",
    trend: "up",
    trendValue: "+15%",
    color: "text-pink-600",
  },
];

function getTrendIcon(trend: string) {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case "down":
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <Minus className="h-4 w-4 text-gray-600" />;
  }
}

export default function ToolsMonitorPage() {
  const totalUsage = toolsData.reduce((sum, tool) => sum + tool.totalUsage, 0);
  const mostUsed = toolsData.reduce((max, tool) => 
    tool.totalUsage > max.totalUsage ? tool : max
  );

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tools Monitor</h1>
        <p className="text-muted-foreground mt-2">
          Monitor usage and performance of JobMate tools
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tool Usage</p>
                <h2 className="text-3xl font-bold mt-2">{totalUsage}</h2>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Most Used Tool</p>
                <h2 className="text-xl font-bold mt-2">{mostUsed.name.split(' ')[0]}</h2>
                <p className="text-sm text-muted-foreground">{mostUsed.totalUsage} uses</p>
              </div>
              {<mostUsed.icon className={`h-8 w-8 ${mostUsed.color}`} />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tools</p>
                <h2 className="text-3xl font-bold mt-2">{toolsData.length}</h2>
              </div>
              <Briefcase className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tools Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium">Tool Name</th>
                  <th className="p-4 text-left text-sm font-medium">Total Usage</th>
                  <th className="p-4 text-left text-sm font-medium">Trend</th>
                  <th className="p-4 text-left text-sm font-medium">Last Used</th>
                  <th className="p-4 text-left text-sm font-medium">Status</th>
                  <th className="p-4 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {toolsData.map((tool) => {
                  const ToolIcon = tool.icon;
                  return (
                    <tr key={tool.name} className="border-b">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-lg p-2 bg-primary/10`}>
                            <ToolIcon className={`h-5 w-5 ${tool.color}`} />
                          </div>
                          <span className="font-medium">{tool.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold">{tool.totalUsage}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getTrendIcon(tool.trend)}
                          <span className="text-sm">{tool.trendValue}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {tool.lastUsed}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="bg-green-500/10 text-green-600">
                          Active
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button variant="outline" size="sm">
                          View Logs
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Usage Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {toolsData.map((tool) => {
                const percentage = ((tool.totalUsage / totalUsage) * 100).toFixed(1);
                return (
                  <div key={tool.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">{tool.name}</span>
                      <span className="text-sm font-bold">{percentage}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  ✓ All tools operational
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  No reported errors in the last 24 hours
                </p>
              </div>

              <div className="p-4 rounded-lg border">
                <p className="text-sm font-medium">CV ATS Generator</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Highest usage increase (+12% this week)
                </p>
              </div>

              <div className="p-4 rounded-lg border">
                <p className="text-sm font-medium">PDF Tools</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Strong growth trend (+15% this week)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
