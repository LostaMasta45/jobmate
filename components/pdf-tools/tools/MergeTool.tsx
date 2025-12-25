"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadZone } from "../UploadZone";
import { ResultCard } from "../ResultCard";
import { mergePDFs } from "@/actions/pdf/merge";
import { toast } from "sonner";
import { FileText, Download, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { PDFToolLayout } from "../PDFToolLayout";

interface UploadedFile {
  fileId: string;
  filename: string;
  size: number;
  type: string;
  path: string;
}

interface MergeToolProps {
  onBack: () => void;
}

export function MergeTool({ onBack }: MergeToolProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Options
  const [addPageNumbers, setAddPageNumbers] = useState(true);
  const [pageNumberPosition, setPageNumberPosition] = useState<'top' | 'bottom'>('bottom');
  const [pageNumberAlignment, setPageNumberAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [excludeFirstPage, setExcludeFirstPage] = useState(true);

  const handleMerge = async () => {
    if (uploadedFiles.length < 2) {
      toast.error('Upload minimal 2 file PDF untuk digabung');
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const fileIds = uploadedFiles.map(f => f.fileId);

      const result = await mergePDFs(fileIds, {
        addPageNumbers,
        pageNumberPosition,
        pageNumberAlignment,
        excludeFirstPage,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('PDF berhasil digabung!');
        setResult(result);
        setUploadedFiles([]); // Clear uploaded files
      }
    } catch (error: any) {
      toast.error('Gagal menggabungkan PDF');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <PDFToolLayout
      title="Gabung PDF"
      description="Satukan berbagai file lamaran, CV, dan portofolio menjadi satu dokumen profesional yang rapi."
      icon={FileText}
      color="text-red-500"
      onBack={onBack}
    >
      <div className="space-y-8 max-w-4xl mx-auto">

        {/* Step 1: Upload */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 font-bold text-sm">1</div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upload Dokumen</h3>
          </div>
          <UploadZone
            accept={{ 'application/pdf': ['.pdf'] }}
            maxFiles={20}
            onFilesUploaded={setUploadedFiles}
            uploadedFiles={uploadedFiles}
          />
          {uploadedFiles.length > 0 && uploadedFiles.length < 2 && (
            <p className="text-sm text-amber-500 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Minimal 2 file diperlukan untuk menggabungkan PDF.
            </p>
          )}
        </div>

        {/* Step 2: Options (Only visible if files uploaded) */}
        {uploadedFiles.length >= 2 && (
          <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-white/10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 font-bold text-sm">2</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pengaturan Halaman</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5">
              {/* Page Numbers Toggle */}
              <div className="flex items-center justify-between col-span-1 md:col-span-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Nomor Halaman</Label>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">
                    Otomatis tambahkan nomor halaman di setiap lembar
                  </p>
                </div>
                <Switch
                  checked={addPageNumbers}
                  onCheckedChange={setAddPageNumbers}
                  className="data-[state=checked]:bg-red-500"
                />
              </div>

              {addPageNumbers && (
                <>
                  {/* Position */}
                  <div className="space-y-3">
                    <Label>Posisi</Label>
                    <RadioGroup
                      value={pageNumberPosition}
                      onValueChange={(v) => setPageNumberPosition(v as any)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="top" id="top" />
                        <Label htmlFor="top" className="font-normal cursor-pointer">Atas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bottom" id="bottom" />
                        <Label htmlFor="bottom" className="font-normal cursor-pointer">Bawah</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Alignment */}
                  <div className="space-y-3">
                    <Label>Perataan</Label>
                    <RadioGroup
                      value={pageNumberAlignment}
                      onValueChange={(v) => setPageNumberAlignment(v as any)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="left" id="left" />
                        <Label htmlFor="left" className="font-normal cursor-pointer">Kiri</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="center" id="center" />
                        <Label htmlFor="center" className="font-normal cursor-pointer">Tengah</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="right" id="right" />
                        <Label htmlFor="right" className="font-normal cursor-pointer">Kanan</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Exclude First Page */}
                  <div className="flex items-center justify-between col-span-1 md:col-span-2 pt-4 border-t border-slate-200 dark:border-white/5">
                    <div className="space-y-0.5">
                      <Label>Skip Halaman Pertama</Label>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Jangan beri nomor di halaman cover/depan
                      </p>
                    </div>
                    <Switch
                      checked={excludeFirstPage}
                      onCheckedChange={setExcludeFirstPage}
                      className="data-[state=checked]:bg-red-500"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Summary & Action */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-zinc-400 px-2">
                <span>Total {uploadedFiles.length} file</span>
                <span>{formatFileSize(uploadedFiles.reduce((sum, f) => sum + f.size, 0))}</span>
              </div>

              <Button
                onClick={handleMerge}
                disabled={processing}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-xl shadow-red-500/20 rounded-xl transition-all hover:scale-[1.01]"
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Gabungkan PDF Sekarang <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="pt-8 border-t border-slate-200 dark:border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ResultCard result={result} operation="merge" />
          </div>
        )}
      </div>
    </PDFToolLayout>
  );
}
