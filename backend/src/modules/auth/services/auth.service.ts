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
import * as argon2 from 'argon2';
import { Role, AuditAction, OtpType } from '@prisma/client';
import { extractNationalIdInfo } from '../../../common/validators/egyptian-national-id.validator';
import { RegisterStudentDto } from '../dto/register-student.dto';
import { RegisterTeacherDto } from '../dto/register-teacher.dto';
import { LoginDto } from '../dto/login.dto';
import { ResetPasswordDto, ChangePasswordDto, ForceChangePasswordDto } from '../dto/password.dto';

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
      where: { phone: dto.phone },
    });
    if (existing)
      throw new ConflictException('User with this phone already exists');

    const teacherProfile = await this.prisma.teacherProfile.findUnique({
      where: { invitationCode: dto.invitationCode },
    });
    const adminProfile = await this.prisma.adminProfile.findUnique({
      where: { invitationCode: dto.invitationCode },
    });

    if (!teacherProfile && !adminProfile) {
      throw new BadRequestException('Invalid invitation code');
    }
    const linkedTeacherId = teacherProfile ? teacherProfile.userId : undefined;

    const hashedPassword = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        firstName: dto.firstName,
        middleName: dto.middleName || '',
        lastName: dto.lastName || '',
        familyName: dto.familyName || '',
        name: `${dto.firstName} ${dto.familyName}`,
        role: Role.STUDENT,
        avatar: dto.avatar,
        studentProfile: {
          create: {
            countryId: dto.country,
            governorate: dto.governorate || null,
            city: dto.city || null,
            grade: dto.grade,
            track: dto.track,
            parentPhone: dto.parentPhone,
            school: dto.school,
            registeredViaCode: dto.invitationCode,
            linkedTeacherId,
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
    if (user.phone) {
      await this.otpService.generateAndSendOtp(
        user.id,
        user.phone,
        OtpType.PHONE_VERIFICATION,
      );
    }

    return {
      message: 'Registration successful. Please verify your phone number.',
      userId: user.id,
    };
  }

  async registerTeacher(
    dto: RegisterTeacherDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const existing = await this.prisma.user.findFirst({
      where: { phone: dto.phone },
    });
    if (existing)
      throw new ConflictException('User with this phone already exists');

    const existingNid = await this.prisma.teacherProfile.findUnique({
      where: { nationalId: dto.nationalId },
    });
    if (existingNid) {
      throw new ConflictException('National ID already registered');
    }

    let dateOfBirth: Date;
    let gender: 'MALE' | 'FEMALE';
    try {
      const info = extractNationalIdInfo(dto.nationalId);
      dateOfBirth = info.dateOfBirth;
      gender = info.gender as 'MALE' | 'FEMALE';
    } catch (e) {
      throw new BadRequestException('Invalid National ID');
    }

    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const m = today.getMonth() - dateOfBirth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    if (age < 21) {
      throw new BadRequestException('Teacher must be at least 21 years old.');
    }

    const hashedPassword = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email || null,
        phone: dto.phone,
        password: hashedPassword,
        firstName: dto.name.split(' ')[0] || '',
        middleName: '',
        lastName: '',
        familyName: dto.name.split(' ').slice(1).join(' ') || '',
        name: dto.name,
        role: Role.TEACHER,
        dateOfBirth,
        gender,
        avatar: dto.avatar,
        teacherProfile: {
          create: {
            nationalId: dto.nationalId,
            teachingSubjects: dto.subjects || [],
            experience: dto.experience || 0,
            verificationStatus: 'PENDING',
            invitationCode: 'TCH-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
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
      user.phone,
      OtpType.PHONE_VERIFICATION,
    );

    return {
      message: 'Registration successful. Please verify your phone number.',
      userId: user.id,
    };
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const identifier = dto.identifier || dto.phone;
    if (!identifier) throw new BadRequestException('Identifier is required');

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { phone: identifier },
          { email: identifier },
          { username: identifier },
        ],
      },
    });

    if (!user)
      throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive)
      throw new UnauthorizedException('Account is banned');

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const lockMinutes = Math.ceil((user.lockedUntil.getTime() - new Date().getTime()) / 60000);
      throw new UnauthorizedException(`Account is temporarily locked. Try again in ${lockMinutes} minutes.`);
    }

    const isMatch = await argon2.verify(user.password, dto.password);
    if (!isMatch) {
      const newAttempts = (user.failedLoginAttempts || 0) + 1;
      const updateData: any = { failedLoginAttempts: newAttempts };
      
      if (newAttempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 15 * 60000); // Lock for 15 minutes
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed attempts
    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0, lockedUntil: null },
      });
    }

    if (user.requiresPasswordChange) {
      // Throw special 403 error for frontend to handle force-change-password
      throw new ConflictException({
        errorCode: 'PASSWORD_CHANGE_REQUIRED',
        message: 'You must change your password on your first login.',
        userId: user.id, // Return userId to identify which user needs password change
      });
    }

    const tempRefreshToken = `temp_${Date.now()}`;
    const session = await this.sessionService.createSession(
      user.id,
      tempRefreshToken,
      ipAddress,
      userAgent,
      dto.fcmToken,
    );

    const tokens = await this.tokenService.generateTokens(user, session.id);

    const hashedRefresh = await argon2.hash(tokens.refreshToken);
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

  async forgotPassword(phone: string) {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) return; // Silent fail for security
    await this.otpService.generateAndSendOtp(
      user.id,
      user.phone,
      OtpType.PASSWORD_RESET,
    );
  }

  async resetPassword(dto: ResetPasswordDto) {
    await this.otpService.verifyOtp(
      dto.userId,
      dto.code,
      OtpType.PASSWORD_RESET,
    );
    const hashedPassword = await argon2.hash(dto.newPassword);

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

    const isMatch = await argon2.verify(user.password, dto.oldPassword);
    if (!isMatch) throw new BadRequestException('Incorrect old password');

    const hashedPassword = await argon2.hash(dto.newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await this.auditService.logAction(userId, AuditAction.PASSWORD_CHANGE);
  }
  async forceChangePassword(dto: ForceChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    if (!user.requiresPasswordChange) {
      throw new BadRequestException('User does not require a password change');
    }

    const isMatch = await argon2.verify(user.password, dto.oldPassword);
    if (!isMatch) throw new BadRequestException('Incorrect old password');

    const hashedPassword = await argon2.hash(dto.newPassword);
    await this.prisma.user.update({
      where: { id: dto.userId },
      data: { 
        password: hashedPassword,
        requiresPasswordChange: false,
      },
    });

    await this.auditService.logAction(dto.userId, AuditAction.PASSWORD_CHANGE);
  }
}
