"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

type Application = {
  id: string;
  company: string;
  position: string;
  status: string;
  salary?: number;
  contact?: string;
  source?: string;
  apply_date: string;
  notes?: string;
  created_at: string;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Applied: "bg-blue-500",
    Screening: "bg-purple-500",
    Interview: "bg-yellow-500",
    Offer: "bg-orange-500",
    Hired: "bg-green-500",
    Rejected: "bg-red-500",
  };
  return colors[status] || "bg-gray-500";
};

export function TrackerDetail({
  application,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}) {
  if (!application) return null;

  const handleDelete = () => {
    onDelete(application.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{application.company}</DialogTitle>
              <p className="text-muted-foreground">{application.position}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  onEdit(application);
                  onOpenChange(false);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(application.status)}`} />
            <Badge variant="outline" className="text-sm">
              {application.status}
            </Badge>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Tanggal Melamar</span>
              </div>
              <p className="text-sm font-medium ml-6">
                {format(new Date(application.apply_date), "dd MMMM yyyy")}
              </p>
            </div>

            {application.salary && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Gaji</span>
                </div>
                <p className="text-sm font-medium ml-6">
                  Rp {application.salary.toLocaleString("id-ID")}
                </p>
              </div>
            )}

            {application.source && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Sumber</span>
                </div>
                <p className="text-sm font-medium ml-6">{application.source}</p>
              </div>
            )}

            {application.contact && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>Kontak HRD</span>
                </div>
                <p className="text-sm font-medium ml-6">{application.contact}</p>
              </div>
            )}
          </div>

          {application.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Catatan</span>
                </div>
                <p className="text-sm ml-6 whitespace-pre-wrap">{application.notes}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Metadata */}
          <div className="text-xs text-muted-foreground">
            <p>
              Dibuat:{" "}
              {format(new Date(application.created_at), "dd MMMM yyyy, HH:mm")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
