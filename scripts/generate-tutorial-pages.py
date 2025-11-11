"""
Script untuk generate semua halaman tutorial JobMate
Run: python scripts/generate-tutorial-pages.py
"""

import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(BASE_DIR, "app", "(protected)", "docs")

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

# Template base untuk tutorial page
TEMPLATE_START = '''\"use client\";

import Link from \"next/link\";
import { ArrowLeft, ChevronRight } from \"lucide-react\";
import { Button } from \"@/components/ui/button\";
import { TipBox } from \"@/components/docs/TipBox\";
import { Card, CardContent } from \"@/components/ui/card\";

export default function {component_name}() {{
  return (
    <div className=\"min-h-screen bg-background\">
      <div className=\"container max-w-4xl mx-auto px-4 py-8\">
        {/* Breadcrumb */}
        <nav className=\"flex items-center gap-2 text-sm text-muted-foreground mb-6\">
          <Link href=\"/docs\" className=\"hover:text-foreground transition-colors\">
            📚 Panduan
          </Link>
          {breadcrumb}
        </nav>

        {/* Back Button */}
        <Link href=\"/docs\">
          <Button variant=\"ghost\" className=\"mb-6\">
            <ArrowLeft className=\"w-4 h-4 mr-2\" />
            Kembali ke Panduan
          </Button>
        </Link>

        {/* Content */}
        <div className=\"prose prose-slate dark:prose-invert max-w-none\">
          {content}

          {/* Help CTA */}
          <section className=\"mt-12 p-6 bg-primary/5 border-2 border-primary/20 rounded-lg not-prose\">
            <h3 className=\"text-xl font-bold mb-2\">💬 Butuh Bantuan?</h3>
            <p className=\"text-muted-foreground mb-4\">
              Tim support kami siap membantu Anda!
            </p>
            <div className=\"flex flex-wrap gap-3\">
              <Link
                href=\"https://t.me/jobmate_support\"
                target=\"_blank\"
                rel=\"noopener noreferrer\"
                className=\"inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold\"
              >
                Chat dengan Admin
              </Link>
              <Link
                href=\"/docs/faq\"
                className=\"inline-flex items-center px-4 py-2 border-2 border-primary rounded-lg hover:bg-primary/10 transition-colors font-semibold\"
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
'''

# Tutorial pages to generate
tutorials = {
    "cv-ats": {
        "path": "tools/cv-ats",
        "component_name": "CVATSPage",
        "title": "📝 Tutorial: CV ATS Generator",
        "description": "Buat CV yang lolos ATS (Applicant Tracking System) dengan AI!",
        "breadcrumb": '<ChevronRight className=\"w-4 h-4\" /><span className=\"text-muted-foreground\">Tools</span><ChevronRight className=\"w-4 h-4\" /><span className=\"text-foreground font-medium\">CV ATS</span>',
    },
    "surat-lamaran": {
        "path": "tools/surat-lamaran",
        "component_name": "SuratLamaranPage",
        "title": "✉️ Tutorial: Surat Lamaran AI",
        "description": "Generate surat lamaran profesional dalam 1 menit dengan AI!",
        "breadcrumb": '<ChevronRight className=\"w-4 h-4\" /><span className=\"text-muted-foreground\">Tools</span><ChevronRight className=\"w-4 h-4\" /><span className=\"text-foreground font-medium\">Surat Lamaran</span>',
    },
    "email-generator": {
        "path": "tools/email-generator",
        "component_name": "EmailGeneratorPage",
        "title": "📧 Tutorial: Email Generator",
        "description": "Generate email follow-up profesional untuk increase response rate!",
        "breadcrumb": '<ChevronRight className=\"w-4 h-4\" /><span className=\"text-muted-foreground\">Tools</span><ChevronRight className=\"w-4 h-4\" /><span className=\"text-foreground font-medium\">Email Generator</span>',
    },
    "tracker": {
        "path": "tools/tracker",
        "component_name": "TrackerPage",
        "title": "📊 Tutorial: Job Application Tracker",
        "description": "Organize semua aplikasi kerja dengan Kanban board!",
        "breadcrumb": '<ChevronRight className=\"w-4 h-4\" /><span className=\"text-muted-foreground\">Tools</span><ChevronRight className=\"w-4 h-4\" /><span className=\"text-foreground font-medium\">Tracker</span>',
    },
    "interview-prep": {
        "path": "tools/interview-prep",
        "component_name": "InterviewPrepPage",
        "title": "🎯 Tutorial: Interview Preparation",
        "description": "Persiapan interview yang menyeluruh dengan AI Assistant!",
        "breadcrumb": '<ChevronRight className=\"w-4 h-4\" /><span className=\"text-muted-foreground\">Tools</span><ChevronRight className=\"w-4 h-4\" /><span className=\"text-foreground font-medium\">Interview Prep</span>',
    },
    "pdf-tools": {
        "path": "tools/pdf-tools",
        "component_name": "PDFToolsPage",
        "title": "📄 Tutorial: PDF Tools",
        "description": "Merge, split, compress, dan convert PDF dengan mudah!",
        "breadcrumb": '<ChevronRight className=\"w-4 h-4\" /><span className=\"text-muted-foreground\">Tools</span><ChevronRight className=\"w-4 h-4\" /><span className=\"text-foreground font-medium\">PDF Tools</span>',
    },
    "wa-generator": {
        "path": "tools/wa-generator",
        "component_name": "WAGeneratorPage",
        "title": "💬 Tutorial: WhatsApp Message Generator",
        "description": "Generate pesan WhatsApp profesional untuk follow-up recruiter!",
        "breadcrumb": '<ChevronRight className=\"w-4 h-4\" /><span className=\"text-muted-foreground\">Tools</span><ChevronRight className=\"w-4 h-4\" /><span className=\"text-foreground font-medium\">WA Generator</span>',
    },
    "faq": {
        "path": "faq",
        "component_name": "FAQPage",
        "title": "❓ FAQ & Troubleshooting",
        "description": "Jawaban untuk pertanyaan yang sering ditanyakan",
        "breadcrumb": '<ChevronRight className=\"w-4 h-4\" /><span className=\"text-foreground font-medium\">FAQ</span>',
    },
}

print("=" * 60)
print("📚 GENERATING ALL TUTORIAL PAGES")
print("=" * 60)
print()
print("⚠️  NOTE: This script creates page structure.")
print("    You need to add detailed content manually from:")
print("    COMPLETE_TUTORIALS_ALL_TOOLS.md")
print()
print("=" * 60)
print()

for key, tutorial in tutorials.items():
    folder_path = os.path.join(DOCS_DIR, tutorial["path"])
    file_path = os.path.join(folder_path, "page.tsx")
    
    # Ensure folder exists
    ensure_dir(folder_path)
    
    # Simple content placeholder
    content = f'''<h1 className=\"text-4xl font-bold mb-4\">{tutorial["title"]}</h1>
          <p className=\"text-xl text-muted-foreground mb-8\">
            {tutorial["description"]}
          </p>

          <TipBox type=\"info\" title=\"📝 Content Placeholder\">
            <p>Silakan copy content dari file:</p>
            <p className=\"font-mono text-sm mt-2\">
              COMPLETE_TUTORIALS_ALL_TOOLS.md
            </p>
            <p className=\"mt-2\">Section: <strong>{tutorial["title"]}</strong></p>
          </TipBox>

          <div className=\"mt-8 p-6 bg-muted rounded-lg\">
            <h3 className=\"text-lg font-semibold mb-2\">🚧 Under Construction</h3>
            <p className=\"text-sm\">
              Tutorial content akan segera ditambahkan. Sementara waktu, 
              Anda bisa explore fitur langsung atau hubungi support untuk bantuan.
            </p>
          </div>'''
    
    page_content = TEMPLATE_START.format(
        component_name=tutorial["component_name"],
        breadcrumb=tutorial["breadcrumb"],
        content=content
    )
    
    # Write file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(page_content)
    
    print(f"✅ Created: /docs/{tutorial['path']}/page.tsx")

print()
print("=" * 60)
print("✅ ALL TUTORIAL PAGE STRUCTURES CREATED!")
print("=" * 60)
print()
print("📝 NEXT STEPS:")
print("1. Open COMPLETE_TUTORIALS_ALL_TOOLS.md")
print("2. Copy content untuk masing-masing section")
print("3. Paste ke page.tsx yang sesuai")
print("4. Replace placeholder dengan content actual")
print("5. Add screenshots")
print()
print("🔗 Files created:")
for key, tutorial in tutorials.items():
    print(f"   • app/(protected)/docs/{tutorial['path']}/page.tsx")
print()
