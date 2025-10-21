"use client";

import { useEffect, useState } from "react";
import { getApplicationFollowUps } from "@/actions/followup/list";
import { FollowUpReminderWithApplication } from "@/types/followup";

export function useFollowUpReminders(application_id: string) {
  const [reminders, setReminders] = useState<FollowUpReminderWithApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [nextDueDate, setNextDueDate] = useState<string | undefined>();

  useEffect(() => {
    loadReminders();
  }, [application_id]);

  const loadReminders = async () => {
    setLoading(true);
    const result = await getApplicationFollowUps(application_id);
    if (result.data) {
      setReminders(result.data);
      
      // Count pending/due reminders
      const pending = result.data.filter(r => r.status === 'pending' || r.status === 'due');
      setCount(pending.length);
      
      // Get next due date
      if (pending.length > 0) {
        const sorted = [...pending].sort((a, b) => 
          new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
        );
        setNextDueDate(sorted[0].scheduled_date);
      }
    }
    setLoading(false);
  };

  return { reminders, loading, count, nextDueDate, refresh: loadReminders };
}

// Optimized version for multiple applications
export function useFollowUpRemindersMap(application_ids: string[]) {
  const [remindersMap, setRemindersMap] = useState<Record<string, {
    count: number;
    nextDueDate?: string;
  }>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (application_ids.length > 0) {
      loadAllReminders();
    }
  }, [application_ids.join(',')]);

  const loadAllReminders = async () => {
    setLoading(true);
    
    // Load reminders for all applications in parallel
    const results = await Promise.all(
      application_ids.map(id => getApplicationFollowUps(id))
    );

    const map: Record<string, { count: number; nextDueDate?: string }> = {};
    
    results.forEach((result, index) => {
      const app_id = application_ids[index];
      if (result.data) {
        const pending = result.data.filter(r => r.status === 'pending' || r.status === 'due');
        const sorted = [...pending].sort((a, b) => 
          new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
        );
        
        map[app_id] = {
          count: pending.length,
          nextDueDate: sorted[0]?.scheduled_date
        };
      } else {
        map[app_id] = { count: 0 };
      }
    });

    setRemindersMap(map);
    setLoading(false);
  };

  return { remindersMap, loading, refresh: loadAllReminders };
}
