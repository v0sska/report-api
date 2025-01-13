import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import config from '../configs';
import { Request, Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { token, refreshToken } = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: config.server.jwt,
      });

      request['user'] = payload.sub;
    } catch {
      if (!refreshToken) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(refreshToken, {
          secret: config.server.jwt,
        });

        const newToken = await this.jwtService.signAsync(
          { sub: payload.sub },
          {
            expiresIn: '1h',
          },
        );

        const newRefreshToken = await this.jwtService.signAsync(
          { sub: payload.sub },
          {
            expiresIn: '7d',
          },
        );

        (request as Request & { res: Response }).res.cookie('token', newToken, {
          httpOnly: true,
          sameSite: 'none',
        });

        (request as Request & { res: Response }).res.cookie(
          'refreshToken',
          newRefreshToken,
          {
            httpOnly: true,
            sameSite: 'none',
          },
        );

        request['user'] = payload.sub;
      } catch {
        throw new UnauthorizedException();
      }
    }

    return true;
  }

  private extractTokenFromHeader(
    request: Request,
  ): { token: string; refreshToken: string } | undefined {
    const refreshToken = request.cookies['refreshToken'];
    const token = request.cookies['token'];
    if (refreshToken && token) {
      return { refreshToken, token };
    }
    return undefined;
  }
}
