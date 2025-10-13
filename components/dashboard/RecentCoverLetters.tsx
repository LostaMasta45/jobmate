"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchRecentLetters();
    }, 30000);
    
    return () => clearInterval(interval);
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
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Surat Lamaran Terbaru</h3>
        </div>
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
      </Card>
    );
  }

  if (letters.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Surat Lamaran Terbaru
          </h3>
        </div>
        <div className="text-center py-8">
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
      </Card>
    );
  }

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Surat Lamaran Terbaru
        </h3>
        <Link href="/surat-lamaran">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            Lihat Semua
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {letters.map((letter) => (
          <Link 
            key={letter.id} 
            href={`/surat-lamaran/${letter.id}`}
            className="block group"
          >
            <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/50 hover:bg-accent/50 transition-all">
              {/* Icon */}
              <div className={`rounded-lg p-2.5 shadow-sm group-hover:scale-110 transition-transform ${
                letter.template_type === 'T0'
                  ? 'bg-gradient-to-br from-green-50 to-green-100'
                  : 'bg-gradient-to-br from-purple-50 to-purple-100'
              }`}>
                <FileText className={`h-5 w-5 ${
                  letter.template_type === 'T0' ? 'text-green-600' : 'text-purple-600'
                }`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {letter.company_name}
                  </h4>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                    letter.template_type === 'T0' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {letter.template_type === 'T0' ? 'ATS' : 'Modern'}
                  </span>
                </div>
                
                <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3 w-3 flex-shrink-0" />
                    <span className="line-clamp-1">{letter.position}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <span>
                      {formatDistanceToNow(new Date(letter.created_at), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Hint */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA to create new */}
      <div className="mt-4 pt-4 border-t">
        <Link href="/surat-lamaran/buat">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <FileText className="h-4 w-4" />
            Buat Surat Lamaran Baru
          </Button>
        </Link>
      </div>
    </Card>
  );
}
