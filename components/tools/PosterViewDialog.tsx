"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface PosterViewDialogProps {
  posterPath: string | null | undefined;
  company: string;
  position: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PosterViewDialog({
  posterPath,
  company,
  position,
  open,
  onOpenChange,
}: PosterViewDialogProps) {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && posterPath) {
      setLoading(true);
      const supabase = createClient();
      
      const { data } = supabase.storage
        .from("job-posters")
        .getPublicUrl(posterPath);

      setPosterUrl(data.publicUrl);
      setLoading(false);
    } else {
      setPosterUrl(null);
      setLoading(true);
    }
  }, [posterPath, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            Poster - {position} di {company}
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : posterUrl ? (
          <div className="relative w-full min-h-[400px] bg-muted rounded-lg overflow-hidden">
            <Image
              src={posterUrl}
              alt={`Poster ${position} di ${company}`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            Poster tidak tersedia
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
