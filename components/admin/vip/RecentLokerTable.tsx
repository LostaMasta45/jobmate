"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExternalLink, Clock, Building } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface RecentLokerTableProps {
  loker: Array<{
    id: string;
    title: string;
    status: string;
    created_at: string;
    perusahaan: { name: string } | null;
  }>;
}

export function RecentLokerTable({ loker }: RecentLokerTableProps) {
  if (loker.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
          <Clock className="h-6 w-6 opacity-50" />
        </div>
        <p className="text-sm font-medium">No new jobs today</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50">
      {loker.map((item) => (
        <Link
          key={item.id}
          href={`/admin/vip-loker/${item.id}/edit`}
          className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-all group duration-200"
        >
          <Avatar className="h-10 w-10 rounded-lg border bg-background">
            <AvatarFallback className="rounded-lg font-bold text-primary/70" style={{ color: '#8e68fd' }}>
              {item.perusahaan?.name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm truncate group-hover:text-[#8e68fd] transition-colors">
                {item.title}
              </h4>
              <Badge 
                variant="secondary"
                className={
                  item.status === "published"
                    ? "bg-[#00d1dc]/10 text-[#00acc7] hover:bg-[#00d1dc]/20 text-[10px] px-2 py-0 h-5"
                    : "bg-gray-500/10 text-gray-600 dark:text-gray-400 hover:bg-gray-500/20 text-[10px] px-2 py-0 h-5"
                }
              >
                {item.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                <span className="truncate max-w-[120px]">{item.perusahaan?.name || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                    day: 'numeric', month: 'short'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-200">
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </div>
        </Link>
      ))}
    </div>
  );
}
