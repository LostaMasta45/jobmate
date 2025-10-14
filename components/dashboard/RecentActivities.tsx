"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Mail, Sparkles } from "lucide-react";
import { RecentCoverLetters } from "./RecentCoverLetters";
import { RecentEmails } from "./RecentEmails";
import { RecentPDFOperations } from "./RecentPDFOperations";

export function RecentActivities() {
  return (
    <Card className="overflow-hidden">
      <Tabs defaultValue="cover-letters" className="w-full">
        <div className="border-b bg-muted/30">
          <TabsList className="w-full justify-start rounded-none bg-transparent p-0 h-auto">
            <TabsTrigger
              value="cover-letters"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
            >
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Surat Lamaran</span>
              <span className="sm:hidden">Surat</span>
            </TabsTrigger>
            <TabsTrigger
              value="emails"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger
              value="pdf-tools"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">PDF Tools</span>
              <span className="sm:hidden">PDF</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          <TabsContent value="cover-letters" className="m-0">
            <RecentCoverLetters />
          </TabsContent>

          <TabsContent value="emails" className="m-0">
            <RecentEmails />
          </TabsContent>

          <TabsContent value="pdf-tools" className="m-0">
            <RecentPDFOperations />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
