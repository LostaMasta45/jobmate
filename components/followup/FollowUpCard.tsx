"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MessageCircle,
  MoreVertical,
  Phone,
  Timer,
  X,
  ExternalLink,
  Linkedin,
} from "lucide-react";
import Link from "next/link";
import { FollowUpReminderWithApplication } from "@/types/followup";
import {
  REMINDER_TYPE_CONFIG,
  CHANNEL_CONFIG,
  formatFollowUpDate,
  getRelativeTime,
  isOverdue,
  getStatusBadgeColor,
  getChannelBadgeColor,
} from "@/lib/followup-utils";
import { cn } from "@/lib/utils";

interface FollowUpCardProps {
  reminder: FollowUpReminderWithApplication;
  onComplete: (reminder_id: string, channel: string) => void;
  onSnooze: (reminder_id: string, days: number) => void;
  onDismiss: (reminder_id: string) => void;
  onViewTemplate: (reminder_id: string) => void;
  compact?: boolean;
}

export function FollowUpCard({
  reminder,
  onComplete,
  onSnooze,
  onDismiss,
  onViewTemplate,
  compact = false,
}: FollowUpCardProps) {
  const [loading, setLoading] = useState(false);
  const typeConfig = REMINDER_TYPE_CONFIG[reminder.reminder_type];
  const channelConfig = CHANNEL_CONFIG[reminder.preferred_channel];
  const overdue = isOverdue(reminder.scheduled_date);

  const handleComplete = async (channel: string) => {
    setLoading(true);
    await onComplete(reminder.id, channel);
    setLoading(false);
  };

  const ChannelIcon = {
    email: Mail,
    whatsapp: MessageCircle,
    linkedin: Linkedin,
    phone: Phone,
  }[reminder.preferred_channel];

  if (compact) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg border hover:border-primary/50 hover:bg-accent/50 transition-all">
        <div className="flex items-center gap-3 flex-1 min-w-0 w-full sm:w-auto">
          <div className="flex-shrink-0">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              overdue ? "bg-red-100 dark:bg-red-900" : "bg-primary/10"
            )}>
              <span className="text-lg">{typeConfig.icon}</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">
              {reminder.application.company}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {reminder.application.position}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-auto">
                {typeConfig.label}
              </Badge>
              <span className={cn(
                "text-[10px] font-medium",
                overdue && "text-red-600 dark:text-red-400"
              )}>
                {getRelativeTime(reminder.scheduled_date)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            size="sm"
            variant="default"
            onClick={() => onViewTemplate(reminder.id)}
            disabled={loading}
            className="h-8 flex-1 sm:flex-none"
          >
            <ChannelIcon className="h-3.5 w-3.5 sm:mr-1" />
            <span className="hidden sm:inline">Follow-up</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onSnooze(reminder.id, 2)}>
                <Timer className="h-4 w-4 mr-2" />
                Snooze 2 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSnooze(reminder.id, 7)}>
                <Timer className="h-4 w-4 mr-2" />
                Snooze 1 week
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDismiss(reminder.id)}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4 mr-2" />
                Dismiss
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn(
      "hover:shadow-md transition-all",
      overdue && "border-red-300 dark:border-red-800"
    )}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-3">
          <div className="flex items-start gap-3 flex-1 w-full">
            <div className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0",
              overdue 
                ? "bg-red-100 dark:bg-red-900" 
                : "bg-gradient-to-br from-primary/10 to-primary/5"
            )}>
              <span className="text-2xl">{typeConfig.icon}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-semibold text-base">
                  {reminder.application.company}
                </h3>
                {overdue && (
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {reminder.application.position}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {typeConfig.label}
                </Badge>
                <Badge className={getChannelBadgeColor(reminder.preferred_channel)}>
                  <ChannelIcon className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">{channelConfig.label}</span>
                  <span className="sm:hidden">{reminder.preferred_channel}</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Date & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className={cn(
              "font-medium",
              overdue && "text-red-600 dark:text-red-400"
            )}>
              {formatFollowUpDate(reminder.scheduled_date)}
            </span>
          </div>
          <span className="text-muted-foreground text-xs sm:text-sm">
            {getRelativeTime(reminder.scheduled_date)}
          </span>
          {reminder.application.created_at && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs">
                Applied {Math.floor((Date.now() - new Date(reminder.application.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago
              </span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          <Button
            onClick={() => onViewTemplate(reminder.id)}
            disabled={loading}
            size="default"
            className="w-full sm:w-auto sm:flex-1 gap-2 font-semibold"
          >
            <ChannelIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            Follow-up Now
          </Button>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => handleComplete(reminder.preferred_channel)}
              disabled={loading}
              className="flex-1 sm:flex-none gap-2"
              size="default"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline">Mark Done</span>
              <span className="sm:hidden">Done</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1 sm:flex-none" size="default">
                  <Timer className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Snooze</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSnooze(reminder.id, 2)}>
                  2 days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSnooze(reminder.id, 3)}>
                  3 days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSnooze(reminder.id, 7)}>
                  1 week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSnooze(reminder.id, 14)}>
                  2 weeks
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              onClick={() => onDismiss(reminder.id)}
              disabled={loading}
              size="default"
              className="w-auto px-3"
            >
              <X className="h-4 w-4" />
            </Button>

            <Link href={`/tools/tracker#${reminder.application_id}`}>
              <Button variant="ghost" size="default" className="w-auto px-3">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Notes */}
        {reminder.notes && (
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
            <p className="line-clamp-2">{reminder.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
