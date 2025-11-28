'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
  Sparkles,
  ArrowRight,
  FileText,
  Image as ImageIcon
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
  deskripsi?: string;
  persyaratan?: string;
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
            ...position,
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

                <div className="flex justify-end pt-4">
                  <Button 
                    size="lg" 
                    onClick={handleParse} 
                    disabled={isParsing}
                    className="w-full md:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25"
                  >
                    {isParsing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Parsing with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Parse {files.length} Posters
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // --- Review Step Render ---
  if (step === 'review') {
    return (
      <div className="max-w-7xl mx-auto">
        {renderSteps()}
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Review Results</h2>
            <p className="text-muted-foreground">Found {editedJobs.length} positions from your posters.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('upload')}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSaveAll} disabled={isSaving} className="min-w-[140px]">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Publish All
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main List */}
          <div className="lg:col-span-12 space-y-4">
            {editedJobs.map((job, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Left: Poster Preview Mini */}
                      <div className="relative w-full md:w-48 bg-muted min-h-[200px] md:min-h-full border-r">
                        {job.poster_url ? (
                          <Image 
                            src={job.poster_url} 
                            alt="Source" 
                            fill 
                            className="object-cover"
                            unoptimized 
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            <FileImage className="h-8 w-8" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                          #{index + 1}
                        </div>
                      </div>

                      {/* Right: Form */}
                      <div className="flex-1 p-6 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                           <div className="flex-1 space-y-4">
                             <div className="grid md:grid-cols-2 gap-4">
                               <div className="space-y-2">
                                 <Label className="text-xs font-semibold uppercase text-muted-foreground">Judul Posisi</Label>
                                 <Input 
                                   value={job.title} 
                                   onChange={(e) => updateJob(index, 'title', e.target.value)}
                                   className="font-semibold text-lg"
                                 />
                               </div>
                               <div className="space-y-2">
                                 <Label className="text-xs font-semibold uppercase text-muted-foreground">Perusahaan</Label>
                                 <Input 
                                   value={job.perusahaan_name} 
                                   onChange={(e) => updateJob(index, 'perusahaan_name', e.target.value)}
                                 />
                               </div>
                             </div>

                             <div className="grid md:grid-cols-3 gap-4">
                               <div className="space-y-2">
                                 <Label className="text-xs font-semibold uppercase text-muted-foreground">Lokasi</Label>
                                 <Input 
                                   value={job.lokasi} 
                                   onChange={(e) => updateJob(index, 'lokasi', e.target.value)}
                                 />
                               </div>
                               <div className="space-y-2">
                                 <Label className="text-xs font-semibold uppercase text-muted-foreground">Gaji (Text)</Label>
                                 <Input 
                                   value={job.gaji_text || ''} 
                                   placeholder="e.g. Rp 5-10 Juta"
                                   onChange={(e) => updateJob(index, 'gaji_text', e.target.value)}
                                 />
                               </div>
                               <div className="space-y-2">
                                 <Label className="text-xs font-semibold uppercase text-muted-foreground">Tipe</Label>
                                 <Select
                                    value={job.tipe_kerja || ''}
                                    onValueChange={(value) => updateJob(index, 'tipe_kerja', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select..." />
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

                             <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-xs font-semibold uppercase text-muted-foreground">Kategori</Label>
                                  <Input 
                                    value={job.kategori.join(', ')}
                                    onChange={(e) => updateJob(index, 'kategori', e.target.value.split(',').map(k=>k.trim()))}
                                    placeholder="IT, Marketing, etc"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-semibold uppercase text-muted-foreground">Kontak WA</Label>
                                  <Input 
                                    value={job.kontak_wa || ''}
                                    onChange={(e) => updateJob(index, 'kontak_wa', e.target.value)}
                                    placeholder="08xxx"
                                  />
                                </div>
                             </div>
                           </div>

                           {/* Action Buttons */}
                           <div className="flex flex-col gap-2">
                              <Button variant="ghost" size="icon" onClick={() => duplicateJob(index)} title="Duplicate">
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => removeJob(index)} className="text-destructive hover:text-destructive hover:bg-destructive/10" title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                           </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
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
