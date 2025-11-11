import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { MobileToolHeader } from "@/components/tools/MobileToolHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, History, Sparkles, Plus } from "lucide-react";
import { WAGeneratorMain } from "@/components/whatsapp/WAGeneratorMain";
import Link from "next/link";

export default function WAGeneratorPage() {
  return (
    <AppShell>
      {/* Mobile Tool Header */}
      <MobileToolHeader
        title="WhatsApp Generator"
        description="Template pesan WA"
      />
      
      {/* Hero Header */}
      <div className="relative overflow-hidden mb-6 hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-lg" />
        <Card className="relative p-6 md:p-8 border-2">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 shadow-lg">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  WhatsApp Generator
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI + Spintax
                  </Badge>
                </h1>
                <p className="text-muted-foreground mt-1">
                  Generate pesan WA profesional dengan AI & variasi spintax otomatis
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="text-center px-4 py-2 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">7</div>
                <div className="text-xs text-muted-foreground">Tipe Pesan</div>
              </div>
              <div className="text-center px-4 py-2 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">4-6</div>
                <div className="text-xs text-muted-foreground">Variasi</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <div className="flex items-center justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
            <TabsTrigger value="create" className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Generate Pesan</span>
              <span className="sm:hidden">Generate</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2" asChild>
              <Link href="/tools/wa-generator/history">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
                <span className="sm:hidden">History</span>
              </Link>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="create" className="space-y-6 mt-6">
          {/* Quick Tips Banner */}
          <Card className="p-4 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:to-teal-950 border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  💡 Tips Pesan WA yang Efektif
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-800 dark:text-green-200">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                    <span>Kirim di jam kerja (09:00-16:00)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                    <span>Maksimal 100-120 kata</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                    <span>Gunakan spintax untuk variasi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                    <span>Mention nama HRD jika tahu</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Main Generator Component */}
          <WAGeneratorMain />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
