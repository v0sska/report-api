import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeveloperDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  stack: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  telegram: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  timeJoin: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
