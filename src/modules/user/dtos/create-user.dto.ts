import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ROLE, RoleValues } from '@/common/constants/role.constants';
import { StatusValues } from '@/common/constants/user-status.constants';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @ApiProperty()
  password?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  position: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  salary: number;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  phone?: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiPropertyOptional()
  dateOfBirth?: Date;

  @IsNotEmpty()
  @IsEnum(ROLE)
  @ApiProperty({
    enum: ROLE,
  })
  role: RoleValues;

  status?: StatusValues;

  inviteToken?: string;
}
