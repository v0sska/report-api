import { CreateWorkAccountDto } from './create-workaccount.dto';
import { PartialType } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';


export class UpdateWorkAccountDto extends PartialType(CreateWorkAccountDto) {
	@ApiPropertyOptional()
    @IsBoolean()
	isBlocked?: boolean;
}
