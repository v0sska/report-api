import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async signUp(@Body() dto: CreateUserDto) {
    const data = await this.authService.signUp(dto);

    return {
      message: 'User created successfully',
      data: data,
      status: HttpStatus.CREATED,
    };
  }

  @Post('login')
  public async signIn(@Body() dto: LoginUserDto) {
    const data = await this.authService.signIn(dto);

    return {
      message: 'User logged in successfully',
      data: data,
      status: HttpStatus.OK,
    };
  }
}
