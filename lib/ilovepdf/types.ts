export interface MergeOptions {
  addPageNumbers?: boolean;
  pageNumberPosition?: 'top' | 'bottom';
  pageNumberAlignment?: 'left' | 'center' | 'right';
  pageNumberFormat?: string;
  pageNumberStartFrom?: number;
  excludeFirstPage?: boolean;
}

export interface CompressOptions {
  compressionLevel: 'low' | 'recommended' | 'extreme';
}

export interface SplitOptions {
  mode: 'ranges' | 'fixed_range' | 'extract';
  ranges?: string; // e.g., "1,3-5,8"
  fixedRange?: number; // Split every N pages
}

export interface ProtectOptions {
  password: string;
  ownerPassword?: string;
  encryptionLevel?: '128' | '256';
  permissions?: {
    print?: boolean;
    modify?: boolean;
    copy?: boolean;
    forms?: boolean;
  };
}

export interface WatermarkOptions {
  mode: 'text' | 'image';
  text?: string;
  imageBuffer?: Buffer;
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  transparency?: number; // 0-100
  rotation?: number; // degrees
  layer?: 'above' | 'below';
  verticalPosition?: 'top' | 'center' | 'bottom';
  horizontalPosition?: 'left' | 'center' | 'right';
  pages?: string; // 'all' or '1,3-5,8'
  mosaic?: boolean;
}

export interface RotateOptions {
  pages?: {
    page: number;
    rotation: 90 | 180 | 270;
  }[];
}

export interface ImageToPDFOptions {
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'fit' | 'a4' | 'letter';
  margin?: number; // pixels
}

export interface PDFOperation {
  id: string;
  user_id: string;
  operation: string;
  input_files: string[];
  output_file: string | null;
  file_size: number | null;
  options: Record<string, any>;
  metadata: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface PDFOperationResult {
  success: boolean;
  operation_id?: string;
  filename?: string;
  size?: number;
  url?: string;
  metadata?: Record<string, any>;
  error?: string;
}
