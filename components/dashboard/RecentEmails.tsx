"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Edit, ArrowRight, Building2, Calendar, Send, FileText } from "lucide-react";
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
        // Get only the 3 most recent emails
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

  const getEmailTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      application: "Lamaran",
      follow_up: "Follow-up",
      thank_you: "Terima Kasih",
      inquiry: "Inquiry",
    };
    return labels[type] || type;
  };

  const getEmailTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      application: "bg-blue-100 text-blue-700",
      follow_up: "bg-amber-100 text-amber-700",
      thank_you: "bg-green-100 text-green-700",
      inquiry: "bg-purple-100 text-purple-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const getToneIcon = (tone: string) => {
    const gradients: Record<string, string> = {
      formal: "from-blue-50 to-blue-100",
      "semi-formal": "from-indigo-50 to-indigo-100",
      casual: "from-cyan-50 to-cyan-100",
      creative: "from-purple-50 to-purple-100",
    };
    return gradients[tone] || "from-gray-50 to-gray-100";
  };

  const getToneIconColor = (tone: string) => {
    const colors: Record<string, string> = {
      formal: "text-blue-600",
      "semi-formal": "text-indigo-600",
      casual: "text-cyan-600",
      creative: "text-purple-600",
    };
    return colors[tone] || "text-gray-600";
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

  if (emails.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="rounded-full bg-primary/10 p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Belum ada email lamaran dibuat
        </p>
        <Link href="/tools/email-generator">
          <Button size="sm" className="gap-2">
            <Mail className="h-4 w-4" />
            Buat Email Pertama
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Aktivitas Terbaru</h3>
        <Link href="/tools/email-generator/history">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            Lihat Semua
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {emails.map((email) => (
          <Link 
            key={email.id} 
            href={`/tools/email-generator?edit=${email.id}`}
            className="block group"
          >
            <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/50 hover:bg-accent/50 transition-all">
              {/* Icon */}
              <div className={`rounded-lg p-2.5 shadow-sm group-hover:scale-110 transition-transform bg-gradient-to-br ${getToneIcon(email.tone_style)}`}>
                <Mail className={`h-5 w-5 ${getToneIconColor(email.tone_style)}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {email.company_name}
                  </h4>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${getEmailTypeColor(email.email_type)}`}>
                    {getEmailTypeLabel(email.email_type)}
                  </span>
                </div>
                
                <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3 w-3 flex-shrink-0" />
                    <span className="line-clamp-1">{email.position}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <span>
                      {formatDistanceToNow(new Date(email.created_at), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Hint */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
