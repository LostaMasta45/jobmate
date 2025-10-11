"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateJobApplication } from "@/actions/tools";
import { format } from "date-fns";
import { Briefcase, Calendar, DollarSign, MapPin, MoreVertical } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DndContextProps,
  rectIntersection,
  pointerWithin,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const STATUSES = [
  { key: "Applied", label: "Applied", color: "bg-blue-500" },
  { key: "Screening", label: "Screening", color: "bg-purple-500" },
  { key: "Interview", label: "Interview", color: "bg-yellow-500" },
  { key: "Offer", label: "Offer", color: "bg-orange-500" },
  { key: "Hired", label: "Hired", color: "bg-green-500" },
  { key: "Rejected", label: "Rejected", color: "bg-red-500" },
];

function ApplicationCard({
  application,
  onEdit,
  onDelete,
  onViewDetail,
}: {
  application: Application;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onViewDetail: (app: Application) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ 
      id: application.id,
      data: {
        type: "card",
        application,
        status: application.status,
      },
      transition: {
        duration: 200,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    opacity: isDragging ? 0 : 1,
    pointerEvents: isDragging ? 'none' : 'auto',
    touchAction: 'none', // Better touch support
  } as React.CSSProperties;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="touch-none" // Prevent touch scrolling during drag
    >
      <Card className="mb-2 cursor-grab hover:shadow-lg hover:border-primary/20 transition-all active:cursor-grabbing group">
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-0.5 truncate group-hover:text-primary transition-colors">
                {application.company}
              </h4>
              <p className="text-xs text-muted-foreground truncate">{application.position}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetail(application)}>
                  <Briefcase className="h-3.5 w-3.5 mr-2" />
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(application)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(application.id)}
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
                {format(new Date(application.apply_date), "dd MMM yyyy")}
              </span>
            </div>

            {application.salary && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-3 w-3 shrink-0" />
                <span className="truncate">Rp {application.salary.toLocaleString("id-ID")}</span>
              </div>
            )}

            {application.source && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{application.source}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KanbanColumn({
  status,
  applications,
  onEdit,
  onDelete,
  onViewDetail,
}: {
  status: typeof STATUSES[0];
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onViewDetail: (app: Application) => void;
}) {
  // Use useDroppable for column drop zone
  const { setNodeRef, isOver } = useDroppable({
    id: status.key,
    data: { 
      type: "column", 
      status: status.key,
    },
  });

  return (
    <div 
      ref={setNodeRef} 
      className="w-full min-h-[200px]"
      data-droppable="true"
      data-column={status.key}
    >
      <Card className={`h-full transition-all duration-200 ${isOver ? 'ring-2 ring-primary bg-primary/10 shadow-lg' : ''}`}>
        <CardHeader className="pb-2 px-3 pt-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status.color} shrink-0`} />
            <h3 className="font-semibold text-sm truncate">{status.label}</h3>
            <Badge variant="secondary" className="ml-auto shrink-0 text-xs px-2">
              {applications.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-2 pt-1">
          <SortableContext
            items={applications.map((a) => a.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="min-h-[200px] max-h-[400px] overflow-y-auto px-1 space-y-2">
              {applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-center">
                  <Briefcase className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground/70">Drop kartu di sini</p>
                </div>
              ) : (
                applications.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewDetail={onViewDetail}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}

export function TrackerKanban({
  applications,
  onEdit,
  onDelete,
  onViewDetail,
}: {
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onViewDetail: (app: Application) => void;
}) {
  const router = useRouter();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [optimisticApps, setOptimisticApps] = React.useState(applications);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setOptimisticApps(applications);
  }, [applications]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // More sensitive, easier to drag
        tolerance: 5,
        delay: 0,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    document.body.style.cursor = 'grabbing';
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event;
    if (!over || !active) return;
    
    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      const isColumn = STATUSES.some(s => s.key === over.id);
      console.log('👉 Drag over:', over.id, isColumn ? '(COLUMN)' : '(card)');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    document.body.style.cursor = '';

    if (!over || !active || isUpdating) {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Drop cancelled:', { hasOver: !!over, hasActive: !!active, isUpdating });
      }
      return;
    }

    const activeApp = optimisticApps.find((app) => app.id === active.id);
    if (!activeApp) {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Active app not found:', active.id);
      }
      return;
    }

    // Find the target status
    let targetStatus: string | undefined;
    let droppedOnCard = false;
    
    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 Drop event:', {
        activeId: active.id,
        activeApp: activeApp.company,
        currentStatus: activeApp.status,
        overId: over.id,
        overData: over.data?.current,
      });
    }
    
    // Try multiple ways to find target status
    // 1. Check if over.id is a column status key (highest priority)
    if (STATUSES.some(s => s.key === over.id)) {
      targetStatus = over.id as string;
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Dropped on column:', targetStatus);
      }
    }
    // 2. Check over.data.current if it's a column type
    else if (over.data?.current?.type === 'column' && over.data.current.status) {
      targetStatus = over.data.current.status;
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Dropped on column area:', targetStatus);
      }
    }
    // 3. Check if dropped on a card
    else {
      const overApp = optimisticApps.find((app) => app.id === over.id);
      if (overApp) {
        targetStatus = overApp.status;
        droppedOnCard = true;
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Dropped on card in column:', targetStatus);
        }
      }
    }

    if (!targetStatus) {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ No target status found');
      }
      return;
    }

    // If dropped on a card in the same column, ignore silently
    if (droppedOnCard && targetStatus === activeApp.status) {
      if (process.env.NODE_ENV === 'development') {
        console.log('ℹ️ Dropped on card in same column, ignoring');
      }
      return;
    }

    if (targetStatus === activeApp.status) {
      if (process.env.NODE_ENV === 'development') {
        console.log('ℹ️ Same status, no update needed');
      }
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Will update:', activeApp.company, 'from', activeApp.status, 'to', targetStatus);
    }

    // Only update if status actually changed
    if (targetStatus) {
      const oldStatus = activeApp.status;
      
      // Optimistic update - immediate UI feedback
      setOptimisticApps((prev) =>
        prev.map((app) =>
          app.id === activeApp.id ? { ...app, status: targetStatus } : app
        )
      );

      setIsUpdating(true);

      try {
        // Update in database
        await updateJobApplication(activeApp.id, { status: targetStatus });
        
        // Refresh data from server (revalidates cache)
        router.refresh();
      } catch (error) {
        // Log error for debugging
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to update status:", error);
        }
        
        // Show user-friendly error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        alert(`Gagal memindahkan ke ${targetStatus}. ${errorMessage}`);
        
        // Revert optimistic update on error
        setOptimisticApps((prev) =>
          prev.map((app) =>
            app.id === activeApp.id ? { ...app, status: oldStatus } : app
          )
        );
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const activeApplication = optimisticApps.find((app) => app.id === activeId);

  // Render DragOverlay in portal at document.body level
  const renderDragOverlay = () => {
    if (!mounted || typeof window === 'undefined') return null;

    return createPortal(
      <DragOverlay 
        dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
        style={{
          zIndex: 9999,
        }}
      >
        {activeApplication ? (
          <div style={{ width: '240px', maxWidth: '240px' }}>
            <Card className="cursor-grabbing shadow-2xl border-2 border-primary bg-background">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-0.5 truncate text-primary">
                      {activeApplication.company}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {activeApplication.position}
                    </p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${STATUSES.find(s => s.key === activeApplication.status)?.color} shrink-0 mt-1`} />
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span className="truncate">
                    {format(new Date(activeApplication.apply_date), "dd MMM yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DragOverlay>,
      document.body
    );
  };

  // Collision detection that prioritizes columns over cards
  const customCollisionDetection = (args: any) => {
    const { active, droppableContainers, pointerCoordinates } = args;
    
    if (!pointerCoordinates) {
      return closestCenter(args);
    }
    
    // Get all collisions
    const allCollisions = pointerWithin(args);
    
    // Filter to get only columns (skip cards and skip the dragging card itself)
    const columnCollisions = allCollisions.filter((collision: any) => {
      // Skip the card being dragged
      if (collision.id === active?.id) {
        return false;
      }
      
      // Get the container data
      const container = droppableContainers.get(collision.id);
      const data = container?.data?.current;
      
      // Only include columns
      return data?.type === 'column';
    });
    
    // If we found columns, return them (prioritize columns!)
    if (columnCollisions.length > 0) {
      return columnCollisions;
    }
    
    // Otherwise return all collisions (might be cards)
    return allCollisions.length > 0 ? allCollisions : closestCenter(args);
  };

  return (
    <>
      <DndContext 
        sensors={sensors} 
        collisionDetection={customCollisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          setActiveId(null);
          document.body.style.cursor = '';
        }}
      >
      {/* Mobile: Vertical Stack */}
      <div className="md:hidden space-y-3">
        {STATUSES.map((status) => {
          const statusApps = optimisticApps.filter((app) => app.status === status.key);
          return (
            <div key={status.key}>
              <KanbanColumn
                status={status}
                applications={statusApps}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewDetail={onViewDetail}
              />
            </div>
          );
        })}
      </div>

      {/* Tablet: 2 Columns Grid */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-3">
        {STATUSES.map((status) => {
          const statusApps = optimisticApps.filter((app) => app.status === status.key);
          return (
            <div key={status.key}>
              <KanbanColumn
                status={status}
                applications={statusApps}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewDetail={onViewDetail}
              />
            </div>
          );
        })}
      </div>

      {/* Desktop: 3 Columns Grid */}
      <div className="hidden lg:grid xl:hidden grid-cols-3 gap-3">
        {STATUSES.map((status) => {
          const statusApps = optimisticApps.filter((app) => app.status === status.key);
          return (
            <div key={status.key}>
              <KanbanColumn
                status={status}
                applications={statusApps}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewDetail={onViewDetail}
              />
            </div>
          );
        })}
      </div>

      {/* Large Desktop: All 6 Columns Horizontal */}
      <div className="hidden xl:flex gap-3 overflow-x-auto pb-2">
        {STATUSES.map((status) => {
          const statusApps = optimisticApps.filter((app) => app.status === status.key);
          return (
            <div key={status.key} className="min-w-[240px] flex-1">
              <KanbanColumn
                status={status}
                applications={statusApps}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewDetail={onViewDetail}
              />
            </div>
          );
        })}
      </div>
      </DndContext>
      
      {/* Render DragOverlay in portal */}
      {renderDragOverlay()}
    </>
  );
}
