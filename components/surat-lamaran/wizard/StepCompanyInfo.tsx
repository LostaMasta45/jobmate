"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Building2, FileText, Sparkles, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { parseJobDescription } from "@/actions/surat-lamaran/parse-job-desc";
import { useToast } from "@/hooks/use-toast";

interface StepCompanyInfoProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function StepCompanyInfo({ formData, updateFormData }: StepCompanyInfoProps) {
  const { toast } = useToast();
  const [showJobDescModal, setShowJobDescModal] = useState(false);
  const [jobDescText, setJobDescText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);

  const handleParseJobDesc = async () => {
    if (!jobDescText || jobDescText.trim().length < 50) {
      toast({
        title: "Job description terlalu pendek",
        description: "Minimal 50 karakter untuk hasil yang akurat.",
        variant: "destructive",
      });
      return;
    }

    setParsing(true);
    setParseSuccess(false);

    try {
      const result = await parseJobDescription(jobDescText);

      if (result.error) {
        toast({
          title: "Gagal memproses",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      if (result.data) {
        // Auto-fill form
        const updates: any = {};
        
        if (result.data.position) updates.position = result.data.position;
        if (result.data.company) updates.companyName = result.data.company;
        if (result.data.location) updates.companyAddress = result.data.location;
        
        // Store parsed data untuk digunakan di step selanjutnya
        updates.parsedJobDescription = result.data;

        updateFormData(updates);
        setParseSuccess(true);

        toast({
          title: "✨ Berhasil!",
          description: "Informasi dari job description berhasil diekstrak.",
        });

        // Close modal after 1.5s
        setTimeout(() => {
          setShowJobDescModal(false);
          setJobDescText("");
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memproses job description.",
        variant: "destructive",
      });
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Data Perusahaan</h2>
          <p className="text-sm text-muted-foreground">
            Informasi perusahaan yang akan dituju
          </p>
        </div>
      </div>

      {/* AI Job Desc Parser CTA */}
      <Alert className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 dark:from-purple-950 dark:to-blue-950 dark:border-purple-800">
        <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        <AlertTitle className="text-purple-900 dark:text-purple-100">
          💡 Tips: Paste Job Description
        </AlertTitle>
        <AlertDescription className="text-purple-800 dark:text-purple-200">
          Punya job description? AI kami bisa extract informasi penting secara otomatis!
        </AlertDescription>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 border-purple-300 hover:bg-purple-100 dark:border-purple-700 dark:hover:bg-purple-900"
          onClick={() => setShowJobDescModal(true)}
        >
          <FileText className="mr-2 h-4 w-4" />
          Parse Job Description dengan AI
        </Button>
      </Alert>

      {/* Job Desc Parser Modal */}
      <Dialog open={showJobDescModal} onOpenChange={setShowJobDescModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI Job Description Parser
            </DialogTitle>
            <DialogDescription>
              Paste job description lengkap di bawah. AI akan extract posisi, perusahaan, skills, dan informasi penting lainnya.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="jobDescInput">Job Description</Label>
              <Textarea
                id="jobDescInput"
                placeholder="Paste job description di sini...

Contoh:
We are looking for a Frontend Developer to join our team at Tokopedia...

Requirements:
- 2+ years experience in React
- Strong understanding of JavaScript/TypeScript
- etc..."
                value={jobDescText}
                onChange={(e) => setJobDescText(e.target.value)}
                rows={12}
                className="mt-2 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {jobDescText.length} karakter (minimal 50)
              </p>
            </div>

            {parseSuccess && (
              <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-900 dark:text-green-100">
                  Berhasil!
                </AlertTitle>
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Informasi berhasil diekstrak dan form sudah diisi otomatis.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowJobDescModal(false);
                setJobDescText("");
                setParseSuccess(false);
              }}
              disabled={parsing}
            >
              Batal
            </Button>
            <Button
              onClick={handleParseJobDesc}
              disabled={parsing || jobDescText.length < 50}
            >
              {parsing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  AI sedang memproses...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Extract dengan AI
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">
            Nama Perusahaan <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            placeholder="Contoh: PT Maju Bersama Indonesia"
            value={formData.companyName}
            onChange={(e) => updateFormData({ companyName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">
            Posisi yang Dilamar <span className="text-red-500">*</span>
          </Label>
          <Input
            id="position"
            placeholder="Contoh: Staff Marketing"
            value={formData.position}
            onChange={(e) => updateFormData({ position: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hrdName">Nama HRD / PIC (opsional)</Label>
          <Input
            id="hrdName"
            placeholder="Contoh: Bapak/Ibu Manager HRD"
            value={formData.hrdName}
            onChange={(e) => updateFormData({ hrdName: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Kosongkan jika tidak tahu, akan pakai "HRD Manager" secara default
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyAddress">Alamat Perusahaan</Label>
          <Textarea
            id="companyAddress"
            placeholder="Contoh: Jl. Sudirman No. 123, Jakarta Selatan"
            value={formData.companyAddress}
            onChange={(e) => updateFormData({ companyAddress: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Sumber Lowongan</Label>
          <RadioGroup
            value={formData.jobSource}
            onValueChange={(value) => updateFormData({ jobSource: value })}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="jobstreet" id="jobstreet" />
                <Label htmlFor="jobstreet" className="font-normal cursor-pointer">
                  JobStreet
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="linkedin" id="linkedin" />
                <Label htmlFor="linkedin" className="font-normal cursor-pointer">
                  LinkedIn
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="glints" id="glints" />
                <Label htmlFor="glints" className="font-normal cursor-pointer">
                  Glints
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="kalibrr" id="kalibrr" />
                <Label htmlFor="kalibrr" className="font-normal cursor-pointer">
                  Kalibrr
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="website" id="website" />
                <Label htmlFor="website" className="font-normal cursor-pointer">
                  Website Perusahaan
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="instagram" id="instagram" />
                <Label htmlFor="instagram" className="font-normal cursor-pointer">
                  Instagram
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="facebook" id="facebook" />
                <Label htmlFor="facebook" className="font-normal cursor-pointer">
                  Facebook
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="whatsapp" id="whatsapp" />
                <Label htmlFor="whatsapp" className="font-normal cursor-pointer">
                  WhatsApp
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="telegram" id="telegram" />
                <Label htmlFor="telegram" className="font-normal cursor-pointer">
                  Telegram
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="referensi" id="referensi" />
                <Label htmlFor="referensi" className="font-normal cursor-pointer">
                  Referensi Teman
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="koran" id="koran" />
                <Label htmlFor="koran" className="font-normal cursor-pointer">
                  Koran/Media
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="font-normal cursor-pointer">
                  Lainnya
                </Label>
              </div>
            </div>
          </RadioGroup>
          {formData.jobSource === "custom" && (
            <Input
              placeholder="Tuliskan sumber lowongan (contoh: datang langsung, brosur, dll)"
              value={formData.jobSourceCustom || ""}
              onChange={(e) => updateFormData({ jobSourceCustom: e.target.value })}
              className="mt-2"
            />
          )}
        </div>
      </div>
    </div>
  );
}
