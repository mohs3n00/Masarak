import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  Delete,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './services/auth.service';
import { RegisterStudentDto } from './dto/register-student.dto';
import { RegisterTeacherDto } from './dto/register-teacher.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto, SendOtpDto } from './dto/otp.dto';
import {
  ResetPasswordDto,
  ChangePasswordDto,
  ForceChangePasswordDto,
} from './dto/password.dto';
import { RefreshTokenDto } from './dto/refresh.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../../shared/storage/storage.service';
import { PrismaService } from '../../database/prisma/prisma.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Post('register/student')
  @ApiOperation({ summary: 'Register a new student account' })
  async registerStudent(@Body() dto: RegisterStudentDto, @Req() req: Request) {
    return this.authService.registerStudent(
      dto,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Public()
  @Post('register/teacher')
  @ApiOperation({ summary: 'Register a new teacher account' })
  async registerTeacher(@Body() dto: RegisterTeacherDto, @Req() req: Request) {
    return this.authService.registerTeacher(
      dto,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and receive access and refresh tokens' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(
      dto,
      req.ip,
      req.headers['user-agent'],
    );

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { message: 'Logged in successfully' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and revoke the current session' })
  async logout(
    @CurrentUser() user: any,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(
      user.sessionId,
      user.id,
      req.ip,
      req.headers['user-agent'],
    );

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rotate the refresh token and receive a new access token',
  })
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshToken(dto.refreshToken);

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Tokens refreshed successfully' };
  }

  @Public()
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send an OTP for verification' })
  async sendOtp(@Body() dto: SendOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (user) {
      // In a real app we'd target email or phone based on the enum
      await this.authService['otpService'].generateAndSendOtp(
        user.id,
        user.phone,
        dto.type,
      );
    }
    return { message: 'OTP sent if user exists' };
  }

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify an OTP' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    await this.authService.verifyOtp(dto.userId, dto.code, dto.type);
    return { message: 'Verified successfully' };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  async forgotPassword(@Body('phone') phone: string) {
    await this.authService.forgotPassword(phone);
    return { message: 'If user exists, a reset code was sent' };
  }

  @Public()
  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset the password using OTP' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);
    return { message: 'Password reset successfully' };
  }

  @Post('password/change')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change the password (requires current password)' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(userId, dto);
    return { message: 'Password changed successfully' };
  }

  @Public()
  @Post('force-change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Force password change for accounts requiring it (like first-login Super Admin)' })
  async forceChangePassword(@Body() dto: ForceChangePasswordDto) {
    await this.authService.forceChangePassword(dto);
    return { message: 'Password updated successfully. You can now login with your new password.' };
  }

  @Patch('avatar')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a new avatar' })
  async uploadAvatar(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.storageService.uploadFile(file, {
      folder: 'avatars',
      publicId: userId,
    });
    await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: result.url },
    });
    return { message: 'Avatar updated', url: result.url };
  }

  @Delete('avatar')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove the avatar' })
  async deleteAvatar(@CurrentUser('id') userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.avatar) {
      await this.storageService.deleteFile(user.avatar);
      await this.prisma.user.update({
        where: { id: userId },
        data: { avatar: null },
      });
    }
    return { message: 'Avatar deleted' };
  }
}
