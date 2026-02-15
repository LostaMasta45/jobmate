"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { TrackerStats } from "./TrackerStats";
import { TrackerTable } from "./TrackerTable";
import { TrackerKanbanFixed } from "./TrackerKanbanFixed";
import { TrackerDetail } from "./TrackerDetail";
import { FollowUpTrackerPanel } from "@/components/followup/FollowUpTrackerPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createJobApplication, deleteJobApplication } from "@/actions/tools";
import { LayoutGrid, List, Plus, Search } from "lucide-react";
import { PosterUpload } from "./PosterUpload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  poster_path?: string;
  created_at: string;
};

type ViewMode = "table" | "kanban";

export function TrackerClient({ applications, userId }: { applications: Application[]; userId: string }) {
  const router = useRouter();
  const [viewMode, setViewMode] = React.useState<ViewMode>("kanban");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [showOnlyWithFollowUps, setShowOnlyWithFollowUps] = React.useState(false);
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [editingApp, setEditingApp] = React.useState<Application | null>(null);
  const [detailApp, setDetailApp] = React.useState<Application | null>(null);
  const [showDetailDialog, setShowDetailDialog] = React.useState(false);
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
    poster_path: undefined as string | undefined,
  });

  // Filter applications
  const filteredApplications = React.useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.position.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setFormData({
      company: app.company,
      position: app.position,
      status: app.status,
      salary: app.salary?.toString() || "",
      contact: app.contact || "",
      source: app.source || "",
      apply_date: app.apply_date,
      notes: app.notes || "",
      poster_path: app.poster_path,
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus lamaran ini?")) return;

    try {
      await deleteJobApplication(id);
      router.refresh(); // Refresh instead of reload
    } catch (error) {
      alert("Gagal menghapus: " + (error as Error).message);
    }
  };

  const handleViewDetail = (app: Application) => {
    setDetailApp(app);
    setShowDetailDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
      };

      await createJobApplication(payload);

      setShowAddDialog(false);
      setEditingApp(null);
      setFormData({
        company: "",
        position: "",
        status: "Applied",
        salary: "",
        contact: "",
        source: "",
        apply_date: new Date().toISOString().split("T")[0],
        notes: "",
        poster_path: undefined,
      });

      router.refresh(); // Refresh instead of reload
    } catch (error) {
      alert("Gagal: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theme-emerald space-y-6">
      <TrackerStats applications={filteredApplications} />

      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        {/* Top Row: Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari perusahaan atau posisi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Screening">Screening</SelectItem>
              <SelectItem value="Interview">Interview</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
              <SelectItem value="Hired">Hired</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bottom Row: Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 rounded-md border p-1 bg-background">
            <Button
              variant={viewMode === "kanban" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Kanban</span>
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Table</span>
            </Button>
          </div>

          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Tambah Lamaran</span>
            <span className="sm:hidden">Tambah</span>
          </Button>
        </div>
      </div>

      {/* Follow-up Reminders Panel */}
      <FollowUpTrackerPanel
        onFilterChange={setShowOnlyWithFollowUps}
      />

      {/* View Content */}
      {viewMode === "kanban" ? (
        <TrackerKanbanFixed
          initialData={filteredApplications}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetail={handleViewDetail}
        />
      ) : (
        <TrackerTable applications={filteredApplications} />
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingApp ? "Edit" : "Tambah"} Lamaran</DialogTitle>
            <DialogDescription>Isi detail lamaran kerja Anda</DialogDescription>
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
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Screening">Screening</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Hired">Hired</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
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
              <textarea
                id="notes"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>

            <PosterUpload
              value={formData.poster_path}
              onChange={(path) =>
                setFormData((prev) => ({ ...prev, poster_path: path }))
              }
              userId={userId}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingApp(null);
                }}
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

      {/* Detail Dialog */}
      <TrackerDetail
        application={detailApp}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
