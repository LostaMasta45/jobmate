"use client";

import { AdminApplication } from "@/actions/admin/admin-applications";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { JobTrackerDetailModal } from "./JobTrackerDetailModal";
import { useRouter, useSearchParams } from "next/navigation";

interface JobTrackerTableProps {
    data: AdminApplication[];
    totalPages: number;
    currentPage: number;
}

export function JobTrackerTable({ data, totalPages, currentPage }: JobTrackerTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedApp, setSelectedApp] = useState<AdminApplication | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Applied": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "Screening": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
            case "Interview": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "Offer": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
            case "Hired": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "Rejected": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`?${params.toString()}`);
    };

    const openDetail = (app: AdminApplication) => {
        setSelectedApp(app);
        setIsDetailOpen(true);
    };

    return (
        <>
            <div className="rounded-xl border shadow-sm bg-card overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[250px]">Applicant</TableHead>
                            <TableHead className="w-[200px]">Company</TableHead>
                            <TableHead className="w-[180px]">Position</TableHead>
                            <TableHead className="w-[120px]">Status</TableHead>
                            <TableHead className="w-[150px]">Applied Date</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No applications found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((app) => (
                                <TableRow key={app.id} className="group hover:bg-muted/50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-border">
                                                <AvatarImage src={app.user_avatar} />
                                                <AvatarFallback>{app.user_name?.substring(0, 2) || "U"}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col max-w-[180px]">
                                                <span className="font-medium text-sm truncate">{app.user_name || "Unknown"}</span>
                                                <span className="text-xs text-muted-foreground truncate">{app.user_email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-foreground/80">{app.company}</TableCell>
                                    <TableCell className="text-muted-foreground">{app.position}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={`${getStatusColor(app.status)} font-semibold`}>
                                            {app.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {app.apply_date ? format(new Date(app.apply_date), "dd MMM yyyy") : "-"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openDetail(app)}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                {/* <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem> */}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-4 border-t bg-muted/20">
                        <div className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <JobTrackerDetailModal
                application={selectedApp}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
            />
        </>
    );
}
