"use client";

import * as React from "react";
import { Resume, CustomSection } from "@/lib/schemas/cv-ats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Trash2, GripVertical } from "lucide-react";
import { nanoid } from "nanoid";

interface StepSkillsProps {
  data: Resume;
  onChange: (data: Resume) => void;
}

export function StepSkills({ data, onChange }: StepSkillsProps) {
  const [skillInput, setSkillInput] = React.useState("");

  // Skills Management
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      onChange({
        ...data,
        skills: [...data.skills, trimmed],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((s) => s !== skill),
    });
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // Custom Sections Management
  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: nanoid(),
      title: "Sertifikasi",
      items: [{ id: nanoid(), label: "", description: "" }],
    };
    onChange({
      ...data,
      customSections: [...data.customSections, newSection],
    });
  };

  const removeCustomSection = (id: string) => {
    if (confirm("Hapus bagian ini?")) {
      onChange({
        ...data,
        customSections: data.customSections.filter((sec) => sec.id !== id),
      });
    }
  };

  const updateCustomSection = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      customSections: data.customSections.map((sec) =>
        sec.id === id ? { ...sec, [field]: value } : sec
      ),
    });
  };

  const addCustomSectionItem = (sectionId: string) => {
    onChange({
      ...data,
      customSections: data.customSections.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              items: [...sec.items, { id: nanoid(), label: "", description: "" }],
            }
          : sec
      ),
    });
  };

  const removeCustomSectionItem = (sectionId: string, itemId: string) => {
    onChange({
      ...data,
      customSections: data.customSections.map((sec) =>
        sec.id === sectionId
          ? { ...sec, items: sec.items.filter((item) => item.id !== itemId) }
          : sec
      ),
    });
  };

  const updateCustomSectionItem = (
    sectionId: string,
    itemId: string,
    field: string,
    value: string
  ) => {
    onChange({
      ...data,
      customSections: data.customSections.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              items: sec.items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item
              ),
            }
          : sec
      ),
    });
  };

  return (
    <div className="space-y-8">
      {/* Skills Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Keterampilan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tambahkan skills teknis dan soft skills Anda
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="skill-input">
                Tambah Skill <span className="text-destructive">*</span>
              </Label>
              <div className="mt-1.5 flex gap-2">
                <Input
                  id="skill-input"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Ketik skill dan tekan Enter (contoh: JavaScript, React, Leadership)"
                />
                <Button onClick={addSkill} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Tekan Enter atau klik tombol + untuk menambahkan
              </p>
            </div>

            {data.skills.length > 0 && (
              <div>
                <Label>Skills Anda ({data.skills.length})</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="cursor-pointer pr-1 text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 rounded-full p-0.5 hover:bg-destructive/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {data.skills.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                Belum ada skill. Ketik dan tekan Enter untuk menambahkan.
              </div>
            )}
          </div>
        </Card>

        {/* Skills Tips */}
        <div className="rounded-lg bg-muted p-4 text-sm">
          <p className="font-medium">💡 Tips Skills ATS-Friendly:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
            <li>
              <strong>Hard Skills:</strong> Teknologi, tools, bahasa pemrograman,
              frameworks (React, Python, AWS)
            </li>
            <li>
              <strong>Soft Skills:</strong> Leadership, Communication, Problem Solving,
              Teamwork
            </li>
            <li>
              <strong>Sesuaikan dengan JD:</strong> Prioritaskan skills yang ada di job
              description
            </li>
            <li>
              <strong>Spesifik {'>'} Generic:</strong> "React.js & Next.js" lebih baik dari
              "Web Development"
            </li>
            <li>
              <strong>Urutkan by relevance:</strong> Skills paling penting di depan
            </li>
            <li>
              <strong>Jangan berbohong:</strong> Hanya tulis skills yang benar-benar
              Anda kuasai
            </li>
          </ul>
        </div>
      </div>

      {/* Custom Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Bagian Kustom</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tambahkan section tambahan seperti Sertifikasi, Proyek, Bahasa, dll
            </p>
          </div>
          <Button onClick={addCustomSection} size="sm" variant="outline">
            <Plus className="mr-1 h-4 w-4" />
            Tambah Bagian
          </Button>
        </div>

        {data.customSections.length === 0 && (
          <Card className="border-dashed p-8">
            <div className="text-center">
              <p className="text-muted-foreground">
                Belum ada bagian kustom (opsional)
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Contoh: Sertifikasi, Proyek, Publikasi, Bahasa, Volunteer, Awards
              </p>
            </div>
          </Card>
        )}

        {data.customSections.map((section, idx) => (
          <Card key={section.id} className="p-6">
            <div className="space-y-4">
              {/* Section Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Bagian #{idx + 1}</h3>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeCustomSection(section.id!)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Section Title */}
              <div>
                <Label htmlFor={`section-title-${section.id}`}>
                  Judul Bagian <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`section-title-${section.id}`}
                  value={section.title}
                  onChange={(e) =>
                    updateCustomSection(section.id!, "title", e.target.value)
                  }
                  placeholder="Contoh: Sertifikasi, Proyek, Bahasa, Volunteer"
                  className="mt-1.5"
                />
              </div>

              {/* Section Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Item</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addCustomSectionItem(section.id!)}
                    className="text-xs"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Tambah Item
                  </Button>
                </div>

                {section.items.map((item, iidx) => (
                  <div
                    key={item.id}
                    className="rounded-lg border p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium">Item #{iidx + 1}</p>
                      {section.items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            removeCustomSectionItem(section.id!, item.id!)
                          }
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`item-label-${item.id}`}>
                        Label / Nama <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`item-label-${item.id}`}
                        value={item.label}
                        onChange={(e) =>
                          updateCustomSectionItem(
                            section.id!,
                            item.id!,
                            "label",
                            e.target.value
                          )
                        }
                        placeholder="Contoh: AWS Certified Solutions Architect"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`item-desc-${item.id}`}>
                        Deskripsi (Opsional)
                      </Label>
                      <Textarea
                        id={`item-desc-${item.id}`}
                        value={item.description || ""}
                        onChange={(e) =>
                          updateCustomSectionItem(
                            section.id!,
                            item.id!,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Contoh: Amazon Web Services, 2023 - Present"
                        className="mt-1.5"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}

        {/* Custom Section Examples */}
        <Card className="p-4">
          <h3 className="mb-3 font-semibold">📝 Contoh Bagian Kustom</h3>
          <div className="space-y-3 text-sm">
            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                💼 Sertifikasi
              </p>
              <ul className="mt-2 space-y-1 text-xs text-blue-800 dark:text-blue-200">
                <li>• AWS Certified Solutions Architect - Associate (2023)</li>
                <li>• Google Professional Cloud Developer (2022)</li>
              </ul>
            </div>

            <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-950">
              <p className="font-medium text-purple-900 dark:text-purple-100">
                🚀 Proyek
              </p>
              <ul className="mt-2 space-y-1 text-xs text-purple-800 dark:text-purple-200">
                <li>
                  • E-Commerce Platform - Built with Next.js, handling 50K users/month
                </li>
                <li>
                  • AI Chatbot - Python & OpenAI API, improved support response 70%
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950">
              <p className="font-medium text-green-900 dark:text-green-100">
                🌍 Bahasa
              </p>
              <ul className="mt-2 space-y-1 text-xs text-green-800 dark:text-green-200">
                <li>• Indonesia - Native</li>
                <li>• English - Fluent (TOEFL 95)</li>
              </ul>
            </div>

            <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950">
              <p className="font-medium text-amber-900 dark:text-amber-100">
                🏆 Penghargaan
              </p>
              <ul className="mt-2 space-y-1 text-xs text-amber-800 dark:text-amber-200">
                <li>• Employee of the Year 2023 - PT Tech Indonesia</li>
                <li>• Best Innovation Award - Hackathon 2022</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
