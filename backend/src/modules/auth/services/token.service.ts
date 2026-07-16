import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, Role } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  phone: string;
  role: Role;
  sessionId: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(
    user: User,
    sessionId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
      sessionId,
    };

    const accessSecret = this.configService.get<string>('auth.jwtAccessSecret');
    const refreshSecret = this.configService.get<string>('auth.jwtRefreshSecret');
    
    console.log('[TokenService.generateTokens] Configured Secrets loaded:', {
      accessSecretLength: accessSecret?.length || 0,
      accessSecretSnippet: accessSecret && accessSecret.length >= 6
        ? `${accessSecret.substring(0, 3)}...${accessSecret.substring(accessSecret.length - 3)}`
        : accessSecret || 'NULL/EMPTY',
      refreshSecretLength: refreshSecret?.length || 0,
      refreshSecretSnippet: refreshSecret && refreshSecret.length >= 6
        ? `${refreshSecret.substring(0, 3)}...${refreshSecret.substring(refreshSecret.length - 3)}`
        : refreshSecret || 'NULL/EMPTY',
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: this.configService.get<string>(
          'auth.jwtAccessExpiresIn',
        ) as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: this.configService.get<string>(
          'auth.jwtRefreshExpiresIn',
        ) as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    const refreshSecret = this.configService.get<string>('auth.jwtRefreshSecret');
    console.log('[TokenService.verifyRefreshToken] Verifying refresh token using secret:', {
      refreshSecretLength: refreshSecret?.length || 0,
      refreshSecretSnippet: refreshSecret && refreshSecret.length >= 6
        ? `${refreshSecret.substring(0, 3)}...${refreshSecret.substring(refreshSecret.length - 3)}`
        : refreshSecret || 'NULL/EMPTY',
    });
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: refreshSecret,
    });
  }
}
