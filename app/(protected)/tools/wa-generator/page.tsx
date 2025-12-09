import { AppShell } from "@/components/layout/AppShell";
import { MobileToolHeader } from "@/components/tools/MobileToolHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Plus } from "lucide-react";
import { WAGeneratorMain } from "@/components/whatsapp/WAGeneratorMain";
import { WAGeneratorHeader } from "@/components/whatsapp/WAGeneratorHeader";
import Link from "next/link";

export default function WAGeneratorPage() {
  return (
    <AppShell>
      {/* Mobile Tool Header (Standard) */}
      <div className="lg:hidden">
        <MobileToolHeader
          title="WhatsApp Generator"
          description="Template pesan WA"
        />
      </div>
      
      {/* Enhanced Animated Header */}
      <WAGeneratorHeader />

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
          {/* Main Generator Component */}
          <WAGeneratorMain />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
