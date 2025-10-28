"use client";

import * as React from "react";
import { Resume, Education } from "@/lib/schemas/cv-ats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { nanoid } from "nanoid";

interface StepEducationProps {
  data: Resume;
  onChange: (data: Resume) => void;
}

export function StepEducation({ data, onChange }: StepEducationProps) {
  const addEducation = () => {
    const newEdu: Education = {
      id: nanoid(),
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    onChange({
      ...data,
      education: [...data.education, newEdu],
    });
  };

  const removeEducation = (id: string) => {
    if (confirm("Hapus pendidikan ini?")) {
      onChange({
        ...data,
        education: data.education.filter((edu) => edu.id !== id),
      });
    }
  };

  const updateEducation = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      education: data.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pendidikan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tambahkan riwayat pendidikan Anda (urutkan dari yang terbaru)
          </p>
        </div>
        <Button onClick={addEducation} size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Tambah
        </Button>
      </div>

      {data.education.length === 0 && (
        <Card className="border-dashed p-12">
          <div className="text-center">
            <p className="text-muted-foreground">Belum ada riwayat pendidikan</p>
            <Button onClick={addEducation} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pendidikan Pertama
            </Button>
          </div>
        </Card>
      )}

      {data.education.map((edu, idx) => (
        <Card key={edu.id} className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Pendidikan #{idx + 1}</h3>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeEducation(edu.id!)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* School Info */}
            <div>
              <Label htmlFor={`school-${edu.id}`}>
                Nama Institusi / Universitas <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`school-${edu.id}`}
                value={edu.school}
                onChange={(e) => updateEducation(edu.id!, "school", e.target.value)}
                placeholder="Universitas Indonesia"
                className="mt-1.5"
              />
            </div>

            {/* Degree & Field */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor={`degree-${edu.id}`}>Gelar / Tingkat</Label>
                <Input
                  id={`degree-${edu.id}`}
                  value={edu.degree || ""}
                  onChange={(e) => updateEducation(edu.id!, "degree", e.target.value)}
                  placeholder="S1 / Bachelor / D3"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor={`field-${edu.id}`}>Jurusan / Program Studi</Label>
                <Input
                  id={`field-${edu.id}`}
                  value={edu.field || ""}
                  onChange={(e) => updateEducation(edu.id!, "field", e.target.value)}
                  placeholder="Teknik Informatika"
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor={`startDate-${edu.id}`}>Tahun Mulai</Label>
                <Input
                  id={`startDate-${edu.id}`}
                  type="month"
                  value={edu.startDate || ""}
                  onChange={(e) => updateEducation(edu.id!, "startDate", e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor={`endDate-${edu.id}`}>Tahun Lulus / Selesai</Label>
                <Input
                  id={`endDate-${edu.id}`}
                  type="month"
                  value={edu.endDate || ""}
                  onChange={(e) => updateEducation(edu.id!, "endDate", e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor={`description-${edu.id}`}>
                Deskripsi / Prestasi (Opsional)
              </Label>
              <Textarea
                id={`description-${edu.id}`}
                value={edu.description || ""}
                onChange={(e) => updateEducation(edu.id!, "description", e.target.value)}
                placeholder="Contoh: IPK 3.85/4.00, Cumlaude, Juara 1 Hackathon Nasional"
                className="mt-1.5 min-h-[100px]"
                rows={3}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Tuliskan GPA, penghargaan, organisasi, atau prestasi relevan
              </p>
            </div>
          </div>
        </Card>
      ))}

      {/* Tips */}
      <div className="rounded-lg bg-muted p-4 text-sm">
        <p className="font-medium">💡 Tips Pendidikan ATS-Friendly:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
          <li>
            <strong>Urutkan terbaru ke lama:</strong> Pendidikan terakhir di paling
            atas
          </li>
          <li>
            <strong>Sertakan GPA jika bagus:</strong> Di atas 3.5 dari 4.0 atau
            equivalent
          </li>
          <li>
            <strong>Relevansi {'>'}  Jumlah:</strong> Fokus pada pendidikan yang relevan
            dengan target role
          </li>
          <li>
            <strong>Tambahkan prestasi:</strong> Dean's List, Cumlaude, beasiswa,
            kompetisi
          </li>
          <li>
            <strong>Organisasi relevan:</strong> Himpunan Mahasiswa, club teknologi,
            volunteer
          </li>
          <li>
            <strong>Sertifikat besar:</strong> Jika ada sertifikat profesional (AWS,
            Google), bisa masuk sini
          </li>
        </ul>
      </div>

      {/* Examples */}
      <Card className="p-4">
        <h3 className="mb-3 font-semibold">📝 Contoh Deskripsi Pendidikan</h3>
        <div className="space-y-3 text-sm">
          <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950">
            <p className="font-medium text-green-900 dark:text-green-100">
              ✅ Baik (Spesifik & Relevan):
            </p>
            <div className="mt-2 space-y-2 text-green-800 dark:text-green-200">
              <p>
                <strong>S1 Teknik Informatika</strong> - Universitas Indonesia
              </p>
              <p className="text-xs">
                • GPA: 3.87/4.00, Cumlaude
                <br />
                • Skripsi: Machine Learning untuk Deteksi Fraud (Nilai A)
                <br />
                • Ketua Himpunan Mahasiswa Informatika 2021-2022
                <br />• Juara 2 Hackathon Nasional COMPFEST 2022
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
            <p className="font-medium text-blue-900 dark:text-blue-100">
              ℹ️ Untuk Fresh Graduate:
            </p>
            <p className="mt-2 text-xs text-blue-800 dark:text-blue-200">
              Jika Anda fresh graduate dengan experience terbatas, perbanyak detail
              di section ini: proyek akhir, magang, organisasi, kompetisi, course
              online relevan (Coursera, Udacity), dan skills yang dipelajari.
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950">
            <p className="font-medium text-amber-900 dark:text-amber-100">
              ⚡ Untuk Experienced Professional:
            </p>
            <p className="mt-2 text-xs text-amber-800 dark:text-amber-200">
              Jika Anda sudah punya 5+ tahun pengalaman, cukup tuliskan institusi,
              gelar, jurusan, dan tahun. Tidak perlu detail GPA/prestasi kecuali
              sangat relevan. Focus ke section Experience.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
