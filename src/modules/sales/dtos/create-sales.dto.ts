import { IsString, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateSalesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
