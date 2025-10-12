"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProfile } from "@/actions/settings";
import { toast } from "sonner";
import { Save, Loader2, Globe, Clock, Bell } from "lucide-react";

const preferencesSchema = z.object({
  locale: z.string(),
  timezone: z.string(),
  notify_email: z.boolean(),
  notify_telegram: z.boolean(),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

export function PreferencesSection({ profile }: { profile: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(profile?.notify_email ?? true);
  const [notifyTelegram, setNotifyTelegram] = useState(profile?.notify_telegram ?? false);

  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      locale: profile?.locale || "id",
      timezone: profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      notify_email: profile?.notify_email ?? true,
      notify_telegram: profile?.notify_telegram ?? false,
    },
  });

  const onSubmit = async (data: PreferencesFormData) => {
    setIsSubmitting(true);
    try {
      await updateProfile({
        locale: data.locale,
        timezone: data.timezone,
        notify_email: notifyEmail,
        notify_telegram: notifyTelegram,
      });
      toast.success("Preferensi berhasil diperbarui!");
    } catch (error) {
      toast.error("Gagal memperbarui preferensi");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDirty = form.formState.isDirty || 
    notifyEmail !== (profile?.notify_email ?? true) ||
    notifyTelegram !== (profile?.notify_telegram ?? false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferensi</CardTitle>
        <CardDescription>
          Atur preferensi bahasa, zona waktu, dan notifikasi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Locale */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Label>Bahasa</Label>
            </div>
            <Select
              value={form.watch("locale")}
              onValueChange={(value) => form.setValue("locale", value, { shouldDirty: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih bahasa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Bahasa Indonesia</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timezone */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label>Zona Waktu</Label>
            </div>
            <Select
              value={form.watch("timezone")}
              onValueChange={(value) => form.setValue("timezone", value, { shouldDirty: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih zona waktu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Jakarta">WIB - Jakarta</SelectItem>
                <SelectItem value="Asia/Makassar">WITA - Makassar</SelectItem>
                <SelectItem value="Asia/Jayapura">WIT - Jayapura</SelectItem>
                <SelectItem value="America/New_York">EST - New York</SelectItem>
                <SelectItem value="Europe/London">GMT - London</SelectItem>
                <SelectItem value="Asia/Tokyo">JST - Tokyo</SelectItem>
                <SelectItem value="Asia/Singapore">SGT - Singapore</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Zona waktu saat ini: {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </p>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Label>Notifikasi</Label>
            </div>
            
            <div className="space-y-4">
              {/* Email Notification */}
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-xs text-muted-foreground">
                    Terima notifikasi melalui email
                  </div>
                </div>
                <Switch
                  checked={notifyEmail}
                  onCheckedChange={setNotifyEmail}
                />
              </div>

              {/* Telegram Notification */}
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Telegram</div>
                  <div className="text-xs text-muted-foreground">
                    {profile?.telegram_chat_id ? (
                      "Terhubung dengan bot Telegram"
                    ) : (
                      'Kirim "/start" ke @JobMateBot untuk menghubungkan'
                    )}
                  </div>
                </div>
                <Switch
                  checked={notifyTelegram}
                  onCheckedChange={setNotifyTelegram}
                  disabled={!profile?.telegram_chat_id}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" disabled={!isDirty || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
            {!isDirty && (
              <p className="text-sm text-muted-foreground">
                Tidak ada perubahan
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
