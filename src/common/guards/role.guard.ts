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
    const route = request.route?.path;
    const method = request.method;

    const adminPath = [{ path: '/api/users', method: 'POST' }];

    const token = this.extractTokenFromCookie(request) || newToken;
    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = await this.jwtService.verifyAsync(token, {
      secret: config.server.jwt,
    });

    const isAdminPath = this.isBlockedRoute(route, method, adminPath);

    if (
      isAdminPath &&
      payload.role !== 'Admin' &&
      payload.role !== 'SuperAdmin' &&
      payload.role !== 'SalesDepartmentOfficer'
    ) {
      throw new BadRequestException('Permission denied');
    }

    if (
      payload.role !== 'Admin' &&
      payload.role !== 'SuperAdmin' &&
      payload.role !== 'SalesDepartmentOfficer' &&
      payload.role !== 'PMDepartmentOfficer'
    ) {
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

  private isBlockedRoute(
    route: string,
    method: string,
    routes: { path: string; method: string }[],
  ): boolean {
    return routes.some((item) => item.path === route && item.method === method);
  }
}
