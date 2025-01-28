import {
  PROJECT_STATUS,
  ProjectStatusValues,
} from '@/common/constants/project-status.constants';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  rate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  hoursInWeek: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  teamInfo: string;

  @IsNotEmpty()
  @IsEnum(PROJECT_STATUS)
  @ApiProperty({
    enum: PROJECT_STATUS,
  })
  status: ProjectStatusValues;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  salesId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  projectManagerId?: string;
}
