import { Metadata } from 'next';
import { BatchPosterUpload } from '@/components/admin/vip/BatchPosterUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, AlertTriangle, FileImage, BrainCircuit, Layers, CheckSquare, Sparkles, ArrowLeft, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Batch Upload Loker - Admin VIP Career',
  description: 'Upload multiple poster loker sekaligus dengan AI parsing',
};

export default function BatchUploadPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 -m-6 p-6 md:p-10">
      <div className="max-w-screen-2xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header Section with Glassmorphism */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/50">
          <div className="space-y-4">
            <Link 
              href="/admin/vip-loker" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors group"
            >
              <ChevronLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Dashboard VIP
            </Link>
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-gradient-to-br from-primary to-purple-600 rounded-xl shadow-lg shadow-primary/25">
                 <Sparkles className="h-6 w-6 text-white" />
               </div>
               <div>
                 <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
                   Batch Upload Loker
                 </h1>
               </div>
            </div>
            <p className="text-muted-foreground text-lg pl-[3.75rem]">
              AI-Powered Bulk Upload & Extraction Wizard
            </p>
          </div>
          
          <div className="flex gap-3 pl-[3.75rem] md:pl-0 self-start md:self-center">
             <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-background/50 px-4 py-2 rounded-full border shadow-sm">
                <BrainCircuit className="h-4 w-4 text-purple-500" />
                <span>Powered by Gemini AI 1.5 Pro</span>
             </div>
          </div>
        </div>

        {/* Main Wizard Container */}
        <div className="relative">
           <BatchPosterUpload />
        </div>

        {/* Footer / Help Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-sm text-muted-foreground border-t border-border/50">
           <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-background/50 transition-colors border border-transparent hover:border-border/50">
              <div className="mt-0.5 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                <FileImage className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-base mb-1">1. Upload Posters</p>
                <p>Drag & Drop hingga 10 poster lowongan sekaligus. Kami mendukung format JPG dan PNG.</p>
              </div>
           </div>
           <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-background/50 transition-colors border border-transparent hover:border-border/50">
              <div className="mt-0.5 p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-base mb-1">2. AI Extraction</p>
                <p>AI akan otomatis membaca dan mengekstrak detail penting seperti Posisi, Gaji, dan Kontak.</p>
              </div>
           </div>
           <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-background/50 transition-colors border border-transparent hover:border-border/50">
              <div className="mt-0.5 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                <CheckSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-base mb-1">3. Review & Publish</p>
                <p>Review hasil ekstraksi, edit jika perlu, dan publish semua lowongan dalam satu klik.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
