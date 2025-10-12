"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { exportMyData, deleteMyAccount } from "@/actions/settings";
import { toast } from "sonner";
import { Download, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DataSection() {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await exportMyData();
      
      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `jobmate-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Data berhasil diekspor!");
    } catch (error) {
      toast.error("Gagal mengekspor data");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== "HAPUS") {
      toast.error('Ketik "HAPUS" untuk konfirmasi');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteMyAccount();
      toast.success("Akun berhasil dihapus");
      router.push("/login");
    } catch (error) {
      toast.error("Gagal menghapus akun");
      console.error(error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            <CardTitle>Ekspor Data</CardTitle>
          </div>
          <CardDescription>
            Unduh semua data Anda dalam format JSON
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Data yang akan diekspor:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Informasi profil</li>
              <li>Semua lamaran pekerjaan</li>
              <li>Template CV dan cover letter</li>
            </ul>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengekspor...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Ekspor Data
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle>Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Tindakan berbahaya dan tidak dapat dikembalikan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Menghapus akun akan menghapus <strong>semua data</strong> Anda secara permanen.
              Data tidak dapat dipulihkan setelah dihapus.
            </AlertDescription>
          </Alert>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus Akun
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-600">
                  Apakah Anda yakin ingin menghapus akun?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Semua data Anda akan dihapus secara permanen:
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="space-y-4">
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Profil dan pengaturan</li>
                  <li>Semua lamaran pekerjaan</li>
                  <li>Template CV dan cover letter</li>
                  <li>Riwayat aktivitas</li>
                </ul>

                <div className="space-y-2">
                  <Label htmlFor="confirm-delete">
                    Ketik <strong>HAPUS</strong> untuk konfirmasi:
                  </Label>
                  <Input
                    id="confirm-delete"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="HAPUS"
                    className="font-mono"
                  />
                </div>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteConfirmText !== "HAPUS" || isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Ya, Hapus Akun Saya
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
