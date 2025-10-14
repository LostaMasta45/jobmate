"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadZone } from "../UploadZone";
import { ResultCard } from "../ResultCard";
import { wordToPDF, imagesToPDF, pdfToWord } from "@/actions/pdf/convert";
import { toast } from "sonner";
import { FileImage, FileEdit, AlertCircle } from "lucide-react";

interface UploadedFile {
  fileId: string;
  filename: string;
  size: number;
  type: string;
  path: string;
}

export function ConvertTool() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("word-to-pdf");

  const handleWordToPDF = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Upload file Word (.docx)');
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const result = await wordToPDF(uploadedFiles[0].fileId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Word berhasil diconvert ke PDF!');
        setResult(result);
        setUploadedFiles([]);
      }
    } catch (error: any) {
      toast.error('Gagal convert Word ke PDF');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleImagesToPDF = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Upload minimal 1 gambar');
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const fileIds = uploadedFiles.map(f => f.fileId);
      const result = await imagesToPDF(fileIds, {
        orientation: 'portrait',
        pageSize: 'fit',
        margin: 5,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${uploadedFiles.length} gambar berhasil diconvert ke PDF!`);
        setResult(result);
        setUploadedFiles([]);
      }
    } catch (error: any) {
      toast.error('Gagal convert gambar ke PDF');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handlePDFToWord = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Upload file PDF');
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const result = await pdfToWord(uploadedFiles[0].fileId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('PDF berhasil diconvert ke Word!');
        setResult(result);
        setUploadedFiles([]);
      }
    } catch (error: any) {
      toast.error('Gagal convert PDF ke Word');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-green-100 dark:bg-green-900 p-2">
              <FileImage className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">Convert File</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Convert Word, Image, atau PDF ke format yang dibutuhkan
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => {
        setActiveTab(v);
        setUploadedFiles([]);
        setResult(null);
      }}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="word-to-pdf">Word → PDF</TabsTrigger>
          <TabsTrigger value="image-to-pdf">Image → PDF</TabsTrigger>
          <TabsTrigger value="pdf-to-word">PDF → Word</TabsTrigger>
        </TabsList>

        <TabsContent value="word-to-pdf" className="space-y-6">
          <Card className="p-6">
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Kapan digunakan:</strong> Convert CV atau Cover Letter dari Word ke PDF untuk aplikasi kerja. 
                Semua formatting, font, dan gambar akan dipertahankan.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold">Upload File Word</h3>
              <UploadZone
                accept={{ 
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                  'application/msword': ['.doc']
                }}
                maxFiles={1}
                onFilesUploaded={setUploadedFiles}
                uploadedFiles={uploadedFiles}
              />

              {uploadedFiles.length > 0 && (
                <Button 
                  onClick={handleWordToPDF}
                  disabled={processing}
                  className="w-full"
                  size="lg"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <FileEdit className="h-4 w-4 mr-2" />
                      Convert ke PDF
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="image-to-pdf" className="space-y-6">
          <Card className="p-6">
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Kapan digunakan:</strong> Convert scan ijazah, sertifikat, atau KTP dari foto ke PDF profesional. 
                Bisa upload multiple images sekaligus.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold">Upload Gambar (JPG, PNG)</h3>
              <UploadZone
                accept={{ 
                  'image/jpeg': ['.jpg', '.jpeg'],
                  'image/png': ['.png'],
                  'image/heic': ['.heic'],
                  'image/webp': ['.webp'],
                }}
                maxFiles={10}
                onFilesUploaded={setUploadedFiles}
                uploadedFiles={uploadedFiles}
              />

              {uploadedFiles.length > 0 && (
                <>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium">Preview:</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {uploadedFiles.length} gambar akan dijadikan {uploadedFiles.length} halaman PDF
                    </p>
                  </div>

                  <Button 
                    onClick={handleImagesToPDF}
                    disabled={processing}
                    className="w-full"
                    size="lg"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <FileImage className="h-4 w-4 mr-2" />
                        Convert {uploadedFiles.length} Gambar ke PDF
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="pdf-to-word" className="space-y-6">
          <Card className="p-6">
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Kapan digunakan:</strong> Edit CV atau dokumen yang sudah dalam format PDF. 
                Hasil convert bisa diedit di Microsoft Word.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold">Upload File PDF</h3>
              <UploadZone
                accept={{ 'application/pdf': ['.pdf'] }}
                maxFiles={1}
                onFilesUploaded={setUploadedFiles}
                uploadedFiles={uploadedFiles}
              />

              {uploadedFiles.length > 0 && (
                <Button 
                  onClick={handlePDFToWord}
                  disabled={processing}
                  className="w-full"
                  size="lg"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <FileEdit className="h-4 w-4 mr-2" />
                      Convert ke Word (.docx)
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Result */}
      {result && <ResultCard result={result} operation="convert" />}
    </div>
  );
}
