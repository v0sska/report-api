import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
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
      message: 'User created successfully',
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
      message: 'User fetched successfully',
      data: user,
      status: HttpStatus.OK,
    };
  }

  @Get('/:id')
  public async findById(
    @Param('id') userId: string,
  ): Promise<DataResponse<Object>> {
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
  @UseGuards(RoleGuard)
  public async delete(@Param('id') id: string): Promise<DataResponse<User>> {
    const user = await this.userService.delete(id);

    return {
      message: 'User deleted successfully',
      data: user,
      status: HttpStatus.OK,
    };
  }
}
