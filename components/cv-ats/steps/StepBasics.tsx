"use client";

import * as React from "react";
import { Resume } from "@/lib/schemas/cv-ats";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface StepBasicsProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export function StepBasics({ resume, setResume }: StepBasicsProps) {
  // Ensure resume is properly initialized
  if (!resume || !resume.basics) {
    console.error("StepBasics: Invalid resume data", resume);
    return null;
  }

  const handleChange = (field: string, value: string) => {
    setResume({
      ...resume,
      basics: { ...resume.basics, [field]: value },
    });
  };

  const handleTitleChange = (value: string) => {
    setResume({ ...resume, title: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Informasi Dasar</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Isi informasi kontak dan identitas Anda
        </p>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">
              Judul CV <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={resume.title || ""}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Frontend Developer CV"
              className="mt-1.5 h-12"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Nama file CV Anda untuk referensi
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="mb-4 font-semibold text-lg">Informasi Pribadi</h3>
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName" className="text-base sm:text-sm">
                Nama Depan <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                value={resume.basics.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="John"
                className="mt-1.5 h-12"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-base sm:text-sm">
                Nama Belakang <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                value={resume.basics.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Doe"
                className="mt-1.5 h-12"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="headline" className="text-base sm:text-sm">
              Headline / Target Role <span className="text-destructive">*</span>
            </Label>
            <Input
              id="headline"
              value={resume.basics.headline}
              onChange={(e) => handleChange("headline", e.target.value)}
              placeholder="Frontend Developer | React Specialist"
              className="mt-1.5 h-12"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Posisi atau role yang Anda targetkan
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="mb-4 font-semibold text-lg">Informasi Kontak</h3>
        <div className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-base sm:text-sm">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={resume.basics.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john.doe@email.com"
              className="mt-1.5 h-12"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone" className="text-base sm:text-sm">Telepon</Label>
              <Input
                id="phone"
                value={resume.basics.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+62 812 3456 7890"
                className="mt-1.5 h-12"
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-base sm:text-sm">Kota</Label>
              <Input
                id="city"
                value={resume.basics.city || ""}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Jakarta"
                className="mt-1.5 h-12"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="text-base sm:text-sm">Alamat Lengkap</Label>
            <Input
              id="address"
              value={resume.basics.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Jl. Contoh No. 123"
              className="mt-1.5 h-12"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="mb-4 font-semibold text-lg">Link Profesional</h3>
        <div className="space-y-5">
          <div>
            <Label htmlFor="website" className="text-base sm:text-sm">Website / Portfolio</Label>
            <Input
              id="website"
              type="url"
              value={resume.basics.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://yourwebsite.com"
              className="mt-1.5 h-12"
            />
          </div>

          <div>
            <Label htmlFor="linkedin" className="text-base sm:text-sm">LinkedIn</Label>
            <Input
              id="linkedin"
              type="url"
              value={resume.basics.linkedin || ""}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="mt-1.5 h-12"
            />
          </div>
        </div>
      </Card>

      <div className="rounded-lg bg-muted p-4 text-sm">
        <p className="font-medium">💡 Tips ATS:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
          <li>Pastikan semua field wajib (*) terisi dengan benar</li>
          <li>Gunakan format email dan URL yang valid</li>
          <li>Headline harus jelas dan spesifik sesuai target posisi</li>
          <li>Nomor telepon gunakan format internasional (+62)</li>
        </ul>
      </div>
    </div>
  );
}
