import { ApiProperty } from '@nestjs/swagger';

import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import {
  INCOME_STATUS,
  IncomeStatusValues,
} from '@/common/constants/income-status.constants';

export class CreateProjectIncomeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hours: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    enum: INCOME_STATUS,
  })
  @IsEnum(INCOME_STATUS)
  @IsNotEmpty()
  status: IncomeStatusValues;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employeeReportId: string;
}
