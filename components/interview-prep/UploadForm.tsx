"use client";

import React, { useState } from "react";
import { Upload, FileText, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateInterviewPrep } from "@/actions/interview-prep";
import { useRouter } from "next/navigation";

export function UploadForm() {
  const router = useRouter();
  const [cvText, setCvText] = useState("");
  const [jobPosterText, setJobPosterText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    if (!cvText.trim() || !jobPosterText.trim()) {
      setError("Mohon isi CV dan Job Poster terlebih dahulu");
      return;
    }

    setIsGenerating(true);
    setError("");
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await generateInterviewPrep({
        cvText,
        jobPosterText,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success && result.session) {
        // Redirect to result page
        setTimeout(() => {
          router.push(`/tools/interview-prep/session/${result.session!.id}`);
        }, 500);
      } else {
        setError(result.error || "Gagal generate interview prep");
        setIsGenerating(false);
        setProgress(0);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* CV Upload */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Upload CV</CardTitle>
            </div>
            <CardDescription>
              Paste teks CV Anda atau upload file PDF/DOCX
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste CV Anda di sini...&#10;&#10;Contoh:&#10;Nama: John Doe&#10;Email: john@example.com&#10;&#10;PENGALAMAN:&#10;- Senior Frontend Developer di TechCorp (2021-2024)&#10;- Led team of 5 developers&#10;&#10;SKILLS:&#10;React.js, Node.js, TypeScript, Team Leadership"
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              disabled={isGenerating}
            />
            
            {cvText && (
              <div className="text-sm text-muted-foreground">
                ✓ {cvText.split('\n').length} lines • {cvText.length} characters
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Poster Upload */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              <CardTitle>Job Poster</CardTitle>
            </div>
            <CardDescription>
              Paste job description atau requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste job description di sini...&#10;&#10;Contoh:&#10;Position: Frontend Tech Lead&#10;Company: Startup XYZ&#10;&#10;REQUIREMENTS:&#10;- 3+ years experience with React.js (Required)&#10;- Experience with GraphQL (Required)&#10;- AWS/Cloud experience (Preferred)&#10;- Team leadership experience (Required)&#10;&#10;RESPONSIBILITIES:&#10;- Lead frontend development team&#10;- Design and implement scalable architecture"
              value={jobPosterText}
              onChange={(e) => setJobPosterText(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              disabled={isGenerating}
            />
            
            {jobPosterText && (
              <div className="text-sm text-muted-foreground">
                ✓ {jobPosterText.split('\n').length} lines • {jobPosterText.length} characters
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Generate Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating || !cvText.trim() || !jobPosterText.trim()}
              className="w-full md:w-auto min-w-[300px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating {progress}%...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  🚀 Generate Complete Interview Prep (30-40 Questions)
                </>
              )}
            </Button>

            {isGenerating && (
              <div className="w-full max-w-md space-y-2">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-sm text-center text-muted-foreground">
                  {progress < 30 && "📄 Parsing CV..."}
                  {progress >= 30 && progress < 50 && "🖼️ Analyzing Job Poster..."}
                  {progress >= 50 && progress < 70 && "🧠 AI Gap Analysis..."}
                  {progress >= 70 && progress < 90 && "❓ Generating 30-40 Questions..."}
                  {progress >= 90 && "✅ Almost there..."}
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground text-center max-w-2xl">
              AI akan menganalisis CV dan Job Requirements, kemudian generate 30-40 pertanyaan interview
              yang dipersonalisasi dengan 3 level jawaban (Basic, Better, STAR Method) ⭐
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
