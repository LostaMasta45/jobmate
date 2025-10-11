"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Resume } from "@/lib/schemas/cv-ats";
import { deleteResume } from "@/actions/cv-ats";
import { downloadResumeAsPDF, downloadResumeAsText, downloadResumeAsWord } from "@/lib/cv-download";

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
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="mb-4 h-16 w-16 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-semibold">Belum Ada CV</h3>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Mulai buat CV ATS-optimized pertama Anda sekarang!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resumes.map((record) => {
          const resume = record.content;
          const expCount = resume.experiences?.length || 0;
          const skillCount = resume.skills?.length || 0;

          return (
            <Card key={record.id} className="group relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1 text-base">
                      {record.title}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {resume.basics?.firstName} {resume.basics?.lastName}
                    </p>
                  </div>
                  {record.ats_score !== null && (
                    <div className="ml-2 flex flex-col items-center">
                      <Award
                        className={`h-5 w-5 ${getScoreColor(record.ats_score)}`}
                      />
                      <span
                        className={`text-xs font-semibold ${getScoreColor(
                          record.ats_score
                        )}`}
                      >
                        {record.ats_score}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pb-4">
                {/* Resume Info */}
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium">Headline:</span>{" "}
                    {resume.basics?.headline || "-"}
                  </p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{expCount} pengalaman</span>
                    <span>•</span>
                    <span>{skillCount} skills</span>
                  </div>
                </div>

                {/* ATS Score Badge */}
                {record.ats_score !== null && (
                  <div
                    className={`rounded-md px-2 py-1 text-xs font-medium ${
                      record.ats_score >= 80
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : record.ats_score >= 60
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}
                  >
                    ATS Score: {getScoreLabel(record.ats_score)}
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Dibuat {formatDate(record.created_at)}</span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewResume(resume)}
                    className="h-8 text-xs"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(resume)}
                    className="h-8 text-xs"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadPDF(resume)}
                    className="h-8 text-xs"
                  >
                    <FileDown className="mr-1 h-3 w-3" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadWord(resume)}
                    className="h-8 text-xs"
                  >
                    <FileText className="mr-1 h-3 w-3" />
                    Word
                  </Button>
                </div>

                {/* Delete Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(record.id)}
                  disabled={deleting === record.id}
                  className="w-full h-8 text-xs"
                >
                  {deleting === record.id ? (
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
      <Dialog open={!!previewResume} onOpenChange={() => setPreviewResume(null)}>
        <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview CV</DialogTitle>
          </DialogHeader>

          {previewResume && (
            <div className="space-y-6 text-sm">
              {/* Header */}
              <div className="border-b pb-4">
                <h2 className="text-2xl font-bold">
                  {previewResume.basics?.firstName} {previewResume.basics?.lastName}
                </h2>
                <p className="mt-1 text-lg text-muted-foreground">
                  {previewResume.basics?.headline}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {previewResume.basics?.email && (
                    <span>{previewResume.basics.email}</span>
                  )}
                  {previewResume.basics?.phone && (
                    <span>{previewResume.basics.phone}</span>
                  )}
                  {previewResume.basics?.city && (
                    <span>{previewResume.basics.city}</span>
                  )}
                </div>
              </div>

              {/* Summary */}
              {previewResume.summary && (
                <div>
                  <h3 className="mb-2 font-semibold uppercase text-xs tracking-wide">
                    Ringkasan
                  </h3>
                  <p className="text-muted-foreground">{previewResume.summary}</p>
                </div>
              )}

              {/* Experience */}
              {previewResume.experiences && previewResume.experiences.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold uppercase text-xs tracking-wide">
                    Pengalaman Profesional
                  </h3>
                  <div className="space-y-4">
                    {previewResume.experiences.map((exp, idx) => (
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
                          {exp.bullets.map((bullet, bidx) => (
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
              {previewResume.education && previewResume.education.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold uppercase text-xs tracking-wide">
                    Pendidikan
                  </h3>
                  <div className="space-y-3">
                    {previewResume.education.map((edu, idx) => (
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
              {previewResume.skills && previewResume.skills.length > 0 && (
                <div>
                  <h3 className="mb-2 font-semibold uppercase text-xs tracking-wide">
                    Keterampilan
                  </h3>
                  <p className="text-muted-foreground">
                    {previewResume.skills.join(", ")}
                  </p>
                </div>
              )}

              {/* Custom Sections */}
              {previewResume.customSections &&
                previewResume.customSections.length > 0 &&
                previewResume.customSections.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="mb-2 font-semibold uppercase text-xs tracking-wide">
                      {section.title}
                    </h3>
                    <div className="space-y-2">
                      {section.items.map((item, iidx) => (
                        <div key={iidx}>
                          <p className="font-medium">{item.label}</p>
                          {item.description && (
                            <p className="text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewResume(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
