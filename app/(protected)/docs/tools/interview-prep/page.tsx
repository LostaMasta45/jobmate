"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Target, Upload, MessageSquare, FileDown, Lightbulb, CheckCircle, AlertCircle } from "lucide-react";
import { StepByStep } from "@/components/docs/StepByStep";

export default function InterviewPrepDocsPage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Interview Preparation with AI</h1>
            <p className="text-muted-foreground text-lg">
              Persiapan interview yang menyeluruh dengan AI Assistant!
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Why Prep */}
      <Card>
        <CardHeader>
          <CardTitle>Kenapa Perlu Interview Prep?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Statistik:</strong><br/>
              • 70% kandidat gagal interview karena kurang persiapan<br/>
              • 80% pertanyaan interview bisa diprediksi<br/>
              • Kandidat yang prepare 3x lebih likely dapat offer
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="font-semibold text-lg mb-3">Benefits Interview Prep:</h3>
            <ul className="space-y-2 ml-4">
              <li>✅ Confidence boost</li>
              <li>✅ Better answers</li>
              <li>✅ Handle unexpected questions</li>
              <li>✅ Reduce anxiety</li>
              <li>✅ Increase success rate</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step */}
      <Card>
        <CardHeader>
          <CardTitle>Cara Menggunakan Interview Prep Tool</CardTitle>
          <CardDescription>Persiapan interview yang sistematis dan comprehensive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepByStep
            step={1}
            title="Upload Job Description"
            description={
              <div className="space-y-2">
                <ol className="space-y-2 ml-4">
                  <li>1. Klik menu <strong>Interview Prep</strong> di sidebar</li>
                  <li>2. Klik <strong>"Start New Session"</strong></li>
                  <li>3. <strong>Upload atau Paste</strong> job description:
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Copy dari lowongan</li>
                      <li>• Include requirements</li>
                      <li>• Include responsibilities</li>
                    </ul>
                  </li>
                </ol>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Upload JD form]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={2}
            title="AI Generate Questions"
            description={
              <div className="space-y-2">
                <p>AI akan analyze job description dan generate:</p>
                <ul className="space-y-2 ml-4">
                  <li>
                    <strong>1. Behavioral Questions</strong> (STAR method):
                    <ul className="ml-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>• "Tell me about a time when..."</li>
                      <li>• "Describe a situation where..."</li>
                    </ul>
                  </li>
                  <li>
                    <strong>2. Technical Questions</strong> (based on skills):
                    <ul className="ml-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>• Language-specific questions</li>
                      <li>• Tools/framework questions</li>
                    </ul>
                  </li>
                  <li>
                    <strong>3. Situational Questions</strong>:
                    <ul className="ml-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>• "What would you do if...?"</li>
                      <li>• "How would you approach...?"</li>
                    </ul>
                  </li>
                  <li>
                    <strong>4. Company/Culture Fit</strong>:
                    <ul className="ml-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>• "Why do you want to work here?"</li>
                      <li>• "What do you know about our company?"</li>
                    </ul>
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Generated questions]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={3}
            title="Practice dengan AI"
            description={
              <div className="space-y-2">
                <ol className="space-y-2 ml-4">
                  <li>1. <strong>Select Question</strong> untuk practice</li>
                  <li>2. <strong>Record atau Type</strong> answer Anda</li>
                  <li>3. <strong>AI Feedback</strong>:
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Strength (apa yang bagus)</li>
                      <li>• Areas to improve</li>
                      <li>• Suggestions untuk better answer</li>
                    </ul>
                  </li>
                  <li>4. <strong>Revise</strong> answer dan practice lagi</li>
                </ol>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Practice mode]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={4}
            title="Export Study Guide"
            description={
              <div className="space-y-2">
                <ol className="space-y-2 ml-4">
                  <li>1. <strong>Review</strong> semua questions dan answers</li>
                  <li>2. <strong>Download PDF</strong> untuk dibaca offline</li>
                  <li>3. <strong>Print</strong> jika perlu</li>
                  <li>4. <strong>Practice</strong> dengan teman/keluarga</li>
                </ol>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* STAR Method */}
      <Card>
        <CardHeader>
          <CardTitle>STAR Method untuk Behavioral Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <strong className="text-blue-600 dark:text-blue-400">S</strong>ituation
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <strong className="text-green-600 dark:text-green-400">T</strong>ask
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <strong className="text-orange-600 dark:text-orange-400">A</strong>ction
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <strong className="text-purple-600 dark:text-purple-400">R</strong>esult
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted/50 rounded space-y-3 text-sm">
            <p><strong>Question:</strong> "Tell me about a time you solved a difficult problem."</p>
            
            <div>
              <p className="font-semibold text-blue-600">Situation:</p>
              <p className="text-muted-foreground">
                "Di perusahaan previous, kami facing masalah website load time sangat slow (8+ seconds)..."
              </p>
            </div>

            <div>
              <p className="font-semibold text-green-600">Task:</p>
              <p className="text-muted-foreground">
                "Sebagai Frontend Developer, saya ditugaskan untuk identify dan solve performance issues dalam 2 minggu."
              </p>
            </div>

            <div>
              <p className="font-semibold text-orange-600">Action:</p>
              <p className="text-muted-foreground">
                "Saya start dengan audit menggunakan Lighthouse. Saya implemented lazy loading, code splitting, dan optimize API queries."
              </p>
            </div>

            <div>
              <p className="font-semibold text-purple-600">Result:</p>
              <p className="text-muted-foreground">
                "Load time turun dari 8 detik ke 1.8 detik (77.5% improvement). Bounce rate turun dari 65% ke 28%, conversion rate naik 40%."
              </p>
            </div>
          </div>

          <Alert className="mt-4">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Tips STAR Method:</strong><br/>
              • <strong>Specific</strong> - Jangan vague, kasih detail<br/>
              • <strong>Quantify</strong> - Include numbers always<br/>
              • <strong>Positive</strong> - Focus on success<br/>
              • <strong>Relevant</strong> - Connect ke posisi yang dilamar
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Common Mistakes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Common Interview Mistakes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-red-600 mb-2">❌ Tidak Research Perusahaan</h3>
            <p className="text-sm text-muted-foreground">
              Wrong: "Saya tidak tahu company ini doing apa"<br/>
              ✅ Right: Research: Website, social media, news
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-red-600 mb-2">❌ Badmouth Previous Employer</h3>
            <p className="text-sm text-muted-foreground">
              Wrong: "Boss saya toxic, perusahaan jelek"<br/>
              ✅ Right: "Saya looking for new challenges dan growth opportunities"
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-red-600 mb-2">❌ Tidak Prepare Questions</h3>
            <p className="text-sm text-muted-foreground">
              Wrong: "Tidak ada pertanyaan"<br/>
              ✅ Right: Prepare 3-5 good questions tentang role, team, culture
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Questions to Ask */}
      <Card>
        <CardHeader>
          <CardTitle>Questions to Ask Interviewer</CardTitle>
          <CardDescription>Selalu prepare questions untuk interviewer!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">About the Role:</h3>
            <ul className="space-y-1 ml-4 text-sm text-muted-foreground">
              <li>• "What does success look like in this role in the first 6 months?"</li>
              <li>• "What are the biggest challenges for this position?"</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">About the Team:</h3>
            <ul className="space-y-1 ml-4 text-sm text-muted-foreground">
              <li>• "Can you tell me about the team I'll be working with?"</li>
              <li>• "How does the team collaborate?"</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">About Growth:</h3>
            <ul className="space-y-1 ml-4 text-sm text-muted-foreground">
              <li>• "What are the growth opportunities in this role?"</li>
              <li>• "What's the typical career path?"</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Alert>
        <Target className="h-4 w-4" />
        <AlertDescription>
          <strong>Siap Ace Your Interview?</strong>
          <br />
          <a href="/tools/interview-prep" className="text-primary underline">
            Mulai Interview Prep →
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
}
