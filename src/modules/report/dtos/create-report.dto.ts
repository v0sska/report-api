import { IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  track: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  report: string;

  @IsNotEmpty()
  @ApiProperty()
  startWork: string;

  @IsNotEmpty()
  @ApiProperty()
  endWork: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  developerId: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  date: string;
}
