"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2, FileImage, DownloadCloud } from "lucide-react";
import { toast } from "sonner";

interface ImageData {
  pageNumber: number;
  filename: string;
  data: string; // base64
  size: number;
}

interface ImageResultCardProps {
  result: {
    success: boolean;
    operation_id?: string;
    images: ImageData[];
    imageCount: number;
    totalSize: number;
  };
}

export function ImageResultCard({ result }: ImageResultCardProps) {
  const [downloading, setDownloading] = useState<number | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownloadSingle = async (image: ImageData) => {
    setDownloading(image.pageNumber);
    try {
      // Convert base64 to blob
      const byteCharacters = atob(image.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      
      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = image.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`${image.filename} berhasil didownload!`);
    } catch (error) {
      toast.error('Gagal download gambar');
      console.error(error);
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    
    try {
      // Download all images one by one with delay
      for (const image of result.images) {
        const byteCharacters = atob(image.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = image.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      toast.success(`${result.images.length} gambar berhasil didownload!`);
    } catch (error) {
      toast.error('Gagal download semua gambar');
      console.error(error);
    } finally {
      setDownloadingAll(false);
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
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              PDF Berhasil Diconvert ke Gambar!
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              {result.imageCount} halaman siap didownload
            </p>
          </div>
        </div>

        {/* Info Stats */}
        <div className="rounded-lg bg-white dark:bg-gray-900 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Halaman:</span>
            <span className="text-sm font-medium">{result.imageCount} gambar</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Ukuran:</span>
            <span className="text-sm font-medium">{formatFileSize(result.totalSize)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Format:</span>
            <span className="text-sm font-medium">JPG (High Quality)</span>
          </div>
        </div>

        {/* Download All Button */}
        <Button
          onClick={handleDownloadAll}
          disabled={downloadingAll}
          className="w-full"
          size="lg"
        >
          {downloadingAll ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Downloading All...
            </>
          ) : (
            <>
              <DownloadCloud className="h-4 w-4 mr-2" />
              Download Semua Gambar ({result.imageCount})
            </>
          )}
        </Button>

        {/* Individual Image List */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            Download Individual:
          </h4>
          <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
            {result.images.map((image) => (
              <div
                key={image.pageNumber}
                className="flex items-center justify-between bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded bg-blue-100 dark:bg-blue-900 px-2 py-1">
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                      {image.pageNumber}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{image.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(image.size)}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadSingle(image)}
                  disabled={downloading === image.pageNumber}
                >
                  {downloading === image.pageNumber ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
                  ) : (
                    <>
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Info Note */}
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 <strong>Tips:</strong> Download semua gambar sekaligus atau pilih halaman tertentu saja. 
            Gambar berkualitas tinggi dan siap untuk print atau posting.
          </p>
        </div>

        {/* Privacy Info */}
        <p className="text-xs text-center text-muted-foreground">
          File langsung di-download tanpa disimpan di server (lebih aman & cepat)
        </p>
      </div>
    </Card>
  );
}
