"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  CheckCircle2, 
  Settings, 
  Zap,
  AlertTriangle,
  Copy
} from "lucide-react";

export default function TestPaymentAdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    orderId: '',
    amount: '',
  });

  const handleSimulatePayment = async () => {
    if (!formData.orderId || !formData.amount) {
      setError('Order ID dan Amount wajib diisi');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-payment/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: formData.orderId,
          amount: parseInt(formData.amount),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Gagal simulate payment');
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyFromPage = () => {
    // Get order ID from current open payment page (if any)
    const lastPayment = sessionStorage.getItem('last-payment-order-id');
    if (lastPayment) {
      setFormData({ ...formData, orderId: lastPayment });
    } else {
      alert('Tidak ada order ID yang tersimpan. Buat payment dulu di /test-payment');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4">
      {/* TEST ADMIN Banner */}
      <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 font-bold z-50">
        🔧 TEST PAYMENT ADMIN - SIMULATION PANEL
      </div>

      <div className="container max-w-3xl mx-auto mt-12">
        <Card className="shadow-2xl border-2 border-red-200/50 dark:border-red-900/50">
          <CardHeader className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Payment Simulation</CardTitle>
                <CardDescription>Simulate payment success untuk testing (Sandbox Mode)</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {/* Warning Alert */}
            <Alert className="bg-amber-50 border-amber-300 dark:bg-amber-950/30">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-400">
                <strong>SANDBOX MODE ONLY!</strong> Fitur ini hanya untuk simulate payment di test mode. Jangan gunakan di production.
              </AlertDescription>
            </Alert>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                Cara Menggunakan:
              </h3>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Buat payment di <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">/test-payment</code></li>
                <li>Copy Order ID dari halaman payment</li>
                <li>Paste Order ID dan Amount di form ini</li>
                <li>Klik "Simulate Payment"</li>
                <li>Status akan berubah ke "completed" dan auto-redirect ke success page</li>
              </ol>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID *</Label>
                <div className="flex gap-2">
                  <Input
                    id="orderId"
                    placeholder="jobmate-test-premium-1762601027812"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyFromPage}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Order ID dari payment page yang sedang dibuka
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (tanpa fee) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="39000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Amount asli sebelum ditambah biaya admin (misal: 10000 atau 39000)
                </p>
              </div>
            </div>

            {/* Quick Fill Buttons */}
            <div className="flex gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-emerald-50" onClick={() => setFormData({ ...formData, amount: '10000' })}>
                Basic: Rp 10.000
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-purple-50" onClick={() => setFormData({ ...formData, amount: '39000' })}>
                Premium: Rp 39.000
              </Badge>
            </div>

            {/* Error */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Result */}
            {result && (
              <Alert className="bg-emerald-50 border-emerald-300 dark:bg-emerald-950/30">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-800 dark:text-emerald-400">
                  <strong>Payment Simulation Berhasil!</strong>
                  <pre className="mt-2 text-xs bg-white dark:bg-slate-900 p-2 rounded overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSimulatePayment}
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Simulate Payment Success
                </>
              )}
            </Button>

            {/* Links */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open('/test-payment?plan=premium', '_blank')}
              >
                Buat Payment Baru
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open('https://app.pakasir.com', '_blank')}
              >
                Dashboard Pakasir
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-bold mb-3">📚 Dokumentasi</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Payment Simulation API</strong> adalah fitur dari Pakasir.com untuk testing payment di sandbox mode.
              </p>
              <p>
                Endpoint: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">POST https://app.pakasir.com/api/paymentsimulation</code>
              </p>
              <p>
                Docs: <a href="https://pakasir.com/p/docs" target="_blank" className="text-blue-600 hover:underline">https://pakasir.com/p/docs</a> (Section C.4)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
