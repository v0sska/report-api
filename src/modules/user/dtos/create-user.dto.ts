import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ROLE, RoleValues } from '@/common/constants/role.constants';
import { StatusValues } from '@/common/constants/user-status.constants';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @ApiProperty()
  password?: string;

  @IsNotEmpty()
  @IsEnum(ROLE)
  @ApiProperty({
    enum: ROLE,
  })
  role: RoleValues;

  status?: StatusValues;

  inviteToken?: string;
}
