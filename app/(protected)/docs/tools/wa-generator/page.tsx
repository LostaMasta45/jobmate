"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Send, Clock, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";
import { StepByStep } from "@/components/docs/StepByStep";

export default function WAGeneratorDocsPage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">WhatsApp Message Generator</h1>
            <p className="text-muted-foreground text-lg">
              Generate pesan WhatsApp profesional untuk follow-up recruiter!
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* When to Use */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Kapan Menggunakan WA Generator?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg mb-2">Scenario 1: Follow-up Aplikasi</h3>
            <p className="text-muted-foreground">Sudah apply via email, follow-up via WA untuk faster response.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Scenario 2: Konfirmasi Interview</h3>
            <p className="text-muted-foreground">Confirm attendance interview via WhatsApp.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Scenario 3: Thank You Message</h3>
            <p className="text-muted-foreground">Quick thank you setelah interview via WA (lebih personal).</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Scenario 4: Ask Questions</h3>
            <p className="text-muted-foreground">Tanya detail job atau company via WA HRD.</p>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step */}
      <Card>
        <CardHeader>
          <CardTitle>Cara Menggunakan WA Generator</CardTitle>
          <CardDescription>Ikuti langkah-langkah berikut untuk generate pesan WA profesional</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepByStep
            step={1}
            title="Pilih Template"
            description={
              <div className="space-y-2">
                <p>Klik menu <strong>WA Generator</strong></p>
                <p>Pilih tipe message:</p>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Follow-up Application</strong></li>
                  <li>• <strong>Interview Confirmation</strong></li>
                  <li>• <strong>Thank You (Post-Interview)</strong></li>
                  <li>• <strong>Ask Questions</strong></li>
                  <li>• <strong>Custom Message</strong></li>
                </ul>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Template selection]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={2}
            title="Isi Informasi"
            description={
              <div className="space-y-2">
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Recipient</strong>: Nama recruiter/HRD</li>
                  <li>• <strong>Company</strong>: Nama perusahaan</li>
                  <li>• <strong>Position</strong>: Posisi yang dilamar</li>
                  <li>• <strong>Context</strong>: Additional info (optional)</li>
                </ul>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Form input]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={3}
            title="Generate & Customize"
            description={
              <div className="space-y-2">
                <ol className="space-y-1 ml-4">
                  <li>1. AI generate pesan WhatsApp</li>
                  <li>2. Review message</li>
                  <li>3. Edit untuk add personal touch</li>
                  <li>4. <strong>Copy</strong> message</li>
                </ol>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Generated message]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={4}
            title="Send via WhatsApp"
            description={
              <div className="space-y-2">
                <ol className="space-y-1 ml-4">
                  <li>1. Open WhatsApp Web atau App</li>
                  <li>2. Find contact recruiter/HRD</li>
                  <li>3. <strong>Paste</strong> message</li>
                  <li>4. Review sekali lagi</li>
                  <li>5. <strong>Send</strong>!</li>
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
            Tips WhatsApp Profesional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-green-600 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Do's ✅
            </h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Greeting</strong> yang sopan (Selamat pagi/siang/sore)</li>
              <li>• <strong>Introduction</strong> diri dengan jelas</li>
              <li>• <strong>Purpose</strong> jelas di awal</li>
              <li>• <strong>Closing</strong> dengan thank you</li>
              <li>• <strong>Check typo</strong> sebelum send</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Don'ts ❌
            </h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Emoji berlebihan</strong> (max 1-2 emoji)</li>
              <li>• <strong>Voice note</strong> untuk first contact</li>
              <li>• <strong>Kirim jam malam</strong> (after 8 PM)</li>
              <li>• <strong>Spam</strong> multiple messages</li>
              <li>• <strong>Informal banget</strong> (pake singkatan alay)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Message Templates</CardTitle>
          <CardDescription>Contoh-contoh pesan WhatsApp profesional</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Follow-up Application:</h3>
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg space-y-2 text-sm">
              <p>Selamat pagi Pak/Bu [Name],</p>
              <p>Perkenalkan, saya [Your Name]. Saya telah mengirimkan aplikasi untuk posisi [Position] di [Company] via email pada [Date].</p>
              <p>Saya sangat tertarik dengan opportunity ini dan ingin mengetahui update terkait proses rekrutmen.</p>
              <p>Mohon informasinya ya Pak/Bu. Terima kasih 🙏</p>
              <p className="font-semibold">[Your Name]<br/>[Email]</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Interview Confirmation:</h3>
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg space-y-2 text-sm">
              <p>Selamat siang Pak/Bu [Name],</p>
              <p>Terima kasih atas undangan interview untuk posisi [Position].</p>
              <p>Saya confirm kehadiran saya pada:<br/>
              📅 Hari/Tanggal: [Date]<br/>
              ⏰ Waktu: [Time]<br/>
              📍 Lokasi: [Location/Platform]</p>
              <p>Saya sudah prepare dan looking forward untuk meeting!</p>
              <p>Terima kasih,<br/>[Your Name]</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Thank You (Post-Interview):</h3>
            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg space-y-2 text-sm">
              <p>Selamat sore Pak/Bu [Name],</p>
              <p>Terima kasih banyak untuk interview opportunity hari ini.</p>
              <p>Saya sangat appreciate time dan insights yang Bapak/Ibu share. Discussion kita about [specific topic] makes me even more excited tentang opportunity ini.</p>
              <p>Saya looking forward untuk next steps. Mohon info jika ada additional information yang dibutuhkan dari saya.</p>
              <p>Terima kasih 🙏</p>
              <p>Best regards,<br/>[Your Name]</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ WA Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Q: Kapan waktu terbaik send WA ke recruiter?</h3>
            <p className="text-muted-foreground">
              A: Jam kerja (9 AM - 5 PM) di weekday. Avoid weekend dan night time.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Berapa lama tunggu response?</h3>
            <p className="text-muted-foreground">
              A: 24-48 jam for response. Jika belum ada kabar, follow-up via email.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Boleh send voice note?</h3>
            <p className="text-muted-foreground">
              A: Untuk first contact, lebih baik text. Voice note OK untuk follow-up atau jika sudah kenal.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Alert>
        <MessageCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Siap Generate Pesan WA Profesional?</strong>
          <br />
          <a href="/tools/wa-generator" className="text-primary underline">
            Buka WA Generator →
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
}
