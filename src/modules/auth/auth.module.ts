import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { EmployeeModule } from '../employee/employee.module';
import { ProjectManagerModule } from '../project-manager/project-manager.module';
import { SalesModule } from '../sales/sales.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/database/prisma.service';

import config from 'src/common/configs';

@Module({
  imports: [
    UserModule,
    EmployeeModule,
    ProjectManagerModule,
    SalesModule,
    JwtModule.register({
      global: true,
      secret: config.server.jwt,
      signOptions: { expiresIn: '5d' },
    }),
  ],
  providers: [AuthService, UserService, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
