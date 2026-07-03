import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class ForceChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @MinLength(12, { message: 'Password must be at least 12 characters' })
  // Should include uppercase, lowercase, number, special char. Regex:
  // (?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/, {
    message: 'Password must contain at least one uppercase, lowercase, number, and special character',
  })
  newPassword: string;
}
