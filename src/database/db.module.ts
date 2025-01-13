import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DbController } from './db.controller';

@Module({
  imports: [],
  providers: [PrismaService],
  controllers: [DbController],
})
export class DbModule {}
