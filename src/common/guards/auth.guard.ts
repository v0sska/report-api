import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import config from '../configs';
import { Request, Response } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokens = this.extractTokenFromCookie(request);

    if (!tokens || (!tokens.token && !tokens.refreshToken)) {
      throw new UnauthorizedException();
    }

    const { token, refreshToken } = tokens;

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: config.server.jwt,
      });
      request['user'] = { id: payload.sub, role: payload.role };
    } catch {
      if (!refreshToken) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(refreshToken, {
          secret: config.server.jwt,
        });

        const newToken = await this.jwtService.signAsync(
          {
            sub: payload.sub,
            role: payload.role,
          },
          {
            expiresIn: '1h',
          },
        );

        (request as Request & { res: Response }).res.cookie('token', newToken, {
          httpOnly: false,
          sameSite: 'lax',
          maxAge: 3600000,
          expires: new Date(Date.now() + 3600000),
        });

        Reflect.defineMetadata('newToken', newToken, request);
        request['user'] = { id: payload.sub, role: payload.role };
      } catch {
        throw new UnauthorizedException();
      }
    }

    return true;
  }

  private extractTokenFromCookie(
    request: Request,
  ): { token: string; refreshToken: string } | undefined {
    const refreshToken = request.cookies['refreshToken'];
    const token = request.cookies['token'];
    if (refreshToken || token) {
      return { refreshToken, token };
    }
    return undefined;
  }
}
