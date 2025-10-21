"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, ArrowRight, Building2, Send, FileText } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface EmailDraft {
  id: string;
  email_type: string;
  company_name: string;
  position: string;
  subject_line: string;
  tone_style: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const EMAIL_TYPE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  application: { label: "Application", color: "text-blue-600", icon: "📧" },
  follow_up: { label: "Follow-Up", color: "text-amber-600", icon: "🔄" },
  thank_you: { label: "Thank You", color: "text-green-600", icon: "🙏" },
  interview: { label: "Interview", color: "text-purple-600", icon: "💼" },
};

export function RecentEmails() {
  const [emails, setEmails] = useState<EmailDraft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentEmails();
  }, []);

  async function fetchRecentEmails() {
    try {
      const { listEmailDrafts } = await import("@/actions/email/list");
      const result = await listEmailDrafts();
      
      if (result.error) {
        console.error("Error fetching email drafts:", result.error);
        setEmails([]);
      } else {
        const recent = (result.data || []).slice(0, 3);
        setEmails(recent);
      }
    } catch (error) {
      console.error("Error fetching email drafts:", error);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-2.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border animate-pulse">
            <div className="h-10 w-10 bg-muted rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="h-3 bg-muted rounded w-2/3" />
              <div className="h-2.5 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-2">
        <div className="rounded-full bg-primary/10 p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
          <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
          Belum ada email dibuat
        </p>
        <Link href="/tools/email-generator">
          <Button size="sm" className="gap-1.5 text-xs h-8 px-3">
            <Mail className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Buat Email</span>
            <span className="sm:hidden">Buat</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2.5">
        {emails.map((email) => {
          const config = EMAIL_TYPE_CONFIG[email.email_type] || EMAIL_TYPE_CONFIG.application;
          return (
            <Link 
              key={email.id} 
              href={`/tools/email-generator`}
              className="block group"
            >
              <div className="p-2.5 rounded-lg border hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all">
                <div className="flex items-start gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <Mail className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 ${config.color}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs sm:text-sm leading-tight mb-0.5 sm:mb-1 truncate">
                      {email.company_name}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                      {email.position}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Badge className={`text-[9px] sm:text-[10px] py-0 px-1 sm:px-1.5 h-4 sm:h-5 flex-shrink-0 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100`}>
                    {config.label}
                  </Badge>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate">
                    {formatDistanceToNow(new Date(email.created_at), {
                      addSuffix: true,
                      locale: id,
                    })}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {emails.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <Link href="/tools/email-generator/history">
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
