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
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    response.cookie('role', user.role, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    response.cookie('id', user.id, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    response.cookie('email', user.email, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    response.cookie('firstName', user.firstName, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    response.cookie('lastName', user.lastName, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    response.cookie('role', user.role, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    response.cookie('id', user.id, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    response.cookie('email', user.email, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    response.cookie('firstName', user.firstName, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    response.cookie('lastName', user.lastName, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    response.cookie('role', user.role, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    response.cookie('id', user.id, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    response.cookie('email', user.email, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    response.cookie('firstName', user.firstName, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    response.cookie('lastName', user.lastName, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
      httpOnly: false,
      sameSite: 'lax',
      expires: new Date(0),
    });

    response.cookie('refreshToken', '', {
      httpOnly: false,
      sameSite: 'lax',
      expires: new Date(0),
    });

    response.cookie('role', '', {
      httpOnly: false,
      sameSite: 'lax',
      expires: new Date(0),
    });

    response.cookie('email', '', {
      httpOnly: false,
      sameSite: 'lax',
      expires: new Date(0),
    });

    response.cookie('firstName', '', {
      httpOnly: false,
      sameSite: 'lax',
      expires: new Date(0),
    });

    response.cookie('lastName', '', {
      httpOnly: false,
      sameSite: 'lax',
      expires: new Date(0),
    });

    return {
      message: MESSAGES.LOGOUT,
      status: HttpStatus.OK,
    };
  }
}
