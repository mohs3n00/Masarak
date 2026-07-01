import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { TokenService } from './token.service';
import { SessionService } from './session.service';
import { OtpService } from './otp.service';
import { AuditService } from './audit.service';
import * as bcrypt from 'bcrypt';
import { Role, OtpType, AuditAction } from '@prisma/client';
import { RegisterStudentDto } from '../dto/register-student.dto';
import { RegisterTeacherDto } from '../dto/register-teacher.dto';
import { LoginDto } from '../dto/login.dto';
import { ResetPasswordDto, ChangePasswordDto } from '../dto/password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
    private readonly otpService: OtpService,
    private readonly auditService: AuditService,
  ) {}

  async registerStudent(
    dto: RegisterStudentDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          ...(dto.phone ? [{ phone: dto.phone }] : []),
        ],
      },
    });
    if (existing)
      throw new ConflictException(
        'User with this email or phone already exists',
      );

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        name: dto.name,
        role: Role.STUDENT,
      },
    });

    await this.auditService.logAction(
      user.id,
      AuditAction.REGISTER,
      ipAddress,
      userAgent,
    );
    await this.otpService.generateAndSendOtp(
      user.id,
      user.email,
      OtpType.EMAIL_VERIFICATION,
    );

    return {
      message: 'Registration successful. Please verify your email.',
      userId: user.id,
    };
  }

  async registerTeacher(
    dto: RegisterTeacherDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          ...(dto.phone ? [{ phone: dto.phone }] : []),
        ],
      },
    });
    if (existing)
      throw new ConflictException(
        'User with this email or phone already exists',
      );

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        name: dto.name,
        role: Role.TEACHER,
        teacherProfile: {
          create: {
            title: dto.title,
            qualifications: dto.qualifications,
          },
        },
      },
    });

    await this.auditService.logAction(
      user.id,
      AuditAction.REGISTER,
      ipAddress,
      userAgent,
    );
    await this.otpService.generateAndSendOtp(
      user.id,
      user.email,
      OtpType.EMAIL_VERIFICATION,
    );

    return {
      message: 'Registration successful. Please verify your email.',
      userId: user.id,
    };
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !user.isActive)
      throw new UnauthorizedException('Invalid credentials or account banned');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // Create session (placeholder for refresh token)
    const tempRefreshToken = `temp_${Date.now()}`;
    const session = await this.sessionService.createSession(
      user.id,
      tempRefreshToken,
      ipAddress,
      userAgent,
      dto.fcmToken,
    );

    // Generate real tokens using the session ID
    const tokens = await this.tokenService.generateTokens(user, session.id);

    // Update session with the real hashed refresh token
    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);
    await this.prisma.session.update({
      where: { id: session.id },
      data: { hashedRefreshToken: hashedRefresh },
    });

    await this.auditService.logAction(
      user.id,
      AuditAction.LOGIN,
      ipAddress,
      userAgent,
    );

    return tokens;
  }

  async logout(
    sessionId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    await this.sessionService.revokeSession(sessionId);
    await this.auditService.logAction(
      userId,
      AuditAction.LOGOUT,
      ipAddress,
      userAgent,
    );
  }

  async refreshToken(oldRefreshToken: string) {
    const decoded = await this.tokenService.verifyRefreshToken(oldRefreshToken);
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.sub },
    });
    if (!user || !user.isActive)
      throw new UnauthorizedException('User not found or banned');

    const tokens = await this.tokenService.generateTokens(
      user,
      decoded.sessionId,
    );
    await this.sessionService.validateAndRotateSession(
      decoded.sessionId,
      oldRefreshToken,
      tokens.refreshToken,
    );
    return tokens;
  }

  async verifyOtp(userId: string, code: string, type: OtpType) {
    await this.otpService.verifyOtp(userId, code, type);

    if (type === OtpType.EMAIL_VERIFICATION) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true },
      });
    } else if (type === OtpType.PHONE_VERIFICATION) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { phoneVerified: true },
      });
    }
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return; // Silent fail for security
    await this.otpService.generateAndSendOtp(
      user.id,
      user.email,
      OtpType.PASSWORD_RESET,
    );
  }

  async resetPassword(dto: ResetPasswordDto) {
    await this.otpService.verifyOtp(
      dto.userId,
      dto.code,
      OtpType.PASSWORD_RESET,
    );
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: dto.userId },
      data: { password: hashedPassword },
    });

    await this.sessionService.revokeAllUserSessions(dto.userId);
    await this.auditService.logAction(dto.userId, AuditAction.PASSWORD_CHANGE);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException();

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) throw new BadRequestException('Incorrect old password');

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await this.auditService.logAction(userId, AuditAction.PASSWORD_CHANGE);
  }
}
