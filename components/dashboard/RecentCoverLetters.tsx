"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, ArrowRight, FileDown, Building2, Calendar } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface CoverLetter {
  id: string;
  company_name: string;
  position: string;
  template_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function RecentCoverLetters() {
  const [letters, setLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentLetters();
  }, []);

  async function fetchRecentLetters() {
    try {
      const { listCoverLetters } = await import("@/actions/surat-lamaran/list");
      const result = await listCoverLetters();
      
      if (result.error) {
        console.error("Error fetching cover letters:", result.error);
        setLetters([]);
      } else {
        // Get only the 3 most recent letters
        const recent = (result.data || []).slice(0, 3);
        setLetters(recent);
      }
    } catch (error) {
      console.error("Error fetching cover letters:", error);
      setLetters([]);
    } finally {
      setLoading(false);
    }
  }

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

  if (letters.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="rounded-full bg-primary/10 p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Belum ada surat lamaran dibuat
        </p>
        <Link href="/surat-lamaran/buat">
          <Button size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            Buat Surat Pertama
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2.5">
        {letters.map((letter) => (
          <Link 
            key={letter.id} 
            href={`/surat-lamaran/${letter.id}`}
            className="block group"
          >
            <div className="p-2.5 rounded-lg border hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-950/20 transition-all">
              {/* Header Row */}
              <div className="flex items-start gap-2 mb-2">
                <FileText className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                  letter.template_type === 'T0' ? 'text-green-600' : 'text-purple-600'
                }`} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm leading-tight mb-1">
                    {letter.company_name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {letter.position}
                  </p>
                </div>
              </div>

              {/* Badge & Time */}
              <div className="flex items-center justify-between">
                <Badge className={`text-[10px] py-0 px-1.5 h-5 ${
                  letter.template_type === 'T0' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100' 
                    : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100'
                }`}>
                  {letter.template_type === 'T0' ? 'ATS' : 'Modern'}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(letter.created_at), {
                    addSuffix: true,
                    locale: id,
                  })}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      {letters.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <Link href="/surat-lamaran">
            <Button variant="ghost" size="sm" className="w-full gap-2 text-xs hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950">
              Lihat Semua
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
