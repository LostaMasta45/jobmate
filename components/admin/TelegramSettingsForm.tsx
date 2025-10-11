"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveAdminSettings, testTelegramConnection } from "@/actions/admin";

type Settings = {
  telegram_bot_token: string;
  telegram_admin_chat_id: string;
} | null;

export function TelegramSettingsForm({ initialSettings }: { initialSettings: Settings }) {
  const [botToken, setBotToken] = React.useState(initialSettings?.telegram_bot_token || "");
  const [chatId, setChatId] = React.useState(initialSettings?.telegram_admin_chat_id || "");
  const [saving, setSaving] = React.useState(false);
  const [testing, setTesting] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await saveAdminSettings({
        telegram_bot_token: botToken,
        telegram_admin_chat_id: chatId,
      });
      alert("Pengaturan berhasil disimpan!");
    } catch (error) {
      alert("Gagal menyimpan: " + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);

    try {
      const result = await testTelegramConnection();
      if (result.success) {
        alert("✓ " + result.message);
      }
    } catch (error) {
      alert("✗ Gagal: " + (error as Error).message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Konfigurasi Telegram Bot</CardTitle>
        <CardDescription>
          Atur token bot dan chat ID untuk notifikasi admin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="botToken">Telegram Bot Token *</Label>
            <Input
              id="botToken"
              type="password"
              placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Dapatkan dari @BotFather di Telegram
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chatId">Telegram Admin Chat ID *</Label>
            <Input
              id="chatId"
              type="text"
              placeholder="123456789"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Chat ID admin yang akan menerima notifikasi. Gunakan @userinfobot untuk mendapatkan ID Anda
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="font-medium">Cara Setup:</p>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-muted-foreground">
              <li>Buat bot baru di @BotFather, salin token</li>
              <li>Dapatkan Chat ID Anda dari @userinfobot</li>
              <li>Masukkan kedua nilai di form ini</li>
              <li>Klik Simpan, lalu Tes Koneksi</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Pengaturan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleTest}
              disabled={testing || !botToken || !chatId}
            >
              {testing ? "Mengirim..." : "Tes Koneksi"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
