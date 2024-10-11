import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { Report } from '@prisma/client';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';
import { DataResponse } from '@/common/types/data-response.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';

@ApiTags('reports')
@Controller('reports')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ReportController {
  public constructor(private readonly reportService: ReportService) {}

  @Post('/')
  public async create(
    @Body() dto: CreateReportDto,
  ): Promise<DataResponse<Report>> {
    const report = await this.reportService.create(dto);

    return {
      message: 'Report created successfully',
      data: report,
      status: HttpStatus.CREATED,
    };
  }

  @Get('/')
  public async find(): Promise<DataResponse<Report[]>> {
    const report = await this.reportService.find();

    return {
      message: 'Report fetched successfully',
      data: report,
      status: HttpStatus.OK,
    };
  }

  @Get('/date')
  public async findByDate(
	@Query('date') date: string, 
	@Query('customerId') customerId: string
): Promise<DataResponse<Report>> {
	const report = await this.reportService.findByDate(date, customerId);

	return {
	  message: 'Report fetched successfully',
	  data: report,
	  status: HttpStatus.OK,
    };
 }

  @Get('/:id')
  public async findById(
    @Param('id') id: string,
  ): Promise<DataResponse<Report>> {
    const report = await this.reportService.findById(id);

    return {
      message: 'Report fetched successfully',
      data: report,
      status: HttpStatus.OK,
    };
  }

  @Get('/developer/:developerId')
  public async findByDeveloperId(
	@Param('developerId') developerId: string,
  ): Promise<DataResponse<Report[]>> {
	const report = await this.reportService.findByDeveloperId(developerId);

	return {
	  message: 'Report fetched successfully',
	  data: report,
	  status: HttpStatus.OK,
	};
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateReportDto,
  ): Promise<DataResponse<Report>> {
    const report = await this.reportService.update(id, dto);

    return {
      message: 'Report updated successfully',
      data: report,
      status: HttpStatus.OK,
    };
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string): Promise<DataResponse<Report>> {
    const report = await this.reportService.delete(id);

    return {
      message: 'Report deleted successfully',
      data: report,
      status: HttpStatus.OK,
    };
  }
}
