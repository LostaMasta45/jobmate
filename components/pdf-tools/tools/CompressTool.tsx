"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadZone } from "../UploadZone";
import { ResultCard } from "../ResultCard";
import { compressPDF } from "@/actions/pdf/compress";
import { toast } from "sonner";
import { Minimize2, AlertCircle, TrendingDown, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { PDFToolLayout } from "../PDFToolLayout";

interface UploadedFile {
  fileId: string;
  filename: string;
  size: number;
  type: string;
  path: string;
}

interface CompressToolProps {
  onBack: () => void;
}

export function CompressTool({ onBack }: CompressToolProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'recommended' | 'extreme'>('recommended');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getEstimatedSize = (originalSize: number) => {
    const reductions = {
      low: 0.4,
      recommended: 0.6,
      extreme: 0.8,
    };
    return originalSize * (1 - reductions[compressionLevel]);
  };

  const handleCompress = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Upload 1 file PDF untuk dikompres');
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const result = await compressPDF(uploadedFiles[0].fileId, {
        compressionLevel,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`PDF dikompres ${result.reduction}%!`);
        setResult(result);
        setUploadedFiles([]);
      }
    } catch (error: any) {
      toast.error('Gagal mengompres PDF');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const currentFile = uploadedFiles[0];

  return (
    <PDFToolLayout
      title="Kompres PDF"
      description="Kecilkan ukuran file PDF Anda agar mudah di-upload ke portal kerja, tanpa mengorbankan kualitas."
      icon={Minimize2}
      color="text-orange-500"
      onBack={onBack}
      theme="blue"
    >
      <div className="space-y-8 max-w-3xl mx-auto">

        {/* Step 1: Upload */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 font-bold text-sm">1</div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upload Dokumen</h3>
          </div>
          <UploadZone
            accept={{ 'application/pdf': ['.pdf'] }}
            maxFiles={1}
            onFilesUploaded={setUploadedFiles}
            uploadedFiles={uploadedFiles}
          />
        </div>

        {/* Step 2: Options */}
        {currentFile && (
          <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-white/10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 font-bold text-sm">2</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pilih Kualitas</h3>
            </div>

            {/* File Info Check */}
            <div className="p-4 rounded-xl bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                  <Minimize2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{currentFile.filename}</p>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">Ukuran saat ini</p>
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {formatFileSize(currentFile.size)}
              </div>
            </div>

            {/* Compression Options */}
            <RadioGroup
              value={compressionLevel}
              onValueChange={(v) => setCompressionLevel(v as any)}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                {
                  id: 'low',
                  label: 'Ringan',
                  sub: 'Kualitas Tinggi',
                  reduction: '40%',
                  color: 'border-blue-200 dark:border-blue-900',
                  bg: 'hover:bg-blue-50 dark:hover:bg-blue-900/10'
                },
                {
                  id: 'recommended',
                  label: 'Standard',
                  sub: 'Recommended',
                  reduction: '60%',
                  color: 'border-green-200 dark:border-green-900 ring-2 ring-green-500 dark:ring-green-500',
                  bg: 'bg-green-50/50 dark:bg-green-900/10'
                },
                {
                  id: 'extreme',
                  label: 'Ekstrim',
                  sub: 'Size Terkecil',
                  reduction: '80%',
                  color: 'border-orange-200 dark:border-orange-900',
                  bg: 'hover:bg-orange-50 dark:hover:bg-orange-900/10'
                },
              ].map((option) => (
                <label
                  key={option.id}
                  htmlFor={option.id}
                  className={`relative cursor-pointer rounded-2xl border p-4 transition-all ${option.bg} ${compressionLevel === option.id ? option.color : 'border-slate-200 dark:border-zinc-800'}`}
                >
                  <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{option.label}</div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white">-{option.reduction}</div>
                    <div className="text-xs text-slate-500 dark:text-zinc-500 uppercase tracking-wider">{option.sub}</div>
                  </div>
                  {compressionLevel === option.id && (
                    <div className="absolute top-2 right-2 text-green-500">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
                </label>
              ))}
            </RadioGroup>

            {/* Estimated Result Section */}
            <div className="p-6 rounded-2xl bg-slate-100 dark:bg-black/20 text-center">
              <p className="text-sm text-slate-500 dark:text-zinc-500 mb-2">Estimasi Ukuran Akhir</p>
              <div className="flex items-center justify-center gap-4 text-3xl font-black text-slate-900 dark:text-white">
                <span className="line-through opacity-30 text-xl">{formatFileSize(currentFile.size)}</span>
                <ArrowRight className="h-6 w-6 text-orange-500" />
                <span className="text-green-500">{formatFileSize(getEstimatedSize(currentFile.size))}</span>
              </div>
            </div>

            <Button
              onClick={handleCompress}
              disabled={processing}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-xl shadow-orange-500/20 rounded-xl transition-all hover:scale-[1.01]"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Memproses...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Kompres PDF Sekarang <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="pt-8 border-t border-slate-200 dark:border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ResultCard result={result} operation="compress" />
          </div>
        )}

      </div>
    </PDFToolLayout>
  );
}
