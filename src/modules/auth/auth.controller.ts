import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { Response } from 'express';

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

    return {
      message: 'User created successfully',
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

    return {
      message: 'User logged in successfully',
      data: user,
      status: HttpStatus.OK,
    };
  }
}
