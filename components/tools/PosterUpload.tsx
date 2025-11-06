"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageIcon, X, Upload } from "lucide-react";
import Image from "next/image";

interface PosterUploadProps {
  value?: string;
  onChange: (path: string | undefined) => void;
  userId: string;
}

export function PosterUpload({ value, onChange, userId }: PosterUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar yang diperbolehkan");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    try {
      setUploading(true);
      const supabase = createClient();

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("job-posters")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("job-posters")
        .getPublicUrl(filePath);

      setPreview(urlData.publicUrl);
      onChange(filePath);
    } catch (error) {
      console.error("Error uploading poster:", error);
      alert("Gagal upload poster. Silakan coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      const supabase = createClient();
      
      // Delete from storage
      const { error } = await supabase.storage
        .from("job-posters")
        .remove([value]);

      if (error) {
        console.error("Error deleting poster:", error);
      }

      setPreview(undefined);
      onChange(undefined);
    } catch (error) {
      console.error("Error removing poster:", error);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="poster">Poster Loker (Optional)</Label>
      
      {preview ? (
        <div className="relative rounded-lg border bg-muted p-2">
          <div className="relative h-48 w-full overflow-hidden rounded-md">
            <Image
              src={preview}
              alt="Poster preview"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-3 right-3"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById("poster-upload")?.click()}
            className="flex items-center gap-2"
          >
            {uploading ? (
              <>
                <Upload className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <ImageIcon className="h-4 w-4" />
                Upload Poster
              </>
            )}
          </Button>
          <input
            id="poster-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <span className="text-xs text-muted-foreground">
            Max 5MB (JPG, PNG, WebP)
          </span>
        </div>
      )}
    </div>
  );
}
