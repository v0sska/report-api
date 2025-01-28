import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AssignMembersDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  projectId: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  employees: { id: string; hoursInWeek: number }[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  projectManagerId?: string;
}
