"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { FileText, Sparkles, CheckCircle, Lightbulb, Download } from "lucide-react";
import { StepByStep } from "@/components/docs/StepByStep";

export default function CoverLetterDocsPage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Cover Letter Generator</h1>
            <p className="text-muted-foreground text-lg">
              Generate English cover letter yang professional dan compelling!
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* What is Cover Letter */}
      <Card>
        <CardHeader>
          <CardTitle>Apa Bedanya Cover Letter dengan Surat Lamaran?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <strong>Cover Letter</strong> = English version, often more concise dan direct.<br/>
              <strong>Surat Lamaran</strong> = Bahasa Indonesia version, lebih formal structure.
            </AlertDescription>
          </Alert>

          <p className="text-muted-foreground">
            Cover letter digunakan untuk melamar ke perusahaan <strong>multinational</strong>, 
            <strong>startup tech</strong>, atau posisi yang require <strong>English communication</strong>.
          </p>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h3 className="font-semibold text-blue-600 mb-2">Kapan Pakai Cover Letter?</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>✅ Job posting dalam bahasa Inggris</li>
              <li>✅ Perusahaan multinational (Google, Microsoft, dll)</li>
              <li>✅ Startup dengan international team</li>
              <li>✅ Posisi yang require English proficiency</li>
              <li>✅ Apply ke perusahaan luar negeri</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step */}
      <Card>
        <CardHeader>
          <CardTitle>Cara Menggunakan Cover Letter Generator</CardTitle>
          <CardDescription>AI akan craft compelling cover letter dalam bahasa Inggris</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepByStep
            step={1}
            title="Input Your Information"
            description={
              <div className="space-y-2">
                <p>Fill in the form with your details:</p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Full Name</strong></li>
                  <li>• <strong>Position</strong> you're applying for</li>
                  <li>• <strong>Company Name</strong></li>
                  <li>• <strong>Key Skills</strong> (relevant to the role)</li>
                  <li>• <strong>Experience</strong> highlights (brief summary)</li>
                  <li>• <strong>Reason</strong> why you're interested in the role/company</li>
                  <li>• <strong>Tone</strong>: Formal, Professional, atau Friendly</li>
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
                <p>Choose the right tone for your cover letter:</p>
                <div className="space-y-3 mt-3">
                  <div className="p-3 bg-muted/50 rounded">
                    <strong>Formal</strong>
                    <p className="text-sm text-muted-foreground">
                      For corporate, banking, legal, government positions. Very professional language.
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded">
                    <strong>Professional</strong> (Default)
                    <p className="text-sm text-muted-foreground">
                      For most applications. Professional but not overly stiff. Works for tech, consulting, etc.
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded">
                    <strong>Friendly</strong>
                    <p className="text-sm text-muted-foreground">
                      For startups, creative agencies, casual work environments. More conversational tone.
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
                  <li>1. Click <strong>"Generate Cover Letter"</strong></li>
                  <li>2. AI will create a cover letter that:
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>✅ Opens with a strong hook</li>
                      <li>✅ Highlights your relevant qualifications</li>
                      <li>✅ Shows enthusiasm for the role</li>
                      <li>✅ Closes with a clear call-to-action</li>
                    </ul>
                  </li>
                  <li>3. Wait 10-15 seconds for processing</li>
                </ol>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Generated cover letter]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={4}
            title="Customize & Personalize"
            description={
              <div className="space-y-2">
                <p>Make it uniquely yours:</p>
                <ol className="space-y-2 ml-4">
                  <li>1. <strong>Add specific details</strong> about the company
                    <ul className="ml-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>• Recent news, products, or initiatives</li>
                      <li>• Why their mission resonates with you</li>
                    </ul>
                  </li>
                  <li>2. <strong>Quantify achievements</strong>
                    <ul className="ml-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>• "Increased sales by 35%"</li>
                      <li>• "Led team of 8 developers"</li>
                    </ul>
                  </li>
                  <li>3. <strong>Show genuine passion</strong>
                    <ul className="ml-4 mt-1 space-y-1 text-sm text-muted-foreground">
                      <li>• What excites you about the role?</li>
                      <li>• How do you see yourself contributing?</li>
                    </ul>
                  </li>
                </ol>
                <Alert className="mt-3">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pro Tip:</strong> The best cover letters tell a <strong>story</strong>. 
                    Don't just list qualifications—show how your experience connects to their needs.
                  </AlertDescription>
                </Alert>
              </div>
            }
          />

          <StepByStep
            step={5}
            title="Download & Submit"
            description={
              <div className="space-y-2">
                <p>Download in your preferred format:</p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>PDF</strong> (recommended) - Professional and universal</li>
                  <li>• <strong>DOCX</strong> (Word) - If required by employer</li>
                  <li>• <strong>Copy Text</strong> - For pasting in email or online forms</li>
                </ul>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Cover Letter Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Anatomy of a Great Cover Letter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
              <strong>Opening Paragraph</strong>
              <p className="text-muted-foreground mt-1">
                • Hook that grabs attention<br/>
                • Position you're applying for<br/>
                • Where you found the job posting
              </p>
            </div>

            <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
              <strong>Body Paragraph 1 - Your Qualifications</strong>
              <p className="text-muted-foreground mt-1">
                • Relevant experience and skills<br/>
                • Specific achievements with metrics<br/>
                • How you meet the requirements
              </p>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded">
              <strong>Body Paragraph 2 - Why This Company</strong>
              <p className="text-muted-foreground mt-1">
                • What attracts you to the company<br/>
                • Alignment with company values/mission<br/>
                • How you'll contribute to their goals
              </p>
            </div>

            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded">
              <strong>Closing Paragraph</strong>
              <p className="text-muted-foreground mt-1">
                • Reiterate interest and enthusiasm<br/>
                • Call-to-action (looking forward to discussing)<br/>
                • Thank them for consideration
              </p>
            </div>
          </div>

          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Length:</strong> Keep it to <strong>3-4 paragraphs</strong> or <strong>250-400 words</strong>. 
              Hiring managers don't have time for novels!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Do's and Don'ts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Cover Letter Do's & Don'ts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-green-600 mb-2">DO's ✅</h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Address by name</strong> if possible (Dear Mr./Ms. [Name])</li>
              <li>• <strong>Research the company</strong> thoroughly</li>
              <li>• <strong>Show, don't tell</strong> - Use specific examples</li>
              <li>• <strong>Match keywords</strong> from job description</li>
              <li>• <strong>Keep it concise</strong> - Quality over quantity</li>
              <li>• <strong>End with confidence</strong> - "I look forward to discussing..."</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-red-600 mb-2">DON'Ts ❌</h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Generic "To Whom It May Concern"</strong></li>
              <li>• <strong>Just repeat your resume</strong></li>
              <li>• <strong>Focus on what company can do for you</strong></li>
              <li>• <strong>Use clichés</strong> ("I'm a team player")</li>
              <li>• <strong>Typos or grammar mistakes</strong></li>
              <li>• <strong>Mention salary</strong> in opening letter</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ Cover Letter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Q: Do I really need a cover letter?</h3>
            <p className="text-muted-foreground">
              A: <strong>Yes!</strong> Even if "optional", submitting one shows initiative and can set you apart 
              from 80% of applicants who don't bother.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Should I use the same cover letter for multiple applications?</h3>
            <p className="text-muted-foreground">
              A: <strong>NO.</strong> Customize each one. Hiring managers can tell when you're using a template. 
              Personalization shows genuine interest.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: How do I address if I don't know the hiring manager's name?</h3>
            <p className="text-muted-foreground">
              A: Try LinkedIn or company website first. If impossible to find, use "Dear Hiring Manager" 
              or "Dear [Department] Team" instead of "To Whom It May Concern".
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Alert>
        <Download className="h-4 w-4" />
        <AlertDescription>
          <strong>Ready to Create Your Cover Letter?</strong>
          <br />
          <a href="/tools/cover-letter" className="text-primary underline">
            Open Cover Letter Generator →
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
}
