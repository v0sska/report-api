import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EXCEPTION } from '@/common/constants/exception.constants';
import { CryptoUtil } from '@/common/utils/crypto.util';
import { LoginUserDto } from './dtos/login-user.dto';
import { userMapper } from '@/common/utils/user-mapper.util';
import { AcceptInviteDto } from './dtos/accept-invite.dto';
import { USER_STATUS } from '@/common/constants/user-status.constants';

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

    const payload = {
      sub: user.id,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      user: userMapper(user),
      tokens: {
        token,
        refreshToken,
      },
    };
  }

  public async acceptInvite(dto: AcceptInviteDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new BadRequestException(EXCEPTION.USER_NOT_FOUND);
    }

    if(user.status === USER_STATUS.ACTIVE) {
      throw new BadRequestException(EXCEPTION.USER_ALREADY_EXISTS);
    }

    const encrypted = CryptoUtil.encrypt(dto.password);

    const updatedUser = await this.userService.update(user.id, {
      password: encrypted,
      status: USER_STATUS.ACTIVE,
      inviteToken: null,
    });

    const payload = {
      sub: user.id,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      user: userMapper(updatedUser),
      tokens: {
        token,
        refreshToken
      },
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

    const payload = {
      sub: findUserByEmail.id,
      role: findUserByEmail.role,
    };

    const token = await this.jwtService.signAsync(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      user: userMapper(findUserByEmail),
      tokens: {
        token,
        refreshToken,
      },
    };
  }
}
