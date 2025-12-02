"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface ColorScheme {
  text?: string;
  accent?: string;
  primary?: string;
  secondary?: string;
  background?: string;
}

interface CreativeCV {
  id: string;
  title: string;
  template_id: string;
  color_scheme: string | ColorScheme;
  ats_score?: number;
  created_at: string;
  updated_at: string;
}

function getColorSchemeName(scheme: string | ColorScheme | null | undefined): string {
  if (!scheme) return "Default";
  if (typeof scheme === "string") return scheme;
  if (scheme.primary) return scheme.primary;
  return "Custom";
}

export function RecentCreativeCVs() {
  const [cvs, setCVs] = useState<CreativeCV[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentCVs();
  }, []);

  async function fetchRecentCVs() {
    try {
      const { getAllCreativeCVs } = await import("@/actions/cv-creative");
      const result = await getAllCreativeCVs();
      setCVs((result || []).slice(0, 3));
    } catch (error) {
      console.error("Error fetching creative CVs:", error);
      setCVs([]);
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

  if (cvs.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-2">
        <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
          <Palette className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
          Belum ada CV Creative dibuat
        </p>
        <Link href="/tools/cv-creative">
          <Button size="sm" className="gap-1.5 text-xs h-8 px-3 bg-purple-600 hover:bg-purple-700">
            <Palette className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Buat CV</span>
            <span className="sm:hidden">Buat</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2.5">
        {cvs.map((cv) => (
          <Link 
            key={cv.id} 
            href="/tools/cv-creative"
            className="block group"
          >
            <div className="p-2.5 rounded-lg border hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all">
              <div className="flex items-start gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <Palette className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 text-purple-600" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs sm:text-sm leading-tight mb-0.5 sm:mb-1 truncate">
                    {cv.title || "CV Creative"}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {cv.template_id?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "Template"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <Badge className="text-[9px] sm:text-[10px] py-0 px-1 sm:px-1.5 h-4 sm:h-5 flex-shrink-0 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100">
                  {getColorSchemeName(cv.color_scheme)}
                </Badge>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate">
                  {formatDistanceToNow(new Date(cv.created_at), {
                    addSuffix: true,
                    locale: id,
                  })}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {cvs.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <Link href="/tools/cv-creative">
            <Button variant="ghost" size="sm" className="w-full gap-1.5 sm:gap-2 text-[10px] sm:text-xs hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950">
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
