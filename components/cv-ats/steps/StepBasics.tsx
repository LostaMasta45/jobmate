"use client";

import * as React from "react";
import { Resume } from "@/lib/schemas/cv-ats";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface StepBasicsProps {
  data: Resume;
  onChange: (data: Resume) => void;
}

export function StepBasics({ data, onChange }: StepBasicsProps) {
  const handleChange = (field: string, value: string) => {
    onChange({
      ...data,
      basics: { ...data.basics, [field]: value },
    });
  };

  const handleTitleChange = (value: string) => {
    onChange({ ...data, title: value });
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
              value={data.title || ""}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Frontend Developer CV"
              className="mt-1.5"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Nama file CV Anda untuk referensi
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 font-semibold">Informasi Pribadi</h3>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">
                Nama Depan <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                value={data.basics.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="John"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="lastName">
                Nama Belakang <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                value={data.basics.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Doe"
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="headline">
              Headline / Target Role <span className="text-destructive">*</span>
            </Label>
            <Input
              id="headline"
              value={data.basics.headline}
              onChange={(e) => handleChange("headline", e.target.value)}
              placeholder="Frontend Developer | React Specialist"
              className="mt-1.5"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Posisi atau role yang Anda targetkan
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 font-semibold">Informasi Kontak</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={data.basics.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john.doe@email.com"
              className="mt-1.5"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone">Telepon</Label>
              <Input
                id="phone"
                value={data.basics.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+62 812 3456 7890"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="city">Kota</Label>
              <Input
                id="city"
                value={data.basics.city || ""}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Jakarta"
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Alamat Lengkap</Label>
            <Input
              id="address"
              value={data.basics.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Jl. Contoh No. 123"
              className="mt-1.5"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 font-semibold">Link Profesional</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="website">Website / Portfolio</Label>
            <Input
              id="website"
              type="url"
              value={data.basics.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://yourwebsite.com"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              type="url"
              value={data.basics.linkedin || ""}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="mt-1.5"
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
