import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { AcceptInviteDto } from './dtos/accept-invite.dto';

import { Response } from 'express';

import { MESSAGES } from '@/common/constants/messages.contants';

import config from '@/common/configs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async signUp(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, tokens } = await this.authService.signUp(dto);

    response.cookie('token', tokens.token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      secure: true,
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    response.cookie('role', user.role, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    response.cookie('id', user.id, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    response.cookie('email', user.email, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    response.cookie('firstName', user.firstName, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    response.cookie('lastName', user.lastName, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    return {
      message: MESSAGES.CREATED,
      data: user,
      status: HttpStatus.CREATED,
    };
  }

  @Post('accept-invite')
  public async acceptInvite(
    @Body() dto: AcceptInviteDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, tokens } = await this.authService.acceptInvite(dto);

    response.cookie('token', tokens.token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      secure: true,
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    response.cookie('role', user.role, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    response.cookie('id', user.id, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    response.cookie('email', user.email, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    response.cookie('firstName', user.firstName, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    response.cookie('lastName', user.lastName, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    return {
      message: MESSAGES.CREATED,
      data: user,
      status: HttpStatus.CREATED,
    };
  }

  @Post('login')
  public async signIn(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, tokens } = await this.authService.signIn(dto);

    response.cookie('token', tokens.token, {
      sameSite: 'none',
      path: '/',
      domain: config.server.frontendDomain,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      secure: true,
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      sameSite: 'none',
      path: '/',
      domain: config.server.frontendDomain,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    response.cookie('role', user.role, {
      sameSite: 'none',
      path: '/',
      domain: config.server.frontendDomain,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    response.cookie('id', user.id, {
      sameSite: 'none',
      path: '/',
      domain: config.server.frontendDomain,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    response.cookie('email', user.email, {
      sameSite: 'none',
      path: '/',
      domain: config.server.frontendDomain,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    response.cookie('firstName', user.firstName, {
      sameSite: 'none',
      path: '/',
      domain: config.server.frontendDomain,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    response.cookie('lastName', user.lastName, {
      sameSite: 'none',
      path: '/',
      domain: config.server.frontendDomain,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
    });

    return {
      message: MESSAGES.LOGED,
      data: user,
      status: HttpStatus.OK,
    };
  }

  @Post('logout')
  public async logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('token', '', {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(0),
      secure: true,
    });

    response.cookie('refreshToken', '', {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(0),
      secure: true,
    });

    response.cookie('role', '', {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(0),
      secure: true,
    });

    response.cookie('email', '', {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(0),
    });

    response.cookie('firstName', '', {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(0),
      secure: true,
    });

    response.cookie('lastName', '', {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(0),
      secure: true,
    });

    return {
      message: MESSAGES.LOGOUT,
      status: HttpStatus.OK,
    };
  }
}
