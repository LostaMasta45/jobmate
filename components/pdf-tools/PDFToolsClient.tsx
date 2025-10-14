"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  FileText, 
  Minimize2, 
  FileImage, 
  FileEdit, 
  History,
  Sparkles 
} from "lucide-react";
import { MergeTool } from "./tools/MergeTool";
import { CompressTool } from "./tools/CompressTool";
import { ConvertTool } from "./tools/ConvertTool";
import { PDFHistory } from "./PDFHistory";

export function PDFToolsClient() {
  const [activeTab, setActiveTab] = useState("merge");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">PDF Tools</h1>
            <p className="text-muted-foreground">
              Kelola dokumen PDF untuk lamaran kerja Anda
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              Tools PDF untuk Job Seeker
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>• Gabung CV + Portfolio + Sertifikat jadi 1 PDF profesional</li>
              <li>• Kompres file untuk memenuhi limit job portal (max 2MB)</li>
              <li>• Convert Word/Image ke PDF dengan kualitas terbaik</li>
              <li>• File aman & auto-dihapus setelah 7 hari</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Tools Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="merge" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Gabung PDF</span>
            <span className="sm:hidden">Gabung</span>
          </TabsTrigger>
          <TabsTrigger value="compress" className="gap-2">
            <Minimize2 className="h-4 w-4" />
            <span className="hidden sm:inline">Kompres</span>
            <span className="sm:hidden">Kompres</span>
          </TabsTrigger>
          <TabsTrigger value="convert" className="gap-2">
            <FileImage className="h-4 w-4" />
            <span className="hidden sm:inline">Convert</span>
            <span className="sm:hidden">Convert</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Riwayat</span>
            <span className="sm:hidden">Riwayat</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="merge" className="space-y-4">
          <MergeTool />
        </TabsContent>

        <TabsContent value="compress" className="space-y-4">
          <CompressTool />
        </TabsContent>

        <TabsContent value="convert" className="space-y-4">
          <ConvertTool />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <PDFHistory />
        </TabsContent>
      </Tabs>

      {/* Privacy Notice */}
      <Card className="p-4 bg-muted/50">
        <div className="flex items-start gap-3 text-sm">
          <div>🔒</div>
          <div>
            <p className="font-medium">Keamanan & Privacy</p>
            <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
              <li>• File dienkripsi dengan SSL</li>
              <li>• Hanya Anda yang bisa akses file</li>
              <li>• File otomatis dihapus setelah 7 hari</li>
              <li>• Powered by iLovePDF API (250 ops/month free)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
