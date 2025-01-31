import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeReportDto {
  employeeId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  hoursWorked: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;
}
