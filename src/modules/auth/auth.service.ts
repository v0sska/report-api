import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EXCEPTION } from '@/common/constants/exception.constants';
import { CryptoUtil } from '@/common/utils/crypto.util';
import { LoginUserDto } from './dtos/login-user.dto';
import { userMapper } from '@/common/utils/user-mapper.util';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async signUp(dto: CreateUserDto) {
    const findUserByEmail = await this.userService.findByEmail(dto.email);

    if (findUserByEmail) {
      throw new BadRequestException(EXCEPTION.USER_ALREADY_EXISTS);
    }

    const encrypted = CryptoUtil.encrypt(dto.password);

    const user = await this.userService.create({
      ...dto,
      password: encrypted,
    });

    const payload = { sub: user.id };

    const token = await this.jwtService.signAsync(payload);

    return {
      user: userMapper(user),
      token,
    };
  }

  public async signIn(dto: LoginUserDto) {
    const findUserByEmail = await this.userService.findByEmail(dto.email);

    if (!findUserByEmail) {
      throw new BadRequestException(EXCEPTION.USER_NOT_FOUND);
    }

    const decrypted = CryptoUtil.decrypt(findUserByEmail.password);

    if (decrypted !== dto.password) {
      throw new BadRequestException(EXCEPTION.INVALID_PASSWORD);
    }

    const payload = { sub: findUserByEmail.id };

    const token = await this.jwtService.signAsync(payload);

    return {
      user: userMapper(findUserByEmail),
      token,
    };
  }
}
