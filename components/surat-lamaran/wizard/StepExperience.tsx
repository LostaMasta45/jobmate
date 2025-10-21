"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Briefcase, Plus, Trash2, Sparkles, Loader2, Info, RefreshCw, CheckCircle } from "lucide-react";
import { generateExperienceStory } from "@/actions/surat-lamaran/generate-experience-story";
import { useToast } from "@/hooks/use-toast";

interface StepExperienceProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function StepExperience({ formData, updateFormData }: StepExperienceProps) {
  const { toast } = useToast();
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [generating, setGenerating] = useState(false);

  const addExperience = () => {
    const newExp = {
      company: "",
      position: "",
      duration: "",
      responsibilities: "",
    };
    updateFormData({
      experiences: [...formData.experiences, newExp],
    });
    setShowExperienceForm(true);
  };

  const removeExperience = (index: number) => {
    const updated = formData.experiences.filter((_: any, i: number) => i !== index);
    updateFormData({ experiences: updated });
    if (updated.length === 0) {
      setShowExperienceForm(false);
    }
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = formData.experiences.map((exp: any, i: number) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    updateFormData({ experiences: updated });
  };

  const handleGenerateStory = async () => {
    if (!formData.rawExperience || formData.rawExperience.length < 20) {
      toast({
        title: "Pengalaman terlalu pendek",
        description: "Minimal 20 karakter untuk hasil yang baik.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);

    try {
      const result = await generateExperienceStory({
        rawExperience: formData.rawExperience,
        position: formData.position || "posisi ini",
        isFreshGrad: formData.experienceType === "fresh_graduate",
      });

      if (result.error) {
        toast({
          title: "Gagal generate",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      if (result.data) {
        updateFormData({ generatedExperienceStory: result.data });
        toast({
          title: "✨ Berhasil!",
          description: "Cerita pengalaman berhasil di-generate.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat generate cerita.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerateStory = () => {
    updateFormData({ generatedExperienceStory: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Pengalaman Kerja</h2>
          <p className="text-sm text-muted-foreground">
            Tambahkan pengalaman kerja relevan (opsional untuk fresh graduate)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Status Pengalaman</Label>
          <RadioGroup
            value={formData.experienceType}
            onValueChange={(value) => {
              updateFormData({ experienceType: value, templateType: value });
              if (value === "fresh_graduate") {
                updateFormData({ experiences: [] });
                setShowExperienceForm(false);
              }
            }}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fresh_graduate" id="fresh" />
                <Label htmlFor="fresh" className="font-normal cursor-pointer">
                  Fresh Graduate (belum punya pengalaman kerja full-time)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="experienced" id="exp" />
                <Label htmlFor="exp" className="font-normal cursor-pointer">
                  Berpengalaman (sudah pernah bekerja)
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {formData.experienceType === "experienced" && (
          <div className="space-y-4">
            {formData.experiences.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Belum ada pengalaman ditambahkan
                </p>
                <Button onClick={addExperience} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Pengalaman Pertama
                </Button>
              </Card>
            ) : (
              <>
                {formData.experiences.map((exp: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Pengalaman {index + 1}</Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExperience(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`company-${index}`}>Nama Perusahaan</Label>
                          <Input
                            id={`company-${index}`}
                            value={exp.company}
                            onChange={(e) =>
                              updateExperience(index, "company", e.target.value)
                            }
                            placeholder="Contoh: PT Global Manufacturing"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`position-${index}`}>Posisi</Label>
                          <Input
                            id={`position-${index}`}
                            value={exp.position}
                            onChange={(e) =>
                              updateExperience(index, "position", e.target.value)
                            }
                            placeholder="Contoh: Marketing Executive"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`duration-${index}`}>Durasi</Label>
                        <Input
                          id={`duration-${index}`}
                          value={exp.duration}
                          onChange={(e) =>
                            updateExperience(index, "duration", e.target.value)
                          }
                          placeholder="Contoh: Januari 2020 - Desember 2023 (4 tahun)"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`responsibilities-${index}`}>
                          Tanggung Jawab / Pencapaian
                        </Label>
                        <Textarea
                          id={`responsibilities-${index}`}
                          value={exp.responsibilities}
                          onChange={(e) =>
                            updateExperience(index, "responsibilities", e.target.value)
                          }
                          placeholder="Contoh: Mengelola social media marketing, meningkatkan followers 50%, membuat content calendar"
                          rows={3}
                        />
                      </div>
                    </div>
                  </Card>
                ))}

                <Button onClick={addExperience} variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Pengalaman Lainnya
                </Button>
              </>
            )}
          </div>
        )}

        {formData.experienceType === "fresh_graduate" && (
          <>
            <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-blue-900 dark:text-blue-100">
                💡 Tips untuk Fresh Graduate
              </AlertTitle>
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Ceritakan pengalaman magang, organisasi, project kampus, atau pengalaman lain yang relevan. AI akan membantu membuat cerita yang menarik!
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Label htmlFor="rawExperience">Pengalaman Relevan (Opsional)</Label>
              <Textarea
                id="rawExperience"
                placeholder="Contoh: 
- Magang di PT Maju Jaya sebagai Web Developer selama 3 bulan, buat fitur chat realtime
- Ketua Divisi IT HMTI, kelola 20 anggota dan bikin website kampus
- Freelance bikin 5 website untuk UMKM lokal"
                rows={5}
                value={formData.rawExperience || ""}
                onChange={(e) => updateFormData({ rawExperience: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Tulis dalam poin-poin atau paragraf sederhana. AI akan transform menjadi narasi profesional.
              </p>

              {formData.rawExperience && formData.rawExperience.length > 20 && !formData.generatedExperienceStory && (
                <Button
                  variant="outline"
                  className="w-full border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900"
                  onClick={handleGenerateStory}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      AI sedang membuat cerita...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Cerita Pengalaman dengan AI
                    </>
                  )}
                </Button>
              )}

              {formData.generatedExperienceStory && (
                <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:to-emerald-950 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        ✨ Cerita Pengalaman Anda:
                      </h4>
                      <p className="text-sm leading-relaxed text-green-800 dark:text-green-200">
                        {formData.generatedExperienceStory}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleRegenerateStory}
                          disabled={generating}
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
          </>
        )}
      </div>
    </div>
  );
}
