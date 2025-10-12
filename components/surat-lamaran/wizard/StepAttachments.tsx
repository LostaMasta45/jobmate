"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Paperclip, Info } from "lucide-react";
import { useState } from "react";

interface StepAttachmentsProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const defaultAttachments = [
  { id: "cv", label: "CV / Daftar Riwayat Hidup", recommended: true },
  { id: "ktp", label: "Fotocopy KTP", recommended: true },
  { id: "ijazah", label: "Fotocopy Ijazah", recommended: true },
  { id: "transkrip", label: "Fotocopy Transkrip Nilai", recommended: false },
  { id: "photo", label: "Pas Foto terbaru", recommended: true },
  { id: "skck", label: "SKCK (Surat Keterangan Catatan Kepolisian)", recommended: false },
  { id: "kesehatan", label: "Surat Keterangan Sehat", recommended: false },
  { id: "sertifikat", label: "Sertifikat / Piagam Penghargaan", recommended: false },
  { id: "portfolio", label: "Portfolio / Hasil Karya", recommended: false },
];

export function StepAttachments({ formData, updateFormData }: StepAttachmentsProps) {
  const [customAttachments, setCustomAttachments] = useState<string[]>(
    formData.customAttachments || []
  );

  const attachments = formData.attachments || [];
  const showAttachmentsSection = formData.includeAttachmentsList !== false; // default true
  const includeAvailability = formData.includeAvailability !== false; // default true
  const includeWillingStatement = formData.includeWillingStatement !== false; // default true

  const toggleAttachment = (id: string) => {
    const updated = attachments.includes(id)
      ? attachments.filter((a: string) => a !== id)
      : [...attachments, id];
    updateFormData({ attachments: updated });
  };

  const addCustomAttachment = () => {
    const newCustom = [...customAttachments, ""];
    setCustomAttachments(newCustom);
    updateFormData({ customAttachments: newCustom });
  };

  const updateCustomAttachment = (index: number, value: string) => {
    const updated = [...customAttachments];
    updated[index] = value;
    setCustomAttachments(updated);
    updateFormData({ customAttachments: updated });
  };

  const removeCustomAttachment = (index: number) => {
    const updated = customAttachments.filter((_, i) => i !== index);
    setCustomAttachments(updated);
    updateFormData({ customAttachments: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Paperclip className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Lampiran & Pernyataan</h2>
          <p className="text-sm text-muted-foreground">
            Atur lampiran berkas dan pernyataan kesediaan kerja
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Optional Statements Section */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Pernyataan Kesediaan</Label>
          <p className="text-sm text-muted-foreground">
            Tambahkan pernyataan untuk menunjukkan keseriusan Anda
          </p>
          
          <div className="space-y-2 p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeAvailability"
                checked={includeAvailability}
                onCheckedChange={(checked) =>
                  updateFormData({ includeAvailability: checked })
                }
              />
              <Label htmlFor="includeAvailability" className="font-normal cursor-pointer">
                Saya bersedia ditempatkan di seluruh wilayah Indonesia
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeWillingStatement"
                checked={includeWillingStatement}
                onCheckedChange={(checked) =>
                  updateFormData({ includeWillingStatement: checked })
                }
              />
              <Label htmlFor="includeWillingStatement" className="font-normal cursor-pointer">
                Saya bersedia bekerja dengan target dan di bawah tekanan
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeOvertimeStatement"
                checked={formData.includeOvertimeStatement || false}
                onCheckedChange={(checked) =>
                  updateFormData({ includeOvertimeStatement: checked })
                }
              />
              <Label htmlFor="includeOvertimeStatement" className="font-normal cursor-pointer">
                Saya bersedia bekerja lembur jika diperlukan
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeCommitmentStatement"
                checked={formData.includeCommitmentStatement || false}
                onCheckedChange={(checked) =>
                  updateFormData({ includeCommitmentStatement: checked })
                }
              />
              <Label htmlFor="includeCommitmentStatement" className="font-normal cursor-pointer">
                Saya siap memberikan kontribusi terbaik untuk perusahaan
              </Label>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            💡 <strong>Tips Fresh Graduate:</strong> Checklist 2-3 pernyataan untuk menunjukkan antusiasme dan fleksibilitas Anda!
          </p>
        </div>

        {/* Attachments Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeAttachmentsList"
              checked={showAttachmentsSection}
              onCheckedChange={(checked) =>
                updateFormData({ includeAttachmentsList: checked })
              }
            />
            <Label htmlFor="includeAttachmentsList" className="font-semibold cursor-pointer">
              Sertakan daftar lampiran di surat (recommended)
            </Label>
          </div>
        </div>

        {showAttachmentsSection && (
          <>
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Kenapa perlu lampiran?</p>
                  <p className="text-xs text-muted-foreground">
                    Menyertakan daftar lampiran menunjukkan profesionalitas dan kelengkapan berkas Anda.
                    Checklist yang dipilih akan muncul di bagian awal surat lamaran.
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <Label>Pilih Lampiran yang Akan Disertakan:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {defaultAttachments.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={item.id}
                      checked={attachments.includes(item.id)}
                      onCheckedChange={() => toggleAttachment(item.id)}
                    />
                    <Label
                      htmlFor={item.id}
                      className="flex-1 font-normal cursor-pointer text-sm"
                    >
                      {item.label}
                      {item.recommended && (
                        <span className="ml-2 text-xs text-primary">(recommended)</span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Lampiran Lainnya (Custom):</Label>
                <button
                  type="button"
                  onClick={addCustomAttachment}
                  className="text-sm text-primary hover:underline"
                >
                  + Tambah
                </button>
              </div>
              {customAttachments.length > 0 && (
                <div className="space-y-2">
                  {customAttachments.map((custom, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Contoh: Surat Rekomendasi, Kartu Keluarga, dll"
                        value={custom}
                        onChange={(e) => updateCustomAttachment(index, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeCustomAttachment(index)}
                        className="text-destructive hover:text-destructive/80 px-3"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Card className="p-4 bg-muted/30">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Tips:</strong> Hanya pilih lampiran yang benar-benar Anda sertakan.
                Jangan checklist jika tidak punya berkasnya. Untuk fresh graduate, minimal
                lampirkan: CV, KTP, Ijazah, dan Pas Foto.
              </p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
