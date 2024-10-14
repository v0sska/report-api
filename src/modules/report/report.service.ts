import { ReportRepository } from './report.repository';
import { Report } from '@prisma/client';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EXCEPTION } from '@/common/constants/exception.constants';

@Injectable()
export class ReportService {
  public constructor(private readonly reportRepository: ReportRepository) {}

  public async create(dto: CreateReportDto): Promise<Report> {
    return await this.reportRepository.create(dto);
  }

  public async find(): Promise<Report[]> {
    return await this.reportRepository.find();
  }

  public async findById(id: string): Promise<Report> {
    const report = await this.reportRepository.findById(id);

    if (!report) {
      throw new NotFoundException(EXCEPTION.REPORT_NOT_FOUND);
    }

    return report;
  }

  public async findByDeveloperId(developerId: string): Promise<Report[]> {
	const report = await this.reportRepository.findByDeveloperId(developerId);

	if (!report) {
	  throw new NotFoundException(EXCEPTION.REPORT_NOT_FOUND);
	}

	return report;
  }

  public async update(id: string, updates: UpdateReportDto): Promise<Report> {
    const report = await this.reportRepository.update(id, updates);

    if (!report) {
      throw new NotFoundException(EXCEPTION.REPORT_NOT_FOUND);
    }

    return report;
  }

  public async delete(id: string): Promise<Report> {
    const report = await this.reportRepository.delete(id);

    if (!report) {
      throw new NotFoundException(EXCEPTION.REPORT_NOT_FOUND);
    }

    return report;
  }

  public async findByDate(date: string, customerId: string): Promise<Report> {
	const report = await this.reportRepository.findByDate(date, customerId);

	if (!report) {
	  throw new NotFoundException(EXCEPTION.REPORT_NOT_FOUND);
	}

	return report;
  }

  public async findByDates(customerId: string, startDate: string, endDate: string): Promise<Report[]> {
	return await this.reportRepository.findByDates(customerId, startDate, endDate);
  }
}
