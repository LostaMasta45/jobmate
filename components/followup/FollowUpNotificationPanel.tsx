"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { FollowUpReminderWithApplication } from "@/types/followup";
import { getFollowUpsDueToday } from "@/actions/followup/list";
import { FollowUpCard } from "./FollowUpCard";
import { completeFollowUpReminder, snoozeFollowUpReminder, dismissFollowUpReminder } from "@/actions/followup/manage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FollowUpNotificationPanelProps {
  initialCount?: number;
}

export function FollowUpNotificationPanel({ initialCount = 0 }: FollowUpNotificationPanelProps) {
  const [reminders, setReminders] = useState<FollowUpReminderWithApplication[]>([]);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showTemplate, setShowTemplate] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadReminders();
    }
  }, [open]);

  const loadReminders = async () => {
    setLoading(true);
    const result = await getFollowUpsDueToday();
    if (result.data) {
      setReminders(result.data);
      setCount(result.data.length);
    }
    setLoading(false);
  };

  const handleComplete = async (reminder_id: string, channel: string) => {
    const result = await completeFollowUpReminder({
      reminder_id,
      channel_used: channel as any,
      notes: "Completed from notification panel"
    });

    if (result.error) {
      toast.error("Failed to complete follow-up");
    } else {
      toast.success("Follow-up marked as complete!");
      loadReminders(); // Refresh list
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
      loadReminders();
    }
  };

  const handleDismiss = async (reminder_id: string) => {
    const result = await dismissFollowUpReminder(reminder_id);

    if (result.error) {
      toast.error("Failed to dismiss reminder");
    } else {
      toast.success("Reminder dismissed");
      loadReminders();
    }
  };

  const handleViewTemplate = (reminder_id: string) => {
    setShowTemplate(reminder_id);
    // TODO: Open template modal
    toast.info("Template feature coming soon!");
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-[400px] p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="font-semibold text-base">Follow-up Reminders</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {count === 0 ? "No reminders due" : `${count} reminder${count > 1 ? 's' : ''} due`}
              </p>
            </div>
            {count > 0 && (
              <Link href="/tools/tracker/followups">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            )}
          </div>

          {/* Content */}
          <ScrollArea className="h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : reminders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold mb-1">All caught up!</h4>
                <p className="text-sm text-muted-foreground">
                  No follow-ups due today
                </p>
              </div>
            ) : (
              <div className="p-3 space-y-3">
                {reminders.map((reminder) => (
                  <FollowUpCard
                    key={reminder.id}
                    reminder={reminder}
                    onComplete={handleComplete}
                    onSnooze={handleSnooze}
                    onDismiss={handleDismiss}
                    onViewTemplate={handleViewTemplate}
                    compact
                  />
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {count > 0 && (
            <div className="p-3 border-t bg-accent/50">
              <Link href="/tools/tracker/followups" className="block">
                <Button variant="outline" className="w-full" size="sm">
                  Manage All Follow-ups
                </Button>
              </Link>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
