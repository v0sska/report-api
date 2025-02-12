import { PartialType } from '@nestjs/swagger';
import { CreateProjectManagerReportDto } from './create-project-manager-report.dto';

export class UpdateProjectManagerReportDto extends PartialType(
  CreateProjectManagerReportDto,
) {}
