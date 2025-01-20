import { CreateSalesDto } from './create-sales.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateSalesDto extends PartialType(CreateSalesDto) {}
