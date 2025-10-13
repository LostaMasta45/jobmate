"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Trash2, Eye, Copy, Calendar, Building2, Briefcase } from "lucide-react";
import { listEmailDrafts } from "@/actions/email/list";
import { deleteEmailDraft } from "@/actions/email/delete";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EmailDraft {
  id: string;
  email_type: string;
  position: string;
  company_name: string;
  subject_line: string;
  body_content: string;
  tone_style: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function EmailHistory() {
  const [drafts, setDrafts] = useState<EmailDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDraft, setSelectedDraft] = useState<EmailDraft | null>(null);

  useEffect(() => {
    fetchDrafts();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDrafts();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  async function fetchDrafts() {
    try {
      const result = await listEmailDrafts();
      if (result.error) {
        console.error("Error fetching drafts:", result.error);
        setDrafts([]);
      } else {
        setDrafts(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching drafts:", error);
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus email ini?")) return;
    
    try {
      const result = await deleteEmailDraft(id);
      if (result.error) {
        toast.error("Gagal menghapus: " + result.error);
      } else {
        toast.success("Email berhasil dihapus");
        fetchDrafts();
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Terjadi kesalahan");
    }
  }

  async function handleCopy(draft: EmailDraft) {
    const fullEmail = `Subject: ${draft.subject_line}\n\n${draft.body_content}`;
    try {
      await navigator.clipboard.writeText(fullEmail);
      toast.success("Email berhasil dicopy!");
    } catch (error) {
      toast.error("Gagal copy email");
    }
  }

  const getEmailTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      application: 'Lamaran',
      follow_up: 'Follow-up',
      thank_you: 'Thank You',
      inquiry: 'Inquiry'
    };
    return labels[type] || type;
  };

  const getEmailTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      application: 'bg-blue-100 text-blue-700',
      follow_up: 'bg-amber-100 text-amber-700',
      thank_you: 'bg-green-100 text-green-700',
      inquiry: 'bg-purple-100 text-purple-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-4" />
            <div className="h-3 bg-muted rounded w-1/2 mb-2" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Mail className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Belum Ada Email Tersimpan</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Buat email pertamamu dengan Email Generator
            </p>
          </div>
          <Link href="/tools/email-generator">
            <Button className="mt-4 gap-2">
              <Mail className="h-4 w-4" />
              Buat Email Baru
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {drafts.map((draft) => (
          <Card
            key={draft.id}
            className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/50"
          >
            {/* Gradient Background Accent */}
            <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-blue-400 to-blue-600" />
            
            <div className="relative p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="rounded-xl p-3 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                
                <div className="flex flex-col gap-1.5 flex-1">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full w-fit ${getEmailTypeColor(draft.email_type)}`}>
                    {getEmailTypeLabel(draft.email_type)}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 w-fit">
                    {draft.tone_style}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {draft.company_name}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4 flex-shrink-0 text-primary/70" />
                    <span className="line-clamp-1 font-medium">{draft.position}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>
                      {formatDistanceToNow(new Date(draft.created_at), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </span>
                  </div>
                  
                  {/* Subject Preview */}
                  <div className="text-xs text-muted-foreground border-l-2 border-primary/30 pl-2 py-1">
                    <p className="line-clamp-2 italic">{draft.subject_line}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 font-medium shadow-sm"
                  onClick={() => setSelectedDraft(draft)}
                >
                  <Eye className="h-4 w-4 mr-1.5" />
                  Lihat
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(draft)}
                  title="Copy Email"
                  className="shadow-sm"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(draft.id)}
                  title="Hapus"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 shadow-sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!selectedDraft} onOpenChange={() => setSelectedDraft(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Preview Email
            </DialogTitle>
            <DialogDescription>
              {selectedDraft?.company_name} - {selectedDraft?.position}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDraft && (
            <div className="space-y-4 mt-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Subject:</p>
                <p className="font-semibold text-lg">{selectedDraft.subject_line}</p>
              </div>
              
              <hr />
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Body:</p>
                <div className="whitespace-pre-wrap text-sm leading-relaxed p-4 rounded-lg bg-muted/30">
                  {selectedDraft.body_content}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleCopy(selectedDraft)} className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copy Email
                </Button>
                <Button variant="outline" onClick={() => setSelectedDraft(null)}>
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
