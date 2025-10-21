// ============================================
// VIP CAREER - TypeScript Types & Interfaces
// ============================================

// Database Tables Types
export interface Perusahaan {
  id: string
  slug: string
  name: string
  logo_url?: string
  deskripsi?: string
  lokasi?: string
  website?: string
  email?: string
  whatsapp?: string
  instagram?: string
  industri?: string
  ukuran?: 'Startup' | 'UMKM' | 'Menengah' | 'Besar'
  created_at: string
  updated_at: string
}

export interface Loker {
  id: string
  title: string
  perusahaan_id?: string
  perusahaan_name: string
  perusahaan_logo?: string | null
  perusahaan?: Perusahaan
  lokasi: string
  kategori: string[]
  tipe_pekerjaan?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Remote'
  gaji_min?: number
  gaji_max?: number
  gaji_text?: string
  deskripsi?: string
  persyaratan?: string
  kualifikasi?: string[]
  benefit?: string[]
  deadline?: string
  sumber?: 'WA' | 'IG' | 'Poster'
  poster_url?: string
  status: 'draft' | 'published' | 'expired' | 'archived'
  is_featured: boolean
  view_count: number
  apply_count?: number
  kontak_person?: string
  kontak_phone?: string
  kontak_email?: string
  created_by?: string
  created_at?: string
  updated_at?: string
  published_at?: string
  is_bookmarked?: boolean
}

export interface Bookmark {
  id: string
  member_id: string
  loker_id: string
  loker?: Loker
  created_at: string
}

export interface JobAlert {
  id: string
  member_id: string
  nama_alert: string
  kategori?: string[]
  lokasi?: string[]
  tipe_pekerjaan?: string[]
  gaji_min?: number
  is_active: boolean
  notif_email: boolean
  notif_browser: boolean
  created_at: string
  updated_at: string
}

export interface LokerView {
  id: string
  loker_id: string
  member_id?: string
  viewed_at: string
}

export interface LokerApplication {
  id: string
  loker_id: string
  member_id: string
  method: 'whatsapp' | 'email'
  applied_at: string
}

export interface Order {
  id: string
  user_id: string
  plan_id: 'basic' | 'premium'
  amount: number
  status: 'pending' | 'paid' | 'failed' | 'expired' | 'refunded'
  payment_method?: string
  provider_order_id?: string
  paid_at?: string
  created_at: string
  updated_at: string
}

export interface WAInvitation {
  id: string
  user_id: string
  wa_number: string
  invite_link?: string
  status: 'pending' | 'sent' | 'joined' | 'failed'
  sent_at?: string
  joined_at?: string
  created_at: string
}

// Membership Types
export type MembershipTier = 'basic' | 'premium'
export type MembershipStatus = 'active' | 'inactive' | 'expired' | 'cancelled'

export interface MemberProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'user' | 'admin'
  membership_tier?: MembershipTier
  membership_status?: MembershipStatus
  membership_started_at?: string
  membership_expires_at?: string
  wa_number?: string
  wa_invite_sent?: boolean
}

// Filter & Search Types
export interface LokerFilters {
  search?: string
  kategori?: string[]
  lokasi?: string[]
  tipe_kerja?: string
  gaji_min?: number
  gaji_max?: number
  sort?: 'terbaru' | 'deadline' | 'gaji_tertinggi' | 'paling_dilihat'
  page?: number
  limit?: number
}

export interface PerusahaanFilters {
  search?: string
  lokasi?: string[]
  industri?: string[]
  page?: number
  limit?: number
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form Types
export interface LokerFormData {
  title: string
  perusahaan_id?: string
  perusahaan_name: string
  lokasi: string
  kategori: string[]
  tipe_kerja?: string
  gaji_min?: number
  gaji_max?: number
  gaji_text?: string
  deskripsi?: string
  persyaratan?: string
  kualifikasi?: string[]
  deadline?: string
  sumber?: 'WA' | 'IG' | 'Poster'
  poster_url?: string
  kontak_wa?: string
  kontak_email?: string
  status: 'draft' | 'published'
}

export interface PerusahaanFormData {
  name: string
  logo_url?: string
  deskripsi?: string
  lokasi?: string
  website?: string
  email?: string
  whatsapp?: string
  instagram?: string
  industri?: string
  ukuran?: string
}

export interface JobAlertFormData {
  nama_alert: string
  kategori?: string[]
  lokasi?: string[]
  tipe_kerja?: string[]
  gaji_min?: number
  notif_email: boolean
  notif_browser: boolean
}

// AI Parsing Response
export interface AIPosterParseResponse {
  title?: string
  perusahaan?: string
  lokasi?: string
  kategori?: string[]
  gaji?: string
  kontak?: {
    wa?: string
    email?: string
  }
  deadline?: string
  raw_text: string
}

export interface AIJobDescriptionResponse {
  deskripsi: string
  persyaratan: string
  kualifikasi: string[]
}

// Constants
export const KATEGORI_LOKER = [
  'IT',
  'Web Development',
  'Mobile Development',
  'Marketing',
  'Sales',
  'Finance',
  'Accounting',
  'Human Resources',
  'Administrasi',
  'Customer Service',
  'Logistik',
  'Produksi',
  'Design',
  'Content Creator',
  'Pendidikan',
  'Kesehatan',
  'F&B',
  'Retail',
  'Lainnya'
] as const

export const LOKASI_JOMBANG = [
  'Jombang Kota',
  'Mojoagung',
  'Ploso',
  'Tembelang',
  'Jogoroto',
  'Sumobito',
  'Peterongan',
  'Megaluh',
  'Bareng',
  'Kabuh',
  'Kudu',
  'Ngoro',
  'Mojowarno',
  'Diwek',
  'Gudo',
  'Ngusikan',
  'Kesamben',
  'Bandar Kedung Mulyo',
  'Perak',
  'Plandaan',
  'Wonosalam'
] as const

export const TIPE_KERJA = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Remote'
] as const

export const INDUSTRI_OPTIONS = [
  'Technology',
  'Manufacturing',
  'Retail',
  'F&B',
  'Education',
  'Healthcare',
  'Finance',
  'Logistics',
  'Creative',
  'Services',
  'Lainnya'
] as const

export const SORT_OPTIONS = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'deadline', label: 'Deadline Terdekat' },
  { value: 'gaji_tertinggi', label: 'Gaji Tertinggi' },
  { value: 'paling_dilihat', label: 'Paling Dilihat' }
] as const

// Utility Types
export type LokerStatus = Loker['status']
export type TipeKerja = Loker['tipe_pekerjaan']
export type Sumber = Loker['sumber']
export type ApplyMethod = LokerApplication['method']
