"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AdminApplication } from "@/actions/admin/admin-applications";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    MapPin,
    DollarSign,
    User,
    Mail,
    Building2,
    Briefcase,
    FileText
} from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface JobTrackerDetailModalProps {
    application: AdminApplication | null;
    isOpen: boolean;
    onClose: () => void;
}

export function JobTrackerDetailModal({
    application,
    isOpen,
    onClose
}: JobTrackerDetailModalProps) {
    if (!application) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Applied": return "bg-blue-500/10 text-blue-500 border-blue-200";
            case "Screening": return "bg-purple-500/10 text-purple-500 border-purple-200";
            case "Interview": return "bg-yellow-500/10 text-yellow-500 border-yellow-200";
            case "Offer": return "bg-orange-500/10 text-orange-500 border-orange-200";
            case "Hired": return "bg-green-500/10 text-green-500 border-green-200";
            case "Rejected": return "bg-red-500/10 text-red-500 border-red-200";
            default: return "bg-gray-500/10 text-gray-500 border-gray-200";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Application Details</span>
                        <Badge variant="outline" className={`${getStatusColor(application.status)} border px-3 py-1 text-xs uppercase tracking-wide`}>
                            {application.status}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* User Section */}
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                            <AvatarImage src={application.user_avatar} />
                            <AvatarFallback>{application.user_name?.substring(0, 2) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-muted-foreground">Applicant</p>
                            <h4 className="font-bold text-foreground truncate">{application.user_name || 'Unknown User'}</h4>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{application.user_email || 'No email'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Job Details */}
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Building2 className="h-4 w-4" /> Company
                                </div>
                                <p className="font-semibold">{application.company}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Briefcase className="h-4 w-4" /> Position
                                </div>
                                <p className="font-semibold">{application.position}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" /> Applied Date
                                </div>
                                <p className="font-medium">
                                    {application.apply_date ? format(new Date(application.apply_date), "dd MMM yyyy") : "-"}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <DollarSign className="h-4 w-4" /> Salary
                                </div>
                                <p className="font-medium">
                                    {application.salary ?
                                        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(application.salary)
                                        : "-"}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" /> Source
                                </div>
                                <p className="font-medium">{application.source || "-"}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" /> Created At
                                </div>
                                <p className="font-medium text-muted-foreground">
                                    {format(new Date(application.created_at), "dd MMM yyyy HH:mm")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {application.notes && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-200 dark:border-yellow-900/30">
                            <div className="flex items-center gap-2 text-sm font-semibold text-yellow-700 dark:text-yellow-500 mb-2">
                                <FileText className="h-4 w-4" /> Notes
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{application.notes}</p>
                        </div>
                    )}

                    {/* Poster Preview (if any) */}
                    {application.poster_path && (
                        <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Job Poster</p>
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                                {/* 
                          Note: In a real implementation we need to resolve the full URL for Supabase storage 
                          Currently assume poster_path might be relative or full URL.
                          If relative, we'd need NEXT_PUBLIC_SUPABASE_URL + storage path.
                          Accessing storage directly here for simplicity if it's a full URL or handle appropriately.
                      */}
                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                    Poster Preview Available (Click to view)
                                    {/* Use regular img or Next Image if fully resolved URL */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
