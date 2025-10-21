"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, CreditCard, Loader2, ArrowLeft } from "lucide-react";

function PaymentFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') as 'basic' | 'premium';

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    email: "",
    fullName: "",
    whatsapp: "",
  });

  const planDetails = {
    basic: { name: 'VIP Basic', price: 10000, priceText: 'Rp 10.000', duration: '/bulan' },
    premium: { name: 'VIP Premium', price: 39000, priceText: 'Rp 39.000', duration: 'Lifetime' },
  };

  const currentPlan = plan && planDetails[plan] ? planDetails[plan] : planDetails.premium;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate WhatsApp number format
      const cleanWhatsapp = formData.whatsapp.replace(/\D/g, '');
      if (cleanWhatsapp.length < 10) {
        setError('Nomor WhatsApp tidak valid');
        setLoading(false);
        return;
      }

      // Create invoice via API
      const response = await fetch('/api/payment/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan || 'premium',
          email: formData.email,
          fullName: formData.fullName,
          whatsapp: cleanWhatsapp.startsWith('62') ? '+' + cleanWhatsapp : '+62' + cleanWhatsapp.replace(/^0/, ''),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Gagal membuat invoice');
      }

      // Redirect to Xendit payment page
      window.location.href = data.invoiceUrl;

    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="container max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/#pricing')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-2 pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl">
              Pembayaran {currentPlan.name}
            </CardTitle>
            <CardDescription className="text-lg">
              Lengkapi data di bawah untuk melanjutkan pembayaran
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Plan Summary */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-6 border-2 border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Paket yang dipilih</span>
                <span className="font-semibold">{currentPlan.name}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Durasi</span>
                <span className="font-semibold">{currentPlan.duration}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-amber-200 dark:border-amber-800">
                <span className="font-semibold">Total Pembayaran</span>
                <span className="text-2xl font-bold text-amber-600">
                  {currentPlan.priceText}
                </span>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nama lengkap sesuai KTP"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Invoice pembayaran akan dikirim ke email ini
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">Nomor WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="08123456789"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Untuk konfirmasi pembayaran dan akses grup VIP
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Lanjut ke Pembayaran
                  </>
                )}
              </Button>
            </form>

            {/* Payment Methods Info */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Metode pembayaran yang tersedia:
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="px-3 py-1 bg-muted rounded-full">QRIS</span>
                <span className="px-3 py-1 bg-muted rounded-full">Virtual Account</span>
                <span className="px-3 py-1 bg-muted rounded-full">E-Wallet</span>
                <span className="px-3 py-1 bg-muted rounded-full">Credit Card</span>
                <span className="px-3 py-1 bg-muted rounded-full">Retail</span>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
              <span className="text-lg">🔒</span>
              <span>Pembayaran aman melalui Xendit</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <PaymentFormContent />
    </Suspense>
  );
}
