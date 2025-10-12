"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Briefcase } from "lucide-react";
import Link from "next/link";

type RecentApplication = {
  id: string;
  company: string;
  position: string;
  status: string;
  created_at: string;
};

type RecentTableProps = {
  rows: RecentApplication[];
};

const STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Applied: "default",
  Screening: "secondary",
  Interview: "outline",
  Offer: "default",
  Hired: "default",
  Rejected: "destructive",
};

export function RecentTable({ rows }: RecentTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lamaran Terbaru</CardTitle>
        <Link
          href="/tools/tracker"
          className="text-sm text-primary hover:underline"
        >
          Lihat Semua →
        </Link>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Belum ada lamaran.</p>
            <Link href="/tools/tracker" className="text-sm text-primary hover:underline mt-2">
              Tambah lamaran pertama →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((row, index) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{row.company}</p>
                  <p className="text-xs text-muted-foreground truncate">{row.position}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(row.created_at), "dd MMM yyyy")}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANTS[row.status] || "outline"} className="ml-3">
                  {row.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
