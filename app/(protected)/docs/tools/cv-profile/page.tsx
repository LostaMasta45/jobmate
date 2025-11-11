"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { User, Sparkles, Copy, Lightbulb, CheckCircle } from "lucide-react";
import { StepByStep } from "@/components/docs/StepByStep";

export default function CVProfileDocsPage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">CV Profile Generator</h1>
            <p className="text-muted-foreground text-lg">
              Buat ringkasan profil profesional (Professional Summary) yang compelling!
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* What is Professional Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Apa itu Professional Summary?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            <strong>Professional Summary</strong> (atau Profile Summary) adalah paragraf pembuka di CV Anda 
            yang merangkum <strong>who you are</strong>, <strong>what you offer</strong>, dan 
            <strong>why you're qualified</strong> dalam 2-4 kalimat.
          </p>

          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <strong>Impact:</strong> Recruiter hanya baca CV selama <strong>6-8 detik</strong>!<br/>
              Professional Summary yang kuat bisa increase peluang dibaca lengkap hingga 60%.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <h3 className="font-semibold text-red-600 mb-2">❌ Bad Summary:</h3>
              <p className="text-sm italic text-muted-foreground">
                "Saya adalah fresh graduate yang hardworking, fast learner, dan team player. 
                Saya bisa bekerja di bawah tekanan dan punya motivasi tinggi."
              </p>
              <p className="text-xs mt-2 text-red-600">
                <strong>Masalah:</strong> Generic, tidak spesifik, tidak ada value proposition
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h3 className="font-semibold text-green-600 mb-2">✅ Good Summary:</h3>
              <p className="text-sm italic text-muted-foreground">
                "Frontend Developer dengan 3+ tahun pengalaman building responsive web applications 
                menggunakan React dan TypeScript. Proven track record meningkatkan website performance 
                by 40% dan user engagement. Passionate about clean code dan modern UI/UX best practices."
              </p>
              <p className="text-xs mt-2 text-green-600">
                <strong>Kenapa Bagus:</strong> Specific, quantifiable, value-focused
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step */}
      <Card>
        <CardHeader>
          <CardTitle>Cara Menggunakan CV Profile Generator</CardTitle>
          <CardDescription>AI akan craft compelling professional summary untuk Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepByStep
            step={1}
            title="Input Your Information"
            description={
              <div className="space-y-2">
                <p>Isi form dengan informasi Anda:</p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Full Name</strong></li>
                  <li>• <strong>Education</strong> (degree, major, university)</li>
                  <li>• <strong>Skills</strong> (key skills yang relevant)
                    <p className="text-sm text-muted-foreground ml-4">Contoh: "React, TypeScript, Node.js, Python, SQL"</p>
                  </li>
                  <li>• <strong>Target Job</strong> (posisi yang Anda lamar)
                    <p className="text-sm text-muted-foreground ml-4">Contoh: "Frontend Developer", "Marketing Manager"</p>
                  </li>
                  <li>• <strong>Years of Experience</strong> (optional)
                    <p className="text-sm text-muted-foreground ml-4">Fresh grad? Leave blank atau tulis "fresh graduate"</p>
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
            title="Select Tone"
            description={
              <div className="space-y-2">
                <p>Pilih tone yang sesuai dengan target industry:</p>
                <div className="space-y-3 mt-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                    <strong className="text-blue-600">Formal</strong>
                    <p className="text-sm text-muted-foreground">
                      Professional language. For corporate, banking, legal, government.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                    <strong className="text-green-600">Professional</strong> (Default)
                    <p className="text-sm text-muted-foreground">
                      Balanced tone. Works for most industries - tech, consulting, healthcare.
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded">
                    <strong className="text-purple-600">Casual/Friendly</strong>
                    <p className="text-sm text-muted-foreground">
                      More conversational. For startups, creative agencies, casual cultures.
                    </p>
                  </div>
                </div>
              </div>
            }
          />

          <StepByStep
            step={3}
            title="Generate with AI"
            description={
              <div className="space-y-2">
                <ol className="space-y-2 ml-4">
                  <li>1. Klik <strong>"Generate Profile"</strong></li>
                  <li>2. AI akan create professional summary yang:
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>✅ Highlight your key qualifications</li>
                      <li>✅ Tailored untuk target job</li>
                      <li>✅ Include relevant keywords</li>
                      <li>✅ Proper length (2-4 kalimat)</li>
                    </ul>
                  </li>
                  <li>3. Wait 5-10 seconds untuk processing</li>
                </ol>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Generated profile]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={4}
            title="Customize & Copy"
            description={
              <div className="space-y-2">
                <ol className="space-y-2 ml-4">
                  <li>1. <strong>Review</strong> hasil generate</li>
                  <li>2. <strong>Edit</strong> untuk add personal touch:
                    <ul className="ml-4 mt-1 space-y-1 text-sm">
                      <li>• Specific achievements dengan metrics</li>
                      <li>• Unique skills atau certifications</li>
                      <li>• Industry-specific terminology</li>
                    </ul>
                  </li>
                  <li>3. <strong>Copy</strong> dan paste ke CV Anda</li>
                  <li>4. <strong>Save</strong> untuk future use</li>
                </ol>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Formula for Great Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Formula Professional Summary yang Efektif
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-muted/50 rounded">
              <strong>Sentence 1: Who You Are + Years of Experience</strong>
              <p className="text-sm text-muted-foreground mt-1">
                "[Job Title] dengan [X] tahun pengalaman di [Industry/Specialty]"
              </p>
              <p className="text-xs italic mt-1">
                Contoh: "Digital Marketing Specialist dengan 5+ tahun pengalaman di e-commerce industry"
              </p>
            </div>

            <div className="p-3 bg-muted/50 rounded">
              <strong>Sentence 2: What You're Good At + Achievements</strong>
              <p className="text-sm text-muted-foreground mt-1">
                "Expert dalam [Key Skills]. Proven track record [Specific Achievement with Metrics]"
              </p>
              <p className="text-xs italic mt-1">
                Contoh: "Expert dalam SEO, SEM, dan social media marketing. Successfully increased 
                organic traffic by 150% dan ROI by 40%"
              </p>
            </div>

            <div className="p-3 bg-muted/50 rounded">
              <strong>Sentence 3: What You're Passionate About + Value Add</strong>
              <p className="text-sm text-muted-foreground mt-1">
                "Passionate about [What] dan committed to [Value You Bring]"
              </p>
              <p className="text-xs italic mt-1">
                Contoh: "Passionate about data-driven marketing strategies dan committed to 
                delivering measurable business growth"
              </p>
            </div>
          </div>

          <Alert className="mt-4">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Length:</strong> Keep it <strong>2-4 kalimat</strong> atau <strong>50-100 kata</strong>. 
              Too short = vague, Too long = TL;DR (too long, didn't read).
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Examples by Level */}
      <Card>
        <CardHeader>
          <CardTitle>Contoh Professional Summary by Experience Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Fresh Graduate:</h3>
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded text-sm">
              <p className="italic">
                "Recent Computer Science graduate from Universitas Indonesia with strong foundation 
                in full-stack development. Completed 3 internship projects building web applications 
                using React, Node.js, and MongoDB. Eager to apply technical skills dan problem-solving 
                abilities dalam professional environment untuk contribute to innovative tech solutions."
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Mid-Level (3-5 years):</h3>
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded text-sm">
              <p className="italic">
                "Marketing Manager dengan 4 tahun pengalaman leading digital campaigns untuk B2B SaaS companies. 
                Track record increasing lead generation by 200% dan reducing CAC by 35% through data-driven 
                strategies. Skilled dalam marketing automation, content strategy, dan team leadership. 
                Passionate about growth marketing dan building scalable acquisition channels."
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Senior (7+ years):</h3>
            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded text-sm">
              <p className="italic">
                "Senior Product Manager dengan 8+ tahun pengalaman launching successful products di fintech 
                dan e-commerce. Led cross-functional teams of 20+ untuk deliver products generating $5M+ ARR. 
                Expert dalam product strategy, user research, dan agile methodologies. Proven ability untuk 
                identify market opportunities dan translate customer needs into profitable product solutions."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Do's and Don'ts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Professional Summary Do's & Don'ts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-green-600 mb-2">DO's ✅</h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Be specific</strong> - Mention actual skills, tools, achievements</li>
              <li>• <strong>Use numbers</strong> - Quantify achievements whenever possible</li>
              <li>• <strong>Tailor untuk job</strong> - Customize untuk setiap aplikasi</li>
              <li>• <strong>Use keywords</strong> - From job description</li>
              <li>• <strong>Show value</strong> - What can you do for THEM?</li>
              <li>• <strong>Write in 3rd person</strong> - "Marketing Manager dengan..." (not "Saya...")</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-red-600 mb-2">DON'Ts ❌</h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Generic statements</strong> - "Hard worker, team player"</li>
              <li>• <strong>List responsibilities</strong> - Focus on achievements!</li>
              <li>• <strong>Too humble</strong> - "Masih belajar, belum expert"</li>
              <li>• <strong>Too arrogant</strong> - "The best, unbeatable"</li>
              <li>• <strong>Use "I" repeatedly</strong> - Sounds egocentric</li>
              <li>• <strong>Career objectives</strong> - Save for cover letter</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ CV Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Q: Apakah summary wajib ada di CV?</h3>
            <p className="text-muted-foreground">
              A: <strong>Highly recommended</strong>! Especially jika Anda mid-level atau senior. 
              Fresh grad bisa skip jika space terbatas dan prefer focus on education/projects.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Letak summary di mana di CV?</h3>
            <p className="text-muted-foreground">
              A: Directly <strong>below contact info</strong>, before work experience. 
              It's the first thing recruiter reads!
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Haruskah update summary untuk setiap aplikasi?</h3>
            <p className="text-muted-foreground">
              A: <strong>Yes!</strong> At minimum, sesuaikan keywords dan emphasis based on job requirements. 
              Save 3-4 versions untuk different job types.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Summary vs Objective - Mana yang lebih baik?</h3>
            <p className="text-muted-foreground">
              A: <strong>Summary</strong> (what you offer) lebih modern dan effective dibanding Objective (what you want). 
              Recruiter care about what you can do for them, not your career goals.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Alert>
        <Copy className="h-4 w-4" />
        <AlertDescription>
          <strong>Siap Craft Professional Summary yang Compelling?</strong>
          <br />
          <a href="/tools/cv-profile" className="text-primary underline">
            Buka CV Profile Generator →
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
}
