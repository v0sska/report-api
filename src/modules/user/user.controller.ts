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

import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@/common/guards/auth.guard';
import { RoleGuard } from '@/common/guards/role.guard';

import { MESSAGES } from '@/common/constants/messages.contants';

import { Request } from 'express';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Post('/')
  @UseGuards(RoleGuard)
  public async create(
    @Body() dto: CreateUserDto,
  ): Promise<DataResponse<(User & { inviteUrl: string }) | User>> {
    const data = await this.userService.createWithInvite(dto);

    return {
      message: MESSAGES.CREATED,
      data: data,
      status: HttpStatus.CREATED,
    };
  }

  @Get('/')
  @UseGuards(RoleGuard)
  public async find(): Promise<
    DataResponse<Omit<User, 'password' | 'inviteToken'>[]>
  > {
    const user = await this.userService.find();
    return {
      message: MESSAGES.FETCHED,
      data: user,
      status: HttpStatus.OK,
    };
  }

  @Get('/me')
  public async findMe(@Req() request: Request): Promise<DataResponse<Object>> {
    const { id } = request['user'];

    const user = await this.userService.findMe(id);

    return {
      message: MESSAGES.FETCHED,
      data: user,
      status: HttpStatus.OK,
    };
  }

  @Get('admin/:userId')
  public async adminFindById(
    @Param('userId') userId: string,
    @Req() request: Request,
  ): Promise<DataResponse<Object>> {
    const { role } = request['user'];

    const user = await this.userService.adminFindUserById(userId, role);

    return {
      message: MESSAGES.FETCHED,
      data: user,
      status: HttpStatus.OK,
    };
  }

  @Get('/:id')
  public async findById(
    @Param('id') userId: string,
  ): Promise<
    DataResponse<
      Omit<User, 'password' | 'inviteToken' | 'status' | 'salary'>
    >
  > {
    const user = await this.userService.findById(userId);

    return {
      message: MESSAGES.FETCHED,
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
      message: MESSAGES.UPDATED,
      data: user,
      status: HttpStatus.OK,
    };
  }

  @Delete('/:id')
  @UseGuards(RoleGuard)
  public async delete(@Param('id') id: string): Promise<DataResponse<User>> {
    const user = await this.userService.delete(id);

    return {
      message: MESSAGES.DELETED,
      data: user,
      status: HttpStatus.OK,
    };
  }
}
