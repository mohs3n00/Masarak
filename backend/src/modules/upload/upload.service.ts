import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudinaryService } from '../../shared/cloudinary/cloudinary.service';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadImage(file: Express.Multer.File, folder: string) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedFolders = [
      'masarak/avatars',
      'masarak/courses',
      'masarak/teachers',
      'masarak/community',
      'masarak/banners',
      'masarak/logos',
      'masarak/attachments',
    ];

    if (!allowedFolders.includes(folder)) {
      // Clean up the temp file before throwing error
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new BadRequestException('Invalid folder name provided');
    }

    try {
      const result = await this.cloudinaryService.uploadFile(file.path, folder);
      
      // Delete temporary file after successful upload
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      };
    } catch (error) {
      // Delete temporary file if upload fails
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new BadRequestException('Failed to upload image to Cloudinary');
    }
  }
}
