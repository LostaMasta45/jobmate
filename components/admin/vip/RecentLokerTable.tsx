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
        <CardTitle className="flex items-center gap-2">
          🆕 Loker Terbaru Hari Ini
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loker.length > 0 ? (
          <div className="space-y-3">
            {loker.map((item) => (
              <Link
                key={item.id}
                href={`/admin/vip-loker/${item.id}/edit`}
                className="block p-3 rounded-lg border hover:bg-accent transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <Badge 
                        variant="outline"
                        className={
                          item.status === "published"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span>🏢 {item.perusahaan?.name || "N/A"}</span>
                      <span>•</span>
                      <span>
                        {new Date(item.created_at).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Belum ada loker baru hari ini</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
