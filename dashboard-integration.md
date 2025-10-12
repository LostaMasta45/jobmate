Dashboard Integration

## Tujuan
Integrasikan dashboard utama JobMate dengan data dari Supabase agar menampilkan insight karier real-time:
- 4 kartu utama statistik lamaran.
- Ringkasan pipeline mini (Applied → Hired).
- Daftar lamaran terbaru (5 data terakhir).
- Upcoming/Reminder (jadwal interview atau follow-up).
- Alerts/Insight otomatis (misal belum follow-up 14 hari, atau lamaran sudah diterima).

---

## Struktur Direktori

```

/app/(protected)/dashboard/page.tsx
/components/dashboard/
StatCards.tsx
PipelineMini.tsx
RecentTable.tsx
UpcomingList.tsx
AlertsPanel.tsx
/actions/dashboard/
getStats.ts
getPipeline.ts
getRecent.ts
getUpcoming.ts
getAlerts.ts

````

> Gunakan shadcn/ui + lucide-react + framer-motion untuk efek animasi ringan dan modern.

---

## Server Actions

### 📊 getStats.ts
```ts
"use server"
import { supabaseServer } from "@/lib/supabaseServer"

export async function getStats() {
  const sb = supabaseServer()
  const [total, inProcess, accepted, rejected] = await Promise.all([
    sb.from("applications").select("id", { count: "exact", head: true }),
    sb.from("applications").select("id", { count: "exact", head: true }).in("status", ["Applied","Screening","Interview","Offer"]),
    sb.from("applications").select("id", { count: "exact", head: true }).eq("status", "Hired"),
    sb.from("applications").select("id", { count: "exact", head: true }).eq("status", "Rejected"),
  ])
  return {
    total: total.count ?? 0,
    inProcess: inProcess.count ?? 0,
    accepted: accepted.count ?? 0,
    rejected: rejected.count ?? 0,
  }
}
````

---

### 📈 getPipeline.ts

```ts
"use server"
import { supabaseServer } from "@/lib/supabaseServer"

const STATUS = ["Applied","Screening","Interview","Offer","Hired","Rejected"] as const

export async function getPipeline() {
  const sb = supabaseServer()
  const results = await Promise.all(
    STATUS.map(s => sb.from("applications").select("id", { count: "exact", head: true }).eq("status", s))
  )
  return STATUS.map((s, i) => ({ status: s, count: results[i].count ?? 0 }))
}
```

---

### 🕓 getRecent.ts

```ts
"use server"
import { supabaseServer } from "@/lib/supabaseServer"

export async function getRecent(limit = 5) {
  const sb = supabaseServer()
  const { data, error } = await sb
    .from("applications")
    .select("id, company_name, position, status, created_at")
    .order("created_at", { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}
```

---

### 📅 getUpcoming.ts

```ts
"use server"
import { supabaseServer } from "@/lib/supabaseServer"

export async function getUpcoming() {
  const sb = supabaseServer()
  const { data, error } = await sb
    .from("applications")
    .select("id, company_name, position, next_action_at")
    .gt("next_action_at", new Date().toISOString())
    .order("next_action_at", { ascending: true })
    .limit(6)
  if (error) throw error
  return data ?? []
}
```

---

### ⚠️ getAlerts.ts

```ts
"use server"
import { supabaseServer } from "@/lib/supabaseServer"

export async function getAlerts() {
  const sb = supabaseServer()
  const alerts = []

  // Lamaran tanpa update >14 hari
  const { data } = await sb
    .from("applications")
    .select("id, company_name, position, updated_at, status")
    .in("status", ["Applied","Screening","Interview","Offer"])

  const now = Date.now()
  data?.forEach(a => {
    const days = Math.floor((now - new Date(a.updated_at).getTime()) / (1000*60*60*24))
    if (days >= 14) alerts.push({
      type: "warning",
      message: `Lamaran ke ${a.company_name} (${a.position}) belum update ${days} hari.`,
      href: `/tools/tracker?open=${a.id}`
    })
  })

  return alerts.slice(0, 5)
}
```

---

## Page Utama Dashboard

```tsx
import { getStats, getPipeline, getRecent, getUpcoming, getAlerts } from "@/actions/dashboard/*"
import StatCards from "@/components/dashboard/StatCards"
import PipelineMini from "@/components/dashboard/PipelineMini"
import RecentTable from "@/components/dashboard/RecentTable"
import UpcomingList from "@/components/dashboard/UpcomingList"
import AlertsPanel from "@/components/dashboard/AlertsPanel"

export default async function DashboardPage() {
  const [stats, pipeline, recent, upcoming, alerts] = await Promise.all([
    getStats(), getPipeline(), getRecent(), getUpcoming(), getAlerts()
  ])

  return (
    <div className="space-y-6">
      <StatCards data={stats} />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <PipelineMini data={pipeline} />
          <RecentTable rows={recent} />
        </div>
        <div className="space-y-6">
          <UpcomingList items={upcoming} />
          {alerts.length > 0 && <AlertsPanel items={alerts} />}
        </div>
      </div>
    </div>
  )
}
```

---

## Komponen UI

### 🟩 StatCards.tsx

```tsx
"use client"
import { motion } from "framer-motion"
import { Briefcase, Clock, CheckCircle, XCircle } from "lucide-react"

export default function StatCards({ data }) {
  const items = [
    { label: "Total", value: data.total, icon: Briefcase },
    { label: "Dalam Proses", value: data.inProcess, icon: Clock },
    { label: "Diterima", value: data.accepted, icon: CheckCircle },
    { label: "Ditolak", value: data.rejected, icon: XCircle },
  ]
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {items.map((it) => (
        <motion.div
          key={it.label}
          className="rounded-xl border bg-card p-4 flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <p className="text-sm text-muted-foreground">{it.label}</p>
            <p className="text-2xl font-semibold">{it.value}</p>
          </div>
          <it.icon className="h-6 w-6 text-muted-foreground" />
        </motion.div>
      ))}
    </div>
  )
}
```

---

### 📊 PipelineMini.tsx

```tsx
"use client"
import { Progress } from "@/components/ui/progress"

export default function PipelineMini({ data }) {
  const total = data.reduce((sum, s) => sum + s.count, 0)
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="font-medium mb-2">Pipeline Lamaran</p>
      <div className="flex flex-col gap-2">
        {data.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span>{s.status}</span>
            <div className="flex items-center gap-2 w-1/2">
              <Progress value={(s.count / total) * 100 || 0} className="h-2" />
              <span>{s.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

### 🕓 RecentTable.tsx

```tsx
"use client"
import { Badge } from "@/components/ui/badge"

export default function RecentTable({ rows }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="font-medium mb-2">Lamaran Terbaru</p>
      <div className="space-y-2 text-sm">
        {rows.map((r) => (
          <div key={r.id} className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-medium">{r.company_name}</p>
              <p className="text-muted-foreground text-xs">{r.position}</p>
            </div>
            <Badge variant="outline">{r.status}</Badge>
          </div>
        ))}
        {rows.length === 0 && <p className="text-muted-foreground text-sm">Belum ada data lamaran.</p>}
      </div>
    </div>
  )
}
```

---

### 📅 UpcomingList.tsx

```tsx
"use client"
import { Calendar, Clock } from "lucide-react"

export default function UpcomingList({ items }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="font-medium mb-2">Upcoming & Reminders</p>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Tidak ada jadwal mendatang.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {items.map((it, i) => (
            <li key={i} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">{it.company_name}</p>
                <p className="text-xs text-muted-foreground">{new Date(it.next_action_at).toLocaleDateString()}</p>
              </div>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

---

### ⚠️ AlertsPanel.tsx

```tsx
"use client"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function AlertsPanel({ items }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="font-medium mb-3">Peringatan</p>
      <ul className="space-y-2 text-sm">
        {items.map((a, i) => (
          <li key={i} className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-1" />
            <Link href={a.href || "#"} className="hover:underline text-foreground">
              {a.message}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## Acceptance Criteria

✅ Statistik dan pipeline muncul otomatis dari Supabase
✅ Semua data update otomatis setelah user melakukan drag/drop di Tracker
✅ Tidak ada `Resume Health` section
✅ Layout clean, ringan, dan responsif

---
