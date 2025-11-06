"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Download, Edit, Calendar, Building2, FileDown, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [previewLetter, setPreviewLetter] = useState<string | null>(null);

  useEffect(() => {
    fetchLetters();
    
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchLetters();
    }, 30000);
    
    return () => clearInterval(interval);
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

  async function handleDownload(letter: CoverLetter, format: 'pdf' | 'word' = 'pdf') {
    try {
      // Get full letter data
      const { getCoverLetter } = await import("@/actions/surat-lamaran/get");
      const result = await getCoverLetter(letter.id);
      
      if (result.error || !result.data) {
        alert("Error: Gagal mengambil data surat");
        return;
      }

      const data = result.data;
      const templateType = data.template_type || "T0";
      const isATSTemplate = templateType === "T0";
      
      console.log("History Download - Template Type:", templateType);
      console.log("History Download - Has generated_content:", !!data.generated_content);
      console.log("History Download - Content length:", data.generated_content?.length);
      
      // Use generated_content if available, otherwise generate new
      let htmlContent = data.generated_content;
      
      if (!htmlContent) {
        console.log("History Download - No generated_content, regenerating...");
        // Generate based on template type
        const formData = {
          companyName: data.company_name,
          companyAddress: data.company_address,
          hrdName: data.hrd_name,
          position: data.position,
          jobSource: data.job_source,
          jobSourceCustom: data.job_source === "custom" ? data.job_source : "",
          ...data.personal_data,
          ...data.education_data,
          experiences: data.experiences || [],
          experienceType: (data.experiences && data.experiences.length > 0) ? "experienced" : "fresh_graduate",
          attachments: data.attachments || [],
          customAttachments: data.custom_attachments || [],
          includeAttachmentsList: data.include_attachments_list !== false,
          includeAvailability: data.optional_statements?.include_availability !== false,
          includeWillingStatement: data.optional_statements?.include_willing_statement !== false,
          includeOvertimeStatement: data.optional_statements?.include_overtime_statement || false,
          includeCommitmentStatement: data.optional_statements?.include_commitment_statement || false,
          templateType: templateType,
        };
        
        if (isATSTemplate) {
          // Use plain ATS generator
          const { generateCoverLetter } = await import("@/lib/coverLetterGenerator");
          htmlContent = generateCoverLetter(formData);
        } else {
          // Use modern template generator
          const { generateModernCoverLetter } = await import("@/lib/modernCoverLetterGenerator");
          htmlContent = generateModernCoverLetter({
            templateId: templateType,
            ...formData
          });
        }
      }

      // Clean filename
      const cleanName = `Surat_Lamaran_${data.company_name.replace(/[^a-zA-Z0-9]/g, '_')}_${data.position.replace(/[^a-zA-Z0-9]/g, '_')}`;
      
      // Export based on format
      if (format === 'word') {
        const { exportCoverLetterToWord } = await import("@/lib/exportCoverLetterWord");
        exportCoverLetterToWord(htmlContent, `${cleanName}.docx`);
      } else {
        const { exportCoverLetterToPDF } = await import("@/lib/exportCoverLetterPDF");
        exportCoverLetterToPDF(htmlContent, `${cleanName}.pdf`);
      }
    } catch (error) {
      console.error("Error downloading:", error);
      alert(`Gagal download ${format.toUpperCase()}`);
    }
  }

  // Render thumbnail preview - Full A4 Content
  const renderThumbnail = (letter: CoverLetter) => {
    const isATS = letter.template_type === "T0";
    
    return (
      <div 
        className="group/thumb relative w-full cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
        style={{ 
          paddingBottom: '141.4%', // A4 portrait aspect ratio (297/210)
        }}
        onClick={() => setPreviewLetter(letter.id)}
      >
        <div 
          className="absolute inset-0 overflow-auto"
          style={{
            backgroundColor: '#ffffff',
            fontSize: '5px',
            lineHeight: '1.3',
          }}
        >
          {/* Full A4 Preview with all sections */}
          <div 
            style={{
              width: '100%',
              height: '100%',
              padding: '8%',
              fontFamily: isATS ? 'Times New Roman, serif' : 'Arial, sans-serif',
              color: '#1e293b',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            {/* Header with date */}
            <div style={{ marginBottom: '6px' }}>
              <div style={{ textAlign: isATS ? 'left' : 'right', fontSize: '5px', color: '#64748b' }}>
                Jakarta, {new Date(letter.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>

            {/* Recipient */}
            <div style={{ marginBottom: '5px' }}>
              <div style={{ fontSize: '5px', marginBottom: '1px' }}>Kepada Yth.</div>
              <div style={{ fontWeight: 'bold', fontSize: '6px' }}>HRD Manager</div>
              <div style={{ fontSize: '5px' }}>{letter.company_name}</div>
              <div style={{ fontSize: '5px' }}>Di tempat</div>
            </div>

            {/* Subject */}
            <div style={{ marginBottom: '5px' }}>
              <div style={{ fontSize: '5px' }}>
                <strong>Perihal:</strong> Lamaran Kerja - {letter.position}
              </div>
            </div>

            {/* Opening */}
            <div style={{ marginBottom: '5px' }}>
              <div style={{ fontSize: '5px' }}>Dengan hormat,</div>
            </div>

            {/* Main content */}
            <div style={{ fontSize: '5px', lineHeight: 1.4, marginBottom: '5px', textAlign: 'justify' }}>
              Saya yang bertanda tangan di bawah ini ingin mengajukan permohonan untuk dapat bergabung 
              dengan perusahaan yang Bapak/Ibu pimpin pada posisi <strong>{letter.position}</strong>.
            </div>

            {/* Personal Data Box */}
            <div style={{ 
              marginBottom: '5px',
              padding: '4px',
              backgroundColor: isATS ? '#F8FAFC' : '#F0F9FF',
              border: `1px solid ${isATS ? '#E2E8F0' : '#BFDBFE'}`,
              borderRadius: '2px'
            }}>
              <div style={{ 
                fontSize: '6px', 
                fontWeight: 'bold', 
                marginBottom: '3px',
                color: isATS ? '#1e293b' : '#1e40af'
              }}>
                DATA PRIBADI
              </div>
              <div style={{ fontSize: '4.5px', lineHeight: 1.5 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '40% 5% 55%', gap: '1px', marginBottom: '1px' }}>
                  <span>Nama</span>
                  <span>:</span>
                  <strong>[Nama Pelamar]</strong>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '40% 5% 55%', gap: '1px', marginBottom: '1px' }}>
                  <span>Pendidikan</span>
                  <span>:</span>
                  <span>S1 / D3 / SMA/SMK</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '40% 5% 55%', gap: '1px', marginBottom: '1px' }}>
                  <span>No. Handphone</span>
                  <span>:</span>
                  <span>08xx-xxxx-xxxx</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '40% 5% 55%', gap: '1px', marginBottom: '1px' }}>
                  <span>Email</span>
                  <span>:</span>
                  <span>email@domain.com</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '40% 5% 55%', gap: '1px' }}>
                  <span>Alamat</span>
                  <span>:</span>
                  <span>Jl. Contoh No. 123</span>
                </div>
              </div>
            </div>

            {/* Body content */}
            <div style={{ fontSize: '5px', lineHeight: 1.4, marginBottom: '5px', textAlign: 'justify' }}>
              Saya memiliki pengalaman dan keterampilan yang sesuai dengan posisi yang dilamar. 
              Saya siap bekerja keras dan berkontribusi untuk kemajuan perusahaan.
            </div>

            {/* Attachments */}
            <div style={{ marginBottom: '5px' }}>
              <div style={{ 
                fontSize: '6px', 
                fontWeight: 'bold', 
                marginBottom: '2px',
                color: isATS ? '#1e293b' : '#1e40af'
              }}>
                Lampiran:
              </div>
              <ol style={{ paddingLeft: '8px', margin: 0, fontSize: '4.5px', lineHeight: 1.5 }}>
                <li>Curriculum Vitae (CV)</li>
                <li>Fotocopy Ijazah & Transkrip</li>
                <li>Fotocopy KTP</li>
                <li>Pas Foto 4x6</li>
                <li>Surat Keterangan Sehat</li>
              </ol>
            </div>

            {/* Closing */}
            <div style={{ fontSize: '5px', lineHeight: 1.4, marginBottom: '5px' }}>
              Demikian surat lamaran ini saya buat. Besar harapan saya untuk dapat bergabung dengan {letter.company_name}. 
              Terima kasih atas perhatian dan kesempatan yang diberikan.
            </div>

            {/* Signature */}
            <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
              <div style={{ fontSize: '5px' }}>Hormat saya,</div>
              <div style={{ height: '10px' }} /> {/* Space for signature */}
              <div style={{ fontWeight: 'bold', fontSize: '6px' }}>
                [Nama Pelamar]
              </div>
            </div>
          </div>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity group-hover/thumb:opacity-80" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover/thumb:opacity-100">
          <div className="rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm">
            <Eye className="h-5 w-5 text-gray-900" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <p className="truncate text-sm font-semibold drop-shadow-md">
            {isATS ? 'ATS Standard' : 'Modern Template'}
          </p>
        </div>
      </div>
    );
  };

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
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {letters.map((letter) => (
        <Card 
          key={letter.id} 
          className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/50"
        >
          {/* Gradient Background Accent */}
          <div className={`absolute inset-0 opacity-5 ${
            letter.template_type === 'T0' 
              ? 'bg-gradient-to-br from-green-400 to-green-600' 
              : 'bg-gradient-to-br from-purple-400 to-purple-600'
          }`} />
          
          <div className="relative p-5 space-y-4">
            {/* Thumbnail Preview */}
            {renderThumbnail(letter)}

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                letter.status === 'draft' 
                  ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}>
                {letter.status === 'draft' ? 'Draft' : 'Final'}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                letter.template_type === 'T0' 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-purple-100 text-purple-700 border border-purple-300'
              }`}>
                {letter.template_type === 'T0' ? 'ATS' : 'Modern'}
              </span>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {letter.company_name}
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4 flex-shrink-0 text-primary/70" />
                  <span className="line-clamp-1 font-medium">{letter.position}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>
                    {formatDistanceToNow(new Date(letter.created_at), {
                      addSuffix: true,
                      locale: id,
                    })}
                  </span>
                </div>
                
                {/* Download Format Badge */}
                <div className="flex items-center gap-2">
                  <div className={`text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 ${
                    letter.template_type === 'T0'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    <FileDown className="h-3 w-3" />
                    {letter.template_type === 'T0' ? 'PDF & Word' : 'PDF only'}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t">
              <Link href={`/surat-lamaran/${letter.id}`} className="flex-1">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full font-medium shadow-sm"
                >
                  <Edit className="h-4 w-4 mr-1.5" />
                  Edit
                </Button>
              </Link>
              
              {/* Download Button - conditional based on template */}
              {letter.template_type === "T0" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      title="Download PDF atau Word"
                      className="shadow-sm"
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem 
                      onClick={() => handleDownload(letter, 'pdf')}
                      className="cursor-pointer"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDownload(letter, 'word')}
                      className="cursor-pointer"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      Download Word
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownload(letter, 'pdf')}
                  title="Download PDF"
                  className="shadow-sm"
                >
                  <FileDown className="h-4 w-4" />
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDelete(letter.id)}
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
  );
}
