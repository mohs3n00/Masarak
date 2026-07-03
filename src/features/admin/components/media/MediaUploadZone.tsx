'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileType, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface MediaUploadZoneProps {
  onUploadStart: (files: File[]) => void;
  onUploadSuccess: (urls: string[]) => void;
  onUploadError: (error: string) => void;
  accepts?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number; // in bytes
}

export function MediaUploadZone({
  onUploadStart,
  onUploadSuccess,
  onUploadError,
  accepts = {
    'video/mp4': ['.mp4'],
    'application/pdf': ['.pdf'],
    'application/zip': ['.zip', '.rar'],
    'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
  },
  maxFiles = 5,
  maxSize = 1024 * 1024 * 500, // Default 500MB
}: MediaUploadZoneProps) {
  const [uploadingFiles, setUploadingFiles] = useState<{name: string, progress: number, status: 'uploading' | 'success' | 'error'}[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      onUploadError(`تم رفض ${rejectedFiles.length} ملفات. تأكد من الصيغة والحجم (الحد الأقصى ${maxSize / (1024 * 1024)}MB).`);
    }

    if (acceptedFiles.length === 0) return;

    onUploadStart(acceptedFiles);

    // Mock Upload Process
    const newFiles = acceptedFiles.map(f => ({ name: f.name, progress: 0, status: 'uploading' as const }));
    setUploadingFiles(prev => [...prev, ...newFiles]);

    acceptedFiles.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20; // Random progress chunks
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadingFiles(prev => prev.map(f => f.name === file.name ? { ...f, progress: 100, status: 'success' } : f));
          onUploadSuccess([`https://mock-storage.masarak.com/${file.name}`]);
        } else {
          setUploadingFiles(prev => prev.map(f => f.name === file.name ? { ...f, progress } : f));
        }
      }, 500);
    });
  }, [maxSize, onUploadError, onUploadStart, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accepts,
    maxFiles,
    maxSize,
  });

  const removeFile = (name: string) => {
    setUploadingFiles(prev => prev.filter(f => f.name !== name));
  };

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          {isDragActive ? 'أفلت الملفات هنا...' : 'اسحب وأفلت الملفات هنا، أو اضغط للاختيار'}
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          يدعم الفيديوهات (MP4)، ملفات PDF، الصور، والملفات المضغوطة (ZIP). الحد الأقصى للملف هو {Math.round(maxSize / (1024 * 1024))}MB.
        </p>
      </div>

      {uploadingFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-semibold text-sm text-foreground">الملفات المرفوعة:</h4>
          {uploadingFiles.map((file, i) => (
            <div key={i} className="flex flex-col gap-2 p-3 bg-card border border-border rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileType className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground line-clamp-1">{file.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                  {file.status === 'success' && <CheckCircle className="w-4 h-4 text-success" />}
                  {file.status === 'error' && <AlertCircle className="w-4 h-4 text-error" />}
                  <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); removeFile(file.name); }}>
                    <X className="w-4 h-4 text-muted-foreground hover:text-error" />
                  </Button>
                </div>
              </div>
              <Progress value={file.progress} className={`h-1.5 ${file.status === 'error' ? 'bg-error/20 [&>div]:bg-error' : file.status === 'success' ? 'bg-success/20 [&>div]:bg-success' : ''}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
