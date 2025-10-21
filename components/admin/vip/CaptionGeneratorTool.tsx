"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Copy, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function CaptionGeneratorTool() {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    posisi: "",
    perusahaan: "",
    lokasi: "Jombang",
    gaji: "",
    tipeKerja: "Full-time",
  });
  const [generatedCaption, setGeneratedCaption] = useState("");

  const handleGenerate = async () => {
    if (!formData.posisi || !formData.perusahaan) {
      toast.error("Posisi dan Perusahaan harus diisi");
      return;
    }

    setLoading(true);

    try {
      // Simple template-based caption generation
      // In production, this would call an AI API
      const gajiText = formData.gaji ? `\n💰 Gaji: ${formData.gaji}` : "";
      
      const caption = `🔥 LOWONGAN KERJA TERBARU! 🔥

📌 Posisi: ${formData.posisi}
🏢 Perusahaan: ${formData.perusahaan}
📍 Lokasi: ${formData.lokasi}${gajiText}
⏰ ${formData.tipeKerja}

✨ Kesempatan emas untuk kamu yang ingin berkarir di ${formData.lokasi}!

🎯 Segera kirim lamaranmu dan raih kesempatan untuk bergabung dengan tim profesional!

📩 Info lengkap cek di VIP Career Jombang
🔗 bit.ly/vipcareer-jombang

#LowonganKerjaJombang #LokerjJombang #InfoLoker #KarirJombang #${formData.posisi.replace(/\s+/g, '')} #${formData.perusahaan.replace(/\s+/g, '')} #JobVacancy #Hiring`;

      setGeneratedCaption(caption);
      toast.success("Caption berhasil digenerate!");
    } catch (error) {
      toast.error("Gagal generate caption");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCaption);
    setCopied(true);
    toast.success("Caption berhasil disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            AI Caption Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Generate caption menarik untuk posting loker di WA & Instagram
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Input */}
          <Card>
            <CardHeader>
              <CardTitle>Input Informasi Loker</CardTitle>
              <CardDescription>
                Isi data loker untuk generate caption otomatis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="posisi">Posisi / Jabatan *</Label>
                <Input
                  id="posisi"
                  placeholder="e.g. Kasir, Admin, Sales Marketing"
                  value={formData.posisi}
                  onChange={(e) => setFormData({ ...formData, posisi: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="perusahaan">Nama Perusahaan *</Label>
                <Input
                  id="perusahaan"
                  placeholder="e.g. PT. Sukses Makmur"
                  value={formData.perusahaan}
                  onChange={(e) => setFormData({ ...formData, perusahaan: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="lokasi">Lokasi</Label>
                <Input
                  id="lokasi"
                  placeholder="e.g. Jombang, Kec. Jombang"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="gaji">Gaji (Opsional)</Label>
                <Input
                  id="gaji"
                  placeholder="e.g. Rp 2.500.000 - 3.000.000"
                  value={formData.gaji}
                  onChange={(e) => setFormData({ ...formData, gaji: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="tipeKerja">Tipe Kerja</Label>
                <Input
                  id="tipeKerja"
                  placeholder="e.g. Full-time, Part-time, Freelance"
                  value={formData.tipeKerja}
                  onChange={(e) => setFormData({ ...formData, tipeKerja: e.target.value })}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Caption
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Result */}
          <Card>
            <CardHeader>
              <CardTitle>Hasil Caption</CardTitle>
              <CardDescription>
                Caption siap posting dengan emoji & hashtag
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  value={generatedCaption}
                  readOnly
                  placeholder="Caption akan muncul disini setelah generate..."
                  className="min-h-[400px] font-mono text-sm"
                />
              </div>

              {generatedCaption && (
                <div className="space-y-2">
                  <Button onClick={handleCopy} className="w-full" variant="outline">
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Salin Caption
                      </>
                    )}
                  </Button>

                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                      💡 Tips Posting:
                    </p>
                    <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 ml-4 list-disc">
                      <li>Posting di waktu prime time (10-12 siang atau 19-21 malam)</li>
                      <li>Tambahkan gambar/poster untuk menarik perhatian</li>
                      <li>Share ke multiple grup WA untuk jangkauan lebih luas</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Examples */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle>Contoh Penggunaan</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <p className="font-semibold mb-2">✅ Good Example:</p>
              <p className="text-xs text-muted-foreground">
                Posisi: "Kasir & Pramuniaga"<br />
                Perusahaan: "Alfamart Jombang Pusat"<br />
                Lokasi: "Jombang Kota"<br />
                Gaji: "Sesuai UMK Jombang"
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <p className="font-semibold mb-2">📊 Hasil:</p>
              <p className="text-xs text-muted-foreground">
                Caption dengan emoji menarik, info lengkap, hashtag relevan, dan CTA yang jelas
              </p>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
