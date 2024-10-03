import { CreateDeveloperDto } from './create-developer.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateDeveloperDto extends PartialType(CreateDeveloperDto) {}
