"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          🆕 Loker Terbaru Hari Ini
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loker.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {loker.map((item) => (
              <Link
                key={item.id}
                href={`/admin/vip-loker/${item.id}/edit`}
                className="block p-2 sm:p-3 rounded-lg border hover:bg-accent transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold group-hover:text-primary transition-colors text-sm sm:text-base truncate">
                        {item.title}
                      </h4>
                      <Badge 
                        variant="outline"
                        className={
                          item.status === "published"
                            ? "bg-green-50 text-green-700 border-green-200 text-xs"
                            : "bg-gray-50 text-gray-700 border-gray-200 text-xs"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-muted-foreground flex-wrap">
                      <span className="truncate">🏢 {item.perusahaan?.name || "N/A"}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="whitespace-nowrap">
                        {new Date(item.created_at).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8 text-muted-foreground">
            <p className="text-xs sm:text-sm">Belum ada loker baru hari ini</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
