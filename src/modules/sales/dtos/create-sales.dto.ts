import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateSalesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  position: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  rate: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
