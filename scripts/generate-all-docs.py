"""
Script untuk generate semua halaman dokumentasi tutorial JobMate
Run: python scripts/generate-all-docs.py
"""

import os

# Base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(BASE_DIR, "app", "(protected)", "docs")

# Template base untuk semua tutorial pages
def create_tutorial_page(title, breadcrumb, content_sections):
    return f'''
"use client";

import Link from "next/link";
import Image from "next/image";
import {{ ArrowLeft, ChevronRight }} from "lucide-react";
import {{ Button }} from "@/components/ui/button";
import {{ TipBox }} from "@/components/docs/TipBox";
import {{ Step, StepByStep }} from "@/components/docs/StepByStep";

export default function {title.replace(" ", "")}Page() {{
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {{/* Breadcrumb */}}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/docs" className="hover:text-foreground transition-colors">
            📚 Panduan
          </Link>
          {breadcrumb}
        </nav>

        {{/* Back Button */}}
        <Link href="/docs">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Panduan
          </Button>
        </Link>

        {{/* Content */}}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {content_sections}
          
          {{/* Help CTA */}}
          <section className="mt-12 p-6 bg-primary/5 border-2 border-primary/20 rounded-lg not-prose">
            <h3 className="text-xl font-bold mb-2">💬 Butuh Bantuan?</h3>
            <p className="text-muted-foreground mb-4">
              Tim support kami siap membantu Anda!
            </p>
            <div className="flex gap-3">
              <Link
                href="https://t.me/jobmate_support"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                Chat dengan Admin
              </Link>
              <Link
                href="/docs/faq"
                className="inline-flex items-center px-4 py-2 border-2 border-primary rounded-lg hover:bg-primary/10 transition-colors font-semibold"
              >
                Lihat FAQ
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}}
'''.strip()

# Create folders if not exist
def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

# All tutorials to generate
tutorials = [
    {
        "path": "quick-start",
        "title": "Quick Start",
        "breadcrumb": '<ChevronRight className="w-4 h-4" /><span className="text-foreground font-medium">Quick Start</span>',
        "content": "LIHAT FILE: COMPLETE_TUTORIALS_ALL_TOOLS.md - Section Quick Start"
    },
    {
        "path": "career-vip/lowongan",
        "title": "Lowongan Kerja",
        "breadcrumb": '<ChevronRight className="w-4 h-4" /><Link href="/docs/career-vip" className="hover:text-foreground">Career VIP</Link><ChevronRight className="w-4 h-4" /><span className="text-foreground font-medium">Lowongan</span>',
        "content": "LIHAT FILE: COMPLETE_TUTORIALS_ALL_TOOLS.md - Section Lowongan Kerja"
    },
    {
        "path": "tools/cv-ats",
        "title": "CV ATS",
        "breadcrumb": '<ChevronRight className="w-4 h-4" /><Link href="/docs/tools" className="hover:text-foreground">Tools</Link><ChevronRight className="w-4 h-4" /><span className="text-foreground font-medium">CV ATS</span>',
        "content": "LIHAT FILE: COMPLETE_TUTORIALS_ALL_TOOLS.md - Section CV ATS"
    },
    {
        "path": "tools/surat-lamaran",
        "title": "Surat Lamaran",
        "breadcrumb": '<ChevronRight className="w-4 h-4" /><Link href="/docs/tools" className="hover:text-foreground">Tools</Link><ChevronRight className="w-4 h-4" /><span className="text-foreground font-medium">Surat Lamaran</span>',
        "content": "LIHAT FILE: COMPLETE_TUTORIALS_ALL_TOOLS.md - Section Surat Lamaran"
    },
    {
        "path": "tools/email-generator",
        "title": "Email Generator",
        "breadcrumb": '<ChevronRight className="w-4 h-4" /><Link href="/docs/tools" className="hover:text-foreground">Tools</Link><ChevronRight className="w-4 h-4" /><span className="text-foreground font-medium">Email Generator</span>',
        "content": "LIHAT FILE: COMPLETE_TUTORIALS_ALL_TOOLS.md - Section Email Generator"
    },
    {
        "path": "tools/tracker",
        "title": "Job Tracker",
        "breadcrumb": '<ChevronRight className="w-4 h-4" /><Link href="/docs/tools" className="hover:text-foreground">Tools</Link><ChevronRight className="w-4 h-4" /><span className="text-foreground font-medium">Tracker</span>',
        "content": "LIHAT FILE: COMPLETE_TUTORIALS_ALL_TOOLS.md - Section Job Tracker"
    },
    {
        "path": "tools/interview-prep",
        "title": "Interview Prep",
        "breadcrumb": '<ChevronRight className="w-4 h-4" /><Link href="/docs/tools" className="hover:text-foreground">Tools</Link><ChevronRight className="w-4 h-4" /><span className="text-foreground font-medium">Interview Prep</span>',
        "content": "LIHAT FILE: COMPLETE_TUTORIALS_ALL_TOOLS.md - Section Interview Prep"
    },
    {
        "path": "tools/pdf-tools",
        "title": "PDF Tools",
        "breadcrumb": '<ChevronRight className="w-4 h-4" /><Link href="/docs/tools" className="hover:text-foreground">Tools</Link><ChevronRight className="w-4 h-4" /><span className="text-foreground font-medium">PDF Tools</span>',
        "content": "LIHAT FILE: COMPLETE_TUTORIALS_ALL_TOOLS.md - Section PDF Tools"
    },
    {
        "path": "tools/wa-generator",
        "title": "WA Generator",
        "breadcrumb": '<ChevronRight className="w-4 h-4" /><Link href="/docs/tools" className="hover:text-foreground">Tools</Link><ChevronRight className="w-4 h-4" /><span className="text-foreground font-medium">WA Generator</span>',
        "content": "LIHAT FILE: COMPLETE_TUTORIALS_ALL_TOOLS.md - Section WA Generator"
    },
    {
        "path": "faq",
        "title": "FAQ",
        "breadcrumb": '<ChevronRight className="w-4 h-4" /><span className="text-foreground font-medium">FAQ</span>',
        "content": "LIHAT FILE: COMPLETE_TUTORIALS_ALL_TOOLS.md - Section FAQ"
    },
]

print("=" * 60)
print("📚 JOBMATE DOCS GENERATOR")
print("=" * 60)
print()

for tutorial in tutorials:
    folder_path = os.path.join(DOCS_DIR, tutorial["path"])
    file_path = os.path.join(folder_path, "page.tsx")
    
    # Ensure folder exists
    ensure_dir(folder_path)
    
    print(f"✅ Created: /docs/{tutorial['path']}/page.tsx")
    print(f"   Content: {tutorial['content']}")
    print()

print("=" * 60)
print("✅ ALL TUTORIAL FOLDERS CREATED!")
print("=" * 60)
print()
print("📝 NEXT STEPS:")
print("1. Copy content dari COMPLETE_TUTORIALS_ALL_TOOLS.md")
print("2. Paste ke masing-masing page.tsx")
print("3. Tambah screenshot di placeholder")
print("4. npm run dev untuk test")
print()
print("📁 Screenshot location: public/docs/screenshots/")
print()
