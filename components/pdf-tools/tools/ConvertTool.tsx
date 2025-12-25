"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadZone } from "../UploadZone";
import { ResultCard } from "../ResultCard";
import { ImageResultCard } from "../ImageResultCard";
import { wordToPDF, imagesToPDF, pdfToWord, pdfToImage } from "@/actions/pdf/convert";
import { toast } from "sonner";
import { FileImage, FileEdit, AlertCircle, ArrowRight, Zap, Image as ImageIcon, FileType } from "lucide-react";
import { PDFToolLayout } from "../PDFToolLayout";

interface UploadedFile {
  fileId: string;
  filename: string;
  size: number;
  type: string;
  path: string;
}

interface ConvertToolProps {
  onBack: () => void;
}

export function ConvertTool({ onBack }: ConvertToolProps) {
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

  const handlePDFToImage = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Upload file PDF');
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const result = await pdfToImage(uploadedFiles[0].fileId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('PDF berhasil diconvert ke gambar!');
        setResult(result);
        setUploadedFiles([]);
      }
    } catch (error: any) {
      toast.error('Gagal convert PDF ke gambar');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <PDFToolLayout
      title="Convert File"
      description="Ubah format dokumen Anda dengan mudah, dari Word ke PDF, Gambar ke PDF, atau sebaliknya."
      icon={FileImage}
      color="text-blue-500"
      onBack={onBack}
      theme="green"
    >
      <div className="space-y-8 max-w-4xl mx-auto">

        <Tabs value={activeTab} onValueChange={(v) => {
          setActiveTab(v);
          setUploadedFiles([]);
          setResult(null);
        }} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 p-1 h-auto bg-slate-100 dark:bg-white/5 rounded-2xl mb-8">
            <TabsTrigger value="word-to-pdf" className="flex flex-col md:flex-row gap-2 py-3 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-lg">
              <FileEdit className="h-4 w-4" />
              <span className="text-xs md:text-sm">Word → PDF</span>
            </TabsTrigger>
            <TabsTrigger value="image-to-pdf" className="flex flex-col md:flex-row gap-2 py-3 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-lg">
              <ImageIcon className="h-4 w-4" />
              <span className="text-xs md:text-sm">Image → PDF</span>
            </TabsTrigger>
            <TabsTrigger value="pdf-to-word" className="flex flex-col md:flex-row gap-2 py-3 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-lg">
              <FileType className="h-4 w-4" />
              <span className="text-xs md:text-sm">PDF → Word</span>
            </TabsTrigger>
            <TabsTrigger value="pdf-to-image" className="flex flex-col md:flex-row gap-2 py-3 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-lg">
              <FileImage className="h-4 w-4" />
              <span className="text-xs md:text-sm">PDF → Image</span>
            </TabsTrigger>
          </TabsList>

          <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-8">
            <TabsContent value="word-to-pdf" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <FileEdit className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Word ke PDF</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">Pertahankan format asli dokumen Anda.</p>
                </div>
              </div>

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
                  className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 rounded-xl transition-all hover:scale-[1.01] mt-6"
                >
                  {processing ? "Converting..." : "Convert ke PDF Sekarang"}
                </Button>
              )}
            </TabsContent>

            <TabsContent value="image-to-pdf" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Image ke PDF</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">Gabungkan foto scan, ijazah, atau KTP.</p>
                </div>
              </div>

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
                <div className="space-y-4 mt-6">
                  <p className="text-sm text-center text-slate-500 dark:text-zinc-400">
                    {uploadedFiles.length} gambar terpilih
                  </p>
                  <Button
                    onClick={handleImagesToPDF}
                    disabled={processing}
                    className="w-full h-14 text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xl shadow-purple-500/20 rounded-xl transition-all hover:scale-[1.01]"
                  >
                    {processing ? "Converting..." : "Convert Gambar ke PDF"}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pdf-to-word" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  <FileType className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">PDF ke Word</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">Edit isi dokumen PDF di Microsoft Word.</p>
                </div>
              </div>

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
                  className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 rounded-xl transition-all hover:scale-[1.01] mt-6"
                >
                  {processing ? "Converting..." : "Convert ke Word"}
                </Button>
              )}
            </TabsContent>

            <TabsContent value="pdf-to-image" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
                  <FileImage className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">PDF ke Image</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">Extract halaman PDF menjadi file JPG.</p>
                </div>
              </div>

              <UploadZone
                accept={{ 'application/pdf': ['.pdf'] }}
                maxFiles={1}
                onFilesUploaded={setUploadedFiles}
                uploadedFiles={uploadedFiles}
              />

              {uploadedFiles.length > 0 && (
                <Button
                  onClick={handlePDFToImage}
                  disabled={processing}
                  className="w-full h-14 text-lg font-bold bg-pink-600 hover:bg-pink-700 text-white shadow-xl shadow-pink-500/20 rounded-xl transition-all hover:scale-[1.01] mt-6"
                >
                  {processing ? "Converting..." : "Convert ke Image (JPG)"}
                </Button>
              )}
            </TabsContent>
          </div>

        </Tabs>

        {/* Result */}
        {result && (
          <div className="pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {result.images ? (
              <ImageResultCard result={result} />
            ) : (
              <ResultCard result={result} operation="convert" />
            )}
          </div>
        )}

      </div>
    </PDFToolLayout>
  );
}
