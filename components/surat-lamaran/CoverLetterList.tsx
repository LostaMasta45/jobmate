"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Download, Edit, Calendar, Building2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface CoverLetter {
  id: string;
  company_name: string;
  position: string;
  template_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function CoverLetterList() {
  const [letters, setLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLetters();
  }, []);

  async function fetchLetters() {
    try {
      const { listCoverLetters } = await import("@/actions/surat-lamaran/list");
      const result = await listCoverLetters();
      
      if (result.error) {
        console.error("Error fetching cover letters:", result.error);
        setLetters([]);
      } else {
        setLetters(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching cover letters:", error);
      setLetters([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus surat lamaran ini?")) return;
    
    try {
      const { deleteCoverLetter } = await import("@/actions/surat-lamaran/delete");
      const result = await deleteCoverLetter(id);
      
      if (result.error) {
        alert("Error: " + result.error);
      } else {
        // Refresh list
        fetchLetters();
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Gagal menghapus surat lamaran");
    }
  }

  async function handleDownload(letter: CoverLetter) {
    try {
      // Get full letter data
      const { getCoverLetter } = await import("@/actions/surat-lamaran/get");
      const result = await getCoverLetter(letter.id);
      
      if (result.error || !result.data) {
        alert("Error: Gagal mengambil data surat");
        return;
      }

      const data = result.data;
      
      // Use generated_content if available, otherwise generate new
      let htmlContent = data.generated_content;
      
      if (!htmlContent) {
        // Generate if not exists
        const { generateCoverLetter } = await import("@/lib/coverLetterGenerator");
        const formData = {
          companyName: data.company_name,
          companyAddress: data.company_address,
          hrdName: data.hrd_name,
          position: data.position,
          jobSource: data.job_source,
          ...data.personal_data,
          ...data.education_data,
          experiences: data.experiences || [],
          attachments: data.attachments || [],
          customAttachments: data.custom_attachments || [],
          includeAttachmentsList: data.include_attachments_list !== false,
          ...data.optional_statements,
          templateType: data.template_type,
        };
        htmlContent = generateCoverLetter(formData);
      }

      // Export to PDF
      const { exportCoverLetterToPDF } = await import("@/lib/exportCoverLetterPDF");
      const filename = `Surat_Lamaran_${data.company_name.replace(/\s+/g, '_')}_${data.position.replace(/\s+/g, '_')}.pdf`;
      
      await exportCoverLetterToPDF(htmlContent, filename);
    } catch (error) {
      console.error("Error downloading:", error);
      alert("Gagal download PDF");
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

  if (letters.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <FileText className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Belum ada surat lamaran</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Mulai buat surat lamaran pertamamu dengan klik tombol "Buat Surat Baru" di atas
            </p>
          </div>
          <Link href="/surat-lamaran/buat">
            <Button className="mt-4">
              <FileText className="mr-2 h-4 w-4" />
              Buat Surat Pertama
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {letters.map((letter) => (
        <Card key={letter.id} className="p-6 hover:shadow-md transition-shadow">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted">
                    {letter.status === 'draft' ? 'Draft' : 'Final'}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="font-semibold line-clamp-1">{letter.company_name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                <Building2 className="h-3 w-3 inline mr-1" />
                {letter.position}
              </p>
              <p className="text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 inline mr-1" />
                {formatDistanceToNow(new Date(letter.created_at), {
                  addSuffix: true,
                  locale: id,
                })}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t">
              <Link href={`/surat-lamaran/${letter.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDownload(letter)}
                title="Download PDF"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDelete(letter.id)}
                title="Hapus"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
