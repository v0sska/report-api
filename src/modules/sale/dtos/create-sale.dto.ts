import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  timeJoin: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
