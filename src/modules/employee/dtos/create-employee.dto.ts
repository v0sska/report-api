import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import {
  PROJECT_ENGAGMENT,
  ProjectEngagmentValues,
} from '@/common/constants/project-engagment.contants';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsEnum(PROJECT_ENGAGMENT)
  @ApiProperty({
    enum: PROJECT_ENGAGMENT,
  })
  projectEngagement: ProjectEngagmentValues;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;
}
