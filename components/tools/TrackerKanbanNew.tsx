"use client";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState, useMemo, useTransition, useEffect } from "react";
import { reorderApplications } from "@/actions/tools";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Briefcase, Calendar, DollarSign, MapPin, MoreVertical } from "lucide-react";
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
  status: string; // Allow any string, we'll filter to Status types
  order_index: number;
  salary?: number;
  contact?: string;
  source?: string;
  apply_date: string;
  notes?: string;
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

export function TrackerKanbanNew({
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
  // Kelompokkan data awal per status + sort by order_index
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
    // Sort by order_index within each column
    for (const k in base) {
      base[k as Status].sort((a, b) => a.order_index - b.order_index);
    }
    return base;
  }, [initialData]);

  const [columns, setColumns] = useState(grouped);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setColumns(grouped);
  }, [grouped]);

  // Stats for header
  const stats = useMemo(
    () => ({
      total: Object.values(columns).flat().length,
      inProcess:
        columns.Applied.length +
        columns.Screening.length +
        columns.Interview.length +
        columns.Offer.length,
      accepted: columns.Hired.length,
      rejected: columns.Rejected.length,
    }),
    [columns]
  );

  function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;

    if (!destination) return; // dropped outside

    const srcCol = source.droppableId as Status;
    const destCol = destination.droppableId as Status;

    // no move
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
      next[srcCol] = srcList;

      const destList = Array.from(next[destCol]);
      destList.splice(destination.index, 0, { ...moved, status: destCol });

      // Re-index order_index locally
      next[destCol] = destList.map((it, idx) => ({ ...it, order_index: idx }));
      next[srcCol] = next[srcCol].map((it, idx) => ({ ...it, order_index: idx }));

      return next;
    });

    // Persist ke server (non-blocking)
    startTransition(async () => {
      try {
        // Build ordering arrays for both affected columns
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
        // Fallback: reload on error
        window.location.reload();
      }
    });
  }

  // Don't render until mounted to avoid SSR issues
  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {STATUSES.map((status) => (
          <Card key={status.key} className="min-h-[240px]">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold">{status.label}</h4>
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
        {/* Mobile: Vertical Stack */}
        <div className="md:hidden space-y-3">
          {STATUSES.map((status) => (
            <Droppable droppableId={status.key} key={status.key} type="CARD">
              {(provided, snapshot) => (
                <Card
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "min-h-[240px] transition-all duration-200",
                    snapshot.isDraggingOver && "ring-2 ring-primary bg-primary/5"
                  )}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2 h-2 rounded-full ${status.color}`} />
                      <h4 className="text-sm font-semibold">{status.label}</h4>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {columns[status.key].length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {columns[status.key].map((app, index) => (
                        <Draggable draggableId={app.id} index={index} key={app.id}>
                          {(dragProvided, dragSnapshot) => (
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
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {columns[status.key].length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[120px] text-center">
                          <Briefcase className="h-8 w-8 text-muted-foreground/30 mb-2" />
                          <p className="text-xs text-muted-foreground/70">Drop kartu di sini</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </Droppable>
          ))}
        </div>

        {/* Tablet: 2 Columns Grid */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-3">
          {STATUSES.map((status) => (
            <Droppable droppableId={status.key} key={status.key} type="CARD">
              {(provided, snapshot) => (
                <Card
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "min-h-[240px] transition-all duration-200",
                    snapshot.isDraggingOver && "ring-2 ring-primary bg-primary/5"
                  )}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2 h-2 rounded-full ${status.color}`} />
                      <h4 className="text-sm font-semibold">{status.label}</h4>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {columns[status.key].length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {columns[status.key].map((app, index) => (
                        <Draggable draggableId={app.id} index={index} key={app.id}>
                          {(dragProvided, dragSnapshot) => (
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
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {columns[status.key].length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[120px] text-center">
                          <Briefcase className="h-8 w-8 text-muted-foreground/30 mb-2" />
                          <p className="text-xs text-muted-foreground/70">Drop kartu di sini</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </Droppable>
          ))}
        </div>

        {/* Desktop: 3 Columns Grid */}
        <div className="hidden lg:grid xl:hidden grid-cols-3 gap-3">
          {STATUSES.map((status) => (
            <Droppable droppableId={status.key} key={status.key} type="CARD">
              {(provided, snapshot) => (
                <Card
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "min-h-[240px] transition-all duration-200",
                    snapshot.isDraggingOver && "ring-2 ring-primary bg-primary/5"
                  )}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2 h-2 rounded-full ${status.color}`} />
                      <h4 className="text-sm font-semibold">{status.label}</h4>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {columns[status.key].length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {columns[status.key].map((app, index) => (
                        <Draggable draggableId={app.id} index={index} key={app.id}>
                          {(dragProvided, dragSnapshot) => (
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
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {columns[status.key].length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[120px] text-center">
                          <Briefcase className="h-8 w-8 text-muted-foreground/30 mb-2" />
                          <p className="text-xs text-muted-foreground/70">Drop kartu di sini</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </Droppable>
          ))}
        </div>

        {/* Large Desktop: All 6 Columns Horizontal */}
        <div className="hidden xl:flex gap-3 overflow-x-auto pb-2">
          {STATUSES.map((status) => (
            <Droppable droppableId={status.key} key={status.key} type="CARD">
              {(provided, snapshot) => (
                <div className="min-w-[240px] flex-1">
                  <Card
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "h-full min-h-[280px] transition-all duration-200",
                      snapshot.isDraggingOver && "ring-2 ring-primary bg-primary/5"
                    )}
                  >
                    <CardContent className="p-3 flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-2 h-2 rounded-full ${status.color}`} />
                        <h4 className="text-sm font-semibold">{status.label}</h4>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {columns[status.key].length}
                        </Badge>
                      </div>
                      <div className="space-y-2 flex-1">
                        {columns[status.key].map((app, index) => (
                          <Draggable draggableId={app.id} index={index} key={app.id}>
                            {(dragProvided, dragSnapshot) => (
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
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {columns[status.key].length === 0 && (
                          <div className="flex flex-col items-center justify-center h-[120px] text-center">
                            <Briefcase className="h-8 w-8 text-muted-foreground/30 mb-2" />
                            <p className="text-xs text-muted-foreground/70">Drop kartu di sini</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
