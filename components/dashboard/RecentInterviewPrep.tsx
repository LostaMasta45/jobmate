"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, ArrowRight, Loader2, Building2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface InterviewPrepSession {
  id: string;
  company_name: string;
  position: string;
  match_score: number;
  status: string;
  question_stats?: {
    opening?: number;
    technical?: number;
    behavioral?: number;
    situational?: number;
    tricky?: number;
    closing?: number;
    high_priority?: number;
  };
  created_at: string;
}

export function RecentInterviewPrep() {
  const [sessions, setSessions] = useState<InterviewPrepSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentSessions();
  }, []);

  async function fetchRecentSessions() {
    try {
      const { getInterviewPrepSessions } = await import("@/actions/interview-prep");
      const result = await getInterviewPrepSessions();
      setSessions((result || []).slice(0, 3));
    } catch (error) {
      console.error("Error fetching interview prep sessions:", error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 70) return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100";
    if (score >= 50) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100";
    return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100";
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border animate-pulse">
            <div className="h-10 w-10 bg-muted rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-2">
        <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
          <Target className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
          Belum ada sesi interview prep
        </p>
        <Link href="/tools/interview-prep">
          <Button size="sm" className="gap-1.5 text-xs h-8 px-3 bg-blue-600 hover:bg-blue-700">
            <Target className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mulai Prep</span>
            <span className="sm:hidden">Mulai</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2.5">
        {sessions.map((session) => (
          <Link 
            key={session.id} 
            href={`/tools/interview-prep/session/${session.id}`}
            className="block group"
          >
            <div className="p-2.5 rounded-lg border hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all">
              <div className="flex items-start gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs sm:text-sm leading-tight mb-0.5 sm:mb-1 truncate">
                    {session.company_name || "Unknown Company"}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {session.position || "Position"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <Badge className={`text-[9px] sm:text-[10px] py-0 px-1 sm:px-1.5 h-4 sm:h-5 flex-shrink-0 ${getMatchScoreColor(session.match_score)}`}>
                  Match {session.match_score}%
                </Badge>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate">
                  {formatDistanceToNow(new Date(session.created_at), {
                    addSuffix: true,
                    locale: id,
                  })}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {sessions.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <Link href="/tools/interview-prep/history">
            <Button variant="ghost" size="sm" className="w-full gap-1.5 sm:gap-2 text-[10px] sm:text-xs hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950">
              <span className="hidden sm:inline">Lihat Semua</span>
              <span className="sm:hidden">Lihat</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
