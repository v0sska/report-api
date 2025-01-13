import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDevelopersOnCustomersDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  developerId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customerId: string;
}
