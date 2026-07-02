import React from 'react';
import { ImageUploader, ImageUploaderProps } from '../ui/ImageUploader';

interface AvatarUploaderProps extends Omit<ImageUploaderProps, 'folder' | 'aspectRatio'> {}

export function AvatarUploader({ className, ...props }: AvatarUploaderProps) {
  return (
    <ImageUploader
      folder="masarak/avatars"
      aspectRatio="square"
      className={`rounded-full overflow-hidden ${className || ''}`}
      {...props}
    />
  );
}
