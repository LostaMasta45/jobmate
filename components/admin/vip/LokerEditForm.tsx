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
import { Loader2, Check, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface LokerEditFormProps {
  loker: any;
}

export function LokerEditForm({ loker }: LokerEditFormProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    title: loker.title || '',
    perusahaan_name: loker.perusahaan_name || '',
    lokasi: loker.lokasi || '',
    kategori: loker.kategori || [],
    tipe_kerja: loker.tipe_kerja || '',
    gaji_text: loker.gaji_text || '',
    gaji_min: loker.gaji_min || '',
    gaji_max: loker.gaji_max || '',
    deskripsi: loker.deskripsi || '',
    persyaratan: loker.persyaratan || '',
    kualifikasi: loker.kualifikasi || [],
    deadline: loker.deadline || '',
    kontak_wa: loker.kontak_wa || '',
    kontak_email: loker.kontak_email || '',
    status: loker.status || 'draft',
  });

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const addKualifikasi = () => {
    setFormData({ 
      ...formData, 
      kualifikasi: [...formData.kualifikasi, ''] 
    });
  };

  const updateKualifikasi = (index: number, value: string) => {
    const newKualifikasi = [...formData.kualifikasi];
    newKualifikasi[index] = value;
    setFormData({ ...formData, kualifikasi: newKualifikasi });
  };

  const removeKualifikasi = (index: number) => {
    const newKualifikasi = formData.kualifikasi.filter((_item: string, i: number) => i !== index);
    setFormData({ ...formData, kualifikasi: newKualifikasi });
  };

  const handleSave = async () => {
    // Validation
    if (!formData.title || !formData.perusahaan_name || !formData.lokasi) {
      toast.error('Title, Perusahaan, dan Lokasi wajib diisi!');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(`/api/admin/vip/loker/${loker.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal update loker');
      }

      toast.success('✅ Loker berhasil diupdate!');
      router.push('/admin/vip-loker');
      router.refresh();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Gagal menyimpan perubahan');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Back Button */}
        <div>
          <Link href="/admin/vip-loker">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>

        {/* Informasi Dasar */}
        <div>
          <h3 className="text-lg font-semibold mb-4">📋 Informasi Dasar</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Judul Loker *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                placeholder="Contoh: Full Stack Developer"
              />
            </div>

            <div>
              <Label htmlFor="perusahaan_name">Nama Perusahaan *</Label>
              <Input
                id="perusahaan_name"
                value={formData.perusahaan_name}
                onChange={(e) => updateFormData('perusahaan_name', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="lokasi">Lokasi *</Label>
              <Input
                id="lokasi"
                value={formData.lokasi}
                onChange={(e) => updateFormData('lokasi', e.target.value)}
                placeholder="Contoh: Jombang Kota"
              />
            </div>

            <div>
              <Label>Kategori</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.kategori.map((kat: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="px-3 py-1">
                    {kat}
                    <button
                      onClick={() => {
                        const newKategori = formData.kategori.filter((_: any, i: number) => i !== idx);
                        updateFormData('kategori', newKategori);
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
                value={formData.tipe_kerja}
                onValueChange={(value) => updateFormData('tipe_kerja', value)}
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

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => updateFormData('status', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
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
              value={formData.gaji_text}
              onChange={(e) => updateFormData('gaji_text', e.target.value)}
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
                value={formData.deskripsi}
                onChange={(e) => updateFormData('deskripsi', e.target.value)}
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
                {formData.kualifikasi.map((kual: string, idx: number) => (
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
                value={formData.kontak_wa}
                onChange={(e) => updateFormData('kontak_wa', e.target.value)}
                placeholder="081234567890"
              />
            </div>

            <div>
              <Label htmlFor="kontak_email">Email</Label>
              <Input
                id="kontak_email"
                value={formData.kontak_email}
                onChange={(e) => updateFormData('kontak_email', e.target.value)}
                placeholder="hr@perusahaan.com"
              />
            </div>

            <div>
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => updateFormData('deadline', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t">
          <Link href="/admin/vip-loker" className="flex-1">
            <Button
              variant="outline"
              className="w-full"
              disabled={isProcessing}
            >
              Batal
            </Button>
          </Link>
          <Button
            onClick={handleSave}
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
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
