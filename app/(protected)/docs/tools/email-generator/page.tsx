"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Mail, CheckCircle, Clock, Send, Lightbulb, AlertCircle } from "lucide-react";
import { StepByStep } from "@/components/docs/StepByStep";
import { TipBox } from "@/components/docs/TipBox";
import { DocsHeader } from "@/components/docs/DocsHeader";

export default function EmailGeneratorDocsPage() {
  return (
    <div className="space-y-8">
      {/* Header with Breadcrumbs & Back Button */}
      <DocsHeader
        title="Email Generator"
        description="Generate email follow-up profesional untuk increase response rate!"
        icon={<Mail className="h-8 w-8 text-primary" />}
        backToDocsHref="/docs"
      />

      {/* Kapan Menggunakan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Kapan Menggunakan Email Generator?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg mb-2">Scenario 1: Follow-up Setelah Apply</h3>
              <p className="text-muted-foreground">Sudah apply tapi belum ada kabar? Follow-up!</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Day 7: First follow-up</li>
                <li>• Day 14: Second follow-up</li>
                <li>• Day 21: Final follow-up</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Scenario 2: Thank You Email Setelah Interview</h3>
              <p className="text-muted-foreground">Kirim dalam 24 jam setelah interview!</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Scenario 3: Acceptance/Declining Offer</h3>
              <p className="text-muted-foreground">Professional way to accept atau decline job offer.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step */}
      <Card>
        <CardHeader>
          <CardTitle>Cara Menggunakan Email Generator</CardTitle>
          <CardDescription>Ikuti langkah-langkah berikut untuk generate email profesional</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepByStep
            step={1}
            title="Pilih Tipe Email"
            description={
              <div className="space-y-2">
                <p>Klik menu <strong>Email Generator</strong> dan pilih tipe:</p>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Follow-up Application</strong> - Tanya status aplikasi</li>
                  <li>• <strong>Thank You (Post-Interview)</strong> - Setelah interview</li>
                  <li>• <strong>Accepting Offer</strong> - Terima job offer</li>
                  <li>• <strong>Declining Offer</strong> - Tolak job offer dengan sopan</li>
                  <li>• <strong>Request Feedback</strong> - Minta feedback jika rejected</li>
                </ul>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Email type selection]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={2}
            title="Isi Informasi"
            description={
              <div className="space-y-2">
                <p><strong>Recipient Info:</strong></p>
                <ul className="space-y-1 ml-4">
                  <li>• Nama HRD/Recruiter</li>
                  <li>• Nama perusahaan</li>
                  <li>• Posisi yang dilamar</li>
                </ul>
                <p className="mt-3"><strong>Context</strong> (specific untuk tipe email):</p>
                <ul className="space-y-1 ml-4">
                  <li>• Tanggal apply (untuk follow-up)</li>
                  <li>• Tanggal interview (untuk thank you)</li>
                  <li>• Details lain yang relevant</li>
                </ul>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Form input informasi]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={3}
            title="Generate Email"
            description={
              <div className="space-y-2">
                <p>Klik <strong>"Generate Email"</strong></p>
                <p>AI akan create email dengan:</p>
                <ul className="space-y-1 ml-4">
                  <li>✅ Professional subject line</li>
                  <li>✅ Appropriate greeting</li>
                  <li>✅ Well-structured body</li>
                  <li>✅ Proper closing</li>
                </ul>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Generated email result]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={4}
            title="Edit & Send"
            description={
              <div className="space-y-2">
                <ol className="space-y-2">
                  <li>1. <strong>Review</strong> generated email</li>
                  <li>2. <strong>Personalize</strong>:
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Add specific details dari interview</li>
                      <li>• Mention something memorable dari conversation</li>
                      <li>• Add your unique voice</li>
                    </ul>
                  </li>
                  <li>3. <strong>Copy</strong> dan paste ke Gmail/Outlook</li>
                  <li>4. <strong>Send</strong>!</li>
                </ol>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Tips Email Profesional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-green-600 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Do's ✅
            </h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Send dalam 24 jam</strong> setelah interview</li>
              <li>• <strong>Personalize</strong> setiap email</li>
              <li>• <strong>Proofread</strong> sebelum send</li>
              <li>• <strong>Professional email address</strong> (nama.lengkap@gmail.com)</li>
              <li>• <strong>Include signature</strong> lengkap</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Don'ts ❌
            </h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Generic email</strong> yang sama untuk semua</li>
              <li>• <strong>Typo</strong> dan grammar mistakes</li>
              <li>• <strong>Terlalu panjang</strong> ({">"}3 paragraf)</li>
              <li>• <strong>Terlalu casual</strong> (pake emoji berlebihan)</li>
              <li>• <strong>Follow-up too often</strong> (max 3x dengan jarak 1 minggu)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ Email Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Q: Berapa kali boleh follow-up?</h3>
            <p className="text-muted-foreground">
              A: Maximum 3 kali dengan jarak 1 minggu. Lebih dari itu considered annoying.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Kapan waktu terbaik kirim email?</h3>
            <p className="text-muted-foreground">
              A: Pagi (8-10 AM) atau setelah lunch (1-3 PM) di hari kerja. Avoid weekend!
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Boleh kirim via WhatsApp instead of email?</h3>
            <p className="text-muted-foreground">
              A: Email lebih profesional untuk komunikasi formal. WhatsApp untuk follow-up informal atau jika diminta.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Alert>
        <Send className="h-4 w-4" />
        <AlertDescription>
          <strong>Siap Generate Email Profesional?</strong>
          <br />
          <a href="/tools/email-generator" className="text-primary underline hover:text-primary/80 transition-colors">
            Buka Email Generator →
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
}
