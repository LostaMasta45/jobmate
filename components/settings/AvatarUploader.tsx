"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { uploadAvatar } from "@/actions/settings";
import { toast } from "sonner";
import { Camera, Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarUploaderProps {
  currentUrl?: string | null;
  userName: string;
  onUploadSuccess?: (url: string) => void;
  size?: "sm" | "md" | "lg";
}

export function AvatarUploader({ currentUrl, userName, onUploadSuccess, size = "md" }: AvatarUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32 sm:h-40 sm:w-40"
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadAvatar(formData);

      if (result.success) {
        toast.success("Avatar berhasil diperbarui!");
        setPreviewUrl(result.url);
        onUploadSuccess?.(result.url);
      }
    } catch (error: any) {
      console.error("Upload avatar error:", error);
      let errorMessage = "Gagal mengunggah avatar";

      if (error.message?.includes("bucket")) {
        errorMessage = "Storage bucket belum disetup. Hubungi admin.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setPreviewUrl(currentUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className={cn("relative group cursor-pointer", isDragging && "ring-2 ring-primary ring-offset-2 rounded-full")}>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="relative inline-block"
      >
        <Avatar className={cn(sizeClasses[size], "border-4 border-background shadow-sm transition-opacity group-hover:opacity-90")}>
          <AvatarImage src={previewUrl || undefined} alt={userName} className="object-cover" />
          <AvatarFallback className="text-2xl bg-muted text-muted-foreground">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>

        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : (
          <div className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full shadow-md hover:bg-primary/90 transition-colors">
            <Camera className="h-4 w-4" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
      />
    </div>
  );
}
