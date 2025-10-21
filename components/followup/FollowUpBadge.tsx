"use client";

import { Bell, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatFollowUpDate, isOverdue, isDueToday } from "@/lib/followup-utils";

interface FollowUpBadgeProps {
  count: number;
  nextDueDate?: string;
  className?: string;
  showDate?: boolean;
}

export function FollowUpBadge({ 
  count, 
  nextDueDate, 
  className,
  showDate = false 
}: FollowUpBadgeProps) {
  if (count === 0) return null;

  const overdue = nextDueDate && isOverdue(nextDueDate);
  const dueToday = nextDueDate && isDueToday(nextDueDate);

  return (
    <Badge
      variant={overdue ? "destructive" : dueToday ? "default" : "secondary"}
      className={cn(
        "gap-1 animate-in fade-in-50",
        overdue && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100",
        dueToday && "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100",
        className
      )}
    >
      {overdue ? (
        <AlertCircle className="h-3 w-3" />
      ) : (
        <Bell className="h-3 w-3" />
      )}
      <span className="text-xs font-medium">
        {count} Follow-up{count > 1 ? 's' : ''}
      </span>
      {showDate && nextDueDate && (
        <span className="text-xs opacity-80">
          • {formatFollowUpDate(nextDueDate)}
        </span>
      )}
    </Badge>
  );
}

// Compact version for small spaces
export function FollowUpBadgeCompact({ count, nextDueDate }: { count: number; nextDueDate?: string }) {
  if (count === 0) return null;

  const overdue = nextDueDate && isOverdue(nextDueDate);
  const dueToday = nextDueDate && isDueToday(nextDueDate);

  return (
    <div
      className={cn(
        "flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold",
        overdue && "bg-red-500 text-white",
        dueToday && "bg-amber-500 text-white",
        !overdue && !dueToday && "bg-primary text-primary-foreground"
      )}
      title={`${count} follow-up${count > 1 ? 's' : ''} ${nextDueDate ? `- ${formatFollowUpDate(nextDueDate)}` : ''}`}
    >
      {count}
    </div>
  );
}
