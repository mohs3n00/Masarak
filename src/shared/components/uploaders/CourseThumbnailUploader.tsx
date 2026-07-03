import React from 'react';
import { ImageUploader, ImageUploaderProps } from '../ui/ImageUploader';

type CourseThumbnailUploaderProps = Omit<ImageUploaderProps, 'folder' | 'aspectRatio'>;

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
