import { IsString, IsOptional, IsNumber, IsEnum, IsUrl, MinLength } from 'class-validator';
import { CourseAccessType, CourseType, Difficulty } from '@prisma/client';

export class CreateCourseDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  originalPrice?: number;

  @IsOptional()
  @IsEnum(CourseAccessType)
  accessType?: CourseAccessType;

  @IsOptional()
  @IsEnum(CourseType)
  type?: CourseType;

  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;
}

export class AddLessonDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  sectionName?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  fileType?: string;

  @IsOptional()
  @IsNumber()
  sizeBytes?: number;
}

export class AddAttachmentDto {
  @IsString()
  fileName: string;

  @IsString()
  @IsUrl()
  fileUrl: string;

  @IsString()
  fileType: string;

  @IsNumber()
  sizeBytes: number;
}

export class NotificationDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(5)
  message: string;
}
