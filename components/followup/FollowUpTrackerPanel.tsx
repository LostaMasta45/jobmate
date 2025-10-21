"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Timer,
  Mail,
  MessageCircle,
  Linkedin,
  X
} from "lucide-react";
import Link from "next/link";
import { FollowUpReminderWithApplication } from "@/types/followup";
import { getFollowUpReminders } from "@/actions/followup/list";
import { 
  completeFollowUpReminder, 
  snoozeFollowUpReminder, 
  dismissFollowUpReminder 
} from "@/actions/followup/manage";
import { 
  REMINDER_TYPE_CONFIG,
  CHANNEL_CONFIG,
  formatFollowUpDate,
  isOverdue,
  isDueToday
} from "@/lib/followup-utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FollowUpTrackerPanelProps {
  onFilterChange?: (showOnlyWithFollowUps: boolean) => void;
}

export function FollowUpTrackerPanel({ onFilterChange }: FollowUpTrackerPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [reminders, setReminders] = useState<FollowUpReminderWithApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterActive, setFilterActive] = useState(false);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    setLoading(true);
    // Fetch ALL active reminders (pending, due) - will be grouped by urgency in UI
    const result = await getFollowUpReminders({
      status: ['pending', 'due']
    });
    if (result.data) {
      // Sort by: overdue first, then due today, then upcoming
      const sorted = result.data.sort((a, b) => {
        const aOverdue = isOverdue(a.scheduled_date);
        const bOverdue = isOverdue(b.scheduled_date);
        const aDueToday = isDueToday(a.scheduled_date);
        const bDueToday = isDueToday(b.scheduled_date);

        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
        if (aDueToday && !bDueToday) return -1;
        if (!aDueToday && bDueToday) return 1;

        return new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime();
      });
      setReminders(sorted);
    }
    setLoading(false);
  };

  const handleComplete = async (reminder_id: string, channel: string) => {
    const result = await completeFollowUpReminder({
      reminder_id,
      channel_used: channel as any,
      notes: "Completed from tracker panel"
    });

    if (result.error) {
      toast.error("Failed to complete follow-up");
    } else {
      toast.success("Follow-up completed!");
      loadReminders();
    }
  };

  const handleSnooze = async (reminder_id: string, days: number) => {
    const result = await snoozeFollowUpReminder({
      reminder_id,
      snooze_days: days
    });

    if (result.error) {
      toast.error("Failed to snooze");
    } else {
      toast.success(`Snoozed for ${days} days`);
      loadReminders();
    }
  };

  const handleDismiss = async (reminder_id: string) => {
    const result = await dismissFollowUpReminder(reminder_id);

    if (result.error) {
      toast.error("Failed to dismiss");
    } else {
      toast.success("Reminder dismissed");
      loadReminders();
    }
  };

  const toggleFilter = () => {
    const newState = !filterActive;
    setFilterActive(newState);
    onFilterChange?.(newState);
  };

  // Group reminders
  const overdue = reminders.filter(r => isOverdue(r.scheduled_date));
  const dueToday = reminders.filter(r => isDueToday(r.scheduled_date));
  const upcoming = reminders.filter(r => 
    !isOverdue(r.scheduled_date) && !isDueToday(r.scheduled_date)
  );

  const totalCount = reminders.length;
  const overdueCount = overdue.length;
  const dueTodayCount = dueToday.length;
  const upcomingCount = upcoming.length;

  // Don't auto-hide panel - always show it even if empty
  // This prevents flash of content when loading

  return (
    <Card className="mb-6 border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CollapsibleTrigger className="p-1 hover:bg-purple-100 dark:hover:bg-purple-800 rounded transition-colors cursor-pointer">
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                )}
              </CollapsibleTrigger>

              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <CardTitle className="text-base font-semibold">
                  Follow-up Reminders
                </CardTitle>
              </div>

              {/* Count badges */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {overdueCount > 0 && (
                  <Badge variant="destructive" className="animate-pulse text-[10px] sm:text-xs py-0 sm:py-1">
                    {overdueCount} <span className="hidden sm:inline">Overdue</span>
                  </Badge>
                )}
                {dueTodayCount > 0 && (
                  <Badge className="bg-amber-500 text-white text-[10px] sm:text-xs py-0 sm:py-1">
                    {dueTodayCount} <span className="hidden sm:inline">Today</span>
                  </Badge>
                )}
                <Badge variant="secondary" className="text-[10px] sm:text-xs py-0 sm:py-1">
                  {totalCount} <span className="hidden sm:inline">Total</span>
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              {/* Filter toggle */}
              <Button
                variant={filterActive ? "default" : "outline"}
                size="sm"
                onClick={toggleFilter}
                className="gap-1 sm:gap-2 h-8 px-2 sm:px-3"
              >
                <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{filterActive ? "Show All" : "Filter"}</span>
              </Button>

              {/* View all link */}
              <Link href="/tools/tracker/followups">
                <Button size="sm" className="gap-1 sm:gap-2 font-semibold bg-purple-600 hover:bg-purple-700 h-8 px-2 sm:px-3 text-xs">
                  <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">All Follow-ups</span>
                  <span className="sm:hidden">All</span>
                </Button>
              </Link>

              <CollapsibleTrigger className="inline-flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-2 sm:px-3 cursor-pointer">
                {isOpen ? "Hide" : "Show"}
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Overdue Section */}
                {overdue.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <h4 className="text-sm font-semibold text-red-600 dark:text-red-400">
                        Overdue ({overdue.length})
                      </h4>
                    </div>
                    <div className="grid gap-2">
                      {overdue.map(reminder => (
                        <ReminderCompactCard
                          key={reminder.id}
                          reminder={reminder}
                          onComplete={handleComplete}
                          onSnooze={handleSnooze}
                          onDismiss={handleDismiss}
                          variant="overdue"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Due Today Section */}
                {dueToday.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-amber-600" />
                      <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                        Due Today ({dueToday.length})
                      </h4>
                    </div>
                    <div className="grid gap-2">
                      {dueToday.map(reminder => (
                        <ReminderCompactCard
                          key={reminder.id}
                          reminder={reminder}
                          onComplete={handleComplete}
                          onSnooze={handleSnooze}
                          onDismiss={handleDismiss}
                          variant="today"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming Section */}
                {upcoming.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <h4 className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                        Upcoming ({upcoming.length})
                      </h4>
                    </div>
                    <div className="grid gap-2">
                      {upcoming.slice(0, 3).map(reminder => (
                        <ReminderCompactCard
                          key={reminder.id}
                          reminder={reminder}
                          onComplete={handleComplete}
                          onSnooze={handleSnooze}
                          onDismiss={handleDismiss}
                          variant="upcoming"
                        />
                      ))}
                      {upcoming.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          +{upcoming.length - 3} more upcoming reminders
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {totalCount === 0 && (
                  <div className="text-center py-8 px-4">
                    <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900 mx-auto flex items-center justify-center mb-4">
                      <CheckCircle2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="text-sm font-semibold mb-2">All Caught Up!</h4>
                    <p className="text-xs text-muted-foreground mb-4">
                      No follow-ups needed right now. Reminders will auto-create when you add applications.
                    </p>
                    <Link href="/tools/tracker/followups">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Bell className="h-4 w-4" />
                        View All Follow-ups
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Bottom CTA */}
                {totalCount > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Link href="/tools/tracker/followups" className="block">
                      <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700 font-semibold" size="lg">
                        <Bell className="h-5 w-5" />
                        View All Follow-ups ({totalCount})
                      </Button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Click any reminder above for quick actions or view all for complete details
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

// Compact reminder card for tracker panel
function ReminderCompactCard({
  reminder,
  onComplete,
  onSnooze,
  onDismiss,
  variant
}: {
  reminder: FollowUpReminderWithApplication;
  onComplete: (id: string, channel: string) => void;
  onSnooze: (id: string, days: number) => void;
  onDismiss: (id: string) => void;
  variant: 'overdue' | 'today' | 'upcoming';
}) {
  const typeConfig = REMINDER_TYPE_CONFIG[reminder.reminder_type];
  const channelConfig = CHANNEL_CONFIG[reminder.preferred_channel];
  const ChannelIcon = {
    email: Mail,
    whatsapp: MessageCircle,
    linkedin: Linkedin,
    phone: Timer
  }[reminder.preferred_channel];

  const variantStyles = {
    overdue: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950",
    today: "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950",
    upcoming: "border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950"
  };

  return (
    <div className={cn(
      "p-2 sm:p-3 rounded-lg border-2 transition-all hover:shadow-md",
      variantStyles[variant]
    )}>
      {/* Mobile Layout: Stack */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div className="flex-shrink-0 text-lg sm:text-xl">
            {typeConfig.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Link 
                href={`/tools/tracker#${reminder.application_id}`}
                className="font-semibold text-sm hover:underline truncate max-w-[200px] sm:max-w-none"
              >
                {reminder.application.company}
              </Link>
              {variant === 'overdue' && (
                <AlertCircle className="h-3 w-3 text-red-600 flex-shrink-0" />
              )}
            </div>
            
            <p className="text-xs text-muted-foreground mb-2 truncate">
              {reminder.application.position}
            </p>

            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-auto">
                {typeConfig.label}
              </Badge>
              <Badge className={cn(
                "text-[10px] py-0 px-1.5 h-auto",
                variant === 'overdue' && "bg-red-600",
                variant === 'today' && "bg-amber-600"
              )}>
                {formatFollowUpDate(reminder.scheduled_date)}
              </Badge>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <ChannelIcon className="h-3 w-3" />
                <span className="hidden sm:inline">{channelConfig.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions - Row on mobile, compact buttons */}
        <div className="flex items-center gap-1 justify-end sm:justify-start flex-shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onComplete(reminder.id, reminder.preferred_channel)}
            title="Mark as done"
            className="h-7 w-7 p-0"
          >
            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSnooze(reminder.id, 3)}
            title="Snooze 3 days"
            className="h-7 w-7 p-0"
          >
            <Timer className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDismiss(reminder.id)}
            title="Dismiss"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>

          <Link href="/tools/tracker/followups">
            <Button
              size="sm"
              className="h-7 px-2 sm:px-3 text-[10px] sm:text-xs font-semibold bg-purple-600 hover:bg-purple-700 whitespace-nowrap"
            >
              Follow-up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
