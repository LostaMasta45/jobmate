"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, FileDown, FileText, Sparkles } from "lucide-react";
import { generateCoverLetter } from "@/lib/coverLetterGenerator";
import { generateModernCoverLetter } from "@/lib/modernCoverLetterGenerator";
import { exportCoverLetterToPDF } from "@/lib/exportCoverLetterPDF";
import { exportCoverLetterToWord } from "@/lib/exportCoverLetterWord";
import { TemplateSelector } from "../TemplateSelector";

interface StepPreviewProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function StepPreview({ formData, updateFormData }: StepPreviewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(formData.templateType || "T0");
  const [downloading, setDownloading] = useState(false);
  
  // Update form data when template changes
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    updateFormData({ templateType: templateId });
  };
  
  // Generate content based on template type
  const isATSTemplate = selectedTemplate === "T0";
  
  const generatedContent = isATSTemplate 
    ? generateCoverLetter(formData)
    : generateModernCoverLetter({
        templateId: selectedTemplate,
        ...formData
      });
  
  // Download handlers
  const handleDownloadPDF = () => {
    setDownloading(true);
    try {
      const filename = `Surat_Lamaran_${formData.companyName?.replace(/[^a-zA-Z0-9]/g, '_')}_${formData.position?.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      exportCoverLetterToPDF(generatedContent, filename);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Gagal download PDF");
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };
  
  const handleDownloadWord = () => {
    setDownloading(true);
    try {
      const filename = `Surat_Lamaran_${formData.companyName?.replace(/[^a-zA-Z0-9]/g, '_')}_${formData.position?.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
      exportCoverLetterToWord(generatedContent, filename);
    } catch (error) {
      console.error("Error downloading Word:", error);
      alert("Gagal download Word");
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Pilih Template & Preview</h2>
          <p className="text-sm text-muted-foreground">
            Pilih template profesional dan lihat preview surat lamaran Anda
          </p>
        </div>
      </div>
      
      {/* Template Selector */}
      <TemplateSelector 
        selectedTemplate={selectedTemplate}
        onSelectTemplate={handleTemplateChange}
      />
      
      <div className="flex items-center gap-2 mt-8 mb-4">
        <Eye className="h-6 w-6 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Preview Surat Lamaran</h3>
          <p className="text-sm text-muted-foreground">
            Periksa hasil surat lamaran sebelum menyimpan
          </p>
        </div>
      </div>

      {/* A4 Preview - different rendering based on template */}
      {isATSTemplate ? (
        // ATS Template: Plain text preview
        <Card className="p-0 bg-white overflow-hidden shadow-lg">
          <div 
            className="bg-white text-black mx-auto"
            style={{ 
              width: "210mm",
              minHeight: "297mm",
              maxWidth: "100%",
              padding: "20mm",
              fontFamily: "'Times New Roman', serif",
              fontSize: "11pt",
              lineHeight: "1.5",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)"
            }}
          >
            {generatedContent.split('\n').map((line, index) => {
              const trimmedLine = line.trim();
              if (!trimmedLine) return <br key={index} />;
              
              // Right align first line (city, date)
              if (index === 0 && trimmedLine.includes(',') && trimmedLine.includes('20')) {
                return <p key={index} style={{ textAlign: 'right', marginBottom: '1.5em' }}>{trimmedLine}</p>;
              }
              
              // Lampiran & Perihal
              if (trimmedLine.startsWith('Lampiran') || trimmedLine.startsWith('Perihal')) {
                return <p key={index} style={{ margin: '0.2em 0' }}>{trimmedLine}</p>;
              }
              
              // Kepada Yth
              if (trimmedLine.includes('Kepada Yth')) {
                return <p key={index} style={{ marginTop: '1.5em', marginBottom: '0.3em' }}>{trimmedLine}</p>;
              }
              
              // Dengan hormat - bold
              if (trimmedLine.includes('Dengan hormat')) {
                return <p key={index} style={{ fontWeight: 'bold', marginTop: '1.5em', marginBottom: '1em' }}>{trimmedLine}</p>;
              }
              
              // Data diri lines
              if (trimmedLine.startsWith('Nama:') || trimmedLine.startsWith('Tempat,') || 
                  trimmedLine.startsWith('Alamat:') || trimmedLine.startsWith('Telepon:') || 
                  trimmedLine.startsWith('Email:') || trimmedLine.startsWith('Pendidikan:') || 
                  trimmedLine.startsWith('Status:')) {
                return <p key={index} style={{ margin: '0.2em 0' }}>{trimmedLine}</p>;
              }
              
              // Berikut data diri
              if (trimmedLine.includes('Berikut data diri')) {
                return <p key={index} style={{ marginTop: '1em', marginBottom: '0.5em' }}>{trimmedLine}</p>;
              }
              
              // Hormat saya - bold with space
              if (trimmedLine.includes('Hormat saya')) {
                return <p key={index} style={{ fontWeight: 'bold', marginTop: '2em', marginBottom: '3em' }}>{trimmedLine}</p>;
              }
              
              // Last line (name) - bold
              const allLines = generatedContent.split('\n').filter(l => l.trim());
              if (index === allLines.length - 1) {
                return <p key={index} style={{ fontWeight: 'bold' }}>{trimmedLine}</p>;
              }
              
              // Regular paragraph
              return <p key={index} style={{ textAlign: 'left', marginBottom: '0.8em' }}>{trimmedLine}</p>;
            })}
          </div>
        </Card>
      ) : (
        // Modern Templates: Styled HTML in iframe
        <Card className="p-0 bg-white overflow-hidden shadow-lg">
          <div className="bg-gray-50 p-4">
            <iframe
              srcDoc={generatedContent}
              className="w-full border-0 shadow-md mx-auto"
              style={{
                height: "1122px",
                width: "794px",
                maxWidth: "100%",
                display: "block",
                backgroundColor: "white"
              }}
              title="Cover Letter Preview"
            />
          </div>
        </Card>
      )}
      
      {/* Download Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border-2 border-dashed border-primary/30">
        <div className="text-center sm:text-left">
          <h4 className="font-semibold text-lg mb-1">Download Surat Lamaran</h4>
          <p className="text-sm text-muted-foreground">
            Download surat lamaran Anda dalam format PDF atau Word
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={handleDownloadPDF}
            disabled={downloading}
            size="lg"
            className="gap-2"
          >
            <FileText className="h-5 w-5" />
            Download PDF
          </Button>
          
          <Button
            onClick={handleDownloadWord}
            disabled={downloading}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <FileDown className="h-5 w-5" />
            Download Word
          </Button>
        </div>
      </div>

      {/* Tips Card */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex gap-3">
          <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Tips:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Pilih template yang sesuai dengan industri dan posisi yang Anda lamar</li>
              <li>• Periksa ejaan nama perusahaan dan posisi dengan teliti</li>
              <li>• Pastikan semua data diri sudah benar</li>
              <li>• Anda bisa download sekarang atau setelah menyimpan</li>
              <li>• Format PDF lebih aman untuk dikirim, Word bisa diedit jika diperlukan</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
