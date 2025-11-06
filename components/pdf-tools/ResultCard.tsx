"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2, TrendingDown, FileCheck } from "lucide-react";
import { getDownloadURL } from "@/actions/pdf/download";
import { toast } from "sonner";

interface ResultCardProps {
  result: {
    success: boolean;
    operation_id?: string;
    filename?: string;
    size?: number;
    url?: string;
    originalSize?: number;
    compressedSize?: number;
    reduction?: number;
    metadata?: Record<string, any>;
    directDownload?: boolean;
    data?: string; // base64 data for direct download
    contentType?: string;
  };
  operation: string;
}

export function ResultCard({ result, operation }: ResultCardProps) {
  const [downloading, setDownloading] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      let base64Data: string;
      let contentType: string;
      let filename: string;

      // Check if it's a direct download (data already in result)
      if (result.directDownload && result.data) {
        base64Data = result.data;
        contentType = result.contentType || 'application/octet-stream';
        filename = result.filename || 'download';
      } else {
        // Normal download from storage
        if (!result.url) {
          toast.error('URL file tidak tersedia');
          return;
        }

        const response = await getDownloadURL(result.url);
        
        if (response.error) {
          toast.error(response.error);
          return;
        }

        base64Data = response.data!;
        contentType = response.contentType || 'application/pdf';
        filename = response.filename || result.filename || 'document.pdf';
      }

      // Convert base64 to blob and trigger download
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('File berhasil didownload!');
    } catch (error) {
      toast.error('Gagal download file');
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

  const getOperationTitle = () => {
    switch (operation) {
      case 'merge': return 'PDF Berhasil Digabung!';
      case 'compress': return 'PDF Berhasil Dikompres!';
      case 'convert': return 'File Berhasil Diconvert!';
      default: return 'Operasi Berhasil!';
    }
  };

  return (
    <Card className="p-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
      <div className="space-y-4">
        {/* Success Header */}
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              {getOperationTitle()}
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              File siap didownload
            </p>
          </div>
        </div>

        {/* File Info */}
        <div className="rounded-lg bg-white dark:bg-gray-900 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Nama File:</span>
            <span className="text-sm font-medium">{result.filename}</span>
          </div>

          {result.size && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ukuran:</span>
              <span className="text-sm font-medium">{formatFileSize(result.size)}</span>
            </div>
          )}

          {/* Compression Stats */}
          {operation === 'compress' && result.originalSize && result.compressedSize && (
            <>
              <div className="border-t pt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <TrendingDown className="h-4 w-4 text-green-600" />
                  <span>Hasil Kompresi:</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Ukuran Awal</p>
                    <p className="text-lg font-bold">{formatFileSize(result.originalSize)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ukuran Akhir</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatFileSize(result.compressedSize)}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {result.reduction}% lebih kecil
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Merge Stats */}
          {operation === 'merge' && result.metadata && (
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                <FileCheck className="h-4 w-4 text-blue-600" />
                <span>Info Penggabungan:</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                {result.metadata.fileCount && (
                  <li>• {result.metadata.fileCount} file berhasil digabung</li>
                )}
                <li>• Page numbering telah ditambahkan</li>
                <li>• Format PDF/A (optimal untuk aplikasi)</li>
              </ul>
            </div>
          )}

          {/* PDF to Image Stats */}
          {result.directDownload && result.metadata?.convertedFormat === 'images_zip' && (
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                <FileCheck className="h-4 w-4 text-purple-600" />
                <span>Info Konversi:</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Setiap halaman PDF → 1 file JPG</li>
                <li>• Semua gambar dalam 1 file ZIP</li>
                <li>• Kualitas tinggi untuk print/posting</li>
                <li>• Extract ZIP untuk akses gambar individual</li>
              </ul>
            </div>
          )}
        </div>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full"
          size="lg"
        >
          {downloading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download File
            </>
          )}
        </Button>

        {/* Info */}
        <p className="text-xs text-center text-muted-foreground">
          {result.directDownload 
            ? 'File langsung di-download tanpa disimpan di server (lebih aman & cepat)'
            : 'File akan otomatis terhapus setelah 7 hari untuk keamanan data Anda'
          }
        </p>
      </div>
    </Card>
  );
}
