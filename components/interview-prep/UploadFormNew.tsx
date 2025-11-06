"use client";

import React, { useState } from "react";
import { Upload, Loader2, AlertCircle, FileText, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploadPreview } from "@/components/ui/file-upload-preview";
import { generateInterviewPrep } from "@/actions/interview-prep";
import { useRouter } from "next/navigation";

export function UploadFormNew() {
  const router = useRouter();
  
  // CV Upload
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState("");
  const [cvMode, setCvMode] = useState<'upload' | 'text'>('upload');
  
  // Job Poster Upload
  const [jobPosterFile, setJobPosterFile] = useState<File | null>(null);
  const [jobPosterText, setJobPosterText] = useState("");
  const [jobPosterMode, setJobPosterMode] = useState<'upload' | 'text'>('upload');
  
  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");

  const canGenerate = () => {
    const hasCv = cvMode === 'upload' ? cvFile !== null : cvText.trim().length > 0;
    const hasJob = jobPosterMode === 'upload' ? jobPosterFile !== null : jobPosterText.trim().length > 0;
    return hasCv && hasJob && !isGenerating;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    setProgress(0);

    try {
      // Prepare data
      let finalCvText = "";
      let finalJobText = "";

      // Step 1: Process CV
      setProgress(10);
      setProgressMessage("📄 Memproses CV Anda...");

      if (cvMode === 'upload' && cvFile) {
        // Convert image to base64 and extract text with GPT-4o Vision
        const cvBase64 = await fileToBase64(cvFile);
        const response = await fetch('/api/interview-prep/extract-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: cvBase64, type: 'cv' }),
        });
        
        if (!response.ok) {
          throw new Error('Gagal extract text dari CV');
        }
        
        const data = await response.json();
        finalCvText = data.extractedText;
      } else {
        finalCvText = cvText;
      }

      // Step 2: Process Job Poster
      setProgress(30);
      setProgressMessage("🖼️ Menganalisis Job Poster...");

      if (jobPosterMode === 'upload' && jobPosterFile) {
        // Convert image to base64 and extract text with GPT-4o Vision
        const jobBase64 = await fileToBase64(jobPosterFile);
        const response = await fetch('/api/interview-prep/extract-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: jobBase64, type: 'job_poster' }),
        });
        
        if (!response.ok) {
          throw new Error('Gagal extract text dari Job Poster');
        }
        
        const data = await response.json();
        finalJobText = data.extractedText;
      } else {
        finalJobText = jobPosterText;
      }

      // Step 3: Generate Interview Prep
      setProgress(50);
      setProgressMessage("🧠 AI sedang menganalisis gap...");

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 5;
        });
      }, 1000);

      const result = await generateInterviewPrep({
        cvText: finalCvText,
        jobPosterText: finalJobText,
      });

      clearInterval(progressInterval);
      setProgress(100);
      setProgressMessage("✅ Selesai!");

      if (result.success && result.session) {
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
      setProgressMessage("");
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
        {/* CV Upload/Paste */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>CV Anda</CardTitle>
            </div>
            <CardDescription>
              Upload screenshot CV atau paste text
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={cvMode} onValueChange={(v) => setCvMode(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload Gambar
                </TabsTrigger>
                <TabsTrigger value="text">
                  <FileText className="h-4 w-4 mr-2" />
                  Paste Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-4">
                <FileUploadPreview
                  file={cvFile}
                  onFileChange={setCvFile}
                  accept="image/*"
                  maxSize={5}
                  label="Upload CV (Gambar)"
                  description="JPG, PNG, WebP - max 5MB"
                />
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    💡 <strong>Tips: Punya CV dalam PDF?</strong><br/>
                    Screenshot halaman PDF Anda, lalu upload screenshot tersebut. 
                    AI kami akan extract semua text dengan akurat!
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    📸 Windows: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Win + Shift + S</code> | 
                    Mac: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Cmd + Shift + 4</code>
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="text" className="mt-4">
                <Textarea
                  placeholder="Paste CV Anda di sini...&#10;&#10;Contoh:&#10;Nama: Reza Hamami&#10;Email: reza@example.com&#10;&#10;PENGALAMAN:&#10;- Senior Frontend Developer di TechCorp (2021-2024)&#10;- Led team of 5 developers&#10;&#10;SKILLS:&#10;React.js, Node.js, TypeScript"
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                  disabled={isGenerating}
                />
                {cvText && (
                  <div className="text-sm text-muted-foreground mt-2">
                    ✓ {cvText.split('\n').length} baris • {cvText.length} karakter
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Job Poster Upload/Paste */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              <CardTitle>Job Poster</CardTitle>
            </div>
            <CardDescription>
              Upload screenshot job poster atau paste deskripsi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={jobPosterMode} onValueChange={(v) => setJobPosterMode(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload Gambar
                </TabsTrigger>
                <TabsTrigger value="text">
                  <FileText className="h-4 w-4 mr-2" />
                  Paste Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-4">
                <FileUploadPreview
                  file={jobPosterFile}
                  onFileChange={setJobPosterFile}
                  accept="image/*"
                  maxSize={5}
                  label="Upload Job Poster (Gambar)"
                  description="JPG, PNG, WebP - max 5MB"
                />
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    💡 <strong>Tips: Punya Job Description dalam PDF?</strong><br/>
                    Screenshot halaman PDF atau posting job dari LinkedIn/JobStreet. 
                    AI akan membaca semua requirement dengan detail!
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    📸 Windows: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Win + Shift + S</code> | 
                    Mac: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Cmd + Shift + 4</code>
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="text" className="mt-4">
                <Textarea
                  placeholder="Paste job description di sini...&#10;&#10;Contoh:&#10;Position: Frontend Tech Lead&#10;Company: Startup XYZ&#10;&#10;REQUIREMENTS:&#10;- 3+ years React.js (Required)&#10;- GraphQL experience (Required)&#10;- Team leadership (Required)"
                  value={jobPosterText}
                  onChange={(e) => setJobPosterText(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                  disabled={isGenerating}
                />
                {jobPosterText && (
                  <div className="text-sm text-muted-foreground mt-2">
                    ✓ {jobPosterText.split('\n').length} baris • {jobPosterText.length} karakter
                  </div>
                )}
              </TabsContent>
            </Tabs>
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
              disabled={!canGenerate()}
              className="w-full md:w-auto min-w-[350px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating {progress}%...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  🚀 Generate Persiapan Interview (30-40 Pertanyaan)
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
                {progressMessage && (
                  <div className="text-sm text-center text-muted-foreground">
                    {progressMessage}
                  </div>
                )}
              </div>
            )}

            {!isGenerating && (
              <p className="text-sm text-muted-foreground text-center max-w-2xl">
                AI akan menganalisis CV dan Job Requirements, kemudian generate 30-40 pertanyaan interview
                yang dipersonalisasi dengan 3 level jawaban (Dasar, Lebih Baik, Metode STAR) ⭐
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
