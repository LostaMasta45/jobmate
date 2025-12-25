"use client";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState, useMemo, useTransition, useEffect } from "react";
import { reorderApplications } from "@/actions/tools";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Briefcase, Calendar, DollarSign, MapPin, MoreVertical, Image as ImageIcon, GripVertical } from "lucide-react";
import { PosterViewDialog } from "./PosterViewDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DndPortal } from "./DndPortal";
import { motion } from "framer-motion";

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
  user_id?: string;
};

type Status = "Applied" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";

const STATUSES: Array<{
  key: Status;
  label: string;
  color: string;
  headerColor: string;
  dot: string;
  gradient: string;
  borderColor: string;
  cardBg: string;
}> = [
    {
      key: "Applied",
      label: "Applied",
      color: "bg-blue-500/5 dark:bg-blue-500/10",
      headerColor: "text-blue-700 dark:text-blue-300",
      dot: "bg-blue-500",
      gradient: "from-blue-500/30 to-transparent",
      borderColor: "border-blue-200 dark:border-blue-500/30",
      cardBg: "bg-blue-50/50 dark:bg-blue-900/20"
    },
    {
      key: "Screening",
      label: "Screening",
      color: "bg-purple-500/5 dark:bg-purple-500/10",
      headerColor: "text-purple-700 dark:text-purple-300",
      dot: "bg-purple-500",
      gradient: "from-purple-500/30 to-transparent",
      borderColor: "border-purple-200 dark:border-purple-500/30",
      cardBg: "bg-purple-50/50 dark:bg-purple-900/20"
    },
    {
      key: "Interview",
      label: "Interview",
      color: "bg-yellow-500/5 dark:bg-yellow-500/10",
      headerColor: "text-yellow-700 dark:text-yellow-300",
      dot: "bg-yellow-500",
      gradient: "from-yellow-500/30 to-transparent",
      borderColor: "border-yellow-200 dark:border-yellow-500/30",
      cardBg: "bg-yellow-50/50 dark:bg-yellow-900/20"
    },
    {
      key: "Offer",
      label: "Offer",
      color: "bg-orange-500/5 dark:bg-orange-500/10",
      headerColor: "text-orange-700 dark:text-orange-300",
      dot: "bg-orange-500",
      gradient: "from-orange-500/30 to-transparent",
      borderColor: "border-orange-200 dark:border-orange-500/30",
      cardBg: "bg-orange-50/50 dark:bg-orange-900/20"
    },
    {
      key: "Hired",
      label: "Hired",
      color: "bg-emerald-500/5 dark:bg-emerald-500/10",
      headerColor: "text-emerald-700 dark:text-emerald-300",
      dot: "bg-emerald-500",
      gradient: "from-emerald-500/30 to-transparent",
      borderColor: "border-emerald-200 dark:border-emerald-500/30",
      cardBg: "bg-emerald-50/50 dark:bg-emerald-900/20"
    },
    {
      key: "Rejected",
      label: "Rejected",
      color: "bg-rose-500/5 dark:bg-rose-500/10",
      headerColor: "text-rose-700 dark:text-rose-300",
      dot: "bg-rose-500",
      gradient: "from-rose-500/30 to-transparent",
      borderColor: "border-rose-200 dark:border-rose-500/30",
      cardBg: "bg-rose-50/50 dark:bg-rose-900/20"
    },
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
          <div key={status.key} className="h-[200px] rounded-2xl bg-slate-100 dark:bg-zinc-900 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="jobmate-board-safe pb-20">
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
                    "rounded-2xl border flex flex-col transition-all duration-300",
                    "min-h-[400px] max-h-[calc(100vh-280px)]",
                    "overflow-hidden backdrop-blur-md",
                    status.color,
                    status.borderColor,
                    snapshot.isDraggingOver ? "ring-2 ring-primary/20 scale-[1.01]" : "shadow-sm"
                  )}
                >
                  {/* Header */}
                  <header className={cn("px-4 pt-4 pb-3 flex items-center justify-between shrink-0 border-b border-black/5 dark:border-white/5")}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-black/20 shadow-sm ${status.dot} ${snapshot.isDraggingOver ? 'animate-pulse' : ''}`} />
                      <h4 className={cn("text-sm font-extrabold tracking-tight", status.headerColor)}>
                        {status.label}
                      </h4>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-mono font-bold bg-white/50 dark:bg-black/50 backdrop-blur-sm border-0 min-w-[24px] justify-center">
                      {columns[status.key].length}
                    </Badge>
                  </header>

                  {/* Card List - scrollable */}
                  <div
                    className={cn(
                      "px-3 pb-3 pt-3 space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800",
                      snapshot.isDraggingOver && "bg-black/5 dark:bg-white/5"
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
                                "group relative transition-all duration-200",
                                dragSnapshot.isDragging && "z-50 scale-105 rotate-1"
                              )}
                            >
                              <div className={cn(
                                "rounded-xl border shadow-sm hover:shadow-lg transition-all p-3.5 relative overflow-hidden",
                                status.borderColor,
                                status.cardBg, // Use the new colorful background
                                dragSnapshot.isDragging ? "shadow-2xl ring-2 ring-primary border-transparent opacity-95" : "hover:border-slate-300 dark:hover:border-zinc-600"
                              )}>
                                {/* Gradient Status line */}
                                <div className={cn("absolute left-0 top-0 bottom-0 w-1", status.dot)} />

                                {/* Glass shine effect on hover */}
                                <div className={cn(
                                  "absolute inset-0 bg-gradient-to-tr opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
                                  status.gradient
                                )} />

                                <div className="flex items-start justify-between gap-3 mb-3 relative z-10 pl-2">
                                  <div className="flex-1 min-w-0">
                                    <h4 className={cn(
                                      "font-bold text-sm text-slate-900 dark:text-slate-100 mb-0.5 truncate leading-tight transition-colors",
                                      `group-hover:${status.headerColor}`
                                    )}>
                                      {app.company}
                                    </h4>
                                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 truncate">
                                      {app.position}
                                    </p>
                                  </div>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="h-3.5 w-3.5" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                      <DropdownMenuItem onClick={() => onViewDetail(app)}>
                                        <Briefcase className="h-3.5 w-3.5 mr-2 text-primary" />
                                        Detail
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => onEdit(app)}>
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => onDelete(app.id)} className="text-red-600 focus:text-red-600">
                                        Hapus
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                <div className="space-y-1.5 relative z-10 pl-2">
                                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500 dark:text-zinc-400 font-medium">
                                    <Calendar className="h-3 w-3 shrink-0 text-slate-400" />
                                    <span className="truncate">
                                      {format(new Date(app.apply_date), "d MMM yyyy")}
                                    </span>
                                  </div>

                                  {(app.salary || app.source) && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                      {app.salary && (
                                        <Badge variant="outline" className="px-1.5 py-0 h-5 text-[9px] sm:text-[10px] gap-1 font-normal bg-slate-50 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 shadow-sm">
                                          <DollarSign className="h-2.5 w-2.5" />
                                          {(app.salary / 1000000).toFixed(1)}jt
                                        </Badge>
                                      )}
                                      {app.source && (
                                        <Badge variant="outline" className="px-1.5 py-0 h-5 text-[9px] sm:text-[10px] gap-1 font-normal bg-slate-50 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 shadow-sm">
                                          <MapPin className="h-2.5 w-2.5" />
                                          {app.source}
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {app.poster_path && (
                                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-zinc-800 pl-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-full justify-between px-2 text-[10px] font-medium text-slate-500 dark:text-zinc-400 hover:text-primary hover:bg-primary/5 transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewPoster(app);
                                      }}
                                    >
                                      <span className="flex items-center gap-1.5">
                                        <ImageIcon className="h-3 w-3" />
                                        Lihat Poster
                                      </span>
                                      <span className="text-[9px] opacity-70">IMAGE</span>
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );

                          // Use portal when dragging
                          return dragSnapshot.isDragging ? <DndPortal>{card}</DndPortal> : card;
                        }}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {columns[status.key].length === 0 && (
                      <div className="flex flex-col items-center justify-center h-24 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl m-1">
                        <p className="text-[10px] font-medium text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Kosong</p>
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
