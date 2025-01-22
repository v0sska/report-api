import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/database/prisma.service';

import config from 'src/common/configs';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: config.server.jwt,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, UserService, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
