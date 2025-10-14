"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { listPDFOperations, deleteOperation } from "@/actions/pdf/list";
import { getDownloadURL } from "@/actions/pdf/download";
import { 
  FileText, 
  Minimize2, 
  FileImage, 
  Download, 
  Clock, 
  CheckCircle2,
  XCircle,
  Loader2,
  History as HistoryIcon,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";

interface PDFOperation {
  id: string;
  operation: string;
  input_files: string[];
  output_file: string | null;
  file_size: number | null;
  options: Record<string, any>;
  metadata: Record<string, any>;
  status: string;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export function PDFHistory() {
  const [operations, setOperations] = useState<PDFOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [operationToDelete, setOperationToDelete] = useState<PDFOperation | null>(null);

  useEffect(() => {
    fetchOperations();
  }, []);

  const fetchOperations = async () => {
    setLoading(true);
    try {
      const result = await listPDFOperations(20);
      if (result.error) {
        toast.error(result.error);
      } else {
        setOperations(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching operations:', error);
      toast.error('Gagal memuat riwayat');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (operation: PDFOperation) => {
    if (!operation.output_file) return;

    setDownloading(operation.id);
    try {
      const response = await getDownloadURL(operation.output_file);
      
      if (response.error) {
        toast.error(response.error);
        return;
      }

      // Convert base64 to blob and trigger download
      const byteCharacters = atob(response.data!);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: response.contentType || 'application/pdf' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = response.filename || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('File berhasil didownload!');
    } catch (error) {
      toast.error('Gagal download file');
      console.error(error);
    } finally {
      setDownloading(null);
    }
  };

  const openDeleteDialog = (operation: PDFOperation) => {
    setOperationToDelete(operation);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!operationToDelete) return;

    setDeleting(operationToDelete.id);
    setDeleteDialogOpen(false);

    try {
      const response = await deleteOperation(operationToDelete.id);
      
      if (response.error) {
        toast.error(response.error);
        return;
      }

      // Remove from local state
      setOperations(operations.filter(op => op.id !== operationToDelete.id));
      toast.success('Riwayat berhasil dihapus');
    } catch (error) {
      toast.error('Gagal menghapus riwayat');
      console.error(error);
    } finally {
      setDeleting(null);
      setOperationToDelete(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getOperationLabel = (op: string) => {
    const labels: Record<string, string> = {
      merge: 'Gabung PDF',
      compress: 'Kompres PDF',
      convert_office: 'Word → PDF',
      convert_image: 'Image → PDF',
      pdf_to_word: 'PDF → Word',
      split: 'Pisah PDF',
      protect: 'Password',
      watermark: 'Watermark',
      rotate: 'Rotasi',
    };
    return labels[op] || op;
  };

  const getOperationIcon = (op: string) => {
    switch (op) {
      case 'merge':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'compress':
        return <Minimize2 className="h-5 w-5 text-purple-600" />;
      case 'convert_office':
      case 'convert_image':
      case 'pdf_to_word':
        return <FileImage className="h-5 w-5 text-green-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getOperationColor = (op: string) => {
    switch (op) {
      case 'merge':
        return 'bg-blue-100 dark:bg-blue-900';
      case 'compress':
        return 'bg-purple-100 dark:bg-purple-900';
      case 'convert_office':
      case 'convert_image':
      case 'pdf_to_word':
        return 'bg-green-100 dark:bg-green-900';
      default:
        return 'bg-gray-100 dark:bg-gray-900';
    }
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Memuat riwayat...</p>
        </div>
      </Card>
    );
  }

  if (operations.length === 0) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-muted p-4">
            <HistoryIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Belum Ada Riwayat</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Riwayat operasi PDF Anda akan muncul di sini
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Riwayat Operasi PDF</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {operations.length} operasi
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchOperations}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="space-y-3">
          {operations.map((operation) => (
            <Card 
              key={operation.id} 
              className="group p-4 transition-all hover:shadow-md hover:border-primary/20"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`rounded-lg p-2.5 transition-transform group-hover:scale-105 ${getOperationColor(operation.operation)}`}>
                  {getOperationIcon(operation.operation)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">
                      {getOperationLabel(operation.operation)}
                    </h3>
                    {operation.status === 'completed' && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                    {operation.status === 'failed' && (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    {operation.status === 'processing' && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                  </div>

                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(operation.created_at), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </span>
                    </div>

                    {operation.file_size && (
                      <p>Ukuran: {formatFileSize(operation.file_size)}</p>
                    )}

                    {operation.metadata?.reductionPercent && (
                      <p className="text-green-600 font-medium">
                        Kompres: {operation.metadata.reductionPercent}% lebih kecil
                      </p>
                    )}

                    {operation.metadata?.fileCount && (
                      <p>{operation.metadata.fileCount} file digabung</p>
                    )}

                    {operation.error_message && (
                      <p className="text-destructive">{operation.error_message}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {operation.status === 'completed' && operation.output_file && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(operation)}
                      disabled={downloading === operation.id || deleting === operation.id}
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {downloading === operation.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Download className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Download</span>
                        </>
                      )}
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteDialog(operation)}
                    disabled={deleting === operation.id}
                    className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    {deleting === operation.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          File akan otomatis terhapus setelah 7 hari
        </p>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Riwayat?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus riwayat operasi ini? 
              File dan data operasi akan dihapus permanen dan tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
