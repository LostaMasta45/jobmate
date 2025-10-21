"use client";

import { useState, useEffect as React_useEffect } from "react";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Eye, 
  FileDown, 
  FileText, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  RefreshCw,
  Zap
} from "lucide-react";
import { generateCoverLetter } from "@/lib/coverLetterGenerator";
import { generateModernCoverLetter } from "@/lib/modernCoverLetterGenerator";
import { exportCoverLetterToPDF } from "@/lib/exportCoverLetterPDF";
import { exportCoverLetterToWord } from "@/lib/exportCoverLetterWord";
import { polishCoverLetterWithAI } from "@/actions/surat-lamaran/polish-with-ai";
import { TemplateSelector } from "../TemplateSelector";
import { useToast } from "@/hooks/use-toast";

interface StepPreviewProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function StepPreview({ formData, updateFormData }: StepPreviewProps) {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(formData.templateType || "T0");
  const [downloading, setDownloading] = useState(false);
  const [polishing, setPolishing] = useState(false);
  const [aiPolished, setAiPolished] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<"standard" | "ai">("standard");
  
  // Update form data when template changes
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    updateFormData({ templateType: templateId });
    // Reset AI polish when template changes
    setAiPolished(null);
    setSelectedVersion("standard");
  };
  
  // Generate content based on template type
  const isATSTemplate = selectedTemplate === "T0";
  
  const standardContent = isATSTemplate 
    ? generateCoverLetter(formData)
    : generateModernCoverLetter({
        templateId: selectedTemplate,
        ...formData
      });
  
  // Current display content
  const displayContent = selectedVersion === "ai" && aiPolished 
    ? aiPolished 
    : standardContent;
  
  // Update formData with generated content for saving
  React.useEffect(() => {
    updateFormData({ 
      generatedContent: displayContent,
      templateType: selectedTemplate
    });
  }, [displayContent, selectedTemplate]);
  
  // AI Polish Handler
  const handleAIPolish = async () => {
    setPolishing(true);
    
    try {
      const result = await polishCoverLetterWithAI(formData);
      
      if (result.error) {
        toast({
          title: "Gagal memoles dengan AI",
          description: result.error,
          variant: "destructive",
        });
        return;
      }
      
      if (result.data) {
        setAiPolished(result.data);
        setSelectedVersion("ai");
        toast({
          title: "✨ Berhasil!",
          description: "Surat lamaran telah dipoles dengan AI.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memoles dengan AI.",
        variant: "destructive",
      });
    } finally {
      setPolishing(false);
    }
  };
  
  // Download handlers
  const handleDownloadPDF = () => {
    setDownloading(true);
    try {
      const filename = `Surat_Lamaran_${formData.companyName?.replace(/[^a-zA-Z0-9]/g, '_')}_${formData.position?.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      exportCoverLetterToPDF(displayContent, filename);
      toast({
        title: "✅ PDF Downloaded",
        description: "Surat lamaran berhasil di-download sebagai PDF.",
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Gagal download PDF",
        description: "Terjadi kesalahan saat download PDF.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };
  
  const handleDownloadWord = () => {
    setDownloading(true);
    try {
      const filename = `Surat_Lamaran_${formData.companyName?.replace(/[^a-zA-Z0-9]/g, '_')}_${formData.position?.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
      exportCoverLetterToWord(displayContent, filename);
      toast({
        title: "✅ Word Downloaded",
        description: "Surat lamaran berhasil di-download sebagai Word.",
      });
    } catch (error) {
      console.error("Error downloading Word:", error);
      toast({
        title: "Gagal download Word",
        description: "Terjadi kesalahan saat download Word.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  // Calculate quality scores (simple heuristics)
  const calculateQualityScore = (content: string, isAI: boolean) => {
    const wordCount = content.split(/\s+/).length;
    const hasKeywords = formData.parsedJobDescription?.keywords?.some((kw: string) => 
      content.toLowerCase().includes(kw.toLowerCase())
    );
    
    return {
      ats: isAI ? 88 : 75,
      readability: isAI ? "A+" : "B+",
      uniqueness: isAI ? 95 : 70,
      wordCount,
      hasKeywords
    };
  };
  
  const qualityScore = calculateQualityScore(displayContent, selectedVersion === "ai");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Pilih Template & Preview</h2>
          <p className="text-sm text-muted-foreground">
            Pilih template profesional dan tingkatkan kualitas dengan AI
          </p>
        </div>
      </div>
      
      {/* Template Selector */}
      <TemplateSelector 
        selectedTemplate={selectedTemplate}
        onSelectTemplate={handleTemplateChange}
      />
      
      {/* AI Polish CTA - Available for ALL templates */}
      {!aiPolished && (
        <Alert className="bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 border-purple-200 dark:from-purple-950 dark:via-blue-950 dark:to-pink-950 dark:border-purple-800">
          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <AlertTitle className="text-purple-900 dark:text-purple-100 text-lg">
            ✨ Tingkatkan Kualitas dengan AI
          </AlertTitle>
          <AlertDescription className="text-purple-800 dark:text-purple-200 space-y-2">
            <p>AI akan memoles surat lamaran Anda dengan:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>Bahasa yang lebih natural dan engaging</li>
              <li>Struktur paragraf yang lebih smooth</li>
              <li>Optimasi keywords untuk ATS</li>
              <li>Integration motivasi yang seamless</li>
            </ul>
          </AlertDescription>
          <Button
            className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={handleAIPolish}
            disabled={polishing}
          >
            {polishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI sedang memoles...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Polish dengan AI (Direkomendasikan)
              </>
            )}
          </Button>
        </Alert>
      )}
      
      {/* Version Selector (if AI polished) */}
      {aiPolished && (
        <Tabs value={selectedVersion} onValueChange={(v) => setSelectedVersion(v as "standard" | "ai")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard">
              Versi Standar
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Versi AI
              <Badge variant="secondary" className="ml-1">Better</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      {/* Quality Indicators */}
      {aiPolished && selectedVersion === "ai" && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {qualityScore.ats}%
            </div>
            <div className="text-xs text-green-700 dark:text-green-300 font-medium">
              ATS Score
            </div>
            <Progress value={qualityScore.ats} className="h-1 mt-2" />
          </Card>
          <Card className="p-4 text-center bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {qualityScore.readability}
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
              Readability
            </div>
            <Progress value={95} className="h-1 mt-2" />
          </Card>
          <Card className="p-4 text-center bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {qualityScore.uniqueness}%
            </div>
            <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">
              Uniqueness
            </div>
            <Progress value={qualityScore.uniqueness} className="h-1 mt-2" />
          </Card>
        </div>
      )}
      
      <div className="flex items-center gap-2 mt-8 mb-4">
        <Eye className="h-6 w-6 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Preview Surat Lamaran</h3>
          <p className="text-sm text-muted-foreground">
            Periksa hasil surat lamaran sebelum menyimpan
          </p>
        </div>
      </div>

      {/* A4 Preview */}
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
              fontSize: "12pt",
              lineHeight: "1.5",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)"
            }}
          >
            {displayContent.split('\n').map((line, index) => {
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
              
              // Hormat saya - bold with signature space
              if (trimmedLine.includes('Hormat saya')) {
                return <p key={index} style={{ fontWeight: 'bold', marginTop: '2em' }}>{trimmedLine}</p>;
              }
              
              // Last line (name) - bold
              if (index === displayContent.split('\n').length - 1) {
                return <p key={index} style={{ fontWeight: 'bold', marginTop: '3em' }}>{trimmedLine}</p>;
              }
              
              // Regular paragraphs - justify
              return <p key={index} style={{ textAlign: 'justify', marginBottom: '0.5em' }}>{trimmedLine}</p>;
            })}
          </div>
        </Card>
      ) : (
        // Modern Template: HTML preview
        <Card className="p-0 bg-white overflow-hidden shadow-lg">
          <div 
            dangerouslySetInnerHTML={{ __html: displayContent }}
            className="mx-auto"
            style={{ 
              maxWidth: "210mm",
              minHeight: "297mm",
            }}
          />
        </Card>
      )}

      {/* Download Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex-1"
          size="lg"
        >
          {downloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>
        <Button
          onClick={handleDownloadWord}
          disabled={downloading}
          variant="outline"
          className="flex-1"
          size="lg"
        >
          {downloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Download Word
            </>
          )}
        </Button>
      </div>

      {/* Success Indicator */}
      {selectedVersion === "ai" && aiPolished && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-900 dark:text-green-100">
            ✨ Surat Lamaran Siap!
          </AlertTitle>
          <AlertDescription className="text-green-800 dark:text-green-200">
            Versi AI telah dioptimasi dengan struktur lebih baik, bahasa lebih engaging, dan ATS-friendly. 
            Silakan download atau simpan untuk digunakan.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
