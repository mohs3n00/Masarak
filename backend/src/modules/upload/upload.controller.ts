import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiTags, ApiConsumes, ApiOperation, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as os from 'os';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload an image to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        folder: {
          type: 'string',
          description: 'The target folder in Cloudinary (e.g. masarak/avatars)',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: os.tmpdir(),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname +
              '-' +
              uniqueSuffix +
              path.extname(file.originalname),
          );
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
  ) {
    if (!folder) {
      throw new BadRequestException('Folder name is required');
    }
    return this.uploadService.uploadImage(file, folder);
  }
}
