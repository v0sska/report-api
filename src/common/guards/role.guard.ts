import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import config from '../configs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  public constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const newToken = Reflect.getMetadata('newToken', request);
    const token = this.extractTokenFromCookie(request) || newToken;
    if (!token) {
      console.log('no token');
      throw new UnauthorizedException();
    }
    const payload = await this.jwtService.verifyAsync(token, {
      secret: config.server.jwt,
    });
    if (payload.role !== 'Admin' && payload.role !== 'SuperAdmin') {
      throw new BadRequestException('Permission denied');
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const token = request.cookies['token'];
    if (token) {
      return token;
    }
    return undefined;
  }
}
