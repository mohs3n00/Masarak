import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../services/token.service';

import { Request } from 'express';

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['accessToken'];
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const accessSecret = configService.get<string>('auth.jwtAccessSecret') || 'secret';
    console.log('[JwtStrategy] Initialized with config-based Access Secret:', {
      accessSecretLength: accessSecret?.length || 0,
      accessSecretSnippet: accessSecret && accessSecret.length >= 6
        ? `${accessSecret.substring(0, 3)}...${accessSecret.substring(accessSecret.length - 3)}`
        : accessSecret,
    });
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: accessSecret,
    });
  }

  async validate(payload: JwtPayload) {
    console.log('[JwtStrategy] validate() called with payload:', payload);
    if (!payload.sub || !payload.sessionId) {
      console.warn('[JwtStrategy] validation FAILED: sub or sessionId is missing in payload');
      throw new UnauthorizedException();
    }
    console.log('[JwtStrategy] validation SUCCESS for user:', payload.sub);
    // Payload properties match the user object attached to Request
    return {
      id: payload.sub,
      phone: payload.phone,
      role: payload.role,
      sessionId: payload.sessionId,
    };
  }
}
