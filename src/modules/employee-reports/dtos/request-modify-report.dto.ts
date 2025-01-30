import {
  MODIFY_REPORT_REQUEST,
  ModifyReportRequestValues,
} from '@/common/constants/modify-report-request';

import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class RequestModifyReportDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  reportId: string;

  @IsEnum(MODIFY_REPORT_REQUEST)
  @IsNotEmpty()
  @ApiProperty({
    enum: MODIFY_REPORT_REQUEST,
  })
  requestType: ModifyReportRequestValues;
}
