import { Controller, Delete } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Database')
@Controller('db')
export class DbController {
  public constructor(private readonly prismaService: PrismaService) {}

  @Delete('/drop-data')
  public async deleteAllData() {
    await this.prismaService.sales.deleteMany();
    await this.prismaService.employee.deleteMany();
    await this.prismaService.user.deleteMany();

    return {
      message: 'All data deleted',
      status: 200,
    };
  }
}
