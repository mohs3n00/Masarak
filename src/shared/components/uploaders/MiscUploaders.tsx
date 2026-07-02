import React from 'react';
import { ImageUploader, ImageUploaderProps } from '../ui/ImageUploader';

export function TeacherUploader({ className, ...props }: Omit<ImageUploaderProps, 'folder'>) {
  return <ImageUploader folder="masarak/teachers" aspectRatio="square" className={`rounded-full overflow-hidden ${className || ''}`} {...props} />;
}

export function CommunityUploader({ className, ...props }: Omit<ImageUploaderProps, 'folder'>) {
  return <ImageUploader folder="masarak/community" aspectRatio="video" className={className} {...props} />;
}

export function LogoUploader({ className, ...props }: Omit<ImageUploaderProps, 'folder'>) {
  return <ImageUploader folder="masarak/logos" aspectRatio="square" className={className} {...props} />;
}

export function CertificateUploader({ className, ...props }: Omit<ImageUploaderProps, 'folder'>) {
  return <ImageUploader folder="masarak/certificates" aspectRatio="auto" className={className} {...props} />;
}

export function AttachmentUploader({ className, ...props }: Omit<ImageUploaderProps, 'folder'>) {
  // Attachments could be PDFs in the future, but for now this uses ImageUploader which is restricted to images
  // To fully support files, we'll need a FileUploader component, but this fits the current 'image' upload requirement
  return <ImageUploader folder="masarak/attachments" aspectRatio="auto" className={className} {...props} />;
}
