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
  nama_perusahaan: string;
  posisi_lowongan: string;
  template_id: string;
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
      const { getSuratLamaranList } = await import("@/actions/surat-lamaran-sederhana/list");
      const result = await getSuratLamaranList({ limit: 3 });
      
      if (result.error) {
        console.error("Error fetching cover letters:", result.error);
        setLetters([]);
      } else {
        setLetters(result.data || []);
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
      <div className="text-center py-8 sm:py-12 px-2">
        <div className="rounded-full bg-primary/10 p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
          Belum ada surat lamaran dibuat
        </p>
        <Link href="/surat-lamaran-sederhana">
          <Button size="sm" className="gap-1.5 text-xs h-8 px-3">
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Buat Surat</span>
            <span className="sm:hidden">Buat</span>
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
            href={`/surat-lamaran-sederhana/view?id=${letter.id}`}
            className="block group"
          >
            <div className="p-2.5 rounded-lg border hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-950/20 transition-all">
              {/* Header Row */}
              <div className="flex items-start gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <FileText className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 ${
                  letter.template_id.startsWith('template-') ? 'text-green-600' : 'text-purple-600'
                }`} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs sm:text-sm leading-tight mb-0.5 sm:mb-1 truncate">
                    {letter.nama_perusahaan}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {letter.posisi_lowongan}
                  </p>
                </div>
              </div>

              {/* Badge & Time */}
              <div className="flex items-center justify-between gap-2">
                <Badge className={`text-[9px] sm:text-[10px] py-0 px-1 sm:px-1.5 h-4 sm:h-5 flex-shrink-0 ${
                  letter.template_id.startsWith('template-') 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100' 
                    : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100'
                }`}>
                  {letter.template_id.replace('template-', 'Template ')}
                </Badge>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate">
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
          <Link href="/surat-lamaran-sederhana/history">
            <Button variant="ghost" size="sm" className="w-full gap-1.5 sm:gap-2 text-[10px] sm:text-xs hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950">
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
