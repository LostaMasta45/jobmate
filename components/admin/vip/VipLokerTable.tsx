"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteLoker, updateLokerStatus, bulkDeleteLoker, bulkUpdateLokerStatus } from "@/actions/admin/vip-loker";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

interface Loker {
  id: string;
  title: string;
  perusahaan: { name: string; lokasi?: string | null } | null;
  perusahaan_name?: string; // fallback
  lokasi?: string | null;
  tipe_kerja?: string | null;
  gaji_text?: string | null;
  status: string;
  sumber?: string;
  created_at: string;
  kategori?: string[];
}

export function VipLokerTable({ lokerList }: { lokerList: Loker[] }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  // Filter logic
  const filteredData = lokerList.filter((item) => {
    const matchSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.perusahaan?.name || item.perusahaan_name || "").toLowerCase().includes(search.toLowerCase());
    
    const matchStatus = filterStatus === "all" || item.status === filterStatus;
    const matchType = filterType === "all" || item.tipe_kerja === filterType;

    return matchSearch && matchStatus && matchType;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    
    try {
      // Assuming you have this action, or replace with direct supabase call if needed in client component (not recommended)
      // better to pass a server action prop or import it
       const result = await deleteLoker(id);
       if (result?.success) {
         toast.success("Job deleted successfully");
         // Simple way to refresh without router.refresh() if the parent doesn't handle it
         window.location.reload(); 
       } else {
         toast.error("Failed to delete job");
       }
    } catch (e) {
      console.error(e);
      toast.error("Error deleting job");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
        const result = await updateLokerStatus(id, newStatus);
        if (result?.success) {
            toast.success(`Status updated to ${newStatus}`);
            window.location.reload();
        } else {
            toast.error("Failed to update status");
        }
    } catch (e) {
        toast.error("Error updating status");
    }
  };

  // Selection helpers
  const isAllSelected = filteredData.length > 0 && filteredData.every(item => selectedIds.has(item.id));
  const isPartialSelected = filteredData.some(item => selectedIds.has(item.id)) && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(item => item.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Yakin ingin menghapus ${selectedIds.size} lowongan kerja yang dipilih?`)) return;

    setIsBulkLoading(true);
    try {
      const result = await bulkDeleteLoker(Array.from(selectedIds));
      if (result?.success) {
        toast.success(`${result.deleted} lowongan berhasil dihapus`);
        setSelectedIds(new Set());
        window.location.reload();
      } else {
        toast.error("Gagal menghapus lowongan");
      }
    } catch (e) {
      toast.error("Error menghapus lowongan");
    } finally {
      setIsBulkLoading(false);
    }
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedIds.size === 0) return;

    setIsBulkLoading(true);
    try {
      const result = await bulkUpdateLokerStatus(Array.from(selectedIds), newStatus);
      if (result?.success) {
        toast.success(`${result.updated} lowongan diubah ke ${newStatus}`);
        setSelectedIds(new Set());
        window.location.reload();
      } else {
        toast.error("Gagal mengubah status");
      }
    } catch (e) {
      toast.error("Error mengubah status");
    } finally {
      setIsBulkLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">Published</Badge>;
      case "draft":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400">Draft</Badge>;
      case "closed":
        return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200 dark:bg-red-900/30 dark:text-red-400">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl font-semibold">Job Listings</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40 bg-background/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
             <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40 bg-background/50">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full Time">Full Time</SelectItem>
                <SelectItem value="Part Time">Part Time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Bulk Action Bar */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="sticky top-0 z-20 bg-primary text-primary-foreground p-3 flex flex-wrap items-center justify-between gap-3 border-b"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={toggleSelectAll}
                  className="border-primary-foreground data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
                />
                <span className="font-medium text-sm">
                  {selectedIds.size} lowongan dipilih
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="h-7 text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <X className="w-4 h-4 mr-1" />
                  Batal
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Select onValueChange={handleBulkStatusChange} disabled={isBulkLoading}>
                  <SelectTrigger className="w-36 h-8 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground text-sm">
                    <SelectValue placeholder="Ubah Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Publish</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="draft">
                      <div className="flex items-center gap-2">
                        <Edit className="w-4 h-4 text-gray-600" />
                        <span>Draft</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="closed">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-amber-600" />
                        <span>Closed</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={isBulkLoading}
                  className="h-8"
                >
                  {isBulkLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-1" />
                  )}
                  Hapus ({selectedIds.size})
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table Header with Select All */}
        {filteredData.length > 0 && selectedIds.size === 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 border-b border-border/40">
            <Checkbox
              checked={isAllSelected}
              ref={(el) => {
                if (el) {
                  (el as HTMLButtonElement).dataset.state = isPartialSelected ? 'indeterminate' : isAllSelected ? 'checked' : 'unchecked';
                }
              }}
              onCheckedChange={toggleSelectAll}
              className="data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
            />
            <span className="text-sm text-muted-foreground">
              Pilih semua ({filteredData.length} lowongan)
            </span>
          </div>
        )}

        <div className="space-y-1">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.id}
                className={`group flex flex-col sm:flex-row sm:items-start justify-between p-4 hover:bg-accent/40 transition-colors border-b border-border/40 last:border-0 ${
                  selectedIds.has(item.id) ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-start gap-4 mb-4 sm:mb-0 flex-1">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={() => toggleSelect(item.id)}
                      className="mt-1"
                    />
                    <Avatar className="h-12 w-12 border bg-muted rounded-xl">
                      <AvatarFallback className="rounded-xl font-bold text-primary text-lg">
                        {(item.perusahaan?.name || item.perusahaan_name || "?").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base truncate max-w-[300px]" title={item.title}>
                        {item.title}
                      </h3>
                      {getStatusBadge(item.status)}
                      {item.sumber === 'Poster' && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 text-[10px] px-1.5 py-0">
                          <Sparkles className="w-3 h-3 mr-1" /> AI Parsed
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[150px]">{item.perusahaan?.name || item.perusahaan_name || "Unknown Company"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[150px]">{item.lokasi || item.perusahaan?.lokasi || "-"}</span>
                      </div>
                      {item.tipe_kerja && (
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>{item.tipe_kerja}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span suppressHydrationWarning>Posted {new Date(item.created_at).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start sm:mt-1">
                    <Link href={`/loker/${item.id}`} target="_blank">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" title="View Live">
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/admin/vip-loker/${item.id}/edit`}>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" title="Edit">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {item.status !== "published" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(item.id, "published")}>
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                            Publish
                          </DropdownMenuItem>
                      )}
                       {item.status !== "draft" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(item.id, "draft")}>
                            <Edit className="w-4 h-4 mr-2 text-gray-600" />
                            Move to Draft
                          </DropdownMenuItem>
                      )}
                      {item.status !== "closed" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(item.id, "closed")}>
                            <XCircle className="w-4 h-4 mr-2 text-amber-600" />
                            Close Job
                          </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No jobs found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mt-1">
                {search || filterStatus !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "Start by adding a new job posting."}
              </p>
              {(search || filterStatus !== "all") ? null : (
                   <Link href="/admin/vip-loker/tambah" className="mt-4">
                    <Button>Create Job</Button>
                   </Link>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
