import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accountId: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  rate: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  trackInWeek: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nameProject: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  isOnUpwork: boolean;
}
