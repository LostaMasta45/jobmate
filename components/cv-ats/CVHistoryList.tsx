"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  FileDown,
  Plus,
  Calendar,
  Award,
  MoreVertical,
} from "lucide-react";
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
import { Resume } from "@/lib/schemas/cv-ats";
import { deleteResume } from "@/actions/cv-ats";
import { downloadResumeAsPDF, downloadResumeAsText, downloadResumeAsWord } from "@/lib/cv-download";
import { CVPreview } from "./CVPreview";
import { TemplateThumbnail } from "./TemplateThumbnail";
import { ATSTemplateId } from "@/lib/ats-templates";
import Link from "next/link";

interface ResumeRecord {
  id: string;
  title: string;
  content: Resume;
  ats_score: number | null;
  created_at: string;
  updated_at: string;
}

interface CVHistoryListProps {
  resumes: ResumeRecord[];
  onEdit: (resume: Resume) => void;
  onRefresh: () => void;
}

export function CVHistoryList({ resumes, onEdit, onRefresh }: CVHistoryListProps) {
  const [previewResume, setPreviewResume] = React.useState<Resume | null>(null);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus CV ini? Tindakan tidak dapat dibatalkan.")) return;

    setDeleting(id);
    try {
      await deleteResume(id);
      onRefresh();
    } catch (error) {
      alert("Gagal hapus: " + (error as Error).message);
    } finally {
      setDeleting(null);
    }
  };

  const handleDownloadPDF = (resume: Resume) => {
    try {
      downloadResumeAsPDF(resume);
    } catch (error) {
      alert("Gagal download PDF: " + (error as Error).message);
    }
  };

  const handleDownloadText = (resume: Resume) => {
    try {
      downloadResumeAsText(resume);
    } catch (error) {
      alert("Gagal download text: " + (error as Error).message);
    }
  };

  const handleDownloadWord = async (resume: Resume) => {
    try {
      await downloadResumeAsWord(resume);
    } catch (error) {
      alert("Gagal download Word: " + (error as Error).message);
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

  if (resumes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
          <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900/50">
            <FileText className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Belum ada CV</h3>
        <p className="text-muted-foreground text-center max-w-xs mb-8">
          Mulai buat CV ATS-optimized pertamamu agar lolos screening mesin.
        </p>
        <Link href="/dashboard/cv-ats/new">
          <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25">
            <Plus className="mr-2 h-5 w-5" />
            Buat CV ATS Baru
          </Button>
        </Link>
      </div>
    );
  }

  // Render thumbnail preview with proper sizing
  const renderThumbnail = (resume: Resume) => {
    const templateId = (resume.templateId as ATSTemplateId) || "classic";
    
    return (
      <div 
        className="relative w-full h-full cursor-pointer overflow-hidden bg-white shadow-sm transition-all group-hover:scale-[1.02] duration-500"
        onClick={() => setPreviewResume(resume)}
      >
        <TemplateThumbnail resume={resume} templateId={templateId} />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40 pointer-events-none" />
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {resumes.map((record) => {
          const resume = record.content;
          const expCount = resume.experiences?.length || 0;
          const skillCount = resume.skills?.length || 0;

          return (
            <div 
              key={record.id} 
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800 transition-all hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-500/30"
            >
              {/* Full Bleed Thumbnail */}
              <div className="relative overflow-hidden bg-slate-100 aspect-[210/297]">
                <div className="absolute inset-0">
                   {renderThumbnail(resume)}
                </div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                   <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-medium shadow-sm text-gray-800 border-none">
                      {formatDate(record.created_at)}
                   </Badge>
                   
                   {record.ats_score !== null && (
                     <Badge 
                        className={`${
                          record.ats_score >= 80 ? 'bg-green-500' : record.ats_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        } text-white border-none shadow-sm`}
                     >
                       {record.ats_score}
                     </Badge>
                   )}
                </div>

                {/* Actions Overlay (Visible on Hover or Mobile Tap) */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                   <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-white hover:bg-blue-50 text-blue-600 shadow-lg" onClick={() => onEdit({ ...resume, id: record.id })}>
                      <Edit className="h-4 w-4" />
                   </Button>
                   <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-white hover:bg-cyan-50 text-cyan-600 shadow-lg" onClick={() => setPreviewResume(resume)}>
                      <Eye className="h-4 w-4" />
                   </Button>
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-white hover:bg-gray-50 text-gray-700 shadow-lg">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleDownloadPDF(resume)}>
                           <FileDown className="mr-2 h-4 w-4" /> PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadWord(resume)}>
                           <FileText className="mr-2 h-4 w-4" /> Word
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadText(resume)}>
                           <FileText className="mr-2 h-4 w-4" /> Text
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(record.id)}>
                           <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 flex flex-col gap-1 bg-white dark:bg-slate-900 relative z-20">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate pr-6" title={record.title}>
                  {record.title || "Untitled CV"}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                   <span className="capitalize">{resume.templateId || "Classic"}</span>
                   <span>{expCount} exp • {skillCount} skills</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add New Card - Always visible at the end */}
        <Link href="/dashboard/cv-ats/new" className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-6 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all min-h-[280px]">
           <div className="rounded-full bg-white dark:bg-slate-800 p-4 shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-md">
              <Plus className="h-8 w-8 text-blue-500" />
           </div>
           <h3 className="font-semibold text-gray-900 dark:text-gray-100">Buat CV Baru</h3>
           <p className="text-xs text-muted-foreground text-center mt-1">
             Optimasi otomatis untuk mesin pencari kerja (ATS)
           </p>
        </Link>
      </div>

      {/* Preview Dialog - A4 Format */}
      <Dialog open={!!previewResume} onOpenChange={() => setPreviewResume(null)}>
        <DialogContent className="max-w-[95vw] w-[900px] h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-4 py-3 border-b shrink-0">
            <DialogTitle>Preview CV ATS - Format A4</DialogTitle>
          </DialogHeader>

          {previewResume && (
            <div className="flex-1 overflow-hidden h-[calc(90vh-120px)]">
              <CVPreview resume={previewResume} />
            </div>
          )}

          <DialogFooter className="px-4 py-3 border-t shrink-0">
            <Button variant="outline" onClick={() => setPreviewResume(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
