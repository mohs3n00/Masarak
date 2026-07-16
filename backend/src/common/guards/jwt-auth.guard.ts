import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log(`[JwtAuthGuard] canActivate check for URL: ${request.url}`);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log(`[JwtAuthGuard] Route is public: ${request.url}`);
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: TUser, info: any, context: ExecutionContext): TUser {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const cookies = request.cookies || {};
    const accessTokenCookie = cookies['accessToken'];

    console.warn('[JwtAuthGuard] handleRequest details:', {
      url: request.url,
      hasAuthHeader: !!authHeader,
      bearerTokenSnippet: bearerToken && bearerToken.length > 20 
        ? `${bearerToken.substring(0, 10)}...${bearerToken.substring(bearerToken.length - 10)}` 
        : bearerToken,
      hasAccessTokenCookie: !!accessTokenCookie,
      err: err ? err.message : null,
      info: info ? { name: info.name, message: info.message } : null,
      hasUser: !!user,
    });

    if (err || !user) {
      console.error('[JwtAuthGuard] Authentication failed!', {
        reason: info ? info.message : (err ? err.message : 'User object is missing'),
      });
      if (err instanceof Error) {
        throw err;
      }
      throw new UnauthorizedException(info ? info.message : 'Unauthorized');
    }
    return user;
  }
}
