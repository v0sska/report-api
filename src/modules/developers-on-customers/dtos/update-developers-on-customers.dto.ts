
import { PartialType } from '@nestjs/swagger';
import { CreateDevelopersOnCustomersDto } from './create-developers-on-customers.dto';

export class UpdateDevelopersOnCustomersDto extends PartialType(CreateDevelopersOnCustomersDto) {}