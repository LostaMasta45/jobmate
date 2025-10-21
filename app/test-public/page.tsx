export default function TestPublicPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          ✅ SUCCESS!
        </h1>
        <p className="text-xl text-gray-700 mb-4">
          Anda bisa akses halaman ini TANPA LOGIN
        </p>
        <p className="text-sm text-gray-500">
          Kalau Anda lihat halaman ini = middleware bekerja dengan benar
        </p>
        <div className="mt-6 text-left bg-gray-100 p-4 rounded">
          <p className="font-mono text-sm">
            Route: /test-public<br/>
            Status: Public (no auth required)<br/>
            Middleware: PASS ✅
          </p>
        </div>
      </div>
    </div>
  );
}
