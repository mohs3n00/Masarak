import React from 'react';
import { ImageUploader, ImageUploaderProps } from '../ui/ImageUploader';

interface CourseThumbnailUploaderProps extends Omit<ImageUploaderProps, 'folder' | 'aspectRatio'> {}

export function CourseThumbnailUploader({ className, ...props }: CourseThumbnailUploaderProps) {
  return (
    <ImageUploader
      folder="masarak/courses"
      aspectRatio="video"
      className={className}
      {...props}
    />
  );
}
