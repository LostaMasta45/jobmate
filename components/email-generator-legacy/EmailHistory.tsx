"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Trash2, Eye, Copy, Briefcase, Clock, RotateCw, Sparkles, Edit } from "lucide-react";
import { listEmailDrafts } from "@/actions/email/list";
import { deleteEmailDraft } from "@/actions/email/delete";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
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
  job_source?: string;
  created_at: string;
  updated_at: string;
  hrd_name?: string;
  hrd_title?: string;
  your_name?: string;
  current_role?: string;
  years_experience?: number;
  personality?: string;
  length_type?: string;
  highlight_skills?: string[];
  achievements?: string;
  include_why_company?: boolean;
  include_why_you?: boolean;
  has_attachment?: boolean;
}

interface EmailHistoryProps {
  onEdit?: (draft: any) => void;
}

export function EmailHistory({ onEdit }: EmailHistoryProps) {
  const [drafts, setDrafts] = useState<EmailDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<EmailDraft | null>(null);

  useEffect(() => {
    fetchDrafts();
    
    const interval = setInterval(() => {
      fetchDrafts();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  async function fetchDrafts() {
    try {
      const result = await listEmailDrafts();
      if (result.error) {
        console.error("Error:", result.error);
        setDrafts([]);
      } else {
        setDrafts(result.data || []);
      }
    } catch (error) {
      console.error("Error:", error);
      setDrafts([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    await fetchDrafts();
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
      toast.error("Terjadi kesalahan");
    }
  }

  function handleView(draft: EmailDraft) {
    setSelectedDraft(draft);
  }

  function handleEdit(draft: EmailDraft) {
    if (onEdit) {
      // Map draft snake_case keys to camelCase expected by EmailWizard
      const mappedDraft = {
        emailType: draft.email_type,
        position: draft.position,
        companyName: draft.company_name,
        subjectLine: draft.subject_line,
        bodyContent: draft.body_content,
        toneStyle: draft.tone_style,
        jobSource: draft.job_source,
        hrdName: draft.hrd_name,
        hrdTitle: draft.hrd_title,
        yourName: draft.your_name,
        currentRole: draft.current_role,
        yearsExperience: draft.years_experience,
        personality: draft.personality,
        lengthType: draft.length_type,
        highlightSkills: draft.highlight_skills,
        achievements: draft.achievements,
        includeWhyCompany: draft.include_why_company,
        includeWhyYou: draft.include_why_you,
        hasAttachment: draft.has_attachment,
      };
      onEdit(mappedDraft);
    }
  }

  async function handleCopy(content: string) {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Email berhasil dicopy!");
    } catch (error) {
      toast.error("Gagal copy email");
    }
  }

  function formatDate(dateString: string) {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: id,
      });
    } catch {
      return "Baru saja";
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse h-[380px]">
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
      <Card className="p-12 text-center">
        <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-semibold mb-2">Belum Ada Email</h3>
        <p className="text-muted-foreground mb-4">
          Mulai buat email lamaran pertama kamu sekarang
        </p>
        <Button>
          <Sparkles className="h-4 w-4 mr-2" />
          Buat Email Baru
        </Button>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {drafts.map((draft) => (
          <Card key={draft.id} className="relative overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
            {/* Card Header with Badge */}
            <div className="p-4 pb-3 border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex gap-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      draft.email_type === 'application' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      draft.email_type === 'follow_up' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                      draft.email_type === 'thank_you' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                    }`}>
                      {draft.email_type === 'application' && 'Lamaran'}
                      {draft.email_type === 'follow_up' && 'Follow-up'}
                      {draft.email_type === 'thank_you' && 'Thank You'}
                      {draft.email_type === 'inquiry' && 'Inquiry'}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 capitalize">
                      {draft.tone_style}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 space-y-3 flex-1 flex flex-col">
              {/* Company Name - Fixed Height */}
              <h3 className="font-bold text-lg line-clamp-2 leading-tight min-h-[3.5rem]">
                {draft.company_name}
              </h3>

              {/* Position & Date */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="line-clamp-1">{draft.position}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{formatDate(draft.created_at)}</span>
                </div>
              </div>

              {/* Subject Preview - Fixed Height */}
              {draft.subject_line && (
                <div className="p-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg border-l-4 border-primary min-h-[4rem]">
                  <p className="text-sm font-medium line-clamp-2">
                    {draft.subject_line}
                  </p>
                </div>
              )}

              {/* Spacer to push buttons to bottom */}
              <div className="flex-1" />

              {/* Job Source Badge */}
              {draft.job_source && (
                <div className="flex items-center gap-2 pt-2 border-t">
                  <span className="text-xs text-muted-foreground flex-shrink-0">Sumber:</span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 text-blue-700 dark:text-blue-300">
                    {draft.job_source === 'linkedin' && '📱 LinkedIn'}
                    {draft.job_source === 'instagram' && '📷 Instagram'}
                    {draft.job_source === 'jobstreet' && '💼 JobStreet'}
                    {draft.job_source === 'glints' && '✨ Glints'}
                    {draft.job_source === 'kalibrr' && '🎯 Kalibrr'}
                    {draft.job_source === 'company_website' && '🌐 Website'}
                    {draft.job_source === 'referral' && '🤝 Referral'}
                    {draft.job_source === 'job_fair' && '🎪 Job Fair'}
                    {draft.job_source === 'other' && '📋 Lainnya'}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons - Fixed Height */}
            <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 gap-2 h-9"
                  onClick={() => handleEdit(draft)}
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() => handleView(draft)}
                  title="Lihat Preview"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() => handleCopy(draft.body_content || '')}
                  title="Copy Email"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(draft.id)}
                  title="Hapus"
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
                <Button onClick={() => handleCopy(selectedDraft.body_content)} className="gap-2">
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
