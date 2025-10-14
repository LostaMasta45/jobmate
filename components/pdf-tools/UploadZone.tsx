"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, Check, GripVertical, MoveVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { uploadPDFFile } from "@/actions/pdf/upload";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface UploadedFile {
  fileId: string;
  filename: string;
  size: number;
  type: string;
  path: string;
}

interface UploadZoneProps {
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
  onFilesUploaded: (files: UploadedFile[]) => void;
  uploadedFiles: UploadedFile[];
}

// Sortable file item component
function SortableFileItem({
  file,
  onRemove,
  disabled,
  formatFileSize,
}: {
  file: UploadedFile;
  onRemove: () => void;
  disabled: boolean;
  formatFileSize: (bytes: number) => string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.fileId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-3 ${isDragging ? 'shadow-lg z-50' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
        </div>
        <div className="rounded-lg bg-primary/10 p-2">
          <File className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{file.filename}</p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function UploadZone({
  accept = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/msword': ['.doc'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
  },
  maxSize = 100 * 1024 * 1024, // 100MB
  maxFiles = 10,
  onFilesUploaded,
  uploadedFiles,
}: UploadZoneProps) {
  const [uploading, setUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = uploadedFiles.findIndex((f) => f.fileId === active.id);
      const newIndex = uploadedFiles.findIndex((f) => f.fileId === over.id);

      const reorderedFiles = arrayMove(uploadedFiles, oldIndex, newIndex);
      onFilesUploaded(reorderedFiles);
      toast.success('Urutan file berhasil diubah');
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return;
      }

      setUploading(true);
      const newFiles: UploadedFile[] = [];

      for (const file of acceptedFiles) {
        try {
          const formData = new FormData();
          formData.append('file', file);

          const result = await uploadPDFFile(formData);

          if (result.error) {
            toast.error(`Failed to upload ${file.name}: ${result.error}`);
          } else if (result.success) {
            newFiles.push({
              fileId: result.fileId!,
              filename: result.filename!,
              size: result.size!,
              type: result.type!,
              path: result.path!,
            });
            toast.success(`Uploaded: ${file.name}`);
          }
        } catch (error) {
          console.error('Upload error:', error);
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (newFiles.length > 0) {
        onFilesUploaded([...uploadedFiles, ...newFiles]);
      }

      setUploading(false);
    },
    [uploadedFiles, maxFiles, onFilesUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    disabled: uploading || uploadedFiles.length >= maxFiles,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const removeFile = (fileId: string) => {
    onFilesUploaded(uploadedFiles.filter((f) => f.fileId !== fileId));
    toast.success('File removed');
  };

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={`p-8 border-2 border-dashed cursor-pointer transition-all ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        } ${uploading || uploadedFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse your computer
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Accepted: PDF, Word (.docx), Images (JPG, PNG)</p>
            <p>Max size: {formatFileSize(maxSize)} • Max files: {maxFiles}</p>
          </div>
        </div>
      </Card>

      {/* Uploaded Files List with Drag & Drop Reorder */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">
              Uploaded Files ({uploadedFiles.length}/{maxFiles})
            </h3>
            {uploadedFiles.length > 1 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MoveVertical className="h-3.5 w-3.5" />
                <span>Drag untuk ubah urutan</span>
              </div>
            )}
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={uploadedFiles.map((f) => f.fileId)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={file.fileId} className="relative">
                    {index === 0 && uploadedFiles.length > 1 && (
                      <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs font-bold text-primary">
                        1
                      </div>
                    )}
                    {index > 0 && (
                      <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                        {index + 1}
                      </div>
                    )}
                    <SortableFileItem
                      file={file}
                      onRemove={() => removeFile(file.fileId)}
                      disabled={uploading}
                      formatFileSize={formatFileSize}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {uploading && (
        <div className="text-center text-sm text-muted-foreground">
          <div className="animate-pulse">Uploading files...</div>
        </div>
      )}
    </div>
  );
}
