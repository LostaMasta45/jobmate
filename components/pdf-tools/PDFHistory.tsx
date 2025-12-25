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
import { PDFToolLayout } from "./PDFToolLayout";
import { motion, AnimatePresence } from "framer-motion";

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

interface PDFHistoryProps {
  onBack?: () => void;
}

export function PDFHistory({ onBack }: PDFHistoryProps) {
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
        return <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'compress':
        return <Minimize2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case 'convert_office':
      case 'convert_image':
      case 'pdf_to_word':
        return <FileImage className="h-5 w-5 text-green-600 dark:text-green-400" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getOperationColor = (op: string) => {
    switch (op) {
      case 'merge':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'compress':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'convert_office':
      case 'convert_image':
      case 'pdf_to_word':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <PDFToolLayout
      title="Riwayat Operasi"
      description="Akses dan unduh file hasil operasi sebelumnya"
      icon={HistoryIcon}
      color="text-slate-500"
      onBack={onBack}
      theme="blue"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Daftar Aktivitas</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {operations.length > 0 ? `${operations.length} operasi tersimpan` : 'Belum ada aktivitas'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOperations}
            disabled={loading}
            className="border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Memuat riwayat...</p>
          </div>
        ) : operations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-white/5">
            <div className="rounded-full bg-slate-100 dark:bg-white/10 p-4">
              <HistoryIcon className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Belum Ada Riwayat</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Riwayat operasi PDF Anda akan muncul di sini
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {operations.map((operation, index) => (
                <motion.div
                  key={operation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group p-4 transition-all hover:translate-y-[-2px] hover:shadow-lg border-slate-200/60 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      {/* Icon */}
                      <div className={`rounded-xl p-3 transition-transform group-hover:scale-105 ${getOperationColor(operation.operation)}`}>
                        {getOperationIcon(operation.operation)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {getOperationLabel(operation.operation)}
                          </h3>
                          {operation.status === 'completed' && (
                            <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                              <CheckCircle2 className="h-3 w-3" />
                              Selesai
                            </span>
                          )}
                          {operation.status === 'failed' && (
                            <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                              <XCircle className="h-3 w-3" />
                              Gagal
                            </span>
                          )}
                          {operation.status === 'processing' && (
                            <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Memproses
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
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
                            <p className="text-green-600 dark:text-green-400 font-medium">
                              Hemat {operation.metadata.reductionPercent}%
                            </p>
                          )}

                          {operation.metadata?.fileCount && (
                            <p>{operation.metadata.fileCount} file digabung</p>
                          )}

                          {operation.error_message && (
                            <p className="text-red-600 dark:text-red-400 font-medium col-span-full">
                              Error: {operation.error_message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
                        {operation.status === 'completed' && operation.output_file && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(operation)}
                            disabled={downloading === operation.id || deleting === operation.id}
                            className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary h-9"
                          >
                            {downloading === operation.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Download className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Unduh</span>
                              </>
                            )}
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(operation)}
                          disabled={deleting === operation.id}
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 h-9 w-9"
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
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-8">
          File akan otomatis terhapus dari server setelah 7 hari
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
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PDFToolLayout>
  );
}
