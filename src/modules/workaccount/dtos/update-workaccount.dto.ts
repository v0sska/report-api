import { CreateWorkAccountDto } from './create-workaccount.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateWorkAccountDto extends PartialType(CreateWorkAccountDto) {}
