"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CVATSClient } from "@/components/cv-ats/CVATSClient";
import { getAllResumes } from "@/actions/cv-ats";
import { Loader2 } from "lucide-react";

export default function CVATSPage() {
  const [resumes, setResumes] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Data fetching logic
  const loadResumes = React.useCallback(async () => {
    // Silent update if already has data? Or loader?
    // User expects interaction immediately, so maybe keep loader on full refresh
    // but on subsequent refreshes (from interactions) we might want a different strategy.
    // For now simple reload is fine.
    try {
      const data = await getAllResumes();
      setResumes(data);
    } catch (error) {
      console.error("Failed to load resumes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  if (loading) {
    // Simple loader while initial data fetch
    return (
      <AppShell isFullScreen>
        <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-[#050505]">
          <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell isFullScreen>
      <CVATSClient
        initialResumes={resumes}
        onRefresh={loadResumes}
      />
    </AppShell>
  );
}

