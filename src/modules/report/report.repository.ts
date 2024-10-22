import { BaseRepository } from '@/common/types/base-repository.type';
import { Report } from '@prisma/client';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';
import { PrismaService } from '@/database/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ReportRepository extends BaseRepository<
  Report,
  CreateReportDto,
  UpdateReportDto
> {
  public constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async create(dto: CreateReportDto): Promise<Report> {
	const data = await this.prismaService.$transaction(async (tx) => {
		const report = await tx.report.create({
			data: dto,
		});

		const customer = await tx.customer.findUnique({
			where: {
			id: dto.customerId,
			},
		});

		if (!customer) {
			throw new InternalServerErrorException('Customer not found');
		}

		const payedAmount = customer.isOnUpwork
			? customer.rate * report.track * 0.9
			: customer.rate * report.track;

		await tx.income.create({
			data: {
			date: dto.date,
			reportId: report.id,
			payed: payedAmount,
			},
		});

		return report;
	});

	return data;
  }

  public async find(): Promise<Report[]> {
    return await this.prismaService.report.findMany({include: {income: true}}).catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  public async findByDeveloperId(developerId: string): Promise<Report[]> {
	return await this.prismaService.report.findMany({
		where: {
			developerId: developerId,
		},
	})
	.catch((error) => {
		throw new InternalServerErrorException(error.message);
	});
  }

  public async findById(id: string): Promise<Report> {
    return await this.prismaService.report
      .findUnique({
        where: {
          id,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async update(id: string, updates: UpdateReportDto): Promise<Report> {
    return await this.prismaService.report
      .update({
        where: {
          id,
        },
        data: updates,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async delete(id: string): Promise<Report> {
    return await this.prismaService.report
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  public async findByDate(date: string, customerId: string): Promise<Report> {
	return await this.prismaService.report
	  .findFirst({
		where: {
		  date: date,
		  customerId: customerId,
		},
		include: {
			income: true,
		}
	  })
	  .catch((error) => {
		throw new InternalServerErrorException(error.message);
	  });
  }

  public async findByDates(customerId: string, startDate: string, endDate: string): Promise<Report[]> {
		const transaction = await this.prismaService.$transaction(async (tx) => {
			const reports: Report[] = [];
			let currentDate = new Date(startDate);

			const endDateObj = new Date(endDate);

			while (currentDate <= endDateObj) {
			const dateString = currentDate.toISOString().split('T')[0];

			const report = await tx.report.findFirst({
				where: {
				customerId: customerId,
				date: dateString,
				},
			});

			if (report) {
				reports.push(report);
			}

			currentDate.setDate(currentDate.getDate() + 1);
			}

			return reports;
		});

		return transaction;
	}
}
