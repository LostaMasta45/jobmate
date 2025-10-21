"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  Bell, 
  CheckCircle2, 
  Calendar,
  TrendingUp,
  Mail,
  MessageCircle,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { FollowUpReminderWithApplication, FollowUpStats } from "@/types/followup";
import { getFollowUpReminders, getFollowUpStats } from "@/actions/followup/list";
import { 
  completeFollowUpReminder, 
  snoozeFollowUpReminder, 
  dismissFollowUpReminder 
} from "@/actions/followup/manage";
import { FollowUpCard } from "@/components/followup/FollowUpCard";
import { TemplateSelector } from "@/components/followup/TemplateSelector";
import { toast } from "sonner";
import { formatResponseRate, formatAvgResponseTime } from "@/lib/followup-utils";

export function FollowUpsPageContent() {
  const [activeTab, setActiveTab] = useState("all");
  const [reminders, setReminders] = useState<FollowUpReminderWithApplication[]>([]);
  const [stats, setStats] = useState<FollowUpStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTemplate, setShowTemplate] = useState<{
    open: boolean;
    reminder?: FollowUpReminderWithApplication;
  }>({ open: false });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Load reminders based on active tab
    let filters: any;
    
    if (activeTab === "due") {
      filters = { 
        status: ['pending', 'due'],
        scheduled_date_to: today
      };
    } else if (activeTab === "upcoming") {
      filters = { 
        status: ['pending'],
        scheduled_date_from: tomorrowStr
      };
    } else if (activeTab === "completed") {
      filters = { 
        status: ['completed']
      };
    } else {
      // "all" tab - NO FILTERS! Show everything except cancelled
      filters = undefined; // Get ALL reminders
    }

    console.log(`[FollowUps] Loading data for tab: ${activeTab}, filters:`, filters);

    const [remindersResult, statsResult] = await Promise.all([
      getFollowUpReminders(filters),
      getFollowUpStats()
    ]);

    console.log(`[FollowUps] Got ${remindersResult.data?.length || 0} reminders`);
    console.log(`[FollowUps] Got stats:`, statsResult);

    if (remindersResult.data) {
      // For "all" tab, filter out cancelled only
      let filteredReminders = remindersResult.data;
      if (activeTab === "all") {
        filteredReminders = remindersResult.data.filter(r => r.status !== 'cancelled');
      }
      setReminders(filteredReminders);
      console.log(`[FollowUps] Set ${filteredReminders.length} reminders in state`);
    } else if (remindersResult.error) {
      console.error(`[FollowUps] Error loading reminders:`, remindersResult.error);
      toast.error(`Failed to load reminders: ${remindersResult.error}`);
    }

    if (statsResult.data) {
      console.log(`[FollowUps] Setting stats:`, statsResult.data);
      setStats(statsResult.data);
    } else if (statsResult.error) {
      console.error(`[FollowUps] Error loading stats:`, statsResult.error);
    }

    setLoading(false);
  };

  const handleComplete = async (reminder_id: string, channel: string) => {
    const result = await completeFollowUpReminder({
      reminder_id,
      channel_used: channel as any,
      notes: "Completed from follow-ups page"
    });

    if (result.error) {
      toast.error("Failed to complete follow-up");
    } else {
      toast.success("Follow-up marked as complete!");
      loadData();
    }
  };

  const handleSnooze = async (reminder_id: string, days: number) => {
    const result = await snoozeFollowUpReminder({
      reminder_id,
      snooze_days: days
    });

    if (result.error) {
      toast.error("Failed to snooze reminder");
    } else {
      toast.success(`Snoozed for ${days} days`);
      loadData();
    }
  };

  const handleDismiss = async (reminder_id: string) => {
    const result = await dismissFollowUpReminder(reminder_id);

    if (result.error) {
      toast.error("Failed to dismiss reminder");
    } else {
      toast.success("Reminder dismissed");
      loadData();
    }
  };

  const handleViewTemplate = (reminder_id: string) => {
    const reminder = reminders.find(r => r.id === reminder_id);
    if (reminder) {
      setShowTemplate({ open: true, reminder });
    }
  };

  const handleSendMessage = async (channel: any, subject: string | undefined, body: string) => {
    if (!showTemplate.reminder) return;

    // Mark as complete
    await handleComplete(showTemplate.reminder.id, channel);
    
    toast.success("Message ready! Opening...");
    
    // TODO: Actually send/open the message
    // For now just show success
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Link href="/tools/tracker">
            <Button variant="ghost" size="sm" className="mb-1 -ml-2 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Tracker
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Follow-up Reminders</h1>
            <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
              Stay on top of your job applications with smart reminders
            </p>
          </div>
        </div>
        {stats && stats.overdue > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              {stats.overdue} overdue reminder{stats.overdue > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && !stats ? (
          // Loading skeleton
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-5 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-8 w-16 bg-muted rounded" />
                    <div className="h-3 w-20 bg-muted rounded" />
                  </div>
                  <div className="h-14 w-14 rounded-full bg-muted" />
                </div>
              </Card>
            ))}
          </>
        ) : stats ? (
          // Actual stats
          <>
          {/* Overdue Card */}
          <Card className="p-5 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border-red-200 dark:border-red-800 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Overdue
                </p>
                <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                  {stats.overdue}
                </p>
                {stats.overdue > 0 && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Needs attention!
                  </p>
                )}
              </div>
              <div className="h-14 w-14 rounded-full bg-red-200/50 dark:bg-red-800/50 flex items-center justify-center">
                <AlertCircle className="h-7 w-7 text-red-700 dark:text-red-300" />
              </div>
            </div>
          </Card>

          {/* Due This Week Card */}
          <Card className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  This Week
                </p>
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                  {stats.due_this_week}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {stats.due_today} due today
                </p>
              </div>
              <div className="h-14 w-14 rounded-full bg-amber-200/50 dark:bg-amber-800/50 flex items-center justify-center">
                <Bell className="h-7 w-7 text-amber-700 dark:text-amber-300" />
              </div>
            </div>
          </Card>

          {/* Completed Card */}
          <Card className="p-5 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Completed
                </p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {stats.completed_this_month}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  this month
                </p>
              </div>
              <div className="h-14 w-14 rounded-full bg-green-200/50 dark:bg-green-800/50 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-green-700 dark:text-green-300" />
              </div>
            </div>
          </Card>

          {/* Response Rate Card */}
          <Card className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Response Rate
                </p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                  {formatResponseRate(stats.response_rate)}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {stats.avg_response_time > 0 
                    ? `Avg: ${formatAvgResponseTime(stats.avg_response_time)}`
                    : 'No data yet'}
                </p>
              </div>
              <div className="h-14 w-14 rounded-full bg-purple-200/50 dark:bg-purple-800/50 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-purple-700 dark:text-purple-300" />
              </div>
            </div>
          </Card>
          </>
        ) : null}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex">
          <TabsTrigger value="due" className="gap-1.5 sm:gap-2 flex-1 sm:flex-initial">
            <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Due Now</span>
            <span className="sm:hidden">Due</span>
            {stats && stats.due_today > 0 && (
              <span className="ml-0.5 sm:ml-1 px-1.5 py-0.5 text-xs rounded-full bg-red-500 text-white font-semibold">
                {stats.due_today}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-1.5 sm:gap-2 flex-1 sm:flex-initial">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Upcoming</span>
            <span className="sm:hidden">Soon</span>
            {stats && stats.due_this_week > 0 && (
              <span className="ml-0.5 sm:ml-1 px-1.5 py-0.5 text-xs rounded-full bg-amber-500 text-white font-semibold">
                {stats.due_this_week}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-1.5 sm:gap-2 flex-1 sm:flex-initial">
            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Completed</span>
            <span className="sm:hidden">Done</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex-1 sm:flex-initial">
            All
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : reminders.length === 0 ? (
            <Card className="p-12 sm:p-16 border-dashed">
              <div className="text-center max-w-md mx-auto">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 mx-auto flex items-center justify-center mb-6">
                  {activeTab === "due" && <CheckCircle2 className="h-10 w-10 text-purple-600 dark:text-purple-400" />}
                  {activeTab === "upcoming" && <Calendar className="h-10 w-10 text-purple-600 dark:text-purple-400" />}
                  {activeTab === "completed" && <CheckCircle2 className="h-10 w-10 text-purple-600 dark:text-purple-400" />}
                  {activeTab === "all" && <Bell className="h-10 w-10 text-purple-600 dark:text-purple-400" />}
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {activeTab === "due" && "All Clear! 🎉"}
                  {activeTab === "upcoming" && "Nothing Scheduled"}
                  {activeTab === "completed" && "No Completions Yet"}
                  {activeTab === "all" && "No Reminders Yet"}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base mb-6">
                  {activeTab === "due" && "You're all caught up! No follow-ups due right now. Great job staying on top of your applications!"}
                  {activeTab === "upcoming" && "No upcoming reminders scheduled. When you add applications in the Tracker, reminders will automatically appear here."}
                  {activeTab === "completed" && "You haven't completed any follow-ups yet. Start following up on your applications to track your progress!"}
                  {activeTab === "all" && "Reminders automatically create when you add applications in the Tracker. Each application gets 3 follow-up reminders: Day 3, Day 7, and Day 14."}
                </p>
                {activeTab === "all" && (
                  <Link href="/tools/tracker">
                    <Button className="mt-2" size="lg">
                      <Calendar className="h-4 w-4 mr-2" />
                      Go to Tracker
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ) : (
            reminders.map((reminder) => (
              <FollowUpCard
                key={reminder.id}
                reminder={reminder}
                onComplete={handleComplete}
                onSnooze={handleSnooze}
                onDismiss={handleDismiss}
                onViewTemplate={handleViewTemplate}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Template Selector Modal */}
      {showTemplate.reminder && (
        <TemplateSelector
          open={showTemplate.open}
          onOpenChange={(open) => setShowTemplate({ open, reminder: showTemplate.reminder })}
          reminderType={showTemplate.reminder.reminder_type as any}
          variables={{
            company: showTemplate.reminder.application.company,
            position: showTemplate.reminder.application.position,
            applied_date: new Date(showTemplate.reminder.application.created_at).toLocaleDateString(),
            hrd_name: "Hiring Manager",
            your_name: "Your Name", // TODO: Get from user profile
            your_email: "your.email@example.com", // TODO: Get from user profile
            your_phone: "+62 xxx xxx xxx", // TODO: Get from user profile
          }}
          onSend={handleSendMessage}
        />
      )}
    </div>
  );
}
