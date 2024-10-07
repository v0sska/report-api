import { Controller, Delete } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Database')
@Controller('db')
export class DbController {
	public constructor(private readonly prismaService: PrismaService) {}

	@Delete('/drop-data')
	public async deleteAllData() {
		await this.prismaService.report.deleteMany();
		await this.prismaService.customer.deleteMany();
		await this.prismaService.workAccount.deleteMany();
		await this.prismaService.developer.deleteMany();
		await this.prismaService.sale.deleteMany();
		await this.prismaService.user.deleteMany();

		return {
			message: 'All data deleted',
			status: 200,
		};
	}
}