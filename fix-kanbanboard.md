
# 06B-fix2 — Perbaikan Menyeluruh Kanban DnD

## Target
1) Hilangkan error `nested scroll container`.  
2) Drag dimulai dari posisi kartu (tidak lompat ke sidebar).  
3) Bisa pindah kolom & reorder (persist ke Supabase).  
4) Kartu tidak ter-clip oleh layout/transform.  
5) Stat header otomatis update.

---

## 0) Prinsip DnD @hello-pangea/dnd
- **Satu Droppable = satu scroll parent saja** (yang punya `overflow-y:auto`).  
- **Jangan ada `transform/scale/filter/backdrop-blur`** pada ancestor board.  
- **Selalu render** `provided.placeholder`.  
- Render elemen yang sedang di-drag ke **`document.body` via Portal**.

---

## 1) Rapikan Layout (hindari nested scroll)
- Pastikan **page** tracker TIDAK scroll (gunakan `overflow-hidden`).  
- Yang boleh scroll hanya **setiap kolom** (Droppable).

```tsx
// app/(protected)/tools/tracker/page.tsx
export default function Page() {
  return (
    <div className="h-[calc(100vh-96px)] overflow-hidden"> 
      {/* header cards + filter di sini */}
      <div className="jobmate-board-safe h-full">
        <KanbanBoard initialData={data} onStatsChange={setStats} />
      </div>
    </div>
  )
}
````

```css
/* styles/globals.css */
/* Pastikan board bebas transform/filter dari ancestor */
.jobmate-board-safe {
  transform: none !important;
  filter: none !important;
  backdrop-filter: none !important;
}
```

> Bila sidebar kamu pakai animasi `translate/scale/blur`, **jangan** bungkus Board di dalam container yang ikut ter-transform. Board harus berada di node yang “bersih”.

---

## 2) Portal untuk elemen yang sedang di-drag

Tambahkan **root portal** di `_app`/`layout`:

```tsx
{/* app/layout.tsx */}
<body>
  {children}
  <div id="dnd-portal" />
</body>
```

Buat util render ke portal:

```tsx
// components/tracker/DndPortal.tsx
"use client"
import { createPortal } from "react-dom"
export function DndPortal({ children }: { children: React.ReactNode }) {
  if (typeof window === "undefined") return null
  const el = document.getElementById("dnd-portal")
  return el ? createPortal(children, el) : null
}
```

---

## 3) Dynamic import (hindari SSR mismatch)

```tsx
// app/(protected)/tools/tracker/page.tsx
const KanbanBoard = dynamic(() => import("@/components/tracker/KanbanBoard"), { ssr: false })
```

---

## 4) Column & Card (1 scroll parent per Droppable)

```tsx
// components/tracker/KanbanBoard.tsx
"use client"

import dynamic from "next/dynamic"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { useMemo, useState, useTransition, useEffect } from "react"
import { DndPortal } from "./DndPortal"
import { reorderApplications } from "@/actions/tracker/reorder"
import { cn } from "@/lib/utils"

type Status = "Applied" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected"
type AppCard = { id: string; company: string; position: string; status: Status; order_index: number; created_at: string }

export default function KanbanBoard({
  initialData,
  onStatsChange,
}: { initialData: AppCard[]; onStatsChange?: (s: any) => void }) {
  const grouped = useMemo(() => {
    const base: Record<Status, AppCard[]> = { Applied: [], Screening: [], Interview: [], Offer: [], Hired: [], Rejected: [] }
    initialData.forEach(a => base[a.status].push(a))
    (Object.keys(base) as Status[]).forEach(k => base[k].sort((a,b)=>a.order_index-b.order_index))
    return base
  }, [initialData])

  const [cols, setCols] = useState(grouped)
  const [isPending, startTransition] = useTransition()

  // stat header
  const stats = useMemo(() => ({
    total: Object.values(cols).flat().length,
    inProcess: cols.Applied.length + cols.Screening.length + cols.Interview.length + cols.Offer.length,
    accepted: cols.Hired.length,
    rejected: cols.Rejected.length,
  }), [cols])

  useEffect(() => { onStatsChange?.(stats) }, [stats, onStatsChange])

  function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result
    if (!destination) return
    const from = source.droppableId as Status
    const to   = destination.droppableId as Status
    if (from === to && source.index === destination.index) return

    // optimistic UI
    setCols(prev => {
      const next = { ...prev }
      const fromList = Array.from(next[from])
      const [moved] = fromList.splice(source.index, 1)
      next[from] = fromList.map((c, i) => ({ ...c, order_index: i }))

      const toList = Array.from(next[to])
      toList.splice(destination.index, 0, { ...moved, status: to })
      next[to] = toList.map((c, i) => ({ ...c, order_index: i }))
      return next
    })

    // persist
    startTransition(() => {
      const newFrom = cols[from].filter(c => c.id !== draggableId).map((c, i) => ({ id: c.id, order_index: i }))
      const newTo = [
        ...cols[to].slice(0, destination.index).map((c, i) => ({ id: c.id, order_index: i })),
        { id: draggableId, order_index: destination.index },
        ...cols[to].slice(destination.index).map((c, i) => ({ id: c.id, order_index: destination.index + 1 + i })),
      ]
      reorderApplications({ id: draggableId, from, to, ordering: { [from]: newFrom, [to]: newTo } })
        .catch(() => location.reload())
    })
  }

  const STATUSES: Status[] = ["Applied","Screening","Interview","Offer","Hired","Rejected"]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <DragDropContext onDragEnd={onDragEnd}>
        {STATUSES.map(status => (
          <Droppable droppableId={status} key={status} type="CARD">
            {(provided, snapshot) => (
              <section
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "rounded-xl border bg-card flex flex-col",
                  "h-[calc(100vh-220px)]",             /* tinggi tetap */
                  "overflow-hidden"                     /* parent TIDAK scroll */
                )}
              >
                <header className="px-3 pt-3 pb-2 flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{status}</h4>
                  <span className="text-xs text-muted-foreground">{cols[status].length}</span>
                </header>

                {/* Satu-satunya scroll parent: list di bawah ini */}
                <div className={cn(
                  "px-3 pb-3 space-y-2 flex-1 overflow-y-auto",
                  snapshot.isDraggingOver && "bg-muted/40"
                )}>
                  {cols[status].map((item, index) => (
                    <Draggable draggableId={item.id} index={index} key={item.id}>
                      {(dragProvided, dragSnapshot) => {
                        const card = (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={cn(
                              "rounded-lg border bg-background p-3 shadow-sm hover:shadow transition",
                              dragSnapshot.isDragging && "ring-2 ring-primary/50"
                            )}
                            style={dragProvided.draggableProps.style} /* WAJIB */
                          >
                            <div className="text-sm font-medium">{item.company}</div>
                            <div className="text-xs text-muted-foreground">{item.position}</div>
                          </div>
                        )

                        // Saat dragging → render ke portal agar tidak dipengaruhi transform/sidebar
                        return dragSnapshot.isDragging ? (
                          <DndPortal>{card}</DndPortal>
                        ) : card
                      }}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </section>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  )
}
```

**Kunci anti-bug nested-scroll:**

* Parent kolom: `overflow-hidden`.
* List di dalam kolom: **`overflow-y-auto`** (ini satu-satunya scroll parent).
* Jangan bungkus board dalam container lain yang juga `overflow:auto`.

---

## 5) Server Action persist (tetap)

Gunakan yang sebelumnya (`reorderApplications`) — tidak perlu diubah, asal meng-update:

* `status` jika pindah kolom
* `order_index` untuk 2 kolom terkait
* **revalidate** `/tools/tracker` & `/dashboard` agar **stat header** ikut berubah.

---

## 6) Stat header auto update tanpa fetch ulang (opsional)

Di `page.tsx`, saat render `KanbanBoard`, kirim callback:

```tsx
<KanbanBoard initialData={apps} onStatsChange={(s) => setLocalStats(s)} />
```

`setLocalStats` langsung mengubah angka di 4 kartu (Total/Proses/Diterima/Ditolak).
Sebagai fallback, tetap panggil `revalidatePath("/dashboard")` di server action.

---

## 7) Checklist verifikasi

* [ ] Console **tidak** lagi menampilkan “unsupported nested scroll container”.
* [ ] Drag dimulai dari posisi asli kartu.
* [ ] Kartu bisa dipindah antar kolom & urutan dalam kolom tersimpan.
* [ ] Tidak ada clipping/teleport ke sidebar saat drag.
* [ ] Stat header berubah saat drop.
* [ ] Mobile drag OK.

---

## Catatan untuk AI

* Pastikan **hanya list kolom** yang punya `overflow-y-auto`.
* **Jangan** menambahkan `transform`/`scale` di parent board.
* Simpan `style={provided.draggableProps.style}` pada kartu.
* Render **kartu yang sedang di-drag** ke portal `#dnd-portal`.
* `droppableId` & `draggableId` harus **string unik**.
* Gunakan **dynamic import `{ ssr:false }`** untuk komponen DnD.

```

