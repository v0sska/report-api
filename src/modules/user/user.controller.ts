import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { DataResponse } from '@/common/types/data-response.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';
import { Request } from 'express';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Post('/')
  public async create(@Body() dto: CreateUserDto): Promise<DataResponse<User>> {
    const user = await this.userService.create(dto);

    return {
      message: 'User created successfully',
      data: user,
      status: HttpStatus.CREATED,
    };
  }

  @Get('/')
  public async find(): Promise<DataResponse<User[]>> {
    const user = await this.userService.find();

    return {
      message: 'User fetched successfully',
      data: user,
      status: HttpStatus.OK,
    };
  }

  @Get('/me')
  public async findById(@Req() request: Request): Promise<DataResponse<Object>> {
	const userId = request['user'];
    const user = await this.userService.findById(userId);

    return {
      message: 'User fetched successfully',
      data: user,
      status: HttpStatus.OK,
    };
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<DataResponse<User>> {
    const user = await this.userService.update(id, dto);

    return {
      message: 'User updated successfully',
      data: user,
      status: HttpStatus.OK,
    };
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string): Promise<DataResponse<User>> {
    const user = await this.userService.delete(id);

    return {
      message: 'User deleted successfully',
      data: user,
      status: HttpStatus.OK,
    };
  }
}
