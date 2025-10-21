export default function SimpleToolsPage() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Tools JobMate</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Halaman sederhana tanpa component complex. Kalau ini work, berarti masalah di component.
        </p>
        
        <div className="grid gap-4">
          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-bold mb-2">CV ATS Generator</h2>
            <p className="text-muted-foreground mb-4">
              Buat CV profesional ATS-friendly dalam 5 menit
            </p>
            <a 
              href="/toolsjobmate/cv-ats"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Lihat Detail
            </a>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-bold mb-2">Email Generator</h2>
            <p className="text-muted-foreground mb-4">
              Generate email lamaran professional
            </p>
            <a 
              href="/toolsjobmate/email-generator"
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Lihat Detail
            </a>
          </div>

          <div className="bg-emerald-100 dark:bg-emerald-900/20 rounded-lg p-6 border border-emerald-200">
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              ✅ Anda bisa lihat halaman ini tanpa login!
            </p>
            <p className="text-xs text-emerald-600 mt-2">
              Kalau redirect ke /sign-in, berarti ada masalah di component page yang lain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
