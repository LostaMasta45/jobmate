# 🗺️ VIP Career - Map Heat Zone Implementation Guide

## 📋 Executive Summary

**Feature:** Interactive Heat Map showing job distribution across Jombang sub-districts (kecamatan)

**Goal:** Visual representation of job opportunities to help users make informed decisions about where to focus their job search.

**Technology Stack:**
- 📍 Mapbox GL JS / Leaflet.js (map rendering)
- 🎨 Heatmap.js (heat visualization)
- 🗄️ PostgreSQL + PostGIS (geo queries)
- ⚡ Next.js + TypeScript (frontend)

---

## 🎯 Feature Overview

### What is Map Heat Zone?

Interactive map of Jombang showing:
- 📌 **Job density** per kecamatan (heat intensity)
- 🔢 **Number of active jobs** (pin markers)
- 🏢 **Company locations** (optional)
- 🎯 **User location** (optional)
- 🔍 **Interactive filtering** (kategori, gaji, dll)

### Visual Concept:

```
┌─────────────────────────────────────────────────┐
│ 🗺️  Peta Loker Jombang                         │
├─────────────────────────────────────────────────┤
│                                                 │
│    [Filters]                                    │
│    Kategori: [All ▼] Gaji: [All ▼]            │
│                                                 │
│  ┌───────────────────────────────────────┐    │
│  │         JOMBANG MAP                   │    │
│  │                                       │    │
│  │    Mojoagung (15) 🔥                 │    │
│  │         ●                             │    │
│  │                                       │    │
│  │  Ploso (8)        Jombang Kota (42)  │    │
│  │    ●                    ●●● 🔥🔥🔥   │    │
│  │                                       │    │
│  │         Sumobito (5)                  │    │
│  │            ●                          │    │
│  │                                       │    │
│  │  Perak (12)      Megaluh (7)         │    │
│  │    ●●               ●                 │    │
│  │                                       │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  Legend:                                        │
│  🔥🔥🔥 >30 loker  ●●● High                    │
│  🔥🔥   15-30      ●●  Medium                  │
│  🔥     5-14       ●   Low                     │
│  -      <5         -   Very Low                │
│                                                 │
│  [📊 Lihat Detail] [🔍 Filter Area]           │
└─────────────────────────────────────────────────┘
```

---

## 🏗️ Technical Architecture

### 1. Database Schema

```sql
-- Tambahkan kolom geo ke vip_loker
ALTER TABLE vip_loker ADD COLUMN IF NOT EXISTS geo_point GEOGRAPHY(POINT, 4326);
ALTER TABLE vip_loker ADD COLUMN IF NOT EXISTS kecamatan VARCHAR(100);
ALTER TABLE vip_loker ADD COLUMN IF NOT EXISTS kelurahan VARCHAR(100);

-- Index untuk performa
CREATE INDEX idx_vip_loker_geo ON vip_loker USING GIST(geo_point);
CREATE INDEX idx_vip_loker_kecamatan ON vip_loker(kecamatan);

-- Table master kecamatan Jombang (21 kecamatan)
CREATE TABLE IF NOT EXISTS kecamatan_jombang (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  geo_boundary GEOGRAPHY(POLYGON, 4326),
  population INTEGER,
  area_km2 DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert master data kecamatan Jombang
INSERT INTO kecamatan_jombang (name, latitude, longitude) VALUES
('Jombang', -7.5456, 112.2331),      -- Kota Jombang (pusat)
('Mojoagung', -7.5667, 112.3500),
('Diwek', -7.5833, 112.2333),
('Ploso', -7.6167, 112.2167),
('Peterongan', -7.4833, 112.2500),
('Sumobito', -7.5500, 112.2833),
('Kesamben', -7.5833, 112.3000),
('Bareng', -7.6000, 112.3333),
('Gudo', -7.5500, 112.3500),
('Ngoro', -7.7000, 112.2667),
('Ngusikan', -7.6833, 112.3167),
('Mojowarno', -7.5167, 112.4167),
('Megaluh', -7.4833, 112.3833),
('Kudu', -7.5333, 112.4333),
('Kabuh', -7.6000, 112.2667),
('Perak', -7.5667, 112.3833),
('Jogoroto', -7.5000, 112.3167),
('Plandaan', -7.6667, 112.3667),
('Wonosalam', -7.7333, 112.2000),
('Bandar Kedung Mulyo', -7.4500, 112.3000),
('Tembelang', -7.6333, 112.4000);

-- View untuk statistik per kecamatan
CREATE OR REPLACE VIEW v_loker_stats_by_kecamatan AS
SELECT 
  k.id,
  k.name AS kecamatan,
  k.latitude,
  k.longitude,
  COUNT(DISTINCT l.id) AS total_loker,
  COUNT(DISTINCT l.perusahaan_name) AS total_perusahaan,
  AVG(l.gaji_min) AS avg_gaji_min,
  AVG(l.gaji_max) AS avg_gaji_max,
  ARRAY_AGG(DISTINCT l.kategori) FILTER (WHERE l.kategori IS NOT NULL) AS kategori_populer
FROM kecamatan_jombang k
LEFT JOIN vip_loker l ON l.kecamatan = k.name AND l.status = 'published'
GROUP BY k.id, k.name, k.latitude, k.longitude
ORDER BY total_loker DESC;
```

---

### 2. Backend API

**File:** `app/api/vip/map/stats/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    
    // Filters
    const kategori = searchParams.get('kategori');
    const gaji_min = searchParams.get('gaji_min');
    const tipe_kerja = searchParams.get('tipe_kerja');

    // Build query
    let query = supabase
      .from('v_loker_stats_by_kecamatan')
      .select('*');

    // Apply filters if needed (more complex query)
    if (kategori) {
      query = query.contains('kategori_populer', [kategori]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Map stats error:', error);
      return NextResponse.json({ error: 'Failed to fetch map data' }, { status: 500 });
    }

    // Transform data for frontend
    const mapData = data?.map(item => ({
      id: item.id,
      name: item.kecamatan,
      lat: parseFloat(item.latitude),
      lng: parseFloat(item.longitude),
      total_jobs: item.total_loker || 0,
      total_companies: item.total_perusahaan || 0,
      avg_salary_min: item.avg_gaji_min || 0,
      avg_salary_max: item.avg_gaji_max || 0,
      popular_categories: item.kategori_populer || [],
      // Calculate heat intensity (0-100)
      heat_intensity: calculateHeatIntensity(item.total_loker || 0)
    }));

    return NextResponse.json({
      success: true,
      data: mapData,
      summary: {
        total_kecamatan: mapData?.length || 0,
        total_jobs: mapData?.reduce((sum, item) => sum + item.total_jobs, 0) || 0,
        avg_jobs_per_kecamatan: Math.round(
          (mapData?.reduce((sum, item) => sum + item.total_jobs, 0) || 0) / 
          (mapData?.length || 1)
        )
      }
    });

  } catch (error: any) {
    console.error('Map API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateHeatIntensity(jobCount: number): number {
  // Scale: 0-5 = 20, 5-15 = 40, 15-30 = 60, 30-50 = 80, 50+ = 100
  if (jobCount >= 50) return 100;
  if (jobCount >= 30) return 80;
  if (jobCount >= 15) return 60;
  if (jobCount >= 5) return 40;
  if (jobCount > 0) return 20;
  return 0;
}
```

---

### 3. Frontend Component

**File:** `components/vip/MapHeatZone.tsx`

```typescript
'use client';

import { useEffect, useState, useRef } from 'react';
import { MapPin, TrendingUp, Building2, DollarSign, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Install: npm install leaflet react-leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, divIcon, DivIconOptions } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface KecamatanData {
  id: number;
  name: string;
  lat: number;
  lng: number;
  total_jobs: number;
  total_companies: number;
  avg_salary_min: number;
  avg_salary_max: number;
  popular_categories: string[];
  heat_intensity: number;
}

interface MapStats {
  total_kecamatan: number;
  total_jobs: number;
  avg_jobs_per_kecamatan: number;
}

export function MapHeatZone() {
  const [data, setData] = useState<KecamatanData[]>([]);
  const [stats, setStats] = useState<MapStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    kategori: 'all',
    gaji_min: 'all',
    tipe_kerja: 'all'
  });
  const [selectedKecamatan, setSelectedKecamatan] = useState<KecamatanData | null>(null);

  useEffect(() => {
    loadMapData();
  }, [filters]);

  const loadMapData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.kategori !== 'all') params.set('kategori', filters.kategori);
      if (filters.gaji_min !== 'all') params.set('gaji_min', filters.gaji_min);
      if (filters.tipe_kerja !== 'all') params.set('tipe_kerja', filters.tipe_kerja);

      const res = await fetch(`/api/vip/map/stats?${params.toString()}`);
      const result = await res.json();

      if (result.success) {
        setData(result.data);
        setStats(result.summary);
      }
    } catch (error) {
      console.error('Failed to load map data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Custom marker icon based on job count
  const createCustomIcon = (jobs: number, intensity: number) => {
    const size = Math.min(20 + (jobs * 0.5), 60); // Scale 20-60px
    const color = getHeatColor(intensity);
    
    return divIcon({
      className: 'custom-marker',
      html: `
        <div class="relative group cursor-pointer">
          <div class="absolute -translate-x-1/2 -translate-y-1/2" style="width: ${size}px; height: ${size}px;">
            <div class="w-full h-full rounded-full ${color} opacity-50 animate-pulse"></div>
          </div>
          <div class="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full border-2 ${color.replace('bg-', 'border-')} shadow-lg z-10 group-hover:scale-110 transition-transform">
            <span class="text-xs font-bold ${color.replace('bg-', 'text-')}">${jobs}</span>
          </div>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    } as DivIconOptions);
  };

  const getHeatColor = (intensity: number): string => {
    if (intensity >= 80) return 'bg-red-500';
    if (intensity >= 60) return 'bg-orange-500';
    if (intensity >= 40) return 'bg-yellow-500';
    if (intensity >= 20) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const formatSalary = (min?: number, max?: number): string => {
    if (!min && !max) return 'Tidak disebutkan';
    if (min && max) return `Rp ${(min / 1000000).toFixed(1)} - ${(max / 1000000).toFixed(1)} jt`;
    if (min) return `Rp ${(min / 1000000).toFixed(1)} jt+`;
    return 'Nego';
  };

  return (
    <div className="space-y-4">
      {/* Header & Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">🗺️ Peta Loker Jombang</h2>
            <p className="text-blue-100">Jelajahi peluang kerja di setiap kecamatan</p>
          </div>
          <MapPin className="w-12 h-12 opacity-50" />
        </div>

        {stats && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-blue-100 mb-1">Total Kecamatan</p>
              <p className="text-2xl font-bold">{stats.total_kecamatan}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-blue-100 mb-1">Total Lowongan</p>
              <p className="text-2xl font-bold">{stats.total_jobs}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-blue-100 mb-1">Rata-rata per Area</p>
              <p className="text-2xl font-bold">{stats.avg_jobs_per_kecamatan}</p>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter Peta</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select value={filters.kategori} onValueChange={(v) => setFilters({ ...filters, kategori: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="IT">IT & Software</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="F&B">F&B</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.gaji_min} onValueChange={(v) => setFilters({ ...filters, gaji_min: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Gaji Minimum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Gaji</SelectItem>
              <SelectItem value="3000000">&gt; Rp 3 jt</SelectItem>
              <SelectItem value="5000000">&gt; Rp 5 jt</SelectItem>
              <SelectItem value="7000000">&gt; Rp 7 jt</SelectItem>
              <SelectItem value="10000000">&gt; Rp 10 jt</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.tipe_kerja} onValueChange={(v) => setFilters({ ...filters, tipe_kerja: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Tipe Kerja" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="Full Time">Full Time</SelectItem>
              <SelectItem value="Part Time">Part Time</SelectItem>
              <SelectItem value="Freelance">Freelance</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="h-[500px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Memuat peta...</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <MapContainer
              center={[-7.5456, 112.2331]} // Jombang center
              zoom={11}
              style={{ height: '500px', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {data.map((kecamatan) => (
                <Marker
                  key={kecamatan.id}
                  position={[kecamatan.lat, kecamatan.lng]}
                  icon={createCustomIcon(kecamatan.total_jobs, kecamatan.heat_intensity)}
                  eventHandlers={{
                    click: () => setSelectedKecamatan(kecamatan)
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold text-lg mb-2">{kecamatan.name}</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-blue-600" />
                          <span><strong>{kecamatan.total_jobs}</strong> lowongan aktif</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-purple-600" />
                          <span><strong>{kecamatan.total_companies}</strong> perusahaan</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span>{formatSalary(kecamatan.avg_salary_min, kecamatan.avg_salary_max)}</span>
                        </div>
                      </div>
                      {kecamatan.popular_categories.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Kategori populer:</p>
                          <div className="flex flex-wrap gap-1">
                            {kecamatan.popular_categories.slice(0, 3).map((cat, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <Button 
                        size="sm" 
                        className="w-full mt-3"
                        onClick={() => window.location.href = `/vip/loker?kecamatan=${kecamatan.name}`}
                      >
                        Lihat Loker
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg z-10 border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">Intensitas Loker</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">&gt; 50 loker</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">30-50 loker</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">15-30 loker</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">5-15 loker</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">&lt; 5 loker</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Kecamatan List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            🏆 Top Kecamatan dengan Lowongan Terbanyak
          </h3>
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <div className="space-y-3">
          {data
            .sort((a, b) => b.total_jobs - a.total_jobs)
            .slice(0, 5)
            .map((kecamatan, index) => (
              <div
                key={kecamatan.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setSelectedKecamatan(kecamatan)}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-orange-600' :
                  'bg-blue-500'
                } text-white font-bold text-sm`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{kecamatan.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {kecamatan.total_jobs} lowongan • {kecamatan.total_companies} perusahaan
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {formatSalary(kecamatan.avg_salary_min, kecamatan.avg_salary_max)}
                </Badge>
                <Button size="sm" variant="ghost">
                  Lihat →
                </Button>
              </div>
            ))}
        </div>
      </div>

      {/* Selected Kecamatan Detail (if any) */}
      {selectedKecamatan && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-1">📍 {selectedKecamatan.name}</h3>
              <p className="text-purple-100">Detail peluang kerja di area ini</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setSelectedKecamatan(null)}
            >
              ✕
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-purple-100 mb-1">Lowongan Aktif</p>
              <p className="text-2xl font-bold">{selectedKecamatan.total_jobs}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-purple-100 mb-1">Perusahaan</p>
              <p className="text-2xl font-bold">{selectedKecamatan.total_companies}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-purple-100 mb-1">Gaji Min Rata-rata</p>
              <p className="text-lg font-bold">
                {selectedKecamatan.avg_salary_min 
                  ? `Rp ${(selectedKecamatan.avg_salary_min / 1000000).toFixed(1)} jt`
                  : '-'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-purple-100 mb-1">Gaji Max Rata-rata</p>
              <p className="text-lg font-bold">
                {selectedKecamatan.avg_salary_max 
                  ? `Rp ${(selectedKecamatan.avg_salary_max / 1000000).toFixed(1)} jt`
                  : '-'}
              </p>
            </div>
          </div>

          {selectedKecamatan.popular_categories.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-purple-100 mb-2">Kategori Populer:</p>
              <div className="flex flex-wrap gap-2">
                {selectedKecamatan.popular_categories.map((cat, idx) => (
                  <Badge key={idx} className="bg-white/20 text-white border-0">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button 
            className="w-full mt-4 bg-white text-purple-600 hover:bg-purple-50 font-semibold"
            onClick={() => window.location.href = `/vip/loker?kecamatan=${selectedKecamatan.name}`}
          >
            Lihat Semua Lowongan di {selectedKecamatan.name} →
          </Button>
        </div>
      )}
    </div>
  );
}

// Add Briefcase import at top
import { Briefcase } from 'lucide-react';
```

---

### 4. CSS Styling

**File:** `styles/map-heatzone.css` (optional)

```css
/* Custom marker animations */
.custom-marker {
  animation: marker-bounce 0.5s ease-out;
}

@keyframes marker-bounce {
  0% {
    transform: translateY(-200px) scale(0);
    opacity: 0;
  }
  60% {
    transform: translateY(10px) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

/* Pulse animation for high-intensity areas */
@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

/* Leaflet popup custom style */
.leaflet-popup-content-wrapper {
  @apply rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700;
}

.leaflet-popup-content {
  @apply m-0 p-0;
}
```

---

## 📊 Data Collection Strategy

### How to Get Geo Data?

**Option 1: Manual Input (Admin)**
```typescript
// Admin form untuk input loker
<Input 
  name="kecamatan"
  placeholder="Pilih Kecamatan"
  type="select"
  options={KECAMATAN_JOMBANG}
/>
```

**Option 2: Geocoding API**
```typescript
// Auto-detect from address
async function geocodeAddress(address: string) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${address},Jombang&format=json`
  );
  const data = await response.json();
  if (data[0]) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  }
  return null;
}
```

**Option 3: IP Geolocation (for companies)**
```typescript
// Detect company location
async function getLocationFromIP() {
  const response = await fetch('https://ipapi.co/json/');
  const data = await response.json();
  return {
    lat: data.latitude,
    lng: data.longitude,
    city: data.city
  };
}
```

---

## 🎨 Advanced Features

### 1. Clustering for Dense Areas

```typescript
import MarkerClusterGroup from 'react-leaflet-cluster';

<MarkerClusterGroup chunkedLoading>
  {data.map(kecamatan => (
    <Marker key={kecamatan.id} position={[kecamatan.lat, kecamatan.lng]} />
  ))}
</MarkerClusterGroup>
```

### 2. Heatmap Layer

```typescript
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';

<HeatmapLayer
  fitBoundsOnLoad
  fitBoundsOnUpdate
  points={data}
  longitudeExtractor={m => m.lng}
  latitudeExtractor={m => m.lat}
  intensityExtractor={m => m.heat_intensity}
  radius={15}
  blur={20}
  max={100}
  gradient={{
    0.0: 'blue',
    0.2: 'cyan',
    0.4: 'lime',
    0.6: 'yellow',
    0.8: 'orange',
    1.0: 'red'
  }}
/>
```

### 3. Search by Location

```typescript
<Input
  placeholder="Cari kecamatan..."
  onChange={(e) => {
    const term = e.target.value.toLowerCase();
    const filtered = data.filter(k => 
      k.name.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
  }}
/>
```

### 4. Draw Custom Boundaries

```typescript
import { Polygon } from 'react-leaflet';

<Polygon
  positions={kecamatan.geo_boundary} // Array of [lat, lng]
  pathOptions={{
    color: 'blue',
    fillColor: 'lightblue',
    fillOpacity: 0.3
  }}
/>
```

---

## 📱 Mobile Optimization

```typescript
// Responsive map height
const [mapHeight, setMapHeight] = useState('500px');

useEffect(() => {
  const updateHeight = () => {
    setMapHeight(window.innerWidth < 768 ? '400px' : '500px');
  };
  updateHeight();
  window.addEventListener('resize', updateHeight);
  return () => window.removeEventListener('resize', updateHeight);
}, []);

<MapContainer style={{ height: mapHeight, width: '100%' }}>
```

---

## 🚀 Integration to Dashboard

**File:** `app/(vip)/vip/page.tsx`

```typescript
import { MapHeatZone } from '@/components/vip/MapHeatZone';

export default function VIPDashboard() {
  return (
    <div className="space-y-6">
      {/* Existing components */}
      <VIPWelcomeBox />
      <QuickSearchBar />
      
      {/* NEW: Map Heat Zone */}
      <MapHeatZone />
      
      {/* Rest of dashboard */}
      <VIPDashboardComplete />
    </div>
  );
}
```

---

## 🎯 Benefits

### For Users:
- ✅ **Visual decision-making** - See where most jobs are
- ✅ **Geographic insights** - Understand job market distribution
- ✅ **Salary comparison** - Compare salary ranges across areas
- ✅ **Strategic job search** - Focus on hotspot areas
- ✅ **Commute planning** - Choose nearby locations

### For Business:
- ✅ **Data transparency** - Build trust with users
- ✅ **Differentiation** - Unique feature vs competitors
- ✅ **Engagement boost** - Interactive element increases time on site
- ✅ **Premium value** - Justify VIP membership
- ✅ **Market insights** - Understand job distribution patterns

---

## 📊 Analytics Tracking

```typescript
// Track map interactions
gtag('event', 'map_interaction', {
  'event_category': 'engagement',
  'event_label': 'kecamatan_click',
  'value': kecamatan.name
});

// Track filter usage
gtag('event', 'map_filter', {
  'event_category': 'engagement',
  'filter_type': 'kategori',
  'filter_value': selectedKategori
});

// Track job view from map
gtag('event', 'map_to_jobs', {
  'event_category': 'conversion',
  'kecamatan': kecamatan.name,
  'job_count': kecamatan.total_jobs
});
```

---

## 🔧 Performance Optimization

### 1. Lazy Loading
```typescript
import dynamic from 'next/dynamic';

const MapHeatZone = dynamic(() => import('@/components/vip/MapHeatZone'), {
  loading: () => <MapSkeleton />,
  ssr: false // Disable SSR for map
});
```

### 2. Caching
```typescript
// Cache map data for 5 minutes
export const revalidate = 300;

// Or use SWR
import useSWR from 'swr';

const { data } = useSWR('/api/vip/map/stats', fetcher, {
  refreshInterval: 300000, // 5 min
  revalidateOnFocus: false
});
```

### 3. Image Optimization
```typescript
// Use tile CDN
url="https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=YOUR_KEY"
```

---

## 🧪 Testing

### Unit Tests
```typescript
describe('MapHeatZone', () => {
  it('renders map with correct center', () => {
    render(<MapHeatZone />);
    expect(screen.getByText('Peta Loker Jombang')).toBeInTheDocument();
  });

  it('calculates heat intensity correctly', () => {
    expect(calculateHeatIntensity(0)).toBe(0);
    expect(calculateHeatIntensity(5)).toBe(40);
    expect(calculateHeatIntensity(50)).toBe(100);
  });

  it('formats salary correctly', () => {
    expect(formatSalary(5000000, 7000000)).toBe('Rp 5.0 - 7.0 jt');
  });
});
```

### E2E Tests
```typescript
test('user can interact with map', async ({ page }) => {
  await page.goto('/vip');
  await page.click('text=Peta Loker Jombang');
  
  // Click marker
  await page.click('.custom-marker');
  await expect(page.locator('.leaflet-popup')).toBeVisible();
  
  // Apply filter
  await page.selectOption('select[name="kategori"]', 'IT');
  await page.waitForResponse('/api/vip/map/stats?kategori=IT');
});
```

---

## 💰 Cost Estimation

### Infrastructure:
- **Map Tiles:** FREE (OpenStreetMap)
- **Geocoding:** FREE (Nominatim, 1 req/sec limit)
- **Hosting:** Included in Vercel/Supabase
- **Storage:** ~10MB geo data

### Paid Alternatives (Optional):
- **Mapbox:** $5/1000 requests (better tiles)
- **Google Maps:** $7/1000 requests (most accurate)
- **Here Maps:** $1/1000 requests (good balance)

**Recommendation:** Start with FREE OpenStreetMap, upgrade if needed.

---

## 📅 Implementation Timeline

### Week 1: Setup & Data
- Day 1-2: Database schema & seed data
- Day 3-4: API endpoints
- Day 5: Testing & validation

### Week 2: Frontend
- Day 1-3: Map component with basic markers
- Day 4: Filters & interactions
- Day 5: Styling & polish

### Week 3: Advanced Features
- Day 1-2: Heatmap layer
- Day 3: Clustering (if needed)
- Day 4-5: Mobile optimization & testing

### Week 4: Integration & Launch
- Day 1-2: Dashboard integration
- Day 3: User testing & feedback
- Day 4: Bug fixes & optimization
- Day 5: Launch 🚀

---

## 🎓 Learning Resources

### Documentation:
- [Leaflet.js Docs](https://leafletjs.com/reference.html)
- [React Leaflet](https://react-leaflet.js.org/)
- [PostGIS Tutorial](https://postgis.net/workshops/postgis-intro/)
- [OpenStreetMap](https://www.openstreetmap.org/)

### Tutorials:
- [Creating Heat Maps](https://www.patrick-wied.at/static/heatmapjs/)
- [Leaflet Clustering](https://github.com/Leaflet/Leaflet.markercluster)
- [Geospatial Queries](https://supabase.com/docs/guides/database/extensions/postgis)

---

## ✅ Checklist

### Before Launch:
- [ ] Database schema created
- [ ] 21 kecamatan data seeded
- [ ] API endpoint tested
- [ ] Map renders correctly
- [ ] Markers show accurate data
- [ ] Filters work properly
- [ ] Mobile responsive
- [ ] Performance optimized
- [ ] Analytics tracking added
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Empty states designed
- [ ] Documentation updated
- [ ] User testing completed
- [ ] Bug fixes deployed

---

## 🎯 Success Metrics

### Engagement:
- **Map views:** Track daily/weekly
- **Interaction rate:** % users who click markers
- **Filter usage:** Which filters most used
- **Time on map:** Avg seconds
- **Kecamatan popularity:** Most viewed areas

### Conversion:
- **Map to jobs:** % who view jobs from map
- **Map to apply:** % who apply from map
- **Retention:** Do map users return more?

### Business:
- **Premium upgrade:** Does map drive upgrades?
- **User satisfaction:** NPS score
- **Feature adoption:** % active users who use map

---

## 💭 Future Enhancements

### Phase 2:
- 🚗 **Commute calculator** - Time/distance to work
- 📊 **Trend analysis** - Job growth over time
- 🏠 **Cost of living** - Compare living costs per area
- 📸 **Street view** - See actual location
- 🌐 **3D view** - Topographic map

### Phase 3:
- 🤖 **AI recommendations** - Best areas for you
- 📱 **AR view** - Point camera to see nearby jobs
- 🗺️ **Route planner** - Multiple interview locations
- 👥 **Social layer** - Where friends work
- 🏆 **Gamification** - Unlock areas by applying

---

## 📞 Support

If you need help implementing:
1. Database setup → Check DB schema section
2. API issues → Review API route code
3. Map not rendering → Verify Leaflet imports
4. Marker issues → Check custom icon function
5. Performance → See optimization section

---

**Created:** December 2024  
**Version:** 1.0  
**Status:** Ready for Implementation  

**Estimated Time:** 3-4 weeks  
**Difficulty:** Medium-High  
**Impact:** Very High 🚀  

---

## 🎬 Let's Build This!

This feature will be a **game-changer** for VIP Career. Users will love the visual, data-driven approach to job hunting.

**Next Steps:**
1. Review this document
2. Approve implementation
3. Start with database setup
4. Build API endpoints
5. Create map component
6. Test & iterate
7. Launch! 🚀

---

**Questions? Let me know and I'll help implement this feature! 💪**
