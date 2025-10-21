"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GraduationCap, Sparkles, Loader2, CheckCircle, RefreshCw, Info } from "lucide-react";
import { enhanceActivity } from "@/actions/surat-lamaran/enhance-activity";
import { useToast } from "@/hooks/use-toast";

interface StepEducationProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function StepEducation({ formData, updateFormData }: StepEducationProps) {
  const { toast } = useToast();
  const [enhancing, setEnhancing] = useState(false);
  const [enhancedActivity, setEnhancedActivity] = useState<string | null>(null);

  const handleEnhanceActivity = async () => {
    if (!formData.activities || formData.activities.trim().length < 10) {
      toast({
        title: "Aktivitas terlalu pendek",
        description: "Minimal 10 karakter untuk hasil yang baik.",
        variant: "destructive",
      });
      return;
    }

    setEnhancing(true);

    try {
      const result = await enhanceActivity(
        formData.activities,
        formData.position || undefined
      );

      if (result.error) {
        toast({
          title: "Gagal enhance",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      if (result.data) {
        setEnhancedActivity(result.data);
        toast({
          title: "✨ Berhasil!",
          description: "Aktivitas berhasil diperbaiki dengan AI.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memperbaiki aktivitas.",
        variant: "destructive",
      });
    } finally {
      setEnhancing(false);
    }
  };

  const handleUseEnhanced = () => {
    if (enhancedActivity) {
      updateFormData({ activities: enhancedActivity });
      setEnhancedActivity(null);
      toast({
        title: "✅ Tersimpan",
        description: "Aktivitas yang diperbaiki sudah digunakan.",
      });
    }
  };

  const handleRegenerateActivity = () => {
    setEnhancedActivity(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <GraduationCap className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Pendidikan Terakhir</h2>
          <p className="text-sm text-muted-foreground">
            Informasi pendidikan formal terakhir Anda
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>
            Jenjang Pendidikan <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.degree}
            onValueChange={(value) => updateFormData({ degree: value })}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sd" id="sd" />
                <Label htmlFor="sd" className="font-normal cursor-pointer">
                  SD
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="smp" id="smp" />
                <Label htmlFor="smp" className="font-normal cursor-pointer">
                  SMP / MTs
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sma" id="sma" />
                <Label htmlFor="sma" className="font-normal cursor-pointer">
                  SMA / MA
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="smk" id="smk" />
                <Label htmlFor="smk" className="font-normal cursor-pointer">
                  SMK
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="smka" id="smka" />
                <Label htmlFor="smka" className="font-normal cursor-pointer">
                  SMKA
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="d3" id="d3" />
                <Label htmlFor="d3" className="font-normal cursor-pointer">
                  D3 (Diploma)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="s1" id="s1" />
                <Label htmlFor="s1" className="font-normal cursor-pointer">
                  S1 (Sarjana)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="s2" id="s2" />
                <Label htmlFor="s2" className="font-normal cursor-pointer">
                  S2 (Magister)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tidak_sekolah" id="tidak_sekolah" />
                <Label htmlFor="tidak_sekolah" className="font-normal cursor-pointer">
                  Tidak Sekolah
                </Label>
              </div>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground mt-2">
            Pilih jenjang pendidikan terakhir Anda. Untuk yang belum pernah sekolah formal, pilih "Tidak Sekolah"
          </p>
        </div>

        {formData.degree !== "tidak_sekolah" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="major">
                {["d3", "s1", "s2"].includes(formData.degree) 
                  ? "Jurusan / Program Studi" 
                  : ["smk", "smka"].includes(formData.degree)
                  ? "Jurusan / Kompetensi Keahlian"
                  : "Jurusan (opsional)"}
                {["d3", "s1", "s2", "smk", "smka"].includes(formData.degree) && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="major"
                placeholder={
                  ["d3", "s1", "s2"].includes(formData.degree)
                    ? "Contoh: Manajemen Pemasaran"
                    : ["smk", "smka"].includes(formData.degree)
                    ? "Contoh: Rekayasa Perangkat Lunak, Tata Boga, Akuntansi"
                    : "Contoh: IPA, IPS, atau kosongkan"
                }
                value={formData.major}
                onChange={(e) => updateFormData({ major: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">
                {["d3", "s1", "s2"].includes(formData.degree) ? "Universitas / Institusi" : "Nama Sekolah"}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="university"
                placeholder={
                  ["d3", "s1", "s2"].includes(formData.degree) 
                    ? "Contoh: Universitas Indonesia" 
                    : ["smk", "smka"].includes(formData.degree)
                    ? "Contoh: SMK Negeri 1 Jakarta"
                    : "Contoh: SMA Negeri 1 Bandung"
                }
                value={formData.university}
                onChange={(e) => updateFormData({ university: e.target.value })}
              />
            </div>
          </div>
        )}

        {formData.degree !== "tidak_sekolah" && (
          <div className="grid gap-4 md:grid-cols-2">
            {["d3", "s1", "s2"].includes(formData.degree) && (
              <div className="space-y-2">
                <Label htmlFor="gpa">IPK (opsional)</Label>
                <Input
                  id="gpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  placeholder="Contoh: 3.65"
                  value={formData.gpa}
                  onChange={(e) => updateFormData({ gpa: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Kosongkan jika IPK di bawah 3.0 atau tidak ingin ditampilkan
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="graduationYear">
                Tahun Lulus <span className="text-red-500">*</span>
              </Label>
              <Input
                id="graduationYear"
                type="number"
                min="1990"
                max={new Date().getFullYear() + 5}
                placeholder="Contoh: 2024"
                value={formData.graduationYear}
                onChange={(e) => updateFormData({ graduationYear: e.target.value })}
              />
            </div>
          </div>
        )}

        {formData.degree !== "tidak_sekolah" && (
          <div className="space-y-3">
            <Label htmlFor="activities">
              {["d3", "s1", "s2"].includes(formData.degree) 
                ? "Organisasi / Kegiatan Kampus (opsional)" 
                : "Organisasi / Kegiatan / Pencapaian (opsional)"}
            </Label>
            <Textarea
              id="activities"
              placeholder={
                ["d3", "s1", "s2"].includes(formData.degree)
                  ? "Contoh: Ketua Business Management Club, Koordinator Tim Marketing Event Kampus"
                  : ["smk", "smka"].includes(formData.degree)
                  ? "Contoh: Juara Lomba Kompetensi Siswa, Praktek Kerja Industri di PT XYZ, Ketua OSIS"
                  : "Contoh: Anggota OSIS, Ketua Ekstrakurikuler, Juara Lomba"
              }
              value={formData.activities}
              onChange={(e) => updateFormData({ activities: e.target.value })}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              <strong>Penting untuk fresh graduate!</strong> Tuliskan organisasi, magang, PKL, atau pencapaian yang relevan.
            </p>

            {/* AI Enhancement Button */}
            {formData.activities && formData.activities.length > 10 && !enhancedActivity && (
              <Button
                variant="outline"
                size="sm"
                className="w-full border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900"
                onClick={handleEnhanceActivity}
                disabled={enhancing}
              >
                {enhancing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI sedang memperbaiki...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Perbaiki dengan AI
                  </>
                )}
              </Button>
            )}

            {/* Enhanced Activity Result */}
            {enhancedActivity && (
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950 dark:to-indigo-950 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      ✨ Versi AI yang Lebih Baik:
                    </h4>
                    <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-200">
                      {enhancedActivity}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={handleUseEnhanced}
                      >
                        <CheckCircle className="mr-2 h-3 w-3" />
                        Gunakan Versi Ini
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRegenerateActivity}
                      >
                        <RefreshCw className="mr-2 h-3 w-3" />
                        Generate Ulang
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {formData.degree === "tidak_sekolah" && (
          <div className="space-y-2">
            <Label htmlFor="selfLearning">Pengalaman Belajar / Keahlian (opsional)</Label>
            <Textarea
              id="selfLearning"
              placeholder="Contoh: Belajar desain grafis otodidak, mengikuti kursus online, magang di tempat usaha, dll"
              value={formData.selfLearning || ""}
              onChange={(e) => updateFormData({ selfLearning: e.target.value })}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Tuliskan skill atau pengalaman belajar yang Anda miliki meski tidak bersekolah formal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
