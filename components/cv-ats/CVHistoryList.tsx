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
  Search,
  ArrowLeft,
  History,
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
  onBack?: () => void;
}

export function CVHistoryList({ resumes, onEdit, onRefresh, onBack }: CVHistoryListProps) {
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
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-6 md:p-8 mb-8">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-10 w-10 bg-white/50 dark:bg-white/10 border border-slate-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <History className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">My Resume Library</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
                Akses & edit resume yang sudah Anda buat sebelumnya.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari CV..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all"
              />
            </div>
            <div className="relative w-full md:w-auto">
              <select className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer">
                <option>Semua Status</option>
                <option>Excellent</option>
                <option>Good</option>
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
        <Link href="/dashboard/cv-ats/new" className="group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all h-full min-h-[300px]">
          <div className="rounded-full bg-white dark:bg-slate-800 p-4 shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-md">
            <Plus className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Buat CV Baru</h3>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Optimasi untuk ATS
          </p>
        </Link>

        {resumes.map((record) => {
          const resume = record.content;

          return (
            <div
              key={record.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-slate-900 dark:bg-black border border-slate-800 dark:border-zinc-800 hover:border-blue-500/50 transition-all duration-300 p-6 min-h-[300px] shadow-lg"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10 w-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-colors">
                    <FileText className="h-6 w-6 text-blue-500" />
                  </div>
                  {record.ats_score !== null && (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${record.ats_score >= 80 ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      record.ats_score >= 60 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                      Score: {record.ats_score}
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors" title={record.title}>
                    {record.title || "Untitled CV"}
                  </h3>
                  <p className="text-sm text-zinc-500 font-medium capitalize">
                    {resume.templateId || "Classic"} Template
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-xs text-zinc-500 font-medium bg-zinc-900/50 py-2 px-3 rounded-lg w-fit">
                    <Calendar className="h-3 w-3" />
                    {formatDate(record.created_at)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/50 relative z-10">
                <Button
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-600 rounded-xl h-10 text-xs font-semibold"
                  onClick={() => setPreviewResume(resume)}
                >
                  <Eye className="h-3.5 w-3.5 mr-2" />
                  Lihat
                </Button>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="flex items-center gap-2 px-4 h-10 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-xs font-bold"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </button>

                {/* More Menu for additional actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-10 w-8 flex items-center justify-center rounded-xl hover:bg-zinc-800 text-zinc-500">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit({ ...resume, id: record.id })}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownloadPDF(resume)}>
                      <FileDown className="mr-2 h-4 w-4" /> PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>
            </div>
          );
        })}
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
