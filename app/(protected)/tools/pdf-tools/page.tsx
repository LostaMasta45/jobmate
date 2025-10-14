"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PDFToolsClient } from "@/components/pdf-tools/PDFToolsClient";

export default function PDFToolsPage() {
  return (
    <AppShell>
      <PDFToolsClient />
    </AppShell>
  );
}
