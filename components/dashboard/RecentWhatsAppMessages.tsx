"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  ArrowRight,
  Building2,
  Send,
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
  status: string;
  created_at: string;
}

const MESSAGE_TYPE_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  application: { label: "Application", icon: "📝", color: "text-blue-600" },
  follow_up: { label: "Follow-Up", icon: "🔄", color: "text-amber-600" },
  interview_confirmation: { label: "Interview", icon: "✅", color: "text-green-600" },
  thank_you: { label: "Thank You", icon: "🙏", color: "text-purple-600" },
  status_inquiry: { label: "Status", icon: "❓", color: "text-teal-600" },
  re_application: { label: "Re-Apply", icon: "🔁", color: "text-red-600" },
  referral: { label: "Referral", icon: "👥", color: "text-indigo-600" },
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

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-2">
        <div className="rounded-full bg-primary/10 p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
          <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
          Belum ada pesan WhatsApp
        </p>
        <Link href="/tools/wa-generator">
          <Button size="sm" className="gap-1.5 text-xs h-8 px-3">
            <MessageCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Generate</span>
            <span className="sm:hidden">Buat</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2.5">
        {messages.map((msg) => {
          const config = MESSAGE_TYPE_CONFIG[msg.message_type] || MESSAGE_TYPE_CONFIG.application;
          
          return (
            <Link 
              key={msg.id} 
              href="/tools/wa-generator"
              className="block group"
            >
              <div className="p-2.5 rounded-lg border hover:border-teal-300 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-all">
                <div className="flex items-start gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <MessageCircle className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 ${config.color}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs sm:text-sm leading-tight mb-0.5 sm:mb-1 truncate">
                      {msg.company_name}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                      {msg.position}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Badge className={`text-[9px] sm:text-[10px] py-0 px-1 sm:px-1.5 h-4 sm:h-5 flex-shrink-0 bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-100`}>
                    {config.icon} {config.label}
                  </Badge>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate">
                    {formatDistanceToNow(new Date(msg.created_at), {
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

      {messages.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <Link href="/tools/wa-generator/history">
            <Button variant="ghost" size="sm" className="w-full gap-1.5 sm:gap-2 text-[10px] sm:text-xs hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950">
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
