"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { SkillTagInput } from "@/components/ui/SkillTagInput";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile, checkUsername } from "@/actions/settings";
import { AvatarUploader } from "./AvatarUploader";
import { toast } from "sonner";
import { Save, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

const profileSchema = z.object({
  full_name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  username: z.string().min(3, "Username minimal 3 karakter").max(20).regex(/^[a-z0-9_]+$/, "Hanya huruf kecil, angka, dan underscore").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  whatsapp: z.string().optional().or(z.literal("")),
  website: z.string().refine((val) => !val || val === "" || z.string().url().safeParse(val).success, {
    message: "URL tidak valid"
  }).optional().or(z.literal("")),
  linkedin: z.string().refine((val) => !val || val === "" || z.string().url().safeParse(val).success, {
    message: "URL tidak valid"
  }).optional().or(z.literal("")),
  skills: z.array(z.string()).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileSection({ profile }: { profile: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<"checking" | "available" | "taken" | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      username: profile?.username || "",
      phone: profile?.phone || "",
      whatsapp: profile?.whatsapp || "",
      website: profile?.website || "",
      linkedin: profile?.linkedin || "",
      skills: profile?.skills || [],
    },
  });

  const username = form.watch("username");
  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (!debouncedUsername || debouncedUsername === profile?.username) {
        setUsernameStatus(null);
        return;
      }

      if (debouncedUsername.length < 3) {
        setUsernameStatus(null);
        return;
      }

      setUsernameStatus("checking");
      try {
        const result = await checkUsername(debouncedUsername);
        setUsernameStatus(result.available ? "available" : "taken");
      } catch (error) {
        console.error(error);
        setUsernameStatus(null);
      }
    };

    checkUsernameAvailability();
  }, [debouncedUsername, profile?.username]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      // Clean up empty strings
      const cleanData: any = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          cleanData[key] = value;
        }
      });

      await updateProfile(cleanData);
      toast.success("Profil berhasil diperbarui!");
      form.reset(data); // Reset form to mark as not dirty
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui profil");
      console.error("Update profile error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDirty = form.formState.isDirty;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Profil</CardTitle>
        <CardDescription>
          Perbarui informasi profil Anda yang akan ditampilkan di aplikasi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar */}
          <div className="flex justify-center py-4">
            <AvatarUploader
              currentUrl={avatarUrl}
              userName={profile?.full_name || "User"}
              onUploadSuccess={(url) => setAvatarUrl(url)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="full_name">
              Nama Lengkap <span className="text-red-500">*</span>
            </Label>
            <Input
              id="full_name"
              {...form.register("full_name")}
              placeholder="John Doe"
            />
            {form.formState.errors.full_name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.full_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username (opsional)</Label>
            <div className="relative">
              <Input
                id="username"
                {...form.register("username")}
                placeholder="johndoe"
                className="pr-10"
              />
              {usernameStatus === "checking" && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {usernameStatus === "available" && (
                <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-600" />
              )}
              {usernameStatus === "taken" && (
                <XCircle className="absolute right-3 top-3 h-4 w-4 text-red-600" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Huruf kecil, angka, dan underscore saja. Min 3 karakter.
              {usernameStatus === "available" && (
                <span className="text-green-600 ml-1">✓ Tersedia</span>
              )}
              {usernameStatus === "taken" && (
                <span className="text-red-600 ml-1">✗ Sudah dipakai</span>
              )}
            </p>
            {form.formState.errors.username && (
              <p className="text-sm text-red-500">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input
                id="phone"
                {...form.register("phone")}
                placeholder="+62 21 1234 5678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                {...form.register("whatsapp")}
                placeholder="+62 812 3456 7890"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                {...form.register("website")}
                placeholder="https://example.com"
                type="url"
              />
              {form.formState.errors.website && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.website.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input
                id="linkedin"
                {...form.register("linkedin")}
                placeholder="https://linkedin.com/in/username"
                type="url"
              />
              {form.formState.errors.linkedin && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.linkedin.message}
                </p>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-1">
              <Label>Keahlian & Skill <span className="text-purple-600 text-xs ml-2">(Penting untuk Match Score)</span></Label>
              <p className="text-sm text-gray-500">
                Masukkan skill teknis Anda (contoh: React, Excel, Supir, Marketing).
              </p>
            </div>

            <Controller
              control={form.control}
              name="skills"
              render={({ field }) => (
                <SkillTagInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Ketik skill lalu tekan Enter..."
                  maxTags={15}
                />
              )}
            />
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
