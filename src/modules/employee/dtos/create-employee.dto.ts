import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

import { ProjectEngagmentValues } from '@/common/constants/project-engagment.contants';

export class CreateEmployeeDto {
  projectEngagement?: ProjectEngagmentValues;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;
}
