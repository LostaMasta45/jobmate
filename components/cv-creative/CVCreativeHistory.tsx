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
  Search,
  History,
  ArrowLeft,
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
  onBack?: () => void;
}

export function CVCreativeHistory({ cvs, onEdit, onRefresh, onBack }: CVCreativeHistoryProps) {
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
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-6 md:p-8 mb-8">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-10 w-10 bg-white/50 dark:bg-white/10 border border-slate-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="p-4 rounded-2xl bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400">
              <History className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">My Portfolio Gallery</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
                Lihat dan kelola koleksi desain CV kreatif Anda.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Portfolio..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-sm transition-all"
              />
            </div>
            <div className="relative w-full md:w-auto">
              <select className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all cursor-pointer">
                <option>Semua Status</option>
                <option>High Score</option>
                <option>Recent</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Add New Card */}
        <Link href="/dashboard/cv-creative/new" className="group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all h-full min-h-[300px]">
          <div className="rounded-full bg-white dark:bg-slate-800 p-4 shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-md">
            <Plus className="h-8 w-8 text-pink-500" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Buat Portfolio Baru</h3>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Pilih dari {10}+ template premium
          </p>
        </Link>

        {cvs.map((cv) => {
          const content = cv.content;

          return (
            <div
              key={cv.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-slate-900 dark:bg-black border border-slate-800 dark:border-zinc-800 hover:border-pink-500/50 transition-all duration-300 p-6 min-h-[300px] shadow-lg"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10 w-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 group-hover:bg-pink-500/20 group-hover:border-pink-500/30 transition-colors">
                    <Palette className="h-6 w-6 text-pink-500 w-full" />
                  </div>
                  {cv.ats_score && (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cv.ats_score >= 80 ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      cv.ats_score >= 60 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                      {cv.ats_score}
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-pink-400 transition-colors" title={cv.title}>
                    {cv.title || "Untitled CV"}
                  </h3>
                  <p className="text-sm text-zinc-500 font-medium capitalize">
                    {cv.template_id} Template
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-xs text-zinc-500 font-medium bg-zinc-900/50 py-2 px-3 rounded-lg w-fit">
                    <Calendar className="h-3 w-3" />
                    {formatDate(cv.created_at)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/50 relative z-10">
                <Button
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-600 rounded-xl h-10 text-xs font-semibold"
                  onClick={() => setPreviewCV(cv)}
                >
                  <Eye className="h-3.5 w-3.5 mr-2" />
                  Lihat
                </Button>
                <button
                  onClick={() => handleDelete(cv.id)}
                  className="flex items-center gap-2 px-4 h-10 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-xs font-bold"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </button>

                {/* More Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-10 w-8 flex items-center justify-center rounded-xl hover:bg-zinc-800 text-zinc-500">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(cv)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(cv, "pdf")}>
                      <FileDown className="mr-2 h-4 w-4" /> PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(cv, "png")}>
                      <Image className="mr-2 h-4 w-4" /> PNG
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
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
