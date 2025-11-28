"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Trash2,
  Check,
  X,
  Calendar,
  Mail,
  MessageSquare,
  Shield
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800 text-xs px-2 py-0.5 font-medium">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 text-xs px-2 py-0.5 font-medium">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 text-xs px-2 py-0.5 font-medium">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
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
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-900/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Applications</p>
                <h3 className="text-2xl font-bold mt-1 text-blue-900 dark:text-blue-100">{stats.total}</h3>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-900/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending</p>
                <h3 className="text-2xl font-bold mt-1 text-yellow-900 dark:text-yellow-100">{stats.pending}</h3>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl text-yellow-600 dark:text-yellow-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-900/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Approved</p>
                <h3 className="text-2xl font-bold mt-1 text-green-900 dark:text-green-100">{stats.approved}</h3>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-900/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Rejected</p>
                <h3 className="text-2xl font-bold mt-1 text-red-900 dark:text-red-100">{stats.rejected}</h3>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl text-red-600 dark:text-red-400">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/30 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            Application List
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background h-9 text-sm"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-36 bg-background h-9 text-sm">
                <div className="flex items-center gap-2">
                   <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                   <SelectValue placeholder="Filter" />
                </div>
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="divide-y divide-border/50">
           {/* Header - Desktop Only */}
          <div className="hidden sm:grid grid-cols-12 gap-4 p-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
             <div className="col-span-4 pl-2">Applicant Info</div>
             <div className="col-span-3">Contact</div>
             <div className="col-span-2">Status</div>
             <div className="col-span-2">Date</div>
             <div className="col-span-1 text-right pr-2">Action</div>
          </div>

          <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
            {filteredApplications.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-semibold">No applications found</h3>
                <p className="text-muted-foreground text-xs max-w-xs mt-1">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            ) : (
              filteredApplications.map((app) => (
                <div 
                  key={app.id} 
                  className="group relative flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 p-4 sm:p-3 hover:bg-muted/30 transition-colors items-start sm:items-center"
                >
                  {/* Mobile: Top Row (User + Action) */}
                  <div className="flex items-center justify-between w-full sm:hidden mb-2">
                     <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border bg-muted">
                          <AvatarFallback className="text-xs font-medium text-primary">
                            {app.full_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm truncate max-w-[150px]">
                             {app.full_name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                             @{app.username}
                          </span>
                        </div>
                     </div>
                     
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewProof(app.proof_path)}>
                           <Eye className="w-4 h-4 mr-2" />
                           View Proof
                        </DropdownMenuItem>
                        
                        {app.status === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(app.id)} className="text-green-600 focus:text-green-600">
                               <Check className="w-4 h-4 mr-2" />
                               Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setRejectingId(app.id);
                                setRejectReason("");
                              }} 
                              className="text-red-600 focus:text-red-600"
                            >
                               <X className="w-4 h-4 mr-2" />
                               Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => {
                            setDeletingId(app.id);
                            setDeleteReason("");
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Desktop: Applicant Info col-span-4 */}
                  <div className="hidden sm:flex col-span-4 items-center gap-3 pl-2 min-w-0">
                    <Avatar className="h-8 w-8 border bg-muted shrink-0">
                      <AvatarFallback className="text-xs font-medium text-primary">
                        {app.full_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-sm truncate block text-foreground">
                          {app.full_name}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="truncate max-w-[140px]">@{app.username}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shared: Contact col-span-3 */}
                  <div className="col-span-3 w-full sm:w-auto flex flex-col gap-1 pl-12 sm:pl-0">
                     <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3 shrink-0" />
                        <span className="truncate max-w-[200px]">{app.email}</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MessageSquare className="w-3 h-3 shrink-0" />
                        <span className="truncate max-w-[200px]">{app.whatsapp}</span>
                     </div>
                  </div>

                  {/* Shared: Status col-span-2 */}
                  <div className="col-span-2 w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 sm:gap-0 pl-12 sm:pl-0 mt-2 sm:mt-0">
                     <span className="text-xs text-muted-foreground sm:hidden">Status:</span>
                     {getStatusBadge(app.status)}
                  </div>

                  {/* Shared: Date col-span-2 */}
                  <div className="col-span-2 w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 sm:gap-0 pl-12 sm:pl-0">
                     <span className="text-xs text-muted-foreground sm:hidden">Date:</span>
                     <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(app.created_at), "dd MMM yyyy")}</span>
                     </div>
                  </div>

                  {/* Desktop: Action col-span-1 */}
                  <div className="hidden sm:flex col-span-1 justify-end pr-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewProof(app.proof_path)}>
                           <Eye className="w-4 h-4 mr-2" />
                           View Proof
                        </DropdownMenuItem>
                        
                        {app.status === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(app.id)} className="text-green-600 focus:text-green-600">
                               <Check className="w-4 h-4 mr-2" />
                               Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setRejectingId(app.id);
                                setRejectReason("");
                              }} 
                              className="text-red-600 focus:text-red-600"
                            >
                               <X className="w-4 h-4 mr-2" />
                               Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => {
                            setDeletingId(app.id);
                            setDeleteReason("");
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Mobile: Rejection Reason (if any) */}
                  {app.status === "rejected" && app.rejection_reason && (
                     <div className="col-span-12 w-full pl-12 sm:pl-0 mt-1">
                        <p className="text-xs text-red-500/80 bg-red-50 dark:bg-red-900/10 p-2 rounded-md border border-red-100 dark:border-red-900/30">
                           <strong>Reason:</strong> {app.rejection_reason}
                        </p>
                     </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Reject Dialog */}
      <Dialog
        open={!!rejectingId}
        onOpenChange={(open) => {
          if (!open) {
            setRejectingId(null);
            setRejectReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Input
                id="reason"
                placeholder="e.g. Incomplete payment proof"
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
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => rejectingId && handleReject(rejectingId)}
              disabled={loading === rejectingId}
            >
              {loading === rejectingId ? "Rejecting..." : "Reject Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={!!deletingId}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingId(null);
            setDeleteReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
               <Shield className="w-5 h-5" />
               Delete Application
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this application?
              <br />
              <span className="text-destructive font-semibold">
                This action cannot be undone.
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
              <Label htmlFor="delete-reason">Reason (Optional)</Label>
              <Input
                id="delete-reason"
                placeholder="e.g. Duplicate, Spam"
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
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingId && handleDelete(deletingId)}
              disabled={loading === deletingId}
            >
              {loading === deletingId ? "Deleting..." : "Yes, Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Proof Modal */}
      <Dialog open={showProofModal} onOpenChange={setShowProofModal}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/95 border-none">
          <div className="relative w-full h-full min-h-[50vh] flex items-center justify-center">
            {proofUrl ? (
              <img
                src={proofUrl}
                alt="Proof of Transfer"
                className="max-h-[85vh] w-auto object-contain"
              />
            ) : (
               <div className="text-white">Loading...</div>
            )}
             <Button 
               variant="ghost" 
               size="icon" 
               className="absolute top-2 right-2 text-white/70 hover:text-white hover:bg-white/20 rounded-full"
               onClick={() => setShowProofModal(false)}
             >
                <X className="w-5 h-5" />
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
