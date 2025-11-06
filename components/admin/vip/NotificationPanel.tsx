"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

interface NotificationPanelProps {
  draftCount: number;
}

export function NotificationPanel({ draftCount }: NotificationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          🔔 Notifikasi Cepat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        {draftCount > 0 ? (
          <div className="p-2 sm:p-3 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm sm:text-base text-yellow-900 dark:text-yellow-100">
                  {draftCount} Loker Draft
                </p>
                <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Ada loker yang belum dipublish
                </p>
              </div>
              <Link href="/admin/vip-loker">
                <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white">
                  Tinjau
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-2 sm:p-3 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20">
            <div className="flex items-start gap-2 sm:gap-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm sm:text-base text-green-900 dark:text-green-100">
                  Semua Lancar! ✨
                </p>
                <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 mt-1">
                  Tidak ada notifikasi yang perlu ditinjau
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-2 sm:p-3 rounded-lg border bg-blue-50 dark:bg-blue-950/20 border-blue-200">
          <p className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            💡 Tips: Gunakan AI Caption Generator
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
            Hemat waktu posting dengan caption otomatis untuk WA & Instagram
          </p>
          <Link href="/admin/tools-ai">
            <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white w-full">
              Coba Sekarang
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
