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
import { FileText, Download, AlertCircle } from "lucide-react";

interface UploadedFile {
  fileId: string;
  filename: string;
  size: number;
  type: string;
  path: string;
}

export function MergeTool() {
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
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-900 p-2">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">Gabung PDF</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Gabungkan CV, Portfolio, dan Sertifikat menjadi satu PDF profesional
              </p>
            </div>
          </div>

          {/* Use Case Examples */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Kapan digunakan:</strong> Saat HR meminta "1 PDF berisi CV + Portfolio + Sertifikat". 
              Tools ini akan menggabungkan semua file dengan page numbering profesional.
            </AlertDescription>
          </Alert>
        </div>
      </Card>

      {/* Upload Zone */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Upload File PDF</h3>
          <UploadZone
            accept={{ 'application/pdf': ['.pdf'] }}
            maxFiles={20}
            onFilesUploaded={setUploadedFiles}
            uploadedFiles={uploadedFiles}
          />
        </div>
      </Card>

      {/* Options */}
      {uploadedFiles.length >= 2 && (
        <Card className="p-6">
          <div className="space-y-6">
            <h3 className="font-semibold">Opsi Penggabungan</h3>

            {/* Page Numbers */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tambah Nomor Halaman</Label>
                <p className="text-xs text-muted-foreground">
                  Tambahkan nomor halaman pada PDF hasil
                </p>
              </div>
              <Switch 
                checked={addPageNumbers} 
                onCheckedChange={setAddPageNumbers}
              />
            </div>

            {addPageNumbers && (
              <>
                {/* Position */}
                <div className="space-y-3">
                  <Label>Posisi Nomor Halaman</Label>
                  <RadioGroup 
                    value={pageNumberPosition} 
                    onValueChange={(v) => setPageNumberPosition(v as any)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="top" id="top" />
                      <Label htmlFor="top" className="font-normal">
                        Atas Halaman
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bottom" id="bottom" />
                      <Label htmlFor="bottom" className="font-normal">
                        Bawah Halaman (Recommended)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Alignment */}
                <div className="space-y-3">
                  <Label>Perataan</Label>
                  <RadioGroup 
                    value={pageNumberAlignment} 
                    onValueChange={(v) => setPageNumberAlignment(v as any)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="left" id="left" />
                      <Label htmlFor="left" className="font-normal">Kiri</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="center" id="center" />
                      <Label htmlFor="center" className="font-normal">
                        Tengah (Recommended)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="right" id="right" />
                      <Label htmlFor="right" className="font-normal">Kanan</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Exclude First Page */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Kecualikan Halaman Pertama</Label>
                    <p className="text-xs text-muted-foreground">
                      Tidak menambahkan nomor pada halaman pertama (cover page)
                    </p>
                  </div>
                  <Switch 
                    checked={excludeFirstPage} 
                    onCheckedChange={setExcludeFirstPage}
                  />
                </div>
              </>
            )}

            {/* Summary */}
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">Ringkasan:</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• {uploadedFiles.length} file akan digabung</li>
                <li>
                  • Total ukuran: {formatFileSize(
                    uploadedFiles.reduce((sum, f) => sum + f.size, 0)
                  )}
                </li>
                <li>
                  • {addPageNumbers 
                    ? `Page numbers: ${pageNumberPosition}, ${pageNumberAlignment}${excludeFirstPage ? ', skip first page' : ''}`
                    : 'Tanpa page numbers'
                  }
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <Button 
              onClick={handleMerge}
              disabled={processing || uploadedFiles.length < 2}
              className="w-full"
              size="lg"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Menggabungkan PDF...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Gabungkan {uploadedFiles.length} File
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Result */}
      {result && <ResultCard result={result} operation="merge" />}
    </div>
  );
}
