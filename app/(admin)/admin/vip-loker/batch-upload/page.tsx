import { Metadata } from 'next';
import { BatchPosterUpload } from '@/components/admin/vip/BatchPosterUpload';

export const metadata: Metadata = {
  title: 'Batch Upload Loker - Admin VIP Career',
  description: 'Upload multiple poster loker sekaligus dengan AI parsing',
};

export default function BatchUploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Batch Upload Loker</h1>
          <p className="text-gray-600 mt-2">
            Upload hingga 10 poster sekaligus. AI akan otomatis extract data dan detect multiple posisi per poster.
          </p>
        </div>

        <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900">💡 Fitur Batch Upload:</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-semibold">📸</span>
              <span><strong>Multiple Posters:</strong> Upload hingga 10 poster sekaligus</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">🤖</span>
              <span><strong>AI Parsing:</strong> Extract data otomatis dari setiap poster</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">🔢</span>
              <span><strong>Multiple Positions:</strong> Detect beberapa posisi dalam 1 poster</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">✏️</span>
              <span><strong>Review & Edit:</strong> Edit semua data sebelum publish</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">🚀</span>
              <span><strong>Bulk Publish:</strong> Publish semua lowongan sekaligus</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-semibold text-amber-900">⚠️ Contoh Kasus:</h3>
          <div className="space-y-3 text-sm text-amber-800">
            <div>
              <p className="font-semibold">Kasus 1: Poster dengan 1 Posisi</p>
              <p className="text-xs italic">
                "Dibutuhkan: Staff Admin - PT Maju Jaya"<br/>
                → AI detect: 1 posisi
              </p>
            </div>
            <div>
              <p className="font-semibold">Kasus 2: Poster dengan Multiple Posisi</p>
              <p className="text-xs italic">
                "Lowongan: 1. Staff Admin, 2. Sales Marketing, 3. Driver - PT Sukses"<br/>
                → AI detect: 3 posisi terpisah dari 1 poster
              </p>
            </div>
            <div>
              <p className="font-semibold">Kasus 3: Upload 5 Poster Sekaligus</p>
              <p className="text-xs italic">
                Poster A (2 posisi) + Poster B (1 posisi) + Poster C (3 posisi) + ...<br/>
                → Total bisa jadi 10+ posisi dari 5 poster
              </p>
            </div>
          </div>
        </div>

        <BatchPosterUpload />
      </div>
    </div>
  );
}
