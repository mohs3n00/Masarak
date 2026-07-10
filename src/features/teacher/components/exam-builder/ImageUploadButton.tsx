'use client';

import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Loader2, X } from 'lucide-react';
import { apiClient } from '@/shared/api/api.client';

interface ImageUploadButtonProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  placeholder?: string;
}

export function ImageUploadButton({ value, onChange, className = '', placeholder = 'صورة' }: ImageUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('يجب اختيار ملف صورة');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'masarak/courses');

      const res = await apiClient.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onChange(res.data.url);
    } catch (err: any) {
      console.error('Upload failed', err);
      setError('فشل رفع الصورة');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        className="hidden"
      />
      
      {value ? (
        <div className="relative group">
          <img src={value} alt="Uploaded" className="h-10 w-auto rounded border border-border object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 bg-error text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-muted/50 hover:bg-muted text-text-muted hover:text-foreground transition-colors disabled:opacity-50"
          title={placeholder}
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
          <span>{uploading ? 'جاري الرفع...' : placeholder}</span>
        </button>
      )}
      
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}
