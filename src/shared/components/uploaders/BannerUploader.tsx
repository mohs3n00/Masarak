import React from 'react';
import { ImageUploader, ImageUploaderProps } from '../ui/ImageUploader';

type BannerUploaderProps = Omit<ImageUploaderProps, 'folder' | 'aspectRatio'>;

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
