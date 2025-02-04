import { PartialType } from '@nestjs/swagger';

import { CreateProjectIncomeDto } from './create-project-income.dto';

export class UpdateProjectIncomeDto extends PartialType(
  CreateProjectIncomeDto,
) {}
