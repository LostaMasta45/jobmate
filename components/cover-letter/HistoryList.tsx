"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  History, 
  Download, 
  Trash2, 
  Edit2, 
  X, 
  Check, 
  FileText,
  Clock,
  Eye
} from "lucide-react";
import { deleteTemplate, updateTemplate } from "@/actions/tools";
import { generateCoverLetterPDF } from "@/lib/pdf";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Template {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  metadata?: any;
}

interface HistoryListProps {
  templates: Template[];
  onRefresh: () => void;
  onLoadTemplate: (content: string) => void;
}

export function HistoryList({ templates, onRefresh, onLoadTemplate }: HistoryListProps) {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [loading, setLoading] = React.useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewContent, setPreviewContent] = React.useState("");

  const handleEdit = (template: Template) => {
    setEditingId(template.id);
    setEditTitle(template.title);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle.trim()) return;
    
    setLoading(id);
    try {
      await updateTemplate(id, { title: editTitle });
      setEditingId(null);
      onRefresh();
    } catch (error) {
      alert("Gagal update: " + (error as Error).message);
    } finally {
      setLoading(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus "${title}"?`)) return;
    
    setLoading(id);
    try {
      await deleteTemplate(id);
      onRefresh();
    } catch (error) {
      alert("Gagal hapus: " + (error as Error).message);
    } finally {
      setLoading(null);
    }
  };

  const handleDownloadPDF = (template: Template) => {
    try {
      const filename = `${template.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      generateCoverLetterPDF(template.content, filename);
    } catch (error) {
      alert("Gagal download PDF: " + (error as Error).message);
    }
  };

  const handleDownloadText = (template: Template) => {
    try {
      const blob = new Blob([template.content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${template.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Gagal download: " + (error as Error).message);
    }
  };

  const handlePreview = (template: Template) => {
    setPreviewContent(template.content);
    setPreviewOpen(true);
  };

  if (templates.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary shrink-0" />
            <CardTitle className="text-lg sm:text-xl">Riwayat Generate</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="p-4 rounded-full bg-muted/50">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground">Belum ada riwayat</p>
              <p className="text-sm text-muted-foreground">Generate surat lamaran untuk mulai</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary shrink-0" />
              <CardTitle className="text-lg sm:text-xl">Riwayat Generate</CardTitle>
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {templates.length} surat
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-3 sm:p-4 rounded-lg border hover:border-primary/50 transition-colors group"
              >
                {/* Title */}
                {editingId === template.id ? (
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="h-8 text-sm"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSaveEdit(template.id)}
                      disabled={loading === template.id}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <h3 className="font-medium text-sm sm:text-base mb-1 truncate">
                    {template.title}
                  </h3>
                )}

                {/* Metadata */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Clock className="h-3 w-3 shrink-0" />
                  <span>{format(new Date(template.created_at), "dd MMM yyyy, HH:mm")}</span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreview(template)}
                    className="gap-1.5 text-xs"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Lihat</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onLoadTemplate(template.content)}
                    className="gap-1.5 text-xs"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Gunakan</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(template)}
                    disabled={loading === template.id}
                    className="gap-1.5 text-xs"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadPDF(template)}
                    className="gap-1.5 text-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>PDF</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadText(template)}
                    className="gap-1.5 text-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>TXT</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(template.id, template.title)}
                    disabled={loading === template.id}
                    className="gap-1.5 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview Surat Lamaran</DialogTitle>
            <DialogDescription>
              Lihat isi surat lamaran yang telah dibuat
            </DialogDescription>
          </DialogHeader>
          <div className="whitespace-pre-wrap text-sm leading-relaxed p-4 bg-muted/50 rounded-lg border">
            {previewContent}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
