import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmployeeHoursDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  projectId: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  employees: { id: string; hoursInWeek: number }[];
}
