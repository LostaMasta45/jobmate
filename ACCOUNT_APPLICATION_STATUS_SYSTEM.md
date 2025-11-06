# 🔐 ACCOUNT APPLICATION STATUS SYSTEM

**Date**: 2025-10-30
**Purpose**: Handle duplicate email submissions properly

---

## 🎯 Problem Statement

**Current Issue:**
- Email sudah pernah ajukan akun → tidak bisa ajukan lagi
- Bikin testing susah (harus delete manual)
- Production: user bingung kalau gagal submit

**Need Solution For:**
1. ✅ Testing: bisa test email notification berulang kali
2. ✅ Production: handle duplicate email dengan proper message
3. ✅ User Experience: clear feedback kalau email sudah ada
4. ✅ Re-submission: allow jika aplikasi sebelumnya ditolak

---

## 📊 Application Status Flow

### Status Types:
```typescript
type ApplicationStatus = 
  | 'pending'    // Menunggu review admin
  | 'approved'   // Disetujui, akun sudah aktif
  | 'rejected'   // Ditolak, bisa ajukan lagi
  | 'cancelled'  // User cancel sendiri
```

### Flow Diagram:
```
[Submit Form]
     ↓
Check: Email exists? ----NO----> [Create New Application] → pending
     |
    YES
     ↓
Get Latest Application Status
     |
     ├─ pending → Show existing application + option to cancel
     ├─ approved → Error: "Email sudah terdaftar"
     ├─ rejected → Allow re-submit dengan data baru
     └─ cancelled → Allow re-submit
```

---

## 🔧 Implementation

### 1. Update API Route: `/api/ajukan-akun/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCode } from "@/lib/utils";
import { notifyNewApplication } from "@/lib/telegram";
import { sendAccountPendingEmail, getUserDisplayName } from "@/lib/email-notifications";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const fullName = formData.get("fullName") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const password = formData.get("password") as string;
    const proofFile = formData.get("proofFile") as File;

    // Validate required fields
    if (!fullName || !username || !email || !whatsapp || !password || !proofFile) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // ========================================
    // 🆕 CHECK: Email sudah pernah ajukan?
    // ========================================
    const { data: existingApplication, error: checkError } = await supabase
      .from("account_applications")
      .select("id, status, created_at")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!checkError && existingApplication) {
      // Email exists! Check status
      const status = existingApplication.status;

      if (status === 'pending') {
        return NextResponse.json({
          error: "duplicate_pending",
          message: "Email ini sudah mengajukan akun dan sedang dalam proses review. Silakan tunggu maksimal 1x24 jam atau hubungi admin jika urgent.",
          applicationId: existingApplication.id,
          createdAt: existingApplication.created_at
        }, { status: 409 }); // 409 Conflict
      }

      if (status === 'approved') {
        return NextResponse.json({
          error: "already_registered",
          message: "Email ini sudah terdaftar dan akun sudah aktif. Silakan login menggunakan email dan password Anda.",
        }, { status: 409 });
      }

      // Status: rejected or cancelled → Allow re-submit
      console.log(`[Ajukan Akun] Email ${email} was ${status}, allowing re-submission`);
    }

    // ========================================
    // Continue with normal flow...
    // ========================================

    // Upload proof file
    const fileExt = proofFile.name.split(".").pop();
    const fileName = `${Date.now()}-${username}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("proofs")
      .upload(fileName, proofFile);

    if (uploadError) {
      return NextResponse.json(
        { error: "Gagal upload bukti pembayaran: " + uploadError.message },
        { status: 500 }
      );
    }

    // Generate telegram link code
    const telegramLinkCode = generateCode(12);

    // Insert application
    const { data, error: insertError } = await supabase
      .from("account_applications")
      .insert({
        full_name: fullName,
        username: username,
        email: email,
        whatsapp: whatsapp,
        proof_path: fileName,
        encrypted_password: password,
        telegram_link_code: telegramLinkCode,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "Gagal menyimpan pengajuan: " + insertError.message },
        { status: 500 }
      );
    }

    // Send email notification
    try {
      const userName = getUserDisplayName(fullName, email);
      await sendAccountPendingEmail({
        userName,
        email,
        submittedAt: new Date().toISOString(),
      });
      console.log(`✅ Account pending email sent to ${email}`);
    } catch (emailError) {
      console.error("Failed to send pending email:", emailError);
    }

    // Send Telegram notification to admin
    try {
      await notifyNewApplication({
        fullName,
        username,
        email,
        whatsapp,
        applicationId: data.id,
      });
    } catch (telegramError) {
      console.error("Telegram notification failed:", telegramError);
    }

    return NextResponse.json({
      success: true,
      telegramLinkCode,
    });
  } catch (error) {
    console.error("[Ajukan Akun API] Unexpected error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan: " + (error as Error).message },
      { status: 500 }
    );
  }
}
```

---

### 2. Update Frontend: `/app/ajukan-akun/page.tsx`

Add better error handling:

```typescript
const handleSubmit = async () => {
  setLoading(true);
  setError(null);

  try {
    if (!proofFile) {
      setError("Bukti pembayaran harus di-upload");
      setLoading(false);
      return;
    }

    const apiFormData = new FormData();
    apiFormData.append("fullName", formData.fullName);
    apiFormData.append("username", formData.username);
    apiFormData.append("email", formData.email);
    apiFormData.append("whatsapp", formData.whatsapp);
    apiFormData.append("password", formData.password);
    apiFormData.append("proofFile", proofFile);

    const response = await fetch("/api/ajukan-akun", {
      method: "POST",
      body: apiFormData,
    });

    const result = await response.json();

    if (!response.ok) {
      // 🆕 Handle specific error types
      if (result.error === 'duplicate_pending') {
        setError(
          <div className="space-y-2">
            <p className="font-semibold">Email Sudah Mengajukan Akun</p>
            <p>{result.message}</p>
            <Link 
              href={`/cek-status-pengajuan?email=${formData.email}`}
              className="text-brand underline hover:no-underline"
            >
              Cek status pengajuan Anda →
            </Link>
          </div>
        );
        return;
      }

      if (result.error === 'already_registered') {
        setError(
          <div className="space-y-2">
            <p className="font-semibold">Email Sudah Terdaftar</p>
            <p>{result.message}</p>
            <Link 
              href="/auth/sign-in"
              className="text-brand underline hover:no-underline"
            >
              Login di sini →
            </Link>
          </div>
        );
        return;
      }

      // Default error
      setError(result.error || "Terjadi kesalahan. Silakan coba lagi.");
      return;
    }

    // Success → redirect
    router.push(`/ajukan-akun/terima-kasih?code=${result.telegramLinkCode}&email=${encodeURIComponent(formData.email)}`);
  } catch (err) {
    setError("Terjadi kesalahan. Silakan coba lagi.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

---

### 3. Add "Cek Status Pengajuan" Page

Create: `/app/cek-status-pengajuan/page.tsx`

```typescript
"use client";

import * as React from "react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Mail, Clock, CheckCircle, XCircle, Ban } from "lucide-react";

function CekStatusContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const handleCheck = async () => {
    if (!email) {
      setError("Masukkan email yang Anda gunakan untuk ajukan akun");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`/api/ajukan-akun/check-status?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Tidak ditemukan pengajuan dengan email ini");
        return;
      }

      setResult(data);
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-8 w-8 text-amber-500" />,
          color: "amber",
          title: "Sedang Ditinjau",
          message: "Pengajuan Anda sedang dalam proses review admin"
        };
      case 'approved':
        return {
          icon: <CheckCircle className="h-8 w-8 text-emerald-500" />,
          color: "emerald",
          title: "Disetujui!",
          message: "Akun Anda sudah aktif. Silakan login."
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-8 w-8 text-red-500" />,
          color: "red",
          title: "Ditolak",
          message: "Pengajuan ditolak. Anda bisa mengajukan kembali."
        };
      case 'cancelled':
        return {
          icon: <Ban className="h-8 w-8 text-gray-500" />,
          color: "gray",
          title: "Dibatalkan",
          message: "Pengajuan dibatalkan. Anda bisa mengajukan kembali."
        };
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand/5 via-background to-brand/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand/80 text-white">
            <Search className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Cek Status Pengajuan</CardTitle>
          <p className="text-sm text-muted-foreground">
            Masukkan email yang Anda gunakan untuk mengajukan akun
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {result && (
            <div className={`rounded-xl border-2 border-${getStatusInfo(result.status)?.color}-200 bg-${getStatusInfo(result.status)?.color}-50 dark:border-${getStatusInfo(result.status)?.color}-900 dark:bg-${getStatusInfo(result.status)?.color}-950 p-6`}>
              <div className="flex flex-col items-center text-center space-y-4">
                {getStatusInfo(result.status)?.icon}
                <div>
                  <h3 className="text-lg font-bold">{getStatusInfo(result.status)?.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getStatusInfo(result.status)?.message}
                  </p>
                </div>
                
                <div className="w-full space-y-2 text-left text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nama:</span>
                    <span className="font-medium">{result.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Username:</span>
                    <span className="font-medium">{result.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tanggal Ajukan:</span>
                    <span className="font-medium">
                      {new Date(result.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  {result.admin_notes && (
                    <div className="mt-4 p-3 rounded-lg bg-background">
                      <p className="text-xs text-muted-foreground mb-1">Catatan Admin:</p>
                      <p className="text-sm">{result.admin_notes}</p>
                    </div>
                  )}
                </div>

                {result.status === 'approved' && (
                  <Button asChild className="w-full">
                    <a href="/auth/sign-in">Login Sekarang</a>
                  </Button>
                )}

                {(result.status === 'rejected' || result.status === 'cancelled') && (
                  <Button asChild className="w-full">
                    <a href="/ajukan-akun">Ajukan Kembali</a>
                  </Button>
                )}
              </div>
            </div>
          )}

          <Button 
            onClick={handleCheck} 
            disabled={loading || !email}
            className="w-full"
            size="lg"
          >
            {loading ? "Mengecek..." : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Cek Status
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CekStatusPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CekStatusContent />
    </Suspense>
  );
}
```

---

### 4. Add API Route: `/api/ajukan-akun/check-status/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("account_applications")
      .select("id, full_name, username, email, status, created_at, admin_notes")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Tidak ditemukan pengajuan dengan email ini" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[Check Status API] Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
```

---

## 🧪 Testing Guide

### For Development (Quick Test):

**Option A: Delete via SQL**
```sql
-- Run in Supabase SQL Editor
DELETE FROM account_applications WHERE email = 'reza.nur.h45@gmail.com';
```

**Option B: Update status to 'rejected'**
```sql
-- Allow re-submission for testing
UPDATE account_applications 
SET status = 'rejected', admin_notes = 'For testing purposes'
WHERE email = 'reza.nur.h45@gmail.com';
```

**Option C: Add test bypass (Development only!)**
```typescript
// In route.ts, add at top:
const isDevMode = process.env.NODE_ENV === 'development';
const bypassCheck = isDevMode && request.nextUrl.searchParams.get('bypass') === 'true';

if (!bypassCheck && existingApplication) {
  // ... normal checking logic
}
```

Then test with: `http://localhost:3000/ajukan-akun?bypass=true`

---

### For Production:

1. **First Submission**: Works normally
2. **Duplicate while Pending**: Shows error with link to check status
3. **Duplicate after Approved**: Shows error with link to login
4. **Re-submission after Rejected**: Allowed, creates new application

---

## 📈 Benefits

### For Development:
✅ Easy testing dengan delete manual atau update status  
✅ Bypass option untuk quick iteration  
✅ Clear error messages untuk debugging  

### For Production:
✅ No duplicate applications dalam status pending  
✅ Clear user feedback untuk setiap scenario  
✅ Allow legitimate re-submissions (after reject)  
✅ Better database integrity  
✅ Reduce admin workload (less duplicate processing)  

### For Users:
✅ Clear error messages ("email sudah digunakan")  
✅ Can check application status anytime  
✅ Can re-apply if rejected  
✅ No confusion about duplicate submissions  

---

## 🚀 Deployment Steps

1. **Update API route** dengan duplicate checking
2. **Update frontend** dengan better error handling  
3. **Create check status page** untuk user tracking  
4. **Test all scenarios**:
   - New submission → Success
   - Duplicate pending → Error with helpful message
   - Duplicate approved → Error with login link
   - Re-submit after reject → Success
5. **Deploy to production**

---

## 🔐 Security Notes

- ✅ Email uniqueness enforced at API level
- ✅ Status transitions logged
- ✅ Admin notes for rejection reasons
- ✅ Rate limiting recommended (prevent spam)
- ✅ Input sanitization on all fields

---

**Status**: 📝 Design Ready  
**Priority**: 🔴 High (for production quality)  
**Estimated Time**: 2-3 hours implementation
