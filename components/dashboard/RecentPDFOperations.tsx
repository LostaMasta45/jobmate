"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Minimize2,
  FileImage,
  ArrowRight,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  Download,
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
  options: Record<string, any>;
  metadata: Record<string, any>;
  status: string;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

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

  const getOperationLabel = (op: string) => {
    const labels: Record<string, string> = {
      merge: "Gabung PDF",
      compress: "Kompres PDF",
      convert_office: "Word → PDF",
      convert_image: "Image → PDF",
      pdf_to_word: "PDF → Word",
      split: "Pisah PDF",
      protect: "Password",
      watermark: "Watermark",
      rotate: "Rotasi",
    };
    return labels[op] || op;
  };

  const getOperationIcon = (op: string) => {
    switch (op) {
      case "merge":
        return FileStack;
      case "compress":
        return Minimize2;
      case "convert_office":
      case "convert_image":
      case "pdf_to_word":
        return FileImage;
      default:
        return FileText;
    }
  };

  const getOperationGradient = (op: string) => {
    const gradients: Record<string, string> = {
      merge: "from-blue-50 to-blue-100",
      compress: "from-purple-50 to-purple-100",
      convert_office: "from-green-50 to-green-100",
      convert_image: "from-green-50 to-green-100",
      pdf_to_word: "from-amber-50 to-amber-100",
      split: "from-rose-50 to-rose-100",
      protect: "from-red-50 to-red-100",
      watermark: "from-indigo-50 to-indigo-100",
      rotate: "from-cyan-50 to-cyan-100",
    };
    return gradients[op] || "from-gray-50 to-gray-100";
  };

  const getOperationIconColor = (op: string) => {
    const colors: Record<string, string> = {
      merge: "text-blue-600",
      compress: "text-purple-600",
      convert_office: "text-green-600",
      convert_image: "text-green-600",
      pdf_to_word: "text-amber-600",
      split: "text-rose-600",
      protect: "text-red-600",
      watermark: "text-indigo-600",
      rotate: "text-cyan-600",
    };
    return colors[op] || "text-gray-600";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg border animate-pulse"
          >
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

  if (operations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="rounded-full bg-primary/10 p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Belum ada operasi PDF
        </p>
        <Link href="/tools/pdf-tools">
          <Button size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            Gunakan PDF Tools
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2.5">
        {operations.map((operation) => {
          const Icon = getOperationIcon(operation.operation);

          return (
            <Link
              key={operation.id}
              href="/tools/pdf-tools"
              className="block group"
            >
              <div className="p-2.5 rounded-lg border hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <Icon
                      className={`h-4 w-4 flex-shrink-0 mt-0.5 ${getOperationIconColor(operation.operation)}`}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm leading-tight mb-1">
                        {getOperationLabel(operation.operation)}
                      </h4>
                      {operation.file_size && operation.status === "completed" && (
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(operation.file_size)}
                          {operation.metadata?.reductionPercent && (
                            <span className="text-green-600 font-medium ml-1">
                              • {operation.metadata.reductionPercent}% ↓
                            </span>
                          )}
                        </p>
                      )}
                      {operation.metadata?.fileCount && (
                        <p className="text-xs text-muted-foreground">
                          {operation.metadata.fileCount} file digabung
                        </p>
                      )}
                    </div>
                  </div>
                  {operation.status === "completed" && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                  )}
                  {operation.status === "failed" && (
                    <XCircle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
                  )}
                  {operation.status === "processing" && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary flex-shrink-0" />
                  )}
                </div>

                {/* Time */}
                <div className="text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(operation.created_at), {
                    addSuffix: true,
                    locale: id,
                  })}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* View All Link */}
      {operations.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <Link href="/tools/pdf-tools">
            <Button variant="ghost" size="sm" className="w-full gap-2 text-xs hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-950">
              Lihat Semua
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
