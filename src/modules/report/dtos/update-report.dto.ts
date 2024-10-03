import { CreateReportDto } from './create-report.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateReportDto extends PartialType(CreateReportDto) {}
