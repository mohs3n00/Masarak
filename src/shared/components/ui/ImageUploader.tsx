import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useCloudinaryUpload, UploadResponse } from '../../hooks/useCloudinaryUpload';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ImageUploaderProps {
  folder: string;
  defaultImage?: string;
  onUploadSuccess?: (data: UploadResponse) => void;
  onRemove?: () => void;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  disabled?: boolean;
}

export function ImageUploader({
  folder,
  defaultImage,
  onUploadSuccess,
  onRemove,
  className,
  aspectRatio = 'auto',
  disabled = false,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const { upload, uploading, progress, error, reset } = useCloudinaryUpload();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Show local preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      try {
        const result = await upload({ file, folder });
        if (onUploadSuccess) {
          onUploadSuccess(result);
        }
      } catch (err) {
        // Error is handled in the hook via toast
      }
    },
    [folder, upload, onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    disabled: uploading || disabled,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    reset();
    if (onRemove) onRemove();
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    reset();
    setPreview(null);
  };

  const aspectClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    banner: 'aspect-[21/9]',
    auto: 'aspect-auto min-h-[150px]',
  }[aspectRatio];

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex flex-col items-center justify-center w-full overflow-hidden transition-colors border-2 border-dashed rounded-lg cursor-pointer group',
        isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 bg-muted/50 hover:bg-muted',
        uploading || disabled ? 'cursor-not-allowed opacity-80' : '',
        aspectClass,
        className
      )}
    >
      <input {...getInputProps()} />

      {preview && !error ? (
        <>
          {/* Preview Image */}
          <img
            src={preview}
            alt="Upload preview"
            className="object-cover w-full h-full"
          />

          {/* Uploading Overlay */}
          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 mb-4 animate-spin text-primary" />
              <Progress value={progress} className="w-3/4 h-2 mb-2" />
              <span className="text-sm font-medium text-foreground">{progress}%</span>
            </div>
          )}

          {/* Remove Button (Hover) */}
          {!uploading && !disabled && (
            <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/40 group-hover:opacity-100">
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleRemove}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                إزالة الصورة
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          {error ? (
            <>
              <div className="p-3 mb-4 rounded-full bg-destructive/10 text-destructive">
                <X className="w-6 h-6" />
              </div>
              <p className="mb-2 text-sm font-medium text-destructive">فشل رفع الصورة</p>
              <Button type="button" variant="outline" size="sm" onClick={handleRetry}>
                إعادة المحاولة
              </Button>
            </>
          ) : (
            <>
              <div className="p-4 mb-4 transition-colors rounded-full bg-muted-foreground/5 group-hover:bg-primary/10">
                <UploadCloud className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
              </div>
              <p className="mb-1 text-sm font-medium">
                {isDragActive ? 'أفلت الصورة هنا' : 'انقر أو اسحب الصورة هنا للرفع'}
              </p>
              <p className="text-xs text-muted-foreground">
                يدعم PNG, JPG, WEBP (الحد الأقصى 10MB)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
