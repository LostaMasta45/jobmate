'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Upload,
  Loader2,
  Check,
  X,
  FileImage,
  AlertCircle,
  Save,
  Trash2,
  Plus,
  Minus,
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface JobPosition {
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
  deadline?: string;
  kontak_wa?: string;
  kontak_email?: string;
}

interface PosterResult {
  poster_index: number;
  poster_filename: string;
  poster_url?: string;
  positions: JobPosition[];
  has_multiple_positions: boolean;
  confidence_score: number;
  error?: string;
}

type StepType = 'upload' | 'review' | 'done';

export function BatchPosterUpload() {
  const router = useRouter();
  const [step, setStep] = useState<StepType>('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parseResults, setParseResults] = useState<PosterResult[]>([]);
  const [editedJobs, setEditedJobs] = useState<(JobPosition & { poster_url?: string; poster_filename?: string })[]>([]);

  // Handle file selection
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) return;

    if (selectedFiles.length > 10) {
      toast.error('Maksimal 10 poster per batch');
      return;
    }

    // Validate each file
    const invalidFiles = selectedFiles.filter(
      (file) => !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024
    );

    if (invalidFiles.length > 0) {
      toast.error('Beberapa file tidak valid (harus gambar, max 5MB)');
      return;
    }

    setFiles(selectedFiles);

    // Generate previews
    const previewPromises = selectedFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then(setPreviews);
  };

  // Parse posters with AI
  const handleParse = async () => {
    setIsParsing(true);

    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`image${index}`, file);
      });

      const response = await fetch('/api/admin/vip/ai/batch-parse-posters', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal parse posters');
      }

      const result = await response.json();
      
      setParseResults(result.results);

      // Flatten all positions from all posters for editing
      const allJobs: (JobPosition & { poster_url?: string; poster_filename?: string })[] = [];
      result.results.forEach((posterResult: PosterResult) => {
        posterResult.positions.forEach((position) => {
          allJobs.push({
            ...position,
            poster_url: posterResult.poster_url,
            poster_filename: posterResult.poster_filename,
          });
        });
      });

      setEditedJobs(allJobs);
      setStep('review');

      toast.success(
        `✨ ${result.summary.parsed_successfully}/${result.summary.total_posters} poster berhasil di-parse! ${result.summary.total_positions} posisi ditemukan.`
      );
    } catch (error: any) {
      console.error('Parse error:', error);
      toast.error(error.message || 'Gagal parse posters');
    } finally {
      setIsParsing(false);
    }
  };

  // Update job field
  const updateJob = (index: number, field: keyof JobPosition, value: any) => {
    setEditedJobs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Remove job
  const removeJob = (index: number) => {
    setEditedJobs((prev) => prev.filter((_, i) => i !== index));
  };

  // Duplicate job
  const duplicateJob = (index: number) => {
    setEditedJobs((prev) => {
      const updated = [...prev];
      const duplicate = { ...updated[index] };
      updated.splice(index + 1, 0, duplicate);
      return updated;
    });
  };

  // Save all jobs
  const handleSaveAll = async () => {
    if (editedJobs.length === 0) {
      toast.error('Tidak ada job untuk disimpan');
      return;
    }

    // Validate
    const invalid = editedJobs.some(
      (job) => !job.title || !job.perusahaan_name || !job.lokasi
    );

    if (invalid) {
      toast.error('Semua job harus punya Title, Perusahaan, dan Lokasi');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/vip/loker/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobs: editedJobs }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal save jobs');
      }

      const result = await response.json();

      setStep('done');

      toast.success(
        `🎉 ${result.summary.success}/${result.summary.total} job berhasil dipublish!`
      );

      if (result.summary.failed > 0) {
        toast.warning(`${result.summary.failed} job gagal disimpan`);
      }

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/admin/vip-loker');
        router.refresh();
      }, 3000);
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Gagal save jobs');
    } finally {
      setIsSaving(false);
    }
  };

  // Upload Step
  if (step === 'upload') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Batch Upload Poster Loker
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload hingga 10 poster sekaligus. AI akan otomatis extract data dan detect multiple posisi per poster.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="posters">Pilih Poster (Max 10 files)</Label>
            <Input
              id="posters"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
              disabled={isParsing}
            />
            <p className="text-xs text-muted-foreground">
              Format: JPG, PNG, WebP | Max 5MB per file
            </p>
          </div>

          {/* Preview */}
          {previews.length > 0 && (
            <div className="space-y-3">
              <Label>{previews.length} poster dipilih</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg border overflow-hidden bg-muted">
                    <Image
                      src={preview}
                      alt={`Poster ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                      <p className="text-xs text-white truncate">{files[index]?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleParse}
              disabled={files.length === 0 || isParsing}
              className="flex-1"
            >
              {isParsing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Parsing {files.length} poster...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Parse dengan AI
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Review Step
  if (step === 'review') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Review & Edit</CardTitle>
            <p className="text-sm text-muted-foreground">
              {editedJobs.length} posisi ditemukan dari {parseResults.length} poster. Review dan edit sebelum publish.
            </p>
          </CardHeader>
        </Card>

        {editedJobs.map((job, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{index + 1}</Badge>
                    <Badge variant="secondary">{job.poster_filename}</Badge>
                  </div>
                  <Input
                    value={job.title}
                    onChange={(e) => updateJob(index, 'title', e.target.value)}
                    placeholder="Judul Posisi *"
                    className="font-semibold text-lg"
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => duplicateJob(index)}
                    title="Duplicate"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeJob(index)}
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Perusahaan *</Label>
                  <Input
                    value={job.perusahaan_name}
                    onChange={(e) => updateJob(index, 'perusahaan_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lokasi *</Label>
                  <Input
                    value={job.lokasi}
                    onChange={(e) => updateJob(index, 'lokasi', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Gaji</Label>
                  <Input
                    value={job.gaji_text || ''}
                    onChange={(e) => updateJob(index, 'gaji_text', e.target.value)}
                    placeholder="Contoh: Rp 5-7 juta"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipe Kerja</Label>
                  <Select
                    value={job.tipe_kerja || ''}
                    onValueChange={(value) => updateJob(index, 'tipe_kerja', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe" />
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

              <div className="space-y-2">
                <Label>Kategori</Label>
                <Input
                  value={job.kategori.join(', ')}
                  onChange={(e) =>
                    updateJob(
                      index,
                      'kategori',
                      e.target.value.split(',').map((k) => k.trim())
                    )
                  }
                  placeholder="Pisahkan dengan koma"
                />
              </div>

              <div className="space-y-2">
                <Label>Kontak WA</Label>
                <Input
                  value={job.kontak_wa || ''}
                  onChange={(e) => updateJob(index, 'kontak_wa', e.target.value)}
                  placeholder="081234567890"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Save Button */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setStep('upload');
              setFiles([]);
              setPreviews([]);
              setParseResults([]);
              setEditedJobs([]);
            }}
          >
            <X className="mr-2 h-4 w-4" />
            Batal
          </Button>
          <Button
            onClick={handleSaveAll}
            disabled={isSaving || editedJobs.length === 0}
            className="flex-1"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan {editedJobs.length} job...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Publish {editedJobs.length} Job
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Done Step
  return (
    <Card>
      <CardContent className="py-12 text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Batch Upload Berhasil!</h3>
          <p className="text-muted-foreground">
            Lowongan sudah dipublish di VIP Career Portal
          </p>
        </div>
        <Button onClick={() => router.push('/admin/vip-loker')}>
          Lihat Semua Loker
        </Button>
      </CardContent>
    </Card>
  );
}
