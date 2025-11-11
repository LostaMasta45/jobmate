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
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base sm:text-lg">Lamaran Terbaru</CardTitle>
        <Link
          href="/tools/tracker"
          className="text-xs sm:text-sm text-primary hover:underline flex-shrink-0"
        >
          Semua →
        </Link>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Briefcase className="h-10 w-10 text-muted-foreground/30 mb-2" />
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">Belum ada lamaran</p>
            <Link href="/tools/tracker">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs sm:text-sm text-primary hover:underline font-medium"
              >
                Tambah Lamaran →
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-2.5">
            {rows.map((row, index) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all cursor-pointer"
              >
                <div className="flex-1 min-w-0 mr-2">
                  <p className="font-medium text-xs sm:text-sm truncate">{row.company}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{row.position}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5" suppressHydrationWarning>
                    {format(new Date(row.created_at), "dd MMM yyyy")}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANTS[row.status] || "outline"} className="text-[10px] sm:text-xs py-0.5 px-2 flex-shrink-0">
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
