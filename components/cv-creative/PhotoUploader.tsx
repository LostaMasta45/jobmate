"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadCVPhoto } from "@/actions/cv-creative";
import { PhotoOptions } from "@/lib/schemas/cv-creative";

interface PhotoUploaderProps {
  value: string | null;
  options: PhotoOptions;
  onChange: (url: string | null, options: PhotoOptions) => void;
  onSkip: () => void;
}

export function PhotoUploader({ value, options, onChange, onSkip }: PhotoUploaderProps) {
  const [uploading, setUploading] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(value);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File terlalu besar! Maksimal 5MB");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      const { url } = await uploadCVPhoto(file);
      onChange(url, options);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Gagal upload foto");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null, options);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Upload Foto Profesional</h2>
        <p className="text-muted-foreground">Foto akan membuat CV Anda lebih personal</p>
      </div>

      <Card>
        <CardContent className="p-6">
          {!preview ? (
            <div
              className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:border-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="mb-2 text-sm font-medium">Click untuk upload foto</p>
              <p className="text-xs text-muted-foreground">Maksimal 5MB • JPG, PNG, WEBP</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div
                  className={`relative overflow-hidden ${
                    options.shape === "circle"
                      ? "rounded-full"
                      : options.shape === "rounded-square"
                      ? "rounded-lg"
                      : ""
                  }`}
                  style={{
                    width: options.size === "small" ? 80 : options.size === "large" ? 150 : 120,
                    height: options.size === "small" ? 80 : options.size === "large" ? 150 : 120,
                    border: options.border.style !== "none" 
                      ? `${options.border.width}px ${options.border.style} ${options.border.color}`
                      : "none",
                  }}
                >
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">Shape</label>
                  <div className="flex gap-2">
                    {(["circle", "square", "rounded-square"] as const).map((shape) => (
                      <Button
                        key={shape}
                        variant={options.shape === shape ? "default" : "outline"}
                        size="sm"
                        onClick={() => onChange(preview, { ...options, shape })}
                      >
                        {shape === "circle" ? "●" : shape === "square" ? "■" : "▢"}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Size</label>
                  <div className="flex gap-2">
                    {(["small", "medium", "large"] as const).map((size) => (
                      <Button
                        key={size}
                        variant={options.size === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => onChange(preview, { ...options, size })}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Ganti Foto
                  </Button>
                  <Button variant="destructive" onClick={handleRemove}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {uploading && (
            <div className="mt-4 text-center text-sm text-muted-foreground">Uploading...</div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onSkip}>
          Skip (Tanpa Foto)
        </Button>
      </div>
    </div>
  );
}
