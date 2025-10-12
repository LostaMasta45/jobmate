"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Briefcase, Plus, Trash2 } from "lucide-react";

interface StepExperienceProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function StepExperience({ formData, updateFormData }: StepExperienceProps) {
  const [showExperienceForm, setShowExperienceForm] = useState(false);

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
          <Card className="p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              💡 Sebagai fresh graduate, fokus pada pendidikan, organisasi kampus, magang, 
              dan soft skills akan lebih ditekankan di surat lamaran Anda.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
