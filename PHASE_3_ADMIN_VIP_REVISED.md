# 📋 PHASE 3: Admin VIP Loker Management (REVISED)

## 🎯 Priority Update:
**80% admin upload via POSTER** → AI Parsing adalah fitur utama!

---

## 🚀 Implementation Priority (REVISED):

### **Week 1 - Day 1-2: AI Poster Parsing (CRITICAL)** 🔥
1. ✅ Setup Sumpod API integration (GPT-4o mini)
2. ✅ Admin upload poster page
3. ✅ AI parse poster → extract structured data
4. ✅ Auto-fill form dengan hasil parsing
5. ✅ Admin review & edit sebelum save

### **Week 1 - Day 3-4: CRUD Loker**
1. ✅ Admin loker list page (table view)
2. ✅ Admin save loker (dari hasil AI parsing)
3. ✅ Admin edit loker
4. ✅ Admin delete loker

### **Week 1 - Day 5: Perusahaan & Stats**
1. ✅ Admin tambah/edit perusahaan (quick form)
2. ✅ Stats dashboard

---

## 🤖 AI Poster Parsing - Detail Implementation

### **1. Sumpod API Setup**

**File: `lib/ai/sumpod-poster.ts`**

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  baseURL: 'https://api.sumpod.com/v1',
});

interface PosterParseResult {
  title: string;
  perusahaan_name: string;
  lokasi: string;
  kategori: string[];
  tipe_kerja?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Remote';
  gaji_text?: string;
  gaji_min?: number;
  gaji_max?: number;
  deskripsi?: string;
  persyaratan?: string;
  kualifikasi: string[];
  deadline?: string;
  kontak_wa?: string;
  kontak_email?: string;
  sumber: 'Poster';
  confidence_score: number; // 0-100
}

export async function parsePosterWithAI(
  imageBase64: string,
  imageMimeType: string
): Promise<PosterParseResult> {
  const prompt = `Kamu adalah AI yang expert dalam membaca poster lowongan kerja di Indonesia.

TUGAS: Extract informasi dari poster loker ini dengan SANGAT TELITI.

OUTPUT FORMAT (JSON):
{
  "title": "Posisi/Jabatan yang dicari (contoh: Full Stack Developer, Marketing Executive)",
  "perusahaan_name": "Nama perusahaan (contoh: PT Maju Jaya, CV Sukses Mandiri)",
  "lokasi": "Lokasi kerja (contoh: Jombang Kota, Mojowarno, Ploso)",
  "kategori": ["Kategori 1", "Kategori 2"], // Array, contoh: ["IT", "Web Development"], ["Marketing", "Sales"]
  "tipe_kerja": "Full-time | Part-time | Contract | Freelance | Remote",
  "gaji_text": "Format gaji seperti di poster (contoh: Rp 5-7 juta, UMR + Tunjangan, Gaji pokok + komisi)",
  "gaji_min": 5000000, // Angka minimum (optional, extract dari gaji_text jika ada)
  "gaji_max": 7000000, // Angka maximum (optional)
  "deskripsi": "Deskripsi pekerjaan atau benefit yang disebutkan",
  "persyaratan": "Persyaratan umum (jika ada, contoh: Min. 2 tahun pengalaman, Pendidikan S1)",
  "kualifikasi": [
    "Kualifikasi 1",
    "Kualifikasi 2",
    "Kualifikasi 3"
  ], // Array of bullet points
  "deadline": "YYYY-MM-DD format (jika ada tanggal deadline, convert ke format ini)",
  "kontak_wa": "Nomor WA (jika ada, format: 081234567890)",
  "kontak_email": "Email (jika ada)",
  "confidence_score": 85 // 0-100, seberapa yakin AI dengan hasil parsing
}

RULES:
1. Jika informasi tidak ada di poster, gunakan null atau []
2. Kategori harus dari list: IT, Web Development, Marketing, Sales, Finance, Accounting, Administrasi, Customer Service, F&B, Retail, Design, Content Creator, Manufacturing, Healthcare, Logistik, Education, Security
3. Lokasi harus spesifik: Jombang Kota, Mojowarno, Ploso, Sumobito, Diwek, Kabuh, dll (sesuai poster)
4. Gaji: Extract angka jika ada, kalau tidak ada angka jelas simpan text mentahnya
5. Kualifikasi: Buat array terpisah untuk setiap poin (max 10 items)
6. Nomor WA: Bersihkan format, hanya angka (contoh: 081234567890)
7. Response HARUS valid JSON, tidak boleh ada markdown atau text lain

EXTRACT DATA:`;

  const response = await client.messages.create({
    model: 'gpt-4o-mini',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: imageMimeType,
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
  });

  // Parse response
  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from AI');
  }

  // Extract JSON from response (handle markdown wrapper if exists)
  let jsonText = content.text.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/```\n?/g, '');
  }

  const parsed: PosterParseResult = JSON.parse(jsonText);
  
  // Validation & cleanup
  if (!parsed.title || !parsed.perusahaan_name || !parsed.lokasi) {
    throw new Error('AI gagal extract informasi penting (title/perusahaan/lokasi)');
  }

  return {
    ...parsed,
    sumber: 'Poster',
  };
}
```

---

### **2. API Route - Parse Poster**

**File: `app/api/admin/vip/ai/parse-poster/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parsePosterWithAI } from '@/lib/ai/sumpod-poster';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check admin auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get image from request
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPG, PNG, WEBP' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Max 5MB' },
        { status: 400 }
      );
    }

    // Convert to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Parse with AI
    const result = await parsePosterWithAI(base64, imageFile.type);

    // Optional: Upload to Supabase Storage for reference
    const fileName = `poster-${Date.now()}-${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vip-posters')
      .upload(fileName, imageFile, {
        contentType: imageFile.type,
        cacheControl: '3600',
        upsert: false,
      });

    let posterUrl = null;
    if (!uploadError && uploadData) {
      const { data: { publicUrl } } = supabase.storage
        .from('vip-posters')
        .getPublicUrl(uploadData.path);
      posterUrl = publicUrl;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        poster_url: posterUrl,
      },
    });
  } catch (error: any) {
    console.error('Parse poster error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse poster' },
      { status: 500 }
    );
  }
}
```

---

### **3. Admin Page - Upload & Parse Poster**

**File: `app/(admin)/admin/vip-loker/tambah/page.tsx`**

```typescript
import { Metadata } from 'next';
import { LokerFormWithAI } from '@/components/admin/vip/LokerFormWithAI';

export const metadata: Metadata = {
  title: 'Tambah Loker - Admin VIP Career',
};

export default function TambahLokerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tambah Loker Baru</h1>
        <p className="text-gray-600 mt-2">
          Upload poster loker untuk parsing otomatis dengan AI
        </p>
      </div>

      <LokerFormWithAI />
    </div>
  );
}
```

---

### **4. Component - Form dengan AI Parsing**

**File: `components/admin/vip/LokerFormWithAI.tsx`**

```typescript
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Sparkles, Loader2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export function LokerFormWithAI() {
  const router = useRouter();
  const [step, setStep] = useState<'upload' | 'review' | 'done'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [editedData, setEditedData] = useState<any>(null);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    setPosterFile(file);

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPosterPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Parse poster with AI
  const handleParsePoster = async () => {
    if (!posterFile) return;

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('image', posterFile);

      const response = await fetch('/api/admin/vip/ai/parse-poster', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal parse poster');
      }

      const result = await response.json();
      
      setParsedData(result.data);
      setEditedData(result.data); // Clone untuk editing
      setStep('review');
      
      toast.success(`✨ Poster berhasil di-parse! (Confidence: ${result.data.confidence_score}%)`);
    } catch (error: any) {
      console.error('Parse error:', error);
      toast.error(error.message || 'Gagal memproses poster');
    } finally {
      setIsProcessing(false);
    }
  };

  // Save loker
  const handleSaveLoker = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch('/api/admin/vip/loker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan loker');
      }

      toast.success('✅ Loker berhasil disimpan!');
      setStep('done');
      
      setTimeout(() => {
        router.push('/admin/vip-loker');
      }, 1500);
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Gagal menyimpan loker');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4">
        <StepBadge active={step === 'upload'} completed={step !== 'upload'}>
          1. Upload Poster
        </StepBadge>
        <div className="w-12 h-0.5 bg-gray-300" />
        <StepBadge active={step === 'review'} completed={step === 'done'}>
          2. Review & Edit
        </StepBadge>
        <div className="w-12 h-0.5 bg-gray-300" />
        <StepBadge active={step === 'done'} completed={false}>
          3. Selesai
        </StepBadge>
      </div>

      {/* STEP 1: Upload Poster */}
      {step === 'upload' && (
        <Card className="p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Upload className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2">Upload Poster Loker</h2>
              <p className="text-gray-600">
                AI akan otomatis extract informasi dari poster
              </p>
            </div>

            {!posterPreview ? (
              <div>
                <Label
                  htmlFor="poster-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <span className="text-sm text-gray-600">
                    Klik untuk upload atau drag & drop
                  </span>
                  <span className="text-xs text-gray-500 mt-2">
                    PNG, JPG, WEBP (Max 5MB)
                  </span>
                </Label>
                <Input
                  id="poster-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative w-full max-w-md mx-auto border-2 border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={posterPreview}
                    alt="Poster preview"
                    width={400}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
                
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPosterFile(null);
                      setPosterPreview(null);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Ganti Poster
                  </Button>
                  
                  <Button
                    onClick={handleParsePoster}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Memproses dengan AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Parse dengan AI
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* STEP 2: Review & Edit */}
      {step === 'review' && editedData && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Review & Edit Data</h2>
              <p className="text-sm text-gray-600 mt-1">
                Hasil AI parsing - silakan koreksi jika ada yang salah
              </p>
            </div>
            <Badge className="bg-green-100 text-green-700">
              <Check className="w-4 h-4 mr-1" />
              Confidence: {parsedData.confidence_score}%
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Poster Preview (kiri) */}
            <div className="lg:col-span-1">
              {posterPreview && (
                <div className="sticky top-6">
                  <Label className="text-sm font-semibold mb-2 block">
                    Poster Original
                  </Label>
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={posterPreview}
                      alt="Poster"
                      width={300}
                      height={450}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Form Fields (kanan) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informasi Dasar */}
              <div>
                <h3 className="text-lg font-semibold mb-4">📋 Informasi Dasar</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Judul Loker *</Label>
                    <Input
                      id="title"
                      value={editedData.title || ''}
                      onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                      placeholder="Contoh: Full Stack Developer"
                    />
                  </div>

                  <div>
                    <Label htmlFor="perusahaan_name">Nama Perusahaan *</Label>
                    <Input
                      id="perusahaan_name"
                      value={editedData.perusahaan_name || ''}
                      onChange={(e) => setEditedData({ ...editedData, perusahaan_name: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lokasi">Lokasi *</Label>
                    <Input
                      id="lokasi"
                      value={editedData.lokasi || ''}
                      onChange={(e) => setEditedData({ ...editedData, lokasi: e.target.value })}
                      placeholder="Contoh: Jombang Kota"
                    />
                  </div>

                  <div>
                    <Label>Kategori</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editedData.kategori?.map((kat: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="px-3 py-1">
                          {kat}
                          <button
                            onClick={() => {
                              const newKategori = editedData.kategori.filter((_: any, i: number) => i !== idx);
                              setEditedData({ ...editedData, kategori: newKategori });
                            }}
                            className="ml-2 text-gray-500 hover:text-red-600"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tipe_kerja">Tipe Kerja</Label>
                    <select
                      id="tipe_kerja"
                      value={editedData.tipe_kerja || ''}
                      onChange={(e) => setEditedData({ ...editedData, tipe_kerja: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Pilih tipe kerja</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Gaji */}
              <div>
                <h3 className="text-lg font-semibold mb-4">💰 Gaji</h3>
                <div>
                  <Label htmlFor="gaji_text">Gaji (Text)</Label>
                  <Input
                    id="gaji_text"
                    value={editedData.gaji_text || ''}
                    onChange={(e) => setEditedData({ ...editedData, gaji_text: e.target.value })}
                    placeholder="Contoh: Rp 5-7 juta + komisi"
                  />
                </div>
              </div>

              {/* Deskripsi & Kualifikasi */}
              <div>
                <h3 className="text-lg font-semibold mb-4">📝 Deskripsi & Kualifikasi</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deskripsi">Deskripsi / Benefit</Label>
                    <Textarea
                      id="deskripsi"
                      value={editedData.deskripsi || ''}
                      onChange={(e) => setEditedData({ ...editedData, deskripsi: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>Kualifikasi</Label>
                    <div className="space-y-2 mt-2">
                      {editedData.kualifikasi?.map((kual: string, idx: number) => (
                        <div key={idx} className="flex gap-2">
                          <Input
                            value={kual}
                            onChange={(e) => {
                              const newKualifikasi = [...editedData.kualifikasi];
                              newKualifikasi[idx] = e.target.value;
                              setEditedData({ ...editedData, kualifikasi: newKualifikasi });
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newKualifikasi = editedData.kualifikasi.filter((_: any, i: number) => i !== idx);
                              setEditedData({ ...editedData, kualifikasi: newKualifikasi });
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Kontak */}
              <div>
                <h3 className="text-lg font-semibold mb-4">📞 Kontak</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="kontak_wa">WhatsApp</Label>
                    <Input
                      id="kontak_wa"
                      value={editedData.kontak_wa || ''}
                      onChange={(e) => setEditedData({ ...editedData, kontak_wa: e.target.value })}
                      placeholder="081234567890"
                    />
                  </div>

                  <div>
                    <Label htmlFor="kontak_email">Email</Label>
                    <Input
                      id="kontak_email"
                      value={editedData.kontak_email || ''}
                      onChange={(e) => setEditedData({ ...editedData, kontak_email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep('upload')}
                  disabled={isProcessing}
                >
                  Kembali
                </Button>
                <Button
                  onClick={handleSaveLoker}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Simpan Loker
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 3: Done */}
      {step === 'done' && (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Loker Berhasil Disimpan!</h2>
          <p className="text-gray-600 mb-6">
            Redirect ke list loker dalam 2 detik...
          </p>
        </Card>
      )}
    </div>
  );
}

function StepBadge({ active, completed, children }: { active: boolean; completed: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`
        px-4 py-2 rounded-full text-sm font-medium transition-all
        ${completed ? 'bg-green-100 text-green-700' : ''}
        ${active && !completed ? 'bg-blue-100 text-blue-700' : ''}
        ${!active && !completed ? 'bg-gray-100 text-gray-500' : ''}
      `}
    >
      {children}
    </div>
  );
}
```

---

## ✅ What You Need to Check:

### **1. AI Parsing Format Match**
Output AI harus sesuai struktur mock data:
```typescript
// ✅ GOOD - Match dengan mock data
{
  "title": "Full Stack Developer",
  "perusahaan_name": "Tekno Digital Solutions",
  "lokasi": "Jombang Kota",
  "kategori": ["IT", "Web Development"],
  "tipe_kerja": "Full-time",
  "gaji_text": "Rp 5-7 juta",
  "kualifikasi": [
    "Pengalaman 2+ tahun sebagai Full Stack Developer",
    "Menguasai React.js, Node.js, PostgreSQL"
  ],
  "kontak_wa": "086789012345",
  "sumber": "Poster"
}
```

### **2. Sumpod API Credentials**
```bash
# .env.local
ANTHROPIC_API_KEY=your_sumpod_api_key_here
```

### **3. Supabase Storage Bucket**
Buat bucket `vip-posters` di Supabase:
- Public bucket
- Max file size: 5MB
- Allowed: image/jpeg, image/png, image/webp

### **4. Flow Summary**
```
Admin → Upload Poster (JPG/PNG)
   ↓
[Parse dengan AI] button
   ↓
Send to /api/admin/vip/ai/parse-poster
   ↓
AI extract data (Sumpod GPT-4o mini)
   ↓
Return structured JSON + Upload poster to Storage
   ↓
Show form with auto-filled data
   ↓
Admin review & edit
   ↓
[Simpan Loker] → POST /api/admin/vip/loker
   ↓
Save to vip_loker table
   ↓
Redirect to loker list
```

---

## 📝 Changes dari Version Sebelumnya:

1. ✅ AI Parsing jadi **Priority #1** (Day 1-2)
2. ✅ Sumpod GPT-4o mini integration (sama seperti tools lain)
3. ✅ Detailed prompt engineering untuk extract loker data
4. ✅ Output format match dengan mock data structure
5. ✅ 3-step flow: Upload → Review → Save
6. ✅ Confidence score untuk tracking AI accuracy
7. ✅ Upload poster ke Supabase Storage (optional keep)

---

## 🚀 Ready to Start?

**Questions:**
1. API key Sumpod sudah ada? (check .env.local)
2. Supabase Storage bucket `vip-posters` mau saya buatkan SQL-nya?
3. Start dengan file mana dulu:
   - **A:** `lib/ai/sumpod-poster.ts` (AI parsing logic)
   - **B:** `app/api/admin/vip/ai/parse-poster/route.ts` (API endpoint)
   - **C:** `components/admin/vip/LokerFormWithAI.tsx` (UI component)

**Approve & pilih A/B/C untuk start!** 🚀
