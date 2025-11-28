import { Metadata } from 'next';
import { BatchPosterUpload } from '@/components/admin/vip/BatchPosterUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, AlertTriangle, FileImage, BrainCircuit, Layers, CheckSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Batch Upload Loker - Admin VIP Career',
  description: 'Upload multiple poster loker sekaligus dengan AI parsing',
};

export default function BatchUploadPage() {
  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Batch Upload Loker</h1>
        <p className="text-muted-foreground mt-1">
          Upload multiple job posters at once and let AI extract the details for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Upload Tool */}
        <div className="lg:col-span-2">
           <BatchPosterUpload />
        </div>

        {/* Sidebar - Info & Guidelines */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-900/20">
            <CardHeader className="pb-3">
               <CardTitle className="flex items-center gap-2 text-base font-semibold text-blue-900 dark:text-blue-100">
                 <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                 Key Features
               </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
               <div className="flex items-start gap-3">
                 <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                   <FileImage className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                 </div>
                 <div>
                   <p className="font-medium text-sm text-blue-900 dark:text-blue-100">Bulk Upload</p>
                   <p className="text-xs text-blue-700/80 dark:text-blue-300/80">Process up to 10 posters in a single batch.</p>
                 </div>
               </div>
               
               <div className="flex items-start gap-3">
                 <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg">
                   <BrainCircuit className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                 </div>
                 <div>
                   <p className="font-medium text-sm text-blue-900 dark:text-blue-100">AI Extraction</p>
                   <p className="text-xs text-blue-700/80 dark:text-blue-300/80">Automatically parses company, role, and requirements.</p>
                 </div>
               </div>

               <div className="flex items-start gap-3">
                 <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg">
                   <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                 </div>
                 <div>
                   <p className="font-medium text-sm text-blue-900 dark:text-blue-100">Multi-Position Detection</p>
                   <p className="text-xs text-blue-700/80 dark:text-blue-300/80">Detects multiple jobs from a single poster.</p>
                 </div>
               </div>

               <div className="flex items-start gap-3">
                 <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-lg">
                   <CheckSquare className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                 </div>
                 <div>
                   <p className="font-medium text-sm text-blue-900 dark:text-blue-100">Review & Publish</p>
                   <p className="text-xs text-blue-700/80 dark:text-blue-300/80">Edit details before pushing to live.</p>
                 </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-900/20">
            <CardHeader className="pb-3">
               <CardTitle className="flex items-center gap-2 text-base font-semibold text-amber-900 dark:text-amber-100">
                 <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                 Examples & Tips
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-amber-900/80 dark:text-amber-200/80">
              <div className="space-y-1">
                <p className="font-semibold text-amber-900 dark:text-amber-100">Single Position Poster</p>
                <p className="text-xs italic bg-background/50 p-2 rounded border border-amber-100 dark:border-amber-900/30">
                  "Dibutuhkan: Staff Admin - PT Maju Jaya"
                  <br />→ AI detects 1 position.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-amber-900 dark:text-amber-100">Multi-Position Poster</p>
                <p className="text-xs italic bg-background/50 p-2 rounded border border-amber-100 dark:border-amber-900/30">
                  "Lowongan: 1. Staff Admin, 2. Sales, 3. Driver"
                  <br />→ AI detects 3 separate jobs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
