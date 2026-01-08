'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, Sparkles, Loader2, Check, X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

type StepType = 'upload' | 'review' | 'done';

interface ParsedData {
  title: string;
  perusahaan_name: string;
  lokasi: string;
  kategori: string[];
  tipe_kerja?: string;
  gaji_text?: string;
  gaji_min?: number;
  gaji_max?: number;
  deskripsi?: string;
  persyaratan?: string;
  kualifikasi: string[];
  skills: string[];
  benefit: string[];
  deadline?: string;
  kontak_person?: string;
  kontak_wa?: string;
  kontak_phone?: string;
  kontak_email?: string;
  apply_link?: string;
  apply_method?: 'whatsapp' | 'email' | 'link' | 'walk_in' | 'multiple';
  confidence_score: number;
  poster_url?: string | null;
}

export function LokerFormWithAI() {
  const router = useRouter();
  const [step, setStep] = useState<StepType>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [editedData, setEditedData] = useState<ParsedData | null>(null);

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
      // Pre-check: Verify we have a valid session
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Sesi login tidak ditemukan. Silakan login kembali.');
        window.location.href = '/admin-login';
        return;
      }

      console.log('[Parse Poster] User verified:', user.email);

      const formData = new FormData();
      formData.append('image', posterFile);

      const response = await fetch('/api/admin/vip/ai/parse-poster', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Important: send cookies for authentication
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('API error response:', error);

        // Show specific error messages
        if (response.status === 401) {
          throw new Error('Sesi login expired. Silakan login kembali.');
        } else if (response.status === 403) {
          throw new Error('Akses ditolak. Hanya admin yang bisa menggunakan fitur ini.');
        } else {
          throw new Error(error.error || error.details || 'Gagal parse poster');
        }
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
    if (!editedData) return;

    // Debug: Log data being sent
    console.log('[SAVE LOKER] Data being sent:', editedData);

    setIsProcessing(true);

    try {
      const response = await fetch('/api/admin/vip/loker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menyimpan loker');
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

  const updateEditedData = (field: keyof ParsedData, value: any) => {
    if (!editedData) return;
    setEditedData({ ...editedData, [field]: value });
  };

  const addKualifikasi = () => {
    if (!editedData) return;
    setEditedData({
      ...editedData,
      kualifikasi: [...editedData.kualifikasi, '']
    });
  };

  const updateKualifikasi = (index: number, value: string) => {
    if (!editedData) return;
    const newKualifikasi = [...editedData.kualifikasi];
    newKualifikasi[index] = value;
    setEditedData({ ...editedData, kualifikasi: newKualifikasi });
  };

  const removeKualifikasi = (index: number) => {
    if (!editedData) return;
    const newKualifikasi = editedData.kualifikasi.filter((_, i) => i !== index);
    setEditedData({ ...editedData, kualifikasi: newKualifikasi });
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
        <Card className="p-8 border-none shadow-sm bg-card/50 backdrop-blur-sm">
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
                  <img
                    src={posterPreview}
                    alt="Poster preview"
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
        <Card className="p-6 border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Review & Edit Data</h2>
              <p className="text-sm text-gray-600 mt-1">
                Hasil AI parsing - silakan koreksi jika ada yang salah
              </p>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <Check className="w-4 h-4 mr-1" />
              Confidence: {parsedData?.confidence_score}%
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
                    <img
                      src={posterPreview}
                      alt="Poster"
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
                      onChange={(e) => updateEditedData('title', e.target.value)}
                      placeholder="Contoh: Full Stack Developer"
                    />
                  </div>

                  <div>
                    <Label htmlFor="perusahaan_name">Nama Perusahaan *</Label>
                    <Input
                      id="perusahaan_name"
                      value={editedData.perusahaan_name || ''}
                      onChange={(e) => updateEditedData('perusahaan_name', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lokasi">Lokasi *</Label>
                    <Input
                      id="lokasi"
                      value={editedData.lokasi || ''}
                      onChange={(e) => updateEditedData('lokasi', e.target.value)}
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
                              updateEditedData('kategori', newKategori);
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
                    <Select
                      value={editedData.tipe_kerja || ''}
                      onValueChange={(value) => updateEditedData('tipe_kerja', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih tipe kerja" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
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
                    onChange={(e) => updateEditedData('gaji_text', e.target.value)}
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
                      onChange={(e) => updateEditedData('deskripsi', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Kualifikasi</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={addKualifikasi}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Tambah
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {editedData.kualifikasi?.map((kual: string, idx: number) => (
                        <div key={idx} className="flex gap-2">
                          <Input
                            value={kual}
                            onChange={(e) => updateKualifikasi(idx, e.target.value)}
                            placeholder={`Kualifikasi ${idx + 1}`}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeKualifikasi(idx)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Skills */}
                    <div>
                      <Label>Skills (Technical)</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {editedData.skills?.map((skill: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="px-3 py-1 bg-blue-100 text-blue-700">
                            {skill}
                            <button
                              onClick={() => {
                                const newSkills = editedData.skills?.filter((_: any, i: number) => i !== idx) || [];
                                updateEditedData('skills', newSkills);
                              }}
                              className="ml-2 text-blue-500 hover:text-red-600"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                        {(!editedData.skills || editedData.skills.length === 0) && (
                          <span className="text-sm text-muted-foreground">Tidak ada skills terdeteksi</span>
                        )}
                      </div>
                    </div>

                    {/* Benefit */}
                    <div>
                      <Label>Benefit / Fasilitas</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {editedData.benefit?.map((ben: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="px-3 py-1 bg-green-100 text-green-700">
                            {ben}
                            <button
                              onClick={() => {
                                const newBenefit = editedData.benefit?.filter((_: any, i: number) => i !== idx) || [];
                                updateEditedData('benefit', newBenefit);
                              }}
                              className="ml-2 text-green-500 hover:text-red-600"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                        {(!editedData.benefit || editedData.benefit.length === 0) && (
                          <span className="text-sm text-muted-foreground">Tidak ada benefit terdeteksi</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kontak */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">📞 Kontak</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="kontak_person">Contact Person</Label>
                      <Input
                        id="kontak_person"
                        value={editedData.kontak_person || ''}
                        onChange={(e) => updateEditedData('kontak_person', e.target.value)}
                        placeholder="Contoh: Ibu Sari, HRD"
                      />
                    </div>

                    <div>
                      <Label htmlFor="kontak_wa">WhatsApp</Label>
                      <Input
                        id="kontak_wa"
                        value={editedData.kontak_wa || ''}
                        onChange={(e) => updateEditedData('kontak_wa', e.target.value)}
                        placeholder="081234567890"
                      />
                    </div>

                    <div>
                      <Label htmlFor="kontak_phone">Telepon (Non-WA)</Label>
                      <Input
                        id="kontak_phone"
                        value={editedData.kontak_phone || ''}
                        onChange={(e) => updateEditedData('kontak_phone', e.target.value)}
                        placeholder="(0321) 123456"
                      />
                    </div>

                    <div>
                      <Label htmlFor="kontak_email">Email</Label>
                      <Input
                        id="kontak_email"
                        value={editedData.kontak_email || ''}
                        onChange={(e) => updateEditedData('kontak_email', e.target.value)}
                        placeholder="hr@perusahaan.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="apply_link">Link Apply (URL)</Label>
                      <Input
                        id="apply_link"
                        value={editedData.apply_link || ''}
                        onChange={(e) => updateEditedData('apply_link', e.target.value)}
                        placeholder="bit.ly/lamarkerja, forms.gle/xxx"
                      />
                    </div>

                    <div>
                      <Label htmlFor="apply_method">Cara Melamar</Label>
                      <Select
                        value={editedData.apply_method || ''}
                        onValueChange={(value) => updateEditedData('apply_method', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih cara melamar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="link">Link/URL</SelectItem>
                          <SelectItem value="walk_in">Walk-in Interview</SelectItem>
                          <SelectItem value="multiple">Multiple (Ada beberapa cara)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="deadline">Deadline (Optional)</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={editedData.deadline || ''}
                        onChange={(e) => updateEditedData('deadline', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t">
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
          </div>
        </Card>
      )}

      {/* STEP 3: Done */}
      {step === 'done' && (
        <Card className="p-12 text-center border-none shadow-sm bg-card/50 backdrop-blur-sm">
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
