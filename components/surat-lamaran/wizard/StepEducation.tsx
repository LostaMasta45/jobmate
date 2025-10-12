"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GraduationCap } from "lucide-react";

interface StepEducationProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function StepEducation({ formData, updateFormData }: StepEducationProps) {
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
          <div className="space-y-2">
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
