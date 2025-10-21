"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  FileText,
  Building2,
  Briefcase,
  Send,
  Copy,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface WAMessage {
  id: string;
  message_type: string;
  company_name: string;
  position: string;
  content: string;
  status: string;
  word_count: number;
  char_count: number;
  times_copied: number;
  sent_at: string | null;
  created_at: string;
}

const MESSAGE_TYPE_CONFIG: Record<string, { label: string; icon: string; color: string; gradient: string }> = {
  application: { 
    label: "Application", 
    icon: "📝", 
    color: "text-blue-600", 
    gradient: "from-blue-50 to-blue-100" 
  },
  follow_up: { 
    label: "Follow-Up", 
    icon: "🔄", 
    color: "text-amber-600", 
    gradient: "from-amber-50 to-amber-100" 
  },
  interview_confirmation: { 
    label: "Interview", 
    icon: "✅", 
    color: "text-green-600", 
    gradient: "from-green-50 to-green-100" 
  },
  thank_you: { 
    label: "Thank You", 
    icon: "🙏", 
    color: "text-purple-600", 
    gradient: "from-purple-50 to-purple-100" 
  },
  status_inquiry: { 
    label: "Status", 
    icon: "❓", 
    color: "text-indigo-600", 
    gradient: "from-indigo-50 to-indigo-100" 
  },
  re_application: { 
    label: "Re-Apply", 
    icon: "🔁", 
    color: "text-rose-600", 
    gradient: "from-rose-50 to-rose-100" 
  },
  referral: { 
    label: "Referral", 
    icon: "👥", 
    color: "text-cyan-600", 
    gradient: "from-cyan-50 to-cyan-100" 
  },
};

export function RecentWhatsAppMessages() {
  const [messages, setMessages] = useState<WAMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentMessages();
  }, []);

  async function fetchRecentMessages() {
    try {
      const { getWAMessages } = await import("@/actions/whatsapp/list");
      const result = await getWAMessages({ limit: 3 });

      if (result.error) {
        console.error("Error fetching WA messages:", result.error);
        setMessages([]);
      } else {
        setMessages(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching WA messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-lg border animate-pulse"
          >
            <div className="h-10 w-10 bg-muted rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="rounded-full bg-green-500/10 p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
          <MessageCircle className="h-8 w-8 text-green-600" />
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Belum ada pesan WhatsApp
        </p>
        <Link href="/tools/wa-generator">
          <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
            <Sparkles className="h-4 w-4" />
            Generate Pesan
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2.5">
        {messages.map((message) => {
          const typeConfig = MESSAGE_TYPE_CONFIG[message.message_type] || MESSAGE_TYPE_CONFIG.application;

          return (
            <Link
              key={message.id}
              href="/tools/wa-generator/history"
              className="block group"
            >
              <div className="p-2.5 rounded-lg border hover:border-teal-300 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-all">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <span className="text-lg flex-shrink-0">{typeConfig.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm leading-tight mb-1">
                        {message.company_name}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {message.position}
                      </p>
                    </div>
                  </div>
                  {message.status === "sent" && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                  )}
                </div>

                {/* Badge */}
                <div className="mb-2">
                  <Badge 
                    variant={message.status === "sent" ? "default" : "outline"} 
                    className="text-[10px] py-0 px-1.5 h-5 bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-100"
                  >
                    {typeConfig.label}
                  </Badge>
                </div>

                {/* Meta Info */}
                <div className="text-[10px] text-muted-foreground">
                  {message.word_count} kata • {formatDistanceToNow(new Date(message.created_at), {
                    addSuffix: true,
                    locale: id,
                  })}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* View All Link */}
      {messages.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <Link href="/tools/wa-generator/history">
            <Button variant="ghost" size="sm" className="w-full gap-2 text-xs hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950">
              Lihat Semua
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
