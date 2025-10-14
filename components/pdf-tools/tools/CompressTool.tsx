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
import { Minimize2, AlertCircle, TrendingDown } from "lucide-react";

interface UploadedFile {
  fileId: string;
  filename: string;
  size: number;
  type: string;
  path: string;
}

export function CompressTool() {
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
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-purple-100 dark:bg-purple-900 p-2">
              <Minimize2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">Kompres PDF</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Kurangi ukuran file PDF untuk memenuhi limit job portal
              </p>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Kapan digunakan:</strong> Saat file portfolio terlalu besar (&gt;2MB) dan job portal membatasi ukuran upload. 
              Kompres tanpa kehilangan kualitas signifikan.
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
            maxFiles={1}
            onFilesUploaded={setUploadedFiles}
            uploadedFiles={uploadedFiles}
          />
        </div>
      </Card>

      {/* Compression Options */}
      {currentFile && (
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">File Info</h3>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium">{currentFile.filename}</p>
                <p className="text-2xl font-bold mt-2 text-primary">
                  {formatFileSize(currentFile.size)}
                </p>
                {currentFile.size > 2 * 1024 * 1024 && (
                  <p className="text-xs text-destructive mt-1">
                    ⚠️ File terlalu besar untuk kebanyakan job portal (max 2MB)
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Level Kompresi</Label>
              
              <RadioGroup 
                value={compressionLevel} 
                onValueChange={(v) => setCompressionLevel(v as any)}
                className="space-y-3"
              >
                <div className="flex items-center space-between border rounded-lg p-4 has-[[data-state=checked]]:border-primary">
                  <div className="flex items-center space-x-3 flex-1">
                    <RadioGroupItem value="low" id="low" />
                    <div className="flex-1">
                      <Label htmlFor="low" className="font-medium">
                        Low Compression (Ringan)
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pengurangan ~40% • Kualitas sangat tinggi • Terbaik untuk gambar/foto
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ~{formatFileSize(getEstimatedSize(currentFile.size))}
                    </p>
                    <p className="text-xs text-muted-foreground">hasil</p>
                  </div>
                </div>

                <div className="flex items-center space-between border rounded-lg p-4 has-[[data-state=checked]]:border-primary">
                  <div className="flex items-center space-x-3 flex-1">
                    <RadioGroupItem value="recommended" id="recommended" />
                    <div className="flex-1">
                      <Label htmlFor="recommended" className="font-medium">
                        Recommended (Direkomendasikan) ✓
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pengurangan ~60% • Kualitas bagus • Balance terbaik
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      ~{formatFileSize(getEstimatedSize(currentFile.size))}
                    </p>
                    <p className="text-xs text-muted-foreground">hasil</p>
                  </div>
                </div>

                <div className="flex items-center space-between border rounded-lg p-4 has-[[data-state=checked]]:border-primary">
                  <div className="flex items-center space-x-3 flex-1">
                    <RadioGroupItem value="extreme" id="extreme" />
                    <div className="flex-1">
                      <Label htmlFor="extreme" className="font-medium">
                        Extreme Compression (Maksimal)
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pengurangan ~80% • Kualitas cukup • Untuk text-only PDF
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">
                      ~{formatFileSize(getEstimatedSize(currentFile.size))}
                    </p>
                    <p className="text-xs text-muted-foreground">hasil</p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Expected Result */}
            <div className="rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 p-4 border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-purple-600" />
                <p className="text-sm font-semibold">Estimasi Hasil Kompresi:</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Ukuran Awal</p>
                  <p className="text-lg font-bold">{formatFileSize(currentFile.size)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">→</p>
                  <p className="text-2xl">🗜️</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ukuran Akhir</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatFileSize(getEstimatedSize(currentFile.size))}
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCompress}
              disabled={processing}
              className="w-full"
              size="lg"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Mengompres PDF...
                </>
              ) : (
                <>
                  <Minimize2 className="h-4 w-4 mr-2" />
                  Kompres PDF
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Result */}
      {result && <ResultCard result={result} operation="compress" />}
    </div>
  );
}
