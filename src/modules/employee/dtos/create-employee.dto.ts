import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  PROJECT_ENGAGMENT,
  ProjectEngagmentValues,
} from '@/common/constants/project-engagment.contants';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEnum(PROJECT_ENGAGMENT)
  @ApiProperty({
    enum: PROJECT_ENGAGMENT,
  })
  projectEngagement: ProjectEngagmentValues;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  position: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  rate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;
}
