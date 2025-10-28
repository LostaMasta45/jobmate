"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Download, Trash2, Loader2, FileDown, Image, MoreVertical } from "lucide-react";
import { CreativeCV } from "@/lib/schemas/cv-creative";
import { deleteCreativeCV } from "@/actions/cv-creative";
import { downloadCreativeCVAsPDF, downloadCreativeCVAsPNG } from "@/lib/cv-creative-download";
import { ModernGradient } from "./templates/ModernGradient";

interface CVCreativeHistoryProps {
  cvs: any[];
  onEdit: (cv: any) => void;
  onRefresh: () => void;
}

export function CVCreativeHistory({ cvs, onEdit, onRefresh }: CVCreativeHistoryProps) {
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [downloading, setDownloading] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus CV ini?")) return;
    
    setDeleting(id);
    try {
      await deleteCreativeCV(id);
      onRefresh();
    } catch (error) {
      alert("Gagal hapus CV");
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = async (cv: any, format: "pdf" | "png") => {
    setDownloading(cv.id);
    
    // Create temporary preview element
    const tempDiv = document.createElement("div");
    tempDiv.id = "cv-preview-content";
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.width = "210mm";
    tempDiv.style.minHeight = "297mm";
    document.body.appendChild(tempDiv);

    try {
      // Render template to temp element
      const { createRoot } = await import("react-dom/client");
      const root = createRoot(tempDiv);
      
      const cvData: CreativeCV = {
        id: cv.id,
        userId: cv.user_id,
        title: cv.title,
        templateId: cv.template_id,
        colorScheme: cv.color_scheme,
        photoUrl: cv.photo_url,
        photoOptions: cv.photo_options,
        content: cv.content,
        atsScore: cv.ats_score,
        isDefault: cv.is_default,
      };

      root.render(<ModernGradient cv={cvData} />);

      // Wait for render
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Download
      if (format === "pdf") {
        await downloadCreativeCVAsPDF(cvData);
      } else {
        await downloadCreativeCVAsPNG(cvData);
      }

      // Cleanup
      root.unmount();
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error("Download error:", error);
      alert(`Gagal download ${format.toUpperCase()}`);
      
      // Cleanup on error
      if (document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv);
      }
    } finally {
      setDownloading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (cvs.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-48 items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="mb-2 text-lg">Belum ada Creative CV</p>
            <p className="text-sm">Click "Buat CV Baru" untuk memulai</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {cvs.map((cv) => (
        <Card key={cv.id} className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
            {/* Thumbnail */}
            <div 
              className="h-20 w-14 flex-shrink-0 rounded border sm:h-24 sm:w-16"
              style={{ 
                background: `linear-gradient(135deg, ${cv.color_scheme.primary}, ${cv.color_scheme.secondary})` 
              }}
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="truncate font-semibold text-sm sm:text-base">{cv.title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs sm:gap-2 sm:text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">{cv.template_id}</Badge>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{formatDate(cv.created_at)}</span>
                {cv.ats_score && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">Score: {cv.ats_score}</span>
                  </>
                )}
              </div>
            </div>

            {/* Actions - Responsive */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(cv)}
                className="hidden sm:flex"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              
              {/* Mobile: Edit icon only */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 sm:hidden"
                onClick={() => onEdit(cv)}
              >
                <Edit className="h-4 w-4" />
              </Button>

              {/* Download Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={downloading === cv.id}
                    className="hidden sm:flex"
                  >
                    {downloading === cv.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    <span className="hidden lg:inline">Download</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDownload(cv, "pdf")}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload(cv, "png")}>
                    <Image className="mr-2 h-4 w-4" />
                    Download PNG
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile: More menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 sm:hidden"
                    disabled={downloading === cv.id || deleting === cv.id}
                  >
                    {downloading === cv.id || deleting === cv.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MoreVertical className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDownload(cv, "pdf")}>
                    <FileDown className="mr-2 h-4 w-4" />
                    PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload(cv, "png")}>
                    <Image className="mr-2 h-4 w-4" />
                    PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(cv.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Desktop: Delete button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(cv.id)}
                disabled={deleting === cv.id}
                className="hidden sm:flex"
              >
                {deleting === cv.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
