"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Mail, Send, Copy, Lightbulb, CheckCircle, Sparkles } from "lucide-react";
import { StepByStep } from "@/components/docs/StepByStep";

export default function EmailTemplateDocsPage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Email Template Generator</h1>
            <p className="text-muted-foreground text-lg">
              Generate professional job application email template dengan AI!
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Why Good Email Matters */}
      <Card>
        <CardHeader>
          <CardTitle>Kenapa Email Aplikasi Penting?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <strong>First Impression:</strong> Email adalah hal pertama yang HRD baca sebelum buka attachment!<br/>
              Email yang professional bisa increase open rate CV Anda hingga 50%.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <h3 className="font-semibold text-red-600 mb-2">❌ Bad Email:</h3>
              <div className="text-sm space-y-2">
                <p><strong>Subject:</strong> "Lamaran"</p>
                <p><strong>Body:</strong> "Terlampir CV saya. Terima kasih."</p>
              </div>
              <p className="text-xs mt-2 text-red-600">
                <strong>Masalah:</strong> Generic, tidak ada context, terlihat tidak serius
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h3 className="font-semibold text-green-600 mb-2">✅ Good Email:</h3>
              <div className="text-sm space-y-2">
                <p><strong>Subject:</strong> "Application: Frontend Developer - John Doe"</p>
                <p><strong>Body:</strong> Professional greeting, introduction, why interested, 
                key qualifications, attachment mention, closing</p>
              </div>
              <p className="text-xs mt-2 text-green-600">
                <strong>Kenapa Bagus:</strong> Clear, professional, shows genuine interest
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step */}
      <Card>
        <CardHeader>
          <CardTitle>Cara Menggunakan Email Template Generator</CardTitle>
          <CardDescription>AI akan create complete email dengan subject dan body</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepByStep
            step={1}
            title="Input Information"
            description={
              <div className="space-y-2">
                <p>Isi form dengan informasi aplikasi Anda:</p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Full Name</strong></li>
                  <li>• <strong>Position</strong> yang dilamar</li>
                  <li>• <strong>Company Name</strong></li>
                  <li>• <strong>Source</strong> - Dari mana tahu lowongan ini?
                    <p className="text-sm text-muted-foreground ml-4">
                      Contoh: "LinkedIn", "JobStreet", "Referral from [Name]", "Company website"
                    </p>
                  </li>
                  <li>• <strong>Key Skills</strong> - 3-5 skills yang relevant
                    <p className="text-sm text-muted-foreground ml-4">
                      Contoh: "React, TypeScript, REST API, Git, Agile"
                    </p>
                  </li>
                  <li>• <strong>Attach CV</strong> - Checklist jika Anda attach CV
                    <p className="text-sm text-muted-foreground ml-4">
                      (AI akan mention attachment di email body)
                    </p>
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Input form]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={2}
            title="Choose Tone"
            description={
              <div className="space-y-2">
                <p>Select email tone yang sesuai dengan company culture:</p>
                <div className="space-y-3 mt-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                    <strong className="text-blue-600">Formal</strong>
                    <p className="text-sm text-muted-foreground">
                      Very professional. For corporate, banking, legal, government positions.
                    </p>
                    <p className="text-xs mt-1 italic">
                      "Dear Sir/Madam, I am writing to express my interest..."
                    </p>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                    <strong className="text-green-600">Professional</strong> (Default)
                    <p className="text-sm text-muted-foreground">
                      Balanced tone. Works for most companies - tech, consulting, healthcare.
                    </p>
                    <p className="text-xs mt-1 italic">
                      "Dear [Name], I'm excited to apply for..."
                    </p>
                  </div>

                  <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded">
                    <strong className="text-purple-600">Friendly</strong>
                    <p className="text-sm text-muted-foreground">
                      Conversational. For startups, creative agencies, casual work environments.
                    </p>
                    <p className="text-xs mt-1 italic">
                      "Hi [Name], I was thrilled to see the opening for..."
                    </p>
                  </div>
                </div>
              </div>
            }
          />

          <StepByStep
            step={3}
            title="Generate Email"
            description={
              <div className="space-y-2">
                <ol className="space-y-2 ml-4">
                  <li>1. Klik <strong>"Generate Email"</strong></li>
                  <li>2. AI akan create:
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>✅ <strong>Subject Line</strong> - Clear dan professional</li>
                      <li>✅ <strong>Email Body</strong> dengan struktur:
                        <ul className="ml-4 space-y-1 text-sm text-muted-foreground">
                          <li>• Greeting (Dear [Name]/Team)</li>
                          <li>• Opening (Position + Source)</li>
                          <li>• Body (Why you + Qualifications)</li>
                          <li>• Attachment mention</li>
                          <li>• Closing (Thank you + Next steps)</li>
                          <li>• Signature</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>3. Wait 10-15 seconds untuk processing</li>
                </ol>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Generated email with subject & body]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={4}
            title="Customize & Send"
            description={
              <div className="space-y-2">
                <ol className="space-y-2 ml-4">
                  <li>1. <strong>Review</strong> generated email</li>
                  <li>2. <strong>Personalize</strong>:
                    <ul className="ml-4 mt-1 space-y-1 text-sm">
                      <li>• Ganti [Name] dengan actual name (check LinkedIn!)</li>
                      <li>• Add specific details tentang company</li>
                      <li>• Mention something yang resonates dengan Anda</li>
                    </ul>
                  </li>
                  <li>3. <strong>Copy</strong> Subject dan Body</li>
                  <li>4. <strong>Paste</strong> ke Gmail/Outlook</li>
                  <li>5. <strong>Attach</strong> CV dan surat lamaran</li>
                  <li>6. <strong>Proofread</strong> sekali lagi</li>
                  <li>7. <strong>Send</strong>!</li>
                </ol>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Email Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Anatomy of Perfect Application Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
              <strong>Subject Line</strong>
              <p className="text-muted-foreground mt-1">
                Format: "Application: [Position] - [Your Name]"<br/>
                Contoh: "Application: Frontend Developer - John Doe"
              </p>
              <Alert className="mt-2">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Pro Tip:</strong> Clear subject = Higher open rate. 
                  Avoid "Lamaran", "CV", atau subject yang vague.
                </AlertDescription>
              </Alert>
            </div>

            <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
              <strong>Greeting</strong>
              <p className="text-muted-foreground mt-1">
                • Best: "Dear Mr./Ms. [Last Name]" (if you know the name)<br/>
                • Good: "Dear Hiring Manager"<br/>
                • Good: "Dear [Department] Team"<br/>
                • Avoid: "To Whom It May Concern" (too formal/outdated)
              </p>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded">
              <strong>Opening Paragraph</strong>
              <p className="text-muted-foreground mt-1">
                State: Position + Where you found it + Express interest<br/>
                <span className="text-xs italic">
                  "I am writing to apply for the Frontend Developer position that I discovered on LinkedIn. 
                  I am excited about the opportunity to contribute to [Company]'s innovative projects."
                </span>
              </p>
            </div>

            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded">
              <strong>Body Paragraph</strong>
              <p className="text-muted-foreground mt-1">
                Brief qualifications + Why you're a fit<br/>
                <span className="text-xs italic">
                  "With 3+ years of experience in React and TypeScript, I have successfully delivered 
                  10+ web applications. My expertise in [relevant skills] aligns well with the requirements."
                </span>
              </p>
            </div>

            <div className="p-3 bg-red-50 dark:bg-red-950 rounded">
              <strong>Attachment Mention</strong>
              <p className="text-muted-foreground mt-1">
                <span className="text-xs italic">
                  "Please find attached my resume and cover letter for your review."
                </span>
              </p>
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded">
              <strong>Closing</strong>
              <p className="text-muted-foreground mt-1">
                Thank them + Express interest in next steps<br/>
                <span className="text-xs italic">
                  "Thank you for considering my application. I look forward to the opportunity 
                  to discuss how I can contribute to your team."
                </span>
              </p>
            </div>

            <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded">
              <strong>Signature</strong>
              <p className="text-muted-foreground mt-1">
                Best regards,<br/>
                [Your Full Name]<br/>
                [Phone Number]<br/>
                [Email Address]<br/>
                [LinkedIn URL] (optional)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Line Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Line Templates</CardTitle>
          <CardDescription>Choose the right format for your situation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Standard Application:</strong><br/>
                "Application: [Position] - [Your Name]"<br/>
                <span className="text-xs text-muted-foreground">
                  Contoh: "Application: Marketing Manager - Sarah Johnson"
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>With Referral:</strong><br/>
                "Application: [Position] - Referred by [Name]"<br/>
                <span className="text-xs text-muted-foreground">
                  Contoh: "Application: Software Engineer - Referred by John Smith"
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>With Job ID:</strong><br/>
                "[Position] Application - [Your Name] (Job ID: [Number])"<br/>
                <span className="text-xs text-muted-foreground">
                  Contoh: "Data Analyst Application - Alex Chen (Job ID: DA-2024-05)"
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Do's and Don'ts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Application Email Do's & Don'ts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-green-600 mb-2">DO's ✅</h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Research recipient name</strong> - Use LinkedIn atau company website</li>
              <li>• <strong>Clear subject line</strong> - Position + Your Name</li>
              <li>• <strong>Concise body</strong> - 3-4 paragraf, max 200 kata</li>
              <li>• <strong>Professional email address</strong> - nama.lengkap@gmail.com</li>
              <li>• <strong>Attach CV & cover letter</strong> - Mentioned di email body</li>
              <li>• <strong>Proofread</strong> - No typos atau grammar errors</li>
              <li>• <strong>Send during business hours</strong> - 9 AM - 5 PM weekdays</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-red-600 mb-2">DON'Ts ❌</h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Generic email</strong> - "Dear Sir/Madam" jika bisa find name</li>
              <li>• <strong>Vague subject</strong> - "Lamaran", "Job Application"</li>
              <li>• <strong>Too long</strong> - Email bukan essay!</li>
              <li>• <strong>Unprofessional email</strong> - cute_girl123@yahoo.com</li>
              <li>• <strong>Forget attachments</strong> - Double check before send!</li>
              <li>• <strong>Send at odd hours</strong> - 2 AM emails = red flag</li>
              <li>• <strong>Use emoji</strong> - Keep it professional</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ Email Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Q: Haruskah attach CV di email body atau paste text?</h3>
            <p className="text-muted-foreground">
              A: <strong>Attach PDF</strong> (CV + cover letter). Email body hanya introduction singkat. 
              Don't paste entire CV di email!
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Kalau tidak tahu nama recruiter, pakai apa?</h3>
            <p className="text-muted-foreground">
              A: "Dear Hiring Manager" atau "Dear [Department] Team" (contoh: "Dear Marketing Team"). 
              Better than "To Whom It May Concern".
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Berapa lama ideal email aplikasi?</h3>
            <p className="text-muted-foreground">
              A: <strong>3-4 paragraf</strong> atau <strong>150-250 kata</strong>. Brief but informative. 
              Detail ada di CV dan cover letter.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Boleh follow-up jika tidak ada respon?</h3>
            <p className="text-muted-foreground">
              A: <strong>Yes!</strong> Wait 7-10 hari, then send polite follow-up email. 
              Max 2 follow-ups dengan jarak 1 minggu.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Alert>
        <Send className="h-4 w-4" />
        <AlertDescription>
          <strong>Siap Create Professional Application Email?</strong>
          <br />
          <a href="/tools/email-template" className="text-primary underline">
            Buka Email Template Generator →
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
}
