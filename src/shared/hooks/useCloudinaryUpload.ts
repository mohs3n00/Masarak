import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import imageCompression from 'browser-image-compression';
import { apiClient } from '@/shared/api/api.client';
import { toast } from 'sonner';

export interface UploadResponse {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

export interface UploadVariables {
  file: File;
  folder: string;
}

export function useCloudinaryUpload() {
  const [progress, setProgress] = useState(0);

  const uploadMutation = useMutation<UploadResponse, Error, UploadVariables>({
    mutationFn: async ({ file, folder }) => {
      setProgress(0);

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPG, PNG, and WEBP are allowed.');
      }

      // Validate size before compression (e.g. 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size exceeds 10MB limit.');
      }

      let fileToUpload = file;

      try {
        // Compress image
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedBlob = await imageCompression(file, options);
        // Create a new File from the blob to preserve name and type
        fileToUpload = new File([compressedBlob], file.name, {
          type: compressedBlob.type,
          lastModified: Date.now(),
        });
      } catch (err) {
        console.warn('Image compression failed, using original file', err);
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('folder', folder);

      // Upload with progress tracking
      const response = await apiClient.post<UploadResponse>('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for uploads
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        },
      });

      return response.data;
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to upload image. Please try again.');
      setProgress(0);
    },
  });

  return {
    upload: uploadMutation.mutateAsync,
    progress,
    uploading: uploadMutation.isPending,
    error: uploadMutation.error,
    uploadedFile: uploadMutation.data,
    reset: uploadMutation.reset,
  };
}
