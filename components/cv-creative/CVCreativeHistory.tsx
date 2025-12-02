import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Download,
  Trash2,
  Loader2,
  FileDown,
  Image,
  MoreVertical,
  Eye,
  Calendar,
  Award,
  Palette,
  Plus,
} from "lucide-react";
import { CreativeCV } from "@/lib/schemas/cv-creative";
import { deleteCreativeCV } from "@/actions/cv-creative";
import { downloadCreativeCVAsPDF, downloadCreativeCVAsPNG } from "@/lib/cv-creative-download";
import { ModernGradient } from "./templates/ModernGradient";
import { CreativeThumbnail } from "./CreativeThumbnail";
import { CVPreview } from "./CVPreview";
import Link from "next/link";

interface CVCreativeHistoryProps {
  cvs: any[];
  onEdit: (cv: any) => void;
  onRefresh: () => void;
}

export function CVCreativeHistory({ cvs, onEdit, onRefresh }: CVCreativeHistoryProps) {
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [downloading, setDownloading] = React.useState<string | null>(null);
  const [previewCV, setPreviewCV] = React.useState<any | null>(null);

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
      
      const cvData: Partial<CreativeCV> = {
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

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  if (cvs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
          <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900/50">
            <Palette className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Belum ada CV</h3>
        <p className="text-muted-foreground text-center max-w-xs mb-8">
          Mulai buat CV professional pertamamu dengan template modern.
        </p>
        <Link href="/dashboard/cv-creative/new">
          <Button size="lg" className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25">
            <Plus className="mr-2 h-5 w-5" />
            Buat CV Baru
          </Button>
        </Link>
      </div>
    );
  }

  // Render thumbnail preview with A4 portrait ratio
  const renderThumbnail = (cv: any) => {
    const cvData: Partial<CreativeCV> = {
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

    return (
      <div 
        className="relative w-full h-full cursor-pointer overflow-hidden bg-white shadow-sm transition-all group-hover:scale-[1.02] duration-500"
        onClick={() => setPreviewCV(cv)}
      >
        <CreativeThumbnail cv={cvData} />
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40 pointer-events-none" />
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cvs.map((cv) => {
          const content = cv.content;
          
          return (
            <div 
              key={cv.id} 
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800 transition-all hover:shadow-xl hover:border-purple-500/30 dark:hover:border-purple-500/30"
            >
              {/* Full Bleed Thumbnail */}
              <div className="relative overflow-hidden bg-slate-100 aspect-[210/297]">
                <div className="absolute inset-0">
                   {renderThumbnail(cv)}
                </div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                   <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-medium shadow-sm text-gray-800 border-none">
                      {formatDate(cv.created_at)}
                   </Badge>
                   
                   {cv.ats_score && (
                     <Badge 
                        className={`${
                          cv.ats_score >= 80 ? 'bg-green-500' : cv.ats_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        } text-white border-none shadow-sm`}
                     >
                       {cv.ats_score}
                     </Badge>
                   )}
                </div>

                {/* Actions Overlay (Visible on Hover or Mobile Tap) */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                   <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-white hover:bg-purple-50 text-purple-600 shadow-lg" onClick={() => onEdit(cv)}>
                      <Edit className="h-4 w-4" />
                   </Button>
                   <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-white hover:bg-blue-50 text-blue-600 shadow-lg" onClick={() => setPreviewCV(cv)}>
                      <Eye className="h-4 w-4" />
                   </Button>
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-white hover:bg-gray-50 text-gray-700 shadow-lg">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleDownload(cv, "pdf")}>
                           <FileDown className="mr-2 h-4 w-4" /> PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(cv, "png")}>
                           <Image className="mr-2 h-4 w-4" /> PNG
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(cv.id)}>
                           <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 flex flex-col gap-1 bg-white dark:bg-slate-900 relative z-20">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate pr-6" title={cv.title}>
                  {cv.title || "Untitled CV"}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                   <span>{cv.template_id}</span>
                   <span>{content?.experiences?.length || 0} exp</span>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Add New Card - Always visible at the end */}
        <Link href="/dashboard/cv-creative/new" className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-6 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all min-h-[280px]">
           <div className="rounded-full bg-white dark:bg-slate-800 p-4 shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-md">
              <Plus className="h-8 w-8 text-purple-500" />
           </div>
           <h3 className="font-semibold text-gray-900 dark:text-gray-100">Buat CV Baru</h3>
           <p className="text-xs text-muted-foreground text-center mt-1">
             Pilih dari {10}+ template professional
           </p>
        </Link>
      </div>

      {/* Preview Dialog - A4 Format */}
      <Dialog open={!!previewCV} onOpenChange={() => setPreviewCV(null)}>
        <DialogContent className="max-w-[95vw] w-[900px] h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-4 py-3 border-b shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle>Preview CV Creative - Format A4</DialogTitle>
              {previewCV?.color_scheme && (
                <Badge
                  className="shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${previewCV.color_scheme.primary}, ${previewCV.color_scheme.secondary})`,
                  }}
                >
                  {previewCV.template_id}
                </Badge>
              )}
            </div>
          </DialogHeader>

          {previewCV && (
            <div className="flex-1 overflow-hidden h-[calc(90vh-120px)]">
              <CVPreview 
                cv={{
                  id: previewCV.id,
                  userId: previewCV.user_id,
                  title: previewCV.title,
                  templateId: previewCV.template_id,
                  colorScheme: previewCV.color_scheme,
                  photoUrl: previewCV.photo_url,
                  photoOptions: previewCV.photo_options,
                  content: previewCV.content,
                  atsScore: previewCV.ats_score,
                  isDefault: previewCV.is_default,
                }}
              />
            </div>
          )}

          <DialogFooter className="px-4 py-3 border-t shrink-0">
            <Button variant="outline" onClick={() => setPreviewCV(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
