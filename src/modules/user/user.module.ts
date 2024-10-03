import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { PrismaService } from '@/database/prisma.service';

@Module({
  providers: [UserService, UserRepository, PrismaService],
  controllers: [UserController],
  exports: [UserService, UserRepository, PrismaService],
})
export class UserModule {}
