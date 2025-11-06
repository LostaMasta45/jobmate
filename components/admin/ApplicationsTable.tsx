"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { approveApplication, rejectApplication, deleteApplication, getProofSignedUrl } from "@/actions/admin";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Application = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  whatsapp: string;
  status: string;
  proof_path: string;
  rejection_reason?: string;
  created_at: string;
};

export function ApplicationsTable({ applications }: { applications: Application[] }) {
  const [filter, setFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState<string | null>(null);
  const [proofUrl, setProofUrl] = React.useState<string | null>(null);
  const [showProofModal, setShowProofModal] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState("");
  const [rejectingId, setRejectingId] = React.useState<string | null>(null);
  const [deleteReason, setDeleteReason] = React.useState("");
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const filteredApplications = React.useMemo(() => {
    let filtered = applications;
    
    // Filter by status
    if (filter !== "all") {
      filtered = filtered.filter((app) => app.status === filter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          (app.full_name || "").toLowerCase().includes(query) ||
          (app.email || "").toLowerCase().includes(query) ||
          (app.username || "").toLowerCase().includes(query) ||
          (app.whatsapp || "").includes(query)
      );
    }
    
    return filtered;
  }, [applications, filter, searchQuery]);

  const handleApprove = async (id: string) => {
    if (!confirm("Yakin ingin menyetujui pengajuan ini?")) return;
    
    setLoading(id);
    try {
      await approveApplication(id);
      alert("Pengajuan berhasil disetujui!");
      window.location.reload();
    } catch (error) {
      alert("Gagal menyetujui: " + (error as Error).message);
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) {
      alert("Alasan penolakan wajib diisi");
      return;
    }

    setLoading(id);
    try {
      await rejectApplication(id, rejectReason);
      alert("Pengajuan berhasil ditolak!");
      setRejectingId(null);
      setRejectReason("");
      window.location.reload();
    } catch (error) {
      alert("Gagal menolak: " + (error as Error).message);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(id);
    try {
      await deleteApplication(id, deleteReason.trim() || undefined);
      alert("Pengajuan berhasil dihapus!");
      setDeletingId(null);
      setDeleteReason("");
      window.location.reload();
    } catch (error) {
      alert("Gagal menghapus: " + (error as Error).message);
    } finally {
      setLoading(null);
    }
  };

  const handleViewProof = async (filePath: string) => {
    try {
      const url = await getProofSignedUrl(filePath);
      setProofUrl(url);
      setShowProofModal(true);
    } catch (error) {
      alert("Gagal memuat bukti: " + (error as Error).message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const stats = React.useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((a) => a.status === "pending").length,
      approved: applications.filter((a) => a.status === "approved").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
    };
  }, [applications]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground mt-1">Total Pengajuan</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow border-yellow-200 dark:border-yellow-900">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-sm text-muted-foreground mt-1">Pending</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow border-green-200 dark:border-green-900">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-sm text-muted-foreground mt-1">Approved</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow border-red-200 dark:border-red-900">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-sm text-muted-foreground mt-1">Rejected</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({applications.length})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
          >
            Pending ({stats.pending})
          </Button>
          <Button
            variant={filter === "approved" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("approved")}
          >
            Approved ({stats.approved})
          </Button>
          <Button
            variant={filter === "rejected" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("rejected")}
          >
            Rejected ({stats.rejected})
          </Button>
        </div>
        
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by name, email, username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium">Nama</th>
                  <th className="p-4 text-left text-sm font-medium">Username</th>
                  <th className="p-4 text-left text-sm font-medium">Email</th>
                  <th className="p-4 text-left text-sm font-medium">WhatsApp</th>
                  <th className="p-4 text-left text-sm font-medium">Status</th>
                  <th className="p-4 text-left text-sm font-medium">Tanggal</th>
                  <th className="p-4 text-left text-sm font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.id} className="border-b">
                      <td className="p-4 text-sm">{app.full_name}</td>
                      <td className="p-4 text-sm">{app.username}</td>
                      <td className="p-4 text-sm">{app.email}</td>
                      <td className="p-4 text-sm">{app.whatsapp}</td>
                      <td className="p-4">{getStatusBadge(app.status)}</td>
                      <td className="p-4 text-sm">
                        {format(new Date(app.created_at), "dd MMM yyyy")}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProof(app.proof_path)}
                          >
                            Lihat Bukti
                          </Button>
                          {app.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(app.id)}
                                disabled={loading === app.id}
                              >
                                ✓ Setujui
                              </Button>
                              <Dialog
                                open={rejectingId === app.id}
                                onOpenChange={(open) => {
                                  setRejectingId(open ? app.id : null);
                                  if (!open) setRejectReason("");
                                }}
                              >
                                <DialogTrigger asChild>
                                  <button
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-3"
                                    disabled={loading === app.id}
                                  >
                                    ✗ Tolak
                                  </button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Tolak Pengajuan</DialogTitle>
                                    <DialogDescription>
                                      Masukkan alasan penolakan untuk {app.full_name}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="reason">Alasan Penolakan *</Label>
                                      <Input
                                        id="reason"
                                        placeholder="Contoh: Data tidak lengkap"
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setRejectingId(null);
                                        setRejectReason("");
                                      }}
                                    >
                                      Batal
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleReject(app.id)}
                                      disabled={loading === app.id}
                                    >
                                      {loading === app.id ? "Menolak..." : "Tolak"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </>
                          )}
                          {app.status === "rejected" && app.rejection_reason && (
                            <span className="text-xs text-muted-foreground">
                              Alasan: {app.rejection_reason}
                            </span>
                          )}
                          {/* Delete Button - Available for ALL statuses */}
                          <Dialog
                            open={deletingId === app.id}
                            onOpenChange={(open) => {
                              setDeletingId(open ? app.id : null);
                              if (!open) setDeleteReason("");
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                disabled={loading === app.id}
                              >
                                🗑️ Hapus
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="text-destructive">⚠️ Hapus Pengajuan</DialogTitle>
                                <DialogDescription>
                                  Apakah Anda yakin ingin menghapus pengajuan dari <strong>{app.full_name}</strong>?
                                  <br />
                                  <br />
                                  <span className="text-destructive font-semibold">
                                    Data ini akan dihapus permanen dan tidak dapat dikembalikan!
                                  </span>
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="rounded-lg bg-muted p-4 space-y-1 text-sm">
                                  <p><strong>Nama:</strong> {app.full_name}</p>
                                  <p><strong>Email:</strong> {app.email}</p>
                                  <p><strong>Username:</strong> {app.username}</p>
                                  <p><strong>WhatsApp:</strong> {app.whatsapp}</p>
                                  <p><strong>Status:</strong> {app.status}</p>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="delete-reason">
                                    Alasan Penghapusan <span className="text-muted-foreground">(opsional)</span>
                                  </Label>
                                  <Input
                                    id="delete-reason"
                                    placeholder="Contoh: Data duplikat, spam, dll"
                                    value={deleteReason}
                                    onChange={(e) => setDeleteReason(e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setDeletingId(null);
                                    setDeleteReason("");
                                  }}
                                >
                                  Batal
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDelete(app.id)}
                                  disabled={loading === app.id}
                                >
                                  {loading === app.id ? "Menghapus..." : "Ya, Hapus Permanen"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showProofModal} onOpenChange={setShowProofModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Bukti Transfer</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            {proofUrl && (
              <img
                src={proofUrl}
                alt="Bukti Transfer"
                className="max-h-[70vh] w-auto rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
