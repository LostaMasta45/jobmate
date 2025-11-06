"use client";

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
} from "lucide-react";
import { CreativeCV } from "@/lib/schemas/cv-creative";
import { deleteCreativeCV } from "@/actions/cv-creative";
import { downloadCreativeCVAsPDF, downloadCreativeCVAsPNG } from "@/lib/cv-creative-download";
import { ModernGradient } from "./templates/ModernGradient";
import { BoldMinimalist, PastelProfessional, DarkModePro } from "./templates/AllTemplatesNew";
import { CV075Professional } from "./templates/CV075Professional";
import { 
  MagazineLayout,
  ColorfulBlocks, 
  TimelineHero, 
  PortfolioGrid, 
  InfographicStyle, 
  SplitScreen, 
  GeometricModern, 
  WatercolorArtist 
} from "./templates/RemainingTemplates";
import { CVPreview } from "./CVPreview";

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

  const getScoreLabel = (score: number | null) => {
    if (!score) return "Belum dihitung";
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Work";
  };

  if (cvs.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex h-48 items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Palette className="mx-auto mb-4 h-16 w-16 opacity-50" />
            <p className="mb-2 text-lg font-semibold">Belum ada Creative CV</p>
            <p className="text-sm">Mulai buat CV visual yang eye-catching sekarang!</p>
          </div>
        </CardContent>
      </Card>
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

    // A4 ratio is 210:297 (approximately 1:1.414)
    // Calculate scale to fit container perfectly
    // Container width will be 100%, we need to scale 210mm to fit
    const scaleValue = 0.35; // Adjusted for better fill
    
    return (
      <div 
        className="group/thumb relative w-full cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
        style={{ 
          paddingBottom: '141.4%', // A4 portrait aspect ratio (297/210 = 1.414)
        }}
        onClick={() => setPreviewCV(cv)}
      >
        <div 
          className="absolute inset-0 flex items-start justify-center"
          style={{
            overflow: 'hidden',
            backgroundColor: '#f5f5f5',
          }}
        >
          <div 
            style={{
              transform: `scale(${scaleValue})`,
              transformOrigin: 'top center',
              width: '210mm',
              minHeight: '297mm',
            }}
            className="pointer-events-none"
          >
            <CVPreview cv={cvData} />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity group-hover/thumb:opacity-80" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover/thumb:opacity-100">
          <div className="rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm">
            <Eye className="h-5 w-5 text-gray-900" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <p className="truncate text-sm font-semibold drop-shadow-md">{cv.template_id}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cvs.map((cv) => {
          const content = cv.content;
          const expCount = content?.experiences?.length || 0;
          const skillCount = content?.skills?.length || 0;

          return (
            <Card key={cv.id} className="group relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1 text-base">
                      {cv.title}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {content?.basics?.firstName} {content?.basics?.lastName}
                    </p>
                  </div>
                  {cv.ats_score !== null && (
                    <div className="ml-2 flex flex-col items-center">
                      <Award
                        className={`h-5 w-5 ${getScoreColor(cv.ats_score)}`}
                      />
                      <span
                        className={`text-xs font-semibold ${getScoreColor(
                          cv.ats_score
                        )}`}
                      >
                        {cv.ats_score}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pb-4">
                {/* CV Thumbnail Preview */}
                {renderThumbnail(cv)}

                {/* Info */}
                <div className="flex-1 text-sm">
                  <p className="text-xs text-muted-foreground">
                    {expCount} pengalaman • {skillCount} skills
                  </p>
                </div>

                {/* ATS Score Badge */}
                {cv.ats_score !== null && (
                  <div
                    className={`rounded-md px-2 py-1 text-xs font-medium ${
                      cv.ats_score >= 80
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : cv.ats_score >= 60
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}
                  >
                    ATS Score: {getScoreLabel(cv.ats_score)}
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Dibuat {formatDate(cv.created_at)}</span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewCV(cv)}
                    className="h-8 text-xs"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(cv)}
                    className="h-8 text-xs"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(cv, "pdf")}
                    disabled={downloading === cv.id}
                    className="h-8 text-xs"
                  >
                    <FileDown className="mr-1 h-3 w-3" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(cv, "png")}
                    disabled={downloading === cv.id}
                    className="h-8 text-xs"
                  >
                    <Image className="mr-1 h-3 w-3" />
                    PNG
                  </Button>
                </div>

                {/* Delete Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(cv.id)}
                  disabled={deleting === cv.id}
                  className="w-full h-8 text-xs"
                >
                  {deleting === cv.id ? (
                    "Menghapus..."
                  ) : (
                    <>
                      <Trash2 className="mr-1 h-3 w-3" />
                      Hapus
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewCV} onOpenChange={() => setPreviewCV(null)}>
        <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview CV Creative</DialogTitle>
          </DialogHeader>

          {previewCV && previewCV.content && (
            <div className="space-y-6 text-sm">
              {/* Header */}
              <div className="border-b pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {previewCV.content.basics?.firstName} {previewCV.content.basics?.lastName}
                    </h2>
                    <p className="mt-1 text-lg text-muted-foreground">
                      {previewCV.content.basics?.headline}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {previewCV.content.basics?.email && (
                        <span>{previewCV.content.basics.email}</span>
                      )}
                      {previewCV.content.basics?.phone && (
                        <span>{previewCV.content.basics.phone}</span>
                      )}
                      {previewCV.content.basics?.city && (
                        <span>{previewCV.content.basics.city}</span>
                      )}
                    </div>
                  </div>
                  <Badge
                    className="shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${previewCV.color_scheme.primary}, ${previewCV.color_scheme.secondary})`,
                    }}
                  >
                    {previewCV.template_id}
                  </Badge>
                </div>
              </div>

              {/* Summary */}
              {previewCV.content.summary && (
                <div>
                  <h3 className="mb-2 font-semibold uppercase text-xs tracking-wide">
                    Ringkasan
                  </h3>
                  <p className="text-muted-foreground">{previewCV.content.summary}</p>
                </div>
              )}

              {/* Experience */}
              {previewCV.content.experiences && previewCV.content.experiences.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold uppercase text-xs tracking-wide">
                    Pengalaman Profesional
                  </h3>
                  <div className="space-y-4">
                    {previewCV.content.experiences.map((exp: any, idx: number) => (
                      <div key={idx}>
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold">{exp.title}</p>
                            <p className="text-muted-foreground">{exp.company}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {exp.startDate} - {exp.isCurrent ? "Sekarang" : exp.endDate}
                          </p>
                        </div>
                        <ul className="mt-2 space-y-1 text-muted-foreground">
                          {exp.bullets.map((bullet: string, bidx: number) => (
                            <li key={bidx} className="flex gap-2">
                              <span>•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {previewCV.content.education && previewCV.content.education.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold uppercase text-xs tracking-wide">
                    Pendidikan
                  </h3>
                  <div className="space-y-3">
                    {previewCV.content.education.map((edu: any, idx: number) => (
                      <div key={idx}>
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold">{edu.school}</p>
                            <p className="text-muted-foreground">
                              {edu.degree} {edu.field}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {edu.startDate} - {edu.endDate}
                          </p>
                        </div>
                        {edu.description && (
                          <p className="mt-1 text-muted-foreground">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {previewCV.content.skills && previewCV.content.skills.length > 0 && (
                <div>
                  <h3 className="mb-2 font-semibold uppercase text-xs tracking-wide">
                    Keterampilan
                  </h3>
                  <p className="text-muted-foreground">
                    {previewCV.content.skills.join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewCV(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
