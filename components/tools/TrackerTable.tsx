"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createJobApplication, updateJobApplication, deleteJobApplication } from "@/actions/tools";
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

type Application = {
  id: string;
  company: string;
  position: string;
  status: string;
  order_index: number;
  salary?: number;
  contact?: string;
  source?: string;
  apply_date: string;
  notes?: string;
  created_at: string;
};

export function TrackerTable({ applications }: { applications: Application[] }) {
  const router = useRouter();
  const [showDialog, setShowDialog] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    company: "",
    position: "",
    status: "Applied",
    salary: "",
    contact: "",
    source: "",
    apply_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
      };

      if (editingId) {
        await updateJobApplication(editingId, payload);
      } else {
        await createJobApplication(payload);
      }

      setShowDialog(false);
      setEditingId(null);
      setFormData({
        company: "",
        position: "",
        status: "Applied",
        salary: "",
        contact: "",
        source: "",
        apply_date: new Date().toISOString().split("T")[0],
        notes: "",
      });
      
      router.refresh(); // Refresh instead of reload
    } catch (error) {
      alert("Gagal: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (app: Application) => {
    setEditingId(app.id);
    setFormData({
      company: app.company,
      position: app.position,
      status: app.status,
      salary: app.salary?.toString() || "",
      contact: app.contact || "",
      source: app.source || "",
      apply_date: app.apply_date,
      notes: app.notes || "",
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;

    try {
      await deleteJobApplication(id);
      router.refresh(); // Refresh instead of reload
    } catch (error) {
      alert("Gagal: " + (error as Error).message);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Applied: "bg-blue-500/10 text-blue-600",
      Screening: "bg-purple-500/10 text-purple-600",
      Interview: "bg-yellow-500/10 text-yellow-600",
      Offer: "bg-orange-500/10 text-orange-600",
      Hired: "bg-green-500/10 text-green-600",
      Rejected: "bg-red-500/10 text-red-600",
    };
    return (
      <Badge variant="outline" className={colors[status] || ""}>
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Daftar Lamaran</CardTitle>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    company: "",
                    position: "",
                    status: "Applied",
                    salary: "",
                    contact: "",
                    source: "",
                    apply_date: new Date().toISOString().split("T")[0],
                    notes: "",
                  });
                }}
              >
                + Tambah Lamaran
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit" : "Tambah"} Lamaran</DialogTitle>
                <DialogDescription>
                  Isi detail lamaran kerja Anda
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">Perusahaan *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, company: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Posisi *</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, position: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, status: e.target.value }))
                      }
                    >
                      <option value="Applied">Applied</option>
                      <option value="Screening">Screening</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apply_date">Tanggal Apply</Label>
                    <Input
                      id="apply_date"
                      type="date"
                      value={formData.apply_date}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, apply_date: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Gaji (Rp)</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={formData.salary}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, salary: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source">Sumber</Label>
                    <Input
                      id="source"
                      placeholder="LinkedIn, JobStreet, dll"
                      value={formData.source}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, source: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Kontak HRD</Label>
                  <Input
                    id="contact"
                    placeholder="Email atau WhatsApp"
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, contact: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, notes: e.target.value }))
                    }
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Menyimpan..." : "Simpan"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">Belum ada data</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="pb-3 text-left text-sm font-medium">Perusahaan</th>
                  <th className="pb-3 text-left text-sm font-medium">Posisi</th>
                  <th className="pb-3 text-left text-sm font-medium">Status</th>
                  <th className="pb-3 text-left text-sm font-medium">Tanggal Apply</th>
                  <th className="pb-3 text-left text-sm font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b last:border-b-0">
                    <td className="py-3 text-sm">{app.company}</td>
                    <td className="py-3 text-sm">{app.position}</td>
                    <td className="py-3">{getStatusBadge(app.status)}</td>
                    <td className="py-3 text-sm">
                      {format(new Date(app.apply_date), "dd MMM yyyy")}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(app)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(app.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
