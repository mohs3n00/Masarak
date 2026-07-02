import React from 'react';
import { ImageUploader, ImageUploaderProps } from '../ui/ImageUploader';

interface BannerUploaderProps extends Omit<ImageUploaderProps, 'folder' | 'aspectRatio'> {}

export function BannerUploader({ className, ...props }: BannerUploaderProps) {
  return (
    <ImageUploader
      folder="masarak/banners"
      aspectRatio="banner"
      className={className}
      {...props}
    />
  );
}
