"use client";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState, useMemo, useTransition, useEffect } from "react";
import { reorderApplications } from "@/actions/tools";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Briefcase, Calendar, DollarSign, MapPin, MoreVertical, Image as ImageIcon } from "lucide-react";
import { PosterViewDialog } from "./PosterViewDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DndPortal } from "./DndPortal";

type AppCard = {
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

type Status = "Applied" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";

const STATUSES: Array<{ key: Status; label: string; color: string }> = [
  { key: "Applied", label: "Applied", color: "bg-blue-500" },
  { key: "Screening", label: "Screening", color: "bg-purple-500" },
  { key: "Interview", label: "Interview", color: "bg-yellow-500" },
  { key: "Offer", label: "Offer", color: "bg-orange-500" },
  { key: "Hired", label: "Hired", color: "bg-green-500" },
  { key: "Rejected", label: "Rejected", color: "bg-red-500" },
];

export function TrackerKanbanFixed({
  initialData,
  onEdit,
  onDelete,
  onViewDetail,
}: {
  initialData: AppCard[];
  onEdit: (app: AppCard) => void;
  onDelete: (id: string) => void;
  onViewDetail: (app: AppCard) => void;
}) {
  // Group data by status + sort by order_index
  const grouped = useMemo(() => {
    const base: Record<Status, AppCard[]> = {
      Applied: [],
      Screening: [],
      Interview: [],
      Offer: [],
      Hired: [],
      Rejected: [],
    };
    for (const a of initialData) {
      if (a.status && base[a.status as Status]) {
        base[a.status as Status].push(a);
      }
    }
    for (const k in base) {
      base[k as Status].sort((a, b) => a.order_index - b.order_index);
    }
    return base;
  }, [initialData]);

  const [columns, setColumns] = useState(grouped);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const [viewPosterApp, setViewPosterApp] = useState<AppCard | null>(null);
  const [showPosterDialog, setShowPosterDialog] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleViewPoster = (app: AppCard) => {
    setViewPosterApp(app);
    setShowPosterDialog(true);
  };

  useEffect(() => {
    setColumns(grouped);
  }, [grouped]);

  function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const srcCol = source.droppableId as Status;
    const destCol = destination.droppableId as Status;

    if (srcCol === destCol && source.index === destination.index) return;

    if (process.env.NODE_ENV === "development") {
      console.log("🎯 Drag End:", {
        draggableId,
        from: srcCol,
        to: destCol,
        sourceIndex: source.index,
        destIndex: destination.index,
      });
    }

    // Optimistic UI update
    setColumns((prev) => {
      const next = { ...prev } as Record<Status, AppCard[]>;
      const srcList = Array.from(next[srcCol]);
      const [moved] = srcList.splice(source.index, 1);
      next[srcCol] = srcList.map((it, idx) => ({ ...it, order_index: idx }));

      const destList = Array.from(next[destCol]);
      destList.splice(destination.index, 0, { ...moved, status: destCol });
      next[destCol] = destList.map((it, idx) => ({ ...it, order_index: idx }));

      return next;
    });

    // Persist to server
    startTransition(async () => {
      try {
        const srcOrdering = columns[srcCol]
          .filter((c) => c.id !== draggableId)
          .map((c, idx) => ({ id: c.id, order_index: idx }));

        const destOrdering = [
          ...columns[destCol]
            .slice(0, destination.index)
            .map((c, idx) => ({ id: c.id, order_index: idx })),
          { id: draggableId, order_index: destination.index },
          ...columns[destCol]
            .slice(destination.index)
            .map((c, idx) => ({ id: c.id, order_index: destination.index + 1 + idx })),
        ];

        await reorderApplications({
          id: draggableId,
          from: srcCol,
          to: destCol,
          ordering: {
            [srcCol]: srcOrdering,
            [destCol]: destOrdering,
          },
        });

        if (process.env.NODE_ENV === "development") {
          console.log("✅ Reorder saved successfully");
        }
      } catch (error) {
        console.error("❌ Failed to save reorder:", error);
        window.location.reload();
      }
    });
  }

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        {STATUSES.map((status) => (
          <Card key={status.key} className="min-h-[400px]">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status.color}`} />
                  <h4 className="text-sm font-semibold">{status.label}</h4>
                </div>
                <Badge variant="secondary" className="text-xs">
                  0
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="jobmate-board-safe">
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Responsive grid - no horizontal scroll needed on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 auto-rows-fr">
          {STATUSES.map((status) => (
            <Droppable droppableId={status.key} key={status.key} type="CARD">
              {(provided, snapshot) => (
                <section
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "rounded-xl border bg-card flex flex-col",
                    "min-h-[400px] max-h-[calc(100vh-280px)]",
                    "overflow-hidden",
                    snapshot.isDraggingOver && "ring-2 ring-primary/40"
                  )}
                >
                  {/* Header */}
                  <header className="px-3 pt-3 pb-2 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${status.color}`} />
                      <h4 className="text-sm font-semibold">{status.label}</h4>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {columns[status.key].length}
                    </Badge>
                  </header>

                  {/* Card List - scrollable */}
                  <div
                    className={cn(
                      "px-3 pb-3 space-y-2 flex-1 overflow-y-auto scrollbar-thin",
                      snapshot.isDraggingOver && "bg-muted/20"
                    )}
                  >
                    {columns[status.key].map((app, index) => (
                      <Draggable draggableId={app.id} index={index} key={app.id}>
                        {(dragProvided, dragSnapshot) => {
                          const card = (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              style={dragProvided.draggableProps.style}
                              className={cn(
                                "rounded-lg bg-background transition-all",
                                dragSnapshot.isDragging && "shadow-2xl ring-2 ring-primary opacity-90"
                              )}
                            >
                              <Card className="cursor-grab hover:shadow-lg hover:border-primary/20 transition-all active:cursor-grabbing group">
                                <CardContent className="p-3">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-sm mb-0.5 truncate group-hover:text-primary transition-colors">
                                        {app.company}
                                      </h4>
                                      <p className="text-xs text-muted-foreground truncate">
                                        {app.position}
                                      </p>
                                    </div>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger
                                        asChild
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                                          <MoreVertical className="h-3.5 w-3.5" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onViewDetail(app)}>
                                          <Briefcase className="h-3.5 w-3.5 mr-2" />
                                          Lihat Detail
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onEdit(app)}>
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => onDelete(app.id)}
                                          className="text-red-600"
                                        >
                                          Hapus
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>

                                  <div className="space-y-1 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                      <Calendar className="h-3 w-3 shrink-0" />
                                      <span className="truncate">
                                        {format(new Date(app.apply_date), "dd MMM yyyy")}
                                      </span>
                                    </div>

                                    {app.salary && (
                                      <div className="flex items-center gap-1.5">
                                        <DollarSign className="h-3 w-3 shrink-0" />
                                        <span className="truncate">
                                          Rp {app.salary.toLocaleString("id-ID")}
                                        </span>
                                      </div>
                                    )}

                                    {app.source && (
                                      <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3 w-3 shrink-0" />
                                        <span className="truncate">{app.source}</span>
                                      </div>
                                    )}

                                    {app.poster_path && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-xs w-full justify-start hover:bg-primary/10"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleViewPoster(app);
                                        }}
                                      >
                                        <ImageIcon className="h-3 w-3 mr-1.5 shrink-0" />
                                        <span className="truncate">Lihat Poster</span>
                                      </Button>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          );

                          // Use portal when dragging
                          return dragSnapshot.isDragging ? <DndPortal>{card}</DndPortal> : card;
                        }}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {columns[status.key].length === 0 && (
                      <div className="flex flex-col items-center justify-center h-32 text-center">
                        <Briefcase className="h-8 w-8 text-muted-foreground/30 mb-2" />
                        <p className="text-xs text-muted-foreground/70">Drop kartu di sini</p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Poster View Dialog */}
      <PosterViewDialog
        posterPath={viewPosterApp?.poster_path}
        company={viewPosterApp?.company || ""}
        position={viewPosterApp?.position || ""}
        open={showPosterDialog}
        onOpenChange={setShowPosterDialog}
      />
    </div>
  );
}
