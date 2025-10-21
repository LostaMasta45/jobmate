"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  ExternalLink, 
  Calendar,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { getFollowUpsDueToday, getFollowUpStats } from "@/actions/followup/list";
import { FollowUpReminderWithApplication, FollowUpStats } from "@/types/followup";
import { formatFollowUpDate, getRelativeTime, isOverdue, REMINDER_TYPE_CONFIG } from "@/lib/followup-utils";
import { cn } from "@/lib/utils";

export function RecentFollowUps() {
  const [reminders, setReminders] = useState<FollowUpReminderWithApplication[]>([]);
  const [stats, setStats] = useState<FollowUpStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [remindersResult, statsResult] = await Promise.all([
      getFollowUpsDueToday(),
      getFollowUpStats()
    ]);

    if (remindersResult.data) {
      setReminders(remindersResult.data.slice(0, 3)); // Only show 3
    }

    if (statsResult.data) {
      setStats(statsResult.data);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-base font-semibold">Follow-up Reminders</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalDue = (stats?.due_today || 0) + (stats?.overdue || 0);

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <CardTitle className="text-base font-semibold">Follow-up Reminders</CardTitle>
          </div>
          <Link href="/tools/tracker/followups">
            <Button variant="ghost" size="sm" className="text-xs">
              Lihat Semua
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white/80 dark:bg-black/20 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {stats.overdue > 0 ? (
                  <AlertCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                ) : (
                  <Bell className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                )}
                <p className="text-xs text-muted-foreground">Due</p>
              </div>
              <p className={cn(
                "text-lg font-bold",
                stats.overdue > 0 ? "text-red-600 dark:text-red-400" : "text-purple-700 dark:text-purple-300"
              )}>
                {totalDue}
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-black/20 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calendar className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <p className="text-xs text-muted-foreground">Week</p>
              </div>
              <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                {stats.due_this_week}
              </p>
            </div>

            <div className="bg-white/80 dark:bg-black/20 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <p className="text-xs text-muted-foreground">Rate</p>
              </div>
              <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                {Math.round(stats.response_rate)}%
              </p>
            </div>
          </div>
        )}

        {/* Reminder List */}
        {reminders.length === 0 ? (
          <div className="text-center py-6 px-4 bg-white/80 dark:bg-black/20 rounded-lg">
            <Bell className="h-8 w-8 mx-auto mb-2 text-purple-400 dark:text-purple-600 opacity-50" />
            <p className="text-sm text-muted-foreground">No follow-ups due today</p>
            <p className="text-xs text-muted-foreground mt-1">You're all caught up! 🎉</p>
          </div>
        ) : (
          <div className="space-y-2">
            {reminders.map((reminder) => {
              const overdue = isOverdue(reminder.scheduled_date);
              const typeConfig = REMINDER_TYPE_CONFIG[reminder.reminder_type];
              
              return (
                <Link 
                  key={reminder.id} 
                  href={`/tools/tracker/followups`}
                  className="block"
                >
                  <div className="bg-white/80 dark:bg-black/20 rounded-lg p-3 hover:bg-white dark:hover:bg-black/30 transition-colors">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 text-lg mt-0.5">
                        {typeConfig.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {reminder.application.company}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {reminder.application.position}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge 
                            variant={overdue ? "destructive" : "secondary"} 
                            className="text-[10px] py-0 px-1.5 h-auto"
                          >
                            {typeConfig.label}
                          </Badge>
                          <span className={cn(
                            "text-[10px] font-medium",
                            overdue && "text-red-600 dark:text-red-400"
                          )}>
                            {formatFollowUpDate(reminder.scheduled_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        <Link href="/tools/tracker/followups" className="block">
          <Button variant="outline" className="w-full text-xs" size="sm">
            <Bell className="h-3 w-3 mr-1.5" />
            Manage All Follow-ups
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
