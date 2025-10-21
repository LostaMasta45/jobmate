"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Minimize2,
  FileImage,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  FileStack,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface PDFOperation {
  id: string;
  operation: string;
  input_files: string[];
  output_file: string | null;
  file_size: number | null;
  status: string;
  created_at: string;
}

const OPERATION_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  merge: { label: "Gabung", icon: FileText, color: "text-blue-600" },
  compress: { label: "Kompres", icon: Minimize2, color: "text-purple-600" },
  convert: { label: "Convert", icon: FileImage, color: "text-amber-600" },
};

export function RecentPDFOperations() {
  const [operations, setOperations] = useState<PDFOperation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOperations();
  }, []);

  async function fetchRecentOperations() {
    try {
      const { listPDFOperations } = await import("@/actions/pdf/list");
      const result = await listPDFOperations(3);

      if (result.error) {
        console.error("Error fetching PDF operations:", result.error);
        setOperations([]);
      } else {
        setOperations(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching PDF operations:", error);
      setOperations([]);
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

  if (operations.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-2">
        <div className="rounded-full bg-primary/10 p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
          <FileStack className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
          Belum ada operasi PDF
        </p>
        <Link href="/tools/pdf-tools">
          <Button size="sm" className="gap-1.5 text-xs h-8 px-3">
            <FileStack className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">PDF Tools</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2.5">
        {operations.map((op) => {
          const config = OPERATION_CONFIG[op.operation] || OPERATION_CONFIG.merge;
          const Icon = config.icon;
          
          return (
            <Link 
              key={op.id} 
              href="/tools/pdf-tools"
              className="block group"
            >
              <div className="p-2.5 rounded-lg border hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all">
                <div className="flex items-start gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 ${config.color}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs sm:text-sm leading-tight mb-0.5 sm:mb-1 truncate">
                      {config.label} PDF
                    </h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                      {op.input_files.length} file{op.input_files.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Badge className={`text-[9px] sm:text-[10px] py-0 px-1 sm:px-1.5 h-4 sm:h-5 flex-shrink-0 ${
                    op.status === 'completed' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                      : op.status === 'failed'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100'
                  }`}>
                    {op.status === 'completed' && <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 inline mr-0.5" />}
                    {op.status === 'failed' && <XCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 inline mr-0.5" />}
                    {op.status === 'processing' && <Loader2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 inline mr-0.5 animate-spin" />}
                    <span className="capitalize">{op.status}</span>
                  </Badge>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate">
                    {formatDistanceToNow(new Date(op.created_at), {
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

      {operations.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <Link href="/tools/pdf-tools">
            <Button variant="ghost" size="sm" className="w-full gap-1.5 sm:gap-2 text-[10px] sm:text-xs hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-950">
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
