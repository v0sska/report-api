import { PartialType } from '@nestjs/swagger';

import { CreateSalesReportDto } from './create-sales-report.dto';

export class UpdateSalesReportDto extends PartialType(CreateSalesReportDto) {}
