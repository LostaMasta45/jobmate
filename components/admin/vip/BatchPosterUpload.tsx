'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
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
  Sparkles,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  Maximize2,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  Tags,
  AlignLeft,
  ListChecks
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- Interfaces ---
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
  skills: string[];
  benefit: string[];
  deadline?: string;
  kontak_person?: string;
  kontak_wa?: string;
  kontak_phone?: string;
  kontak_email?: string;
  apply_link?: string;
  apply_method?: 'whatsapp' | 'email' | 'link' | 'walk_in' | 'multiple';
}

interface PosterResult {
  poster_index: number;
  poster_filename: string;
  poster_url?: string;
  positions: Array<{
    title: string;
    perusahaan_name: string;
    lokasi: string;
    kategori?: string[];
    tipe_kerja?: string;
    gaji_text?: string;
    gaji_min?: number;
    gaji_max?: number;
    deskripsi?: string;
    persyaratan?: string;
    kualifikasi?: string[];
    skills?: string[];
    benefit?: string[];
    deadline?: string;
    kontak_person?: string;
    kontak_wa?: string;
    kontak_phone?: string;
    kontak_email?: string;
  }>;
  has_multiple_positions: boolean;
  confidence_score: number;
  error?: string;
}

type StepType = 'upload' | 'review' | 'done';

const STEPS = [
  { id: 'upload', label: 'Upload Posters', icon: Upload },
  { id: 'review', label: 'Review Data', icon: FileText },
  { id: 'done', label: 'Published', icon: Check },
];

export function BatchPosterUpload() {
  const router = useRouter();
  const [step, setStep] = useState<StepType>('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parseResults, setParseResults] = useState<PosterResult[]>([]);
  const [editedJobs, setEditedJobs] = useState<(JobPosition & { poster_url?: string; poster_filename?: string })[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // --- Handlers ---

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;

    if (selectedFiles.length > 10) {
      toast.error('Maksimal 10 poster per batch');
      return;
    }

    const validFiles = selectedFiles.filter(
      (file) => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.warning('Beberapa file diabaikan (bukan gambar atau > 5MB)');
    }

    if (validFiles.length === 0) return;

    setFiles(validFiles);

    const previewPromises = validFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then(setPreviews);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

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

      const allJobs: (JobPosition & { poster_url?: string; poster_filename?: string })[] = [];
      result.results.forEach((posterResult: PosterResult) => {
        posterResult.positions.forEach((position) => {
          allJobs.push({
            title: position.title || '',
            perusahaan_name: position.perusahaan_name || '',
            lokasi: position.lokasi || '',
            kategori: Array.isArray(position.kategori) ? position.kategori : [],
            tipe_kerja: position.tipe_kerja || undefined,
            gaji_text: position.gaji_text || undefined,
            gaji_min: position.gaji_min || undefined,
            gaji_max: position.gaji_max || undefined,
            deskripsi: position.deskripsi || undefined,
            persyaratan: position.persyaratan || undefined,
            kualifikasi: Array.isArray(position.kualifikasi) ? position.kualifikasi : [],
            skills: Array.isArray(position.skills) ? position.skills : [],
            benefit: Array.isArray(position.benefit) ? position.benefit : [],
            deadline: position.deadline || undefined,
            kontak_person: position.kontak_person || undefined,
            kontak_wa: position.kontak_wa || undefined,
            kontak_phone: position.kontak_phone || undefined,
            kontak_email: position.kontak_email || undefined,
            apply_link: position.apply_link || undefined,
            apply_method: position.apply_method || undefined,
            poster_url: posterResult.poster_url,
            poster_filename: posterResult.poster_filename,
          });
        });
      });

      setEditedJobs(allJobs);
      setStep('review');
      toast.success(`✨ Berhasil parse! ${result.summary.total_positions} posisi ditemukan.`);
    } catch (error: any) {
      console.error('Parse error:', error);
      toast.error(error.message || 'Gagal parse posters');
    } finally {
      setIsParsing(false);
    }
  };

  const updateJob = (index: number, field: keyof JobPosition, value: any) => {
    setEditedJobs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeJob = (index: number) => {
    setEditedJobs((prev) => prev.filter((_, i) => i !== index));
  };

  const duplicateJob = (index: number) => {
    setEditedJobs((prev) => {
      const updated = [...prev];
      const duplicate = { ...updated[index] };
      updated.splice(index + 1, 0, duplicate);
      return updated;
    });
  };

  const handleSaveAll = async () => {
    if (editedJobs.length === 0) {
      toast.error('Tidak ada job untuk disimpan');
      return;
    }

    const invalid = editedJobs.some((job) => !job.title || !job.perusahaan_name || !job.lokasi);
    if (invalid) {
      toast.error('Title, Perusahaan, dan Lokasi wajib diisi untuk semua job.');
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
      toast.success(`🎉 ${result.summary.success} job berhasil dipublish!`);

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

  // --- Render Helper: Progress Steps ---
  const renderSteps = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center gap-2 md:gap-4 bg-background/60 backdrop-blur px-4 py-2 rounded-full border shadow-sm">
        {STEPS.map((s, idx) => {
          const isActive = s.id === step;
          const isCompleted = STEPS.findIndex(stp => stp.id === step) > idx;
          const Icon = s.icon;

          return (
            <div key={s.id} className="flex items-center gap-2">
              <div className={cn(
                "flex items-center justify-center h-8 w-8 rounded-full transition-colors",
                isActive ? "bg-primary text-primary-foreground" :
                  isCompleted ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={cn(
                "text-sm font-medium hidden md:block",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>{s.label}</span>
              {idx < STEPS.length - 1 && <div className="w-8 h-[1px] bg-border hidden md:block" />}
            </div>
          );
        })}
      </div>
    </div>
  );

  // --- Upload Step Render ---
  if (step === 'upload') {
    return (
      <div className="max-w-4xl mx-auto">
        {renderSteps()}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div
            className={cn(
              "relative group border-2 border-dashed rounded-xl p-10 transition-all duration-200 text-center cursor-pointer overflow-hidden",
              dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
              files.length > 0 ? "bg-muted/20" : ""
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFilesChange}
              disabled={isParsing}
            />

            <div className="flex flex-col items-center gap-4 z-10 relative">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold tracking-tight">Drag & Drop Poster Loker</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Atau klik area ini untuk memilih file. Max 10 poster sekaligus. Support JPG, PNG.
                </p>
              </div>
              <Button variant="outline" className="mt-4">
                Pilih File
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-muted-foreground">Selected Files ({files.length})</h4>
                  <Button variant="ghost" size="sm" onClick={() => { setFiles([]); setPreviews([]); }} className="text-destructive hover:bg-destructive/10">
                    Clear All
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {previews.map((preview, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative aspect-[3/4] rounded-lg overflow-hidden border bg-muted shadow-sm"
                    >
                      <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newFiles = [...files];
                            newFiles.splice(index, 1);
                            const newPreviews = [...previews];
                            newPreviews.splice(index, 1);
                            setFiles(newFiles);
                            setPreviews(newPreviews);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-[10px] text-white truncate font-medium">{files[index].name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  {isParsing && (
                    <div className="bg-muted/50 rounded-lg p-4 border">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="relative">
                          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                        </div>
                        <span>AI sedang menganalisis {files.length} poster secara paralel...</span>
                      </div>
                      <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-purple-600 animate-pulse" style={{ width: '100%' }} />
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Button
                      size="lg"
                      onClick={handleParse}
                      disabled={isParsing}
                      className="w-full md:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25"
                    >
                      {isParsing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Parsing {files.length} Posters...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Parse {files.length} Posters
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }


  // Helper functions for kualifikasi management
  const addKualifikasi = (jobIndex: number) => {
    setEditedJobs((prev) => {
      const updated = [...prev];
      const job = updated[jobIndex];
      updated[jobIndex] = {
        ...job,
        kualifikasi: [...(job.kualifikasi || []), '']
      };
      return updated;
    });
  };

  const updateKualifikasi = (jobIndex: number, qualIndex: number, value: string) => {
    setEditedJobs((prev) => {
      const updated = [...prev];
      const job = updated[jobIndex];
      const newKualifikasi = [...(job.kualifikasi || [])];
      newKualifikasi[qualIndex] = value;
      updated[jobIndex] = { ...job, kualifikasi: newKualifikasi };
      return updated;
    });
  };

  const removeKualifikasi = (jobIndex: number, qualIndex: number) => {
    setEditedJobs((prev) => {
      const updated = [...prev];
      const job = updated[jobIndex];
      const newKualifikasi = (job.kualifikasi || []).filter((_, i) => i !== qualIndex);
      updated[jobIndex] = { ...job, kualifikasi: newKualifikasi };
      return updated;
    });
  };

  const removeKategori = (jobIndex: number, katIndex: number) => {
    setEditedJobs((prev) => {
      const updated = [...prev];
      const job = updated[jobIndex];
      const newKategori = (job.kategori || []).filter((_, i) => i !== katIndex);
      updated[jobIndex] = { ...job, kategori: newKategori };
      return updated;
    });
  };


  // --- Review Step Render ---
  if (step === 'review') {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-32">
        {renderSteps()}

        {/* Sticky Header for Actions */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md py-4 mb-8 border-b -mx-4 md:-mx-6 px-4 md:px-6 shadow-sm transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">Review & Edit Data</h2>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">{editedJobs.length}</span> posisi siap dipublish - silakan koreksi jika ada yang salah
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button variant="outline" onClick={() => setStep('upload')} className="flex-1 sm:flex-none h-10">
                <X className="mr-2 h-4 w-4" />
                Kembali
              </Button>
              <Button onClick={handleSaveAll} disabled={isSaving} className="flex-1 sm:flex-none h-10 shadow-md bg-green-600 hover:bg-green-700">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Simpan Semua ({editedJobs.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-10">
          {editedJobs.map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border shadow-sm hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Left: Poster Preview */}
                  <div className="lg:col-span-1 bg-muted/20 border-b lg:border-b-0 lg:border-r">
                    <div className="p-4 lg:sticky lg:top-28">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-primary text-primary-foreground">
                          #{index + 1}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => duplicateJob(index)}
                            className="h-8 text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" /> Copy
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeJob(index)}
                            className="h-8 text-xs text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Hapus
                          </Button>
                        </div>
                      </div>

                      {job.poster_url ? (
                        <div
                          className="relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-primary transition-colors"
                          onClick={() => setPreviewImage(job.poster_url!)}
                        >
                          <Image
                            src={job.poster_url}
                            alt="Poster"
                            fill
                            className="object-contain bg-white"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                            <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                              Klik untuk zoom
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-[3/4] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            <FileImage className="h-12 w-12 mx-auto opacity-30 mb-2" />
                            <p className="text-sm">No Image</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Form Fields */}
                  <div className="lg:col-span-2 p-6 space-y-6">

                    {/* 📋 Informasi Dasar */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span>📋</span> Informasi Dasar
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`title-${index}`}>Judul Loker *</Label>
                          <Input
                            id={`title-${index}`}
                            value={job.title}
                            onChange={(e) => updateJob(index, 'title', e.target.value)}
                            placeholder="Contoh: Staff Administrasi"
                            className="mt-1.5"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`perusahaan-${index}`}>Nama Perusahaan *</Label>
                          <Input
                            id={`perusahaan-${index}`}
                            value={job.perusahaan_name}
                            onChange={(e) => updateJob(index, 'perusahaan_name', e.target.value)}
                            placeholder="Contoh: PT Sukses Jaya"
                            className="mt-1.5"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`lokasi-${index}`}>Lokasi *</Label>
                          <Input
                            id={`lokasi-${index}`}
                            value={job.lokasi}
                            onChange={(e) => updateJob(index, 'lokasi', e.target.value)}
                            placeholder="Contoh: Jombang Kota"
                            className="mt-1.5"
                          />
                        </div>

                        <div>
                          <Label>Kategori</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(job.kategori || []).map((kat, katIdx) => (
                              <Badge key={katIdx} variant="outline" className="px-3 py-1 flex items-center gap-1">
                                {kat}
                                <button
                                  onClick={() => removeKategori(index, katIdx)}
                                  className="ml-1 hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                            <Input
                              placeholder="+ Tambah kategori (Enter)"
                              className="w-40 h-8 text-xs"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                  e.preventDefault();
                                  const newValue = e.currentTarget.value.trim();
                                  if (!job.kategori.includes(newValue)) {
                                    updateJob(index, 'kategori', [...(job.kategori || []), newValue]);
                                  }
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                          </div>
                        </div>


                        <div>
                          <Label htmlFor={`tipe-${index}`}>Tipe Kerja</Label>
                          <Select
                            value={job.tipe_kerja || ''}
                            onValueChange={(value) => updateJob(index, 'tipe_kerja', value)}
                          >
                            <SelectTrigger className="w-full mt-1.5">
                              <SelectValue placeholder="Pilih tipe kerja" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Full-time">Full-time</SelectItem>
                              <SelectItem value="Part-time">Part-time</SelectItem>
                              <SelectItem value="Contract">Contract</SelectItem>
                              <SelectItem value="Freelance">Freelance</SelectItem>
                              <SelectItem value="Remote">Remote</SelectItem>
                              <SelectItem value="Internship">Internship</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* 💰 Gaji */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span>💰</span> Gaji
                      </h3>
                      <div>
                        <Label htmlFor={`gaji-${index}`}>Gaji (Text)</Label>
                        <Input
                          id={`gaji-${index}`}
                          value={job.gaji_text || ''}
                          onChange={(e) => updateJob(index, 'gaji_text', e.target.value)}
                          placeholder="Contoh: Rp 3-5 juta + bonus"
                          className="mt-1.5"
                        />
                      </div>
                    </div>

                    {/* 📝 Deskripsi & Kualifikasi */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span>📝</span> Deskripsi & Kualifikasi
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`deskripsi-${index}`}>Deskripsi / Benefit</Label>
                          <Textarea
                            id={`deskripsi-${index}`}
                            value={job.deskripsi || ''}
                            onChange={(e) => updateJob(index, 'deskripsi', e.target.value)}
                            placeholder="Deskripsi pekerjaan, benefit, fasilitas, jam kerja..."
                            rows={4}
                            className="mt-1.5"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>Kualifikasi / Persyaratan</Label>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => addKualifikasi(index)}
                              className="h-7 text-xs"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Tambah
                            </Button>
                          </div>
                          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                            {(job.kualifikasi || []).length === 0 ? (
                              <p className="text-sm text-muted-foreground italic border border-dashed p-2 rounded text-center">
                                Belum ada kualifikasi. Klik "Tambah" untuk menambahkan.
                              </p>
                            ) : (
                              (job.kualifikasi || []).map((kual, qualIdx) => (
                                <div key={qualIdx} className="flex gap-2 items-center">
                                  <span className="text-xs text-muted-foreground w-4 text-center">{qualIdx + 1}.</span>
                                  <Input
                                    value={kual}
                                    onChange={(e) => updateKualifikasi(index, qualIdx, e.target.value)}
                                    placeholder={`Kualifikasi ${qualIdx + 1}`}
                                    className="h-8 text-sm"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeKualifikasi(index, qualIdx)}
                                    className="flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* 📞 Kontak */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span>📞</span> Kontak
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`wa-${index}`}>WhatsApp</Label>
                          <Input
                            id={`wa-${index}`}
                            value={job.kontak_wa || ''}
                            onChange={(e) => updateJob(index, 'kontak_wa', e.target.value)}
                            placeholder="081234567890"
                            className="mt-1.5"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`email-${index}`}>Email</Label>
                          <Input
                            id={`email-${index}`}
                            value={job.kontak_email || ''}
                            onChange={(e) => updateJob(index, 'kontak_email', e.target.value)}
                            placeholder="hr@perusahaan.com"
                            className="mt-1.5"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`deadline-${index}`}>Deadline (Optional)</Label>
                          <Input
                            id={`deadline-${index}`}
                            type="date"
                            value={job.deadline || ''}
                            onChange={(e) => updateJob(index, 'deadline', e.target.value)}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Image Preview Modal */}
        <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
          <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden flex flex-col bg-background border-none shadow-2xl rounded-xl">
            <VisuallyHidden>
              <DialogTitle>Preview Poster</DialogTitle>
            </VisuallyHidden>
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/60 to-transparent z-50 flex items-center justify-between px-6">
              <span className="text-white/90 font-medium text-sm">Preview Poster</span>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full h-9 w-9 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10"
                onClick={() => setPreviewImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {previewImage && (
              <div className="w-full h-full relative bg-black/95 flex items-center justify-center p-4 md:p-8">
                <Image
                  src={previewImage}
                  alt="Full Preview"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    );
  }

  // --- Done Step Render ---
  return (
    <div className="max-w-2xl mx-auto text-center pt-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-2xl shadow-lg p-12 border"
      >
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Upload Successful!</h2>
        <p className="text-muted-foreground mb-8">
          Semua lowongan berhasil dipublish ke portal VIP. Anda akan dialihkan dalam beberapa detik...
        </p>
        <Button size="lg" onClick={() => router.push('/admin/vip-loker')} className="w-full md:w-auto">
          Kembali ke Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
