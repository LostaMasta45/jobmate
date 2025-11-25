import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Minimize2, FileImage, Sparkles, CheckCircle2, Shield, ArrowRight, Zap, Lock } from "lucide-react";
import Link from "next/link";
import { NavbarDynamic } from "@/components/landing-v2/NavbarDynamic";
import { SimpleFooter } from "@/components/landing-v2/SimpleFooter";

export const metadata: Metadata = {
  title: "PDF Tools — Merge, Compress, Convert | JobMate",
  description: "3 tools PDF essential: Merge (gabung CV+Portfolio), Compress (meet job portal limit), Convert (Word/Image to PDF). Auto-delete after 7 days.",
  keywords: ["pdf tools", "merge pdf", "compress pdf", "convert to pdf", "pdf job seeker", "gabung pdf online"],
};

export default function PDFToolsDetailPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-brand selection:text-white">
      <NavbarDynamic />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-slate-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 mb-4 px-4 py-1.5">
              <Zap className="h-3 w-3 mr-2" />
              3 Tools in 1
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              PDF Tools Suite
            </h1>
            
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              3 tools PDF essential untuk job seeker: Merge (gabung CV+Portfolio), 
              Compress (meet job portal limit), Convert (Word/Image to PDF). File aman, auto-delete 7 hari.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/tools/pdf-tools">
                <Button size="lg" className="bg-slate-600 hover:bg-slate-700 text-white rounded-full px-8 h-12 gap-2 shadow-[0_0_20px_rgba(71,85,105,0.3)]">
                  <FileText className="h-5 w-5" />
                  Gunakan PDF Tools
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full px-8 h-12 gap-2">
                  Lihat Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Main Tools */}
      <section className="py-20 bg-neutral-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">3 Tools Essential</h2>
            <p className="text-neutral-400 text-lg">
              Solve semua kebutuhan PDF untuk job application
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: FileText,
                title: "Merge PDF",
                desc: "Gabung multiple PDFs jadi 1 file profesional.",
                color: "text-blue-400",
                bg: "bg-blue-500/10",
                features: ["Gabung CV + Portfolio", "Unlimited files", "Drag & drop order"]
              },
              {
                icon: Minimize2,
                title: "Compress PDF",
                desc: "Kompres file untuk meet job portal limit.",
                color: "text-purple-400",
                bg: "bg-purple-500/10",
                features: ["Reduce size 50-80%", "Max quality", "Under 2MB limit"]
              },
              {
                icon: FileImage,
                title: "Convert to PDF",
                desc: "Convert Word/Image ke PDF format.",
                color: "text-amber-400",
                bg: "bg-amber-500/10",
                features: ["Word to PDF", "Image to PDF", "Best formatting"]
              }
            ].map((tool, i) => (
              <Card key={i} className="p-8 bg-neutral-900/50 border-white/5 hover:border-slate-500/30 transition-colors text-center">
                 <div className="flex justify-center mb-6">
                    <div className={`rounded-full p-4 ${tool.bg}`}>
                        <tool.icon className={`h-8 w-8 ${tool.color}`} />
                    </div>
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2">{tool.title}</h3>
                 <p className="text-sm text-neutral-400 mb-6">{tool.desc}</p>
                 <ul className="space-y-3 text-left">
                    {tool.features.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-neutral-300">
                            <CheckCircle2 className="h-4 w-4 text-slate-500" />
                            {f}
                        </li>
                    ))}
                 </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-black relative">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Real Scenarios</h2>
            <p className="text-neutral-400 text-lg">
              Solusi untuk masalah yang sering dihadapi job seeker
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { icon: "📁", title: "Scenario 1: Gabung Dokumen", problem: 'HRD minta: "Kirim 1 PDF isi CV, portfolio, sertifikat"', sol: "Use Merge PDF → Upload semua → Download 1 PDF complete!" },
              { icon: "⚡", title: "Scenario 2: File Terlalu Besar", problem: "Job portal limit 2MB, file Anda 5MB", sol: "Use Compress PDF → Kompres 70% → Jadi 1.5MB (aman)!" },
              { icon: "🔄", title: "Scenario 3: Format Salah", problem: "Portal hanya terima PDF, file Anda Word/JPG", sol: "Use Convert to PDF → Instant convert → Download PDF!" },
              { icon: "🎯", title: "Scenario 4: Paket Lengkap", problem: "Kirim CV (Word) + Project (JPG) + Sertifikat (PDF)", sol: "Convert all → Merge jadi 1 → Compress → Perfect!" }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/10 bg-neutral-900/30 backdrop-blur-sm hover:bg-neutral-900/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-neutral-400 mb-3 italic">"{item.problem}"</p>
                    <div className="text-xs bg-slate-500/20 text-slate-300 p-3 rounded-lg border border-slate-500/20">
                        <strong>Solution:</strong> {item.sol}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 bg-neutral-950">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-center">
             <div className="p-6">
                <Zap className="h-10 w-10 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Instant Processing</h3>
                <p className="text-sm text-neutral-400">Merge, compress, convert dalam detik.</p>
             </div>
             <div className="p-6">
                <Shield className="h-10 w-10 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Auto-Delete 7 Hari</h3>
                <p className="text-sm text-neutral-400">Privacy terjaga. File otomatis dihapus.</p>
             </div>
             <div className="p-6">
                <Lock className="h-10 w-10 text-amber-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Secure Encryption</h3>
                <p className="text-sm text-neutral-400">Transfer data aman dengan enkripsi.</p>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-600/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto p-8 md:p-12 text-center rounded-3xl bg-gradient-to-br from-neutral-900 to-black border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Siap Manage PDF Dokumen?
            </h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
              3 tools in 1: Merge, Compress, Convert. 
              Fast, secure, unlimited usage. Auto-delete 7 hari!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools/pdf-tools">
                <Button size="lg" className="bg-slate-600 hover:bg-slate-700 text-white rounded-full px-8 h-12 gap-2 shadow-lg shadow-slate-600/20">
                  <Sparkles className="h-5 w-5" />
                  Gunakan PDF Tools
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SimpleFooter />
    </main>
  );
}
