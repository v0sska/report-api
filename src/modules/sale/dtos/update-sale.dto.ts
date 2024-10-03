import { IsOptional } from 'class-validator';
import { CreateSaleDto } from './create-sale.dto';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @IsOptional()
  @ApiPropertyOptional()
  isBlocked?: boolean;
}
