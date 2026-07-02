import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsEgyptianNationalId } from '../../../common/validators/egyptian-national-id.validator';
export class RegisterTeacherDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsPhoneNumber('EG')
  phone: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEgyptianNationalId({ message: 'الرقم القومي غير صالح' })
  nationalId: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subjects?: string[];

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(0)
  experience?: number;
}
