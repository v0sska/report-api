import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateEmployeeReportDto } from './create-employee-report.dto';

import {
  REPORT_STATUS,
  ReportStatusValues,
} from '@/common/constants/report.status.constants';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateEmployeeReportDto extends PartialType(
  CreateEmployeeReportDto,
) {
  @IsEnum(REPORT_STATUS)
  @ApiProperty({
    enum: REPORT_STATUS,
  })
  @IsOptional()
  editStatus?: ReportStatusValues;

  @IsEnum(REPORT_STATUS)
  @ApiProperty({
    enum: REPORT_STATUS,
  })
  @IsOptional()
  deleteStatus?: ReportStatusValues;

  updatedAt?: Date;
}
