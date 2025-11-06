"use client";

import * as React from "react";
import { Upload, FileCheck, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadPreviewProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  description?: string;
  required?: boolean;
}

export function FileUploadPreview({
  file,
  onFileChange,
  accept = "image/*,.pdf",
  maxSize = 2,
  label = "Upload File",
  description = "JPG, PNG, atau PDF - max 2MB",
  required = false,
}: FileUploadPreviewProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError("");

    if (!selectedFile) {
      onFileChange(null);
      return;
    }

    // Validate file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File terlalu besar. Maksimal ${maxSize}MB`);
      onFileChange(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    onFileChange(selectedFile);
  };

  const handleRemove = () => {
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
    setError("");
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="h-20 w-20 overflow-hidden rounded-lg border">
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-lg border bg-muted">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        required={required}
      />

      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed p-6 transition-colors",
          file
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
            : error
            ? "border-destructive bg-destructive/5"
            : "border-muted-foreground/25 hover:border-brand hover:bg-accent cursor-pointer"
        )}
      >
        {!file ? (
          <label
            onClick={() => inputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center gap-2"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">{label}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </label>
        ) : (
          <div className="flex items-center gap-4">
            {getFilePreview(file)}

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-emerald-600" />
                <p className="font-medium text-sm">{file.name}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {file && !error && (
        <p className="text-xs text-emerald-600">
          ✓ File siap di-upload
        </p>
      )}
    </div>
  );
}
